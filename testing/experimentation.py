import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ReActAgent, ToolCallResult, AgentStream
from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    ToolCall,
    ToolCallResult,
    AgentStream,
)
import requests  

# react agent docs https://docs.llamaindex.ai/en/stable/examples/agent/react_agent/


# Define the recommend function
def recommend(query: str):
    """Useful for recommending courses based on a user query. Returns a list of course dictionaries with name, topic, link, and provider."""
    print(f"Received query: {query}")  # Debugging: Log the input query
    try:
        # Call the API endpoint for recommendations using GET with query parameter
        response = requests.get(
            "http://127.0.0.1:8000",
            params={"query": query},
            timeout=10
        )
        response.raise_for_status()  # Raise an error for HTTP error responses
        return response.json()  # Return the JSON response from the API
    except requests.RequestException as e:
        print(f"Error fetching recommendations: {e}")
        return []  # Return an empty list in case of an error

# Initialize the LLM
llm = GoogleGenAI(
    model="gemini-2.0-flash",
    api_key="AIzaSyAG29iZsYDXK_kTH3HcOcXloCKnlLdhiRc",
    temperature=0.0 
)

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
    "4. DO NOT surround your final response with JSON code markers (BAD: ```json)"

    "Workflow:\n"
    "1. Analyze the user's learning goals and generate targeted search queries\n"
    "2. Call the 'recommend' function multiple times if needed with different queries\n"
    "3. Collect all relevant courses while preserving their original dictionary structure\n"
    "4. Organize them into a logical sequence based on:\n"
    "   - Skill level (beginner to advanced)\n"
    "   - Prerequisite relationships\n"
    "   - Topic progression\n"
    "5. Return the final ordered list of course dictionaries\n\n"

    "Important Rules:\n"
    "- NEVER modify any course dictionary contents\n"
    "- ONLY change the order of the list\n"
    "- If courses need grouping, maintain them as separate dictionaries in sequence\n"
    "- If the API returns an empty result, try alternative query phrasings"
    ),
    tools=[recommend],
    llm=llm,
)

# Create and run the workflow
agent = AgentWorkflow(agents=[recommendation_agent], root_agent="course_recommender")


# Main function
async def main():
    current_agent = None
    current_tool_calls = ""
    handler = agent.run(user_msg="Midieval literature")
    #stream output
    # code ripped from llamaindex docs
    async for event in handler.stream_events():
        if (
            hasattr(event, "current_agent_name")
            and event.current_agent_name != current_agent
        ):
            current_agent = event.current_agent_name
            print(f"\n{'='*50}")
            print(f"🤖 Agent: {current_agent}")
            print(f"{'='*50}\n")

        # if isinstance(event, AgentStream):
        #     if event.delta:
        #         print(event.delta, end="", flush=True)
        # elif isinstance(event, AgentInput):
        #     print("📥 Input:", event.input)
        elif isinstance(event, AgentOutput):
            if event.response.content:
                print("📤 Output:", event.response.content)
            if event.tool_calls:
                print(
                    "🛠️  Planning to use tools:",
                    [call.tool_name for call in event.tool_calls],
                )
        elif isinstance(event, ToolCallResult):
            print(f"🔧 Tool Result ({event.tool_name}):")
            print(f"  Arguments: {event.tool_kwargs}")
            print(f"  Output: {event.tool_output}")
        elif isinstance(event, ToolCall):
            print(f"🔨 Calling Tool: {event.tool_name}")
            print(f"  With arguments: {event.tool_kwargs}")

    #print final response
    resp = await handler
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())