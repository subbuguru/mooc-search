import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ReActAgent, ToolCallResult, AgentStream
import requests  

# Define the recommend function
def recommend(query: str):
    """Useful for recommending courses based on a user query. Returns a list of course dictionaries with name, topic, link, and provider."""
    print(f"Received query: {query}")  # Debugging: Log the input query
    try:
        # Call the API endpoint for recommendations using GET with query parameter
        response = requests.get(
            "https://verbose-space-giggle-vj7g5xq596qfwv-8000.app.github.dev/",
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
    system_prompt=(
        "You are a helpful assistant that organizes courses into a coherent learning plan based on user queries. "
        "You will call the 'recommend' function as many times as needed to fetch course recommendations and use the results as-is  without rewriting them. "
        "Your task is to carefully re organize the results into a logical sequence or group them by topic to create a comprehensive learning plan. "
        "Ensure that the output IS A DICTIONARY retains the exact wording and structure of the results from the 'recommend' function."
    ),
    tools=[recommend],
    llm=llm,
)

# Create and run the workflow
agent = AgentWorkflow(agents=[recommendation_agent], root_agent="course_recommender")

# Main function
async def main():
    handler = agent.run(user_msg="Give a sequence of courses for me to learn data science with r and sql")
    async for ev in handler.stream_events():
        if isinstance(ev, ToolCallResult):
            print("")
            print("Called tool: ", ev.tool_name, ev.tool_kwargs, "=>", ev.tool_output)
        elif isinstance(ev, AgentStream):  # showing the thought process
            print(ev.delta, end="", flush=True)

    resp = await handler
    print("\nFinal Response:", resp)

if __name__ == "__main__":
    asyncio.run(main())