# Handles agent creation and streaming functions which are in turn exposed in main.py

from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ReActAgent, ToolCallResult
from llama_index.core.agent.workflow import (
    AgentOutput,
    ToolCall,
    ToolCallResult,
)
from embeddings import recommend
from dotenv import load_dotenv
import os

import json

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")


# Initialize the LLM
llm = GoogleGenAI(
    model="gemini-2.0-flash",
    api_key=api_key,
    temperature=0.0 
)


def validate_json(json_string: str) -> str:
    '''Validates whether the given string is a valid JSON object. Returns 'Valid JSON' if valid, otherwise returns an error message.'''
    try:
        # Attempt to parse the JSON string
        json.loads(json_string)
        return "Valid JSON"
    except json.JSONDecodeError as e:
        return f"Invalid JSON: {e}"

# Create ReActAgent
recommendation_agent = ReActAgent(
    name="course_recommender",
    description="Recommends courses based on user queries, preserving the original course details.",
    system_prompt = (
    "You are an expert learning path curator that organizes courses into optimal sequences while preserving original course data. "
    "Your output MUST be a list of dictionaries where each dictionary represents a course exactly as returned by the API.\n\n"

    "STRICT REQUIREMENTS:\n"
    "1. Final output must be a Python list containing the original course dictionaries\n"
    "2. Each course dictionary must remain completely unchanged (same keys, values, and structure)\n"
    "3. The list order should represent the recommended learning sequence\n\n"
    "4. DO NOT surround your final response with JSON code markers (BAD: ```json) The final answer should ONLY BE A VALID JSON OBJECT with DOUBLE QUOTES."

    "Workflow:\n"
    "1. Analyze the user's learning goals and generate targeted search queries, explaining your reasoning for each query\n"
    "2. Call the 'recommend' function multiple times if needed with different queries\n"
    "3. Collect all relevant courses while preserving their original dictionary structure\n"
    "4. Organize them into a logical sequence based on:\n"
    "   - Skill level (beginner to advanced)\n"
    "   - Prerequisite relationships\n"
    "   - Topic progression\n"
    "5. Return the final ordered list of course dictionaries. CONVERTED TO A VALID JSON OBJECT without Markdown identifiers (NO: ```json ```). Use the json tool to validate before your final response\n\n"

    "Important Rules:\n"
    "- NEVER modify any course dictionary contents\n"
    "- ONLY change the order of the list\n"
    "- If courses need grouping, maintain them as separate dictionaries in sequence\n"
    "- If the API returns an empty result, try alternative query phrasings"
    ),
    tools=[recommend, validate_json],
    llm=llm,
)
# Create and run the workflow
agent = AgentWorkflow(agents=[recommendation_agent], root_agent="course_recommender")

# Define a generator for streaming agent events
async def stream_agent_events(query: str):
    current_agent = None
    handler = agent.run(user_msg=query)

    async for event in handler.stream_events():
        if (
            hasattr(event, "current_agent_name")
            and event.current_agent_name != current_agent
        ):
            current_agent = event.current_agent_name
            yield f"\n{'='*50}\n"
            yield f"🤖 Agent: {current_agent}\n"
            yield f"{'='*50}\n"

        if isinstance(event, AgentOutput):
            if event.response.content:
                yield f"📤 Output: {event.response.content}\n"
            if event.tool_calls:
                yield f"🛠️  Planning to use tools: {[call.tool_name for call in event.tool_calls]}\n"
        elif isinstance(event, ToolCallResult):
            yield f"🔧 Tool Result ({event.tool_name}):\n"
            yield f"  Arguments: {event.tool_kwargs}\n"
            yield f"  Output: {event.tool_output}\n"
        elif isinstance(event, ToolCall):
            yield f"🔨 Calling Tool: {event.tool_name}\n"
            yield f"  With arguments: {event.tool_kwargs}\n"

