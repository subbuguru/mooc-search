import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ToolCallResult, AgentStream
import requests  # Add this import for making HTTP requests

# Define the recommend function
def recommend(query: str):
    """Useful for recommending courses based on a user query."""
    try:
        # Make a GET request to the backend API
        response = requests.get(
            "https://verbose-space-giggle-vj7g5xq596qfwv-8000.app.github.dev/",
            params={"query": query},
        )
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()  # Return the JSON response from the API
    except requests.exceptions.RequestException as e:
        print(f"Error calling the API: {e}")
        return [{"error": "Failed to fetch recommendations"}]

# Replace tools and agent prompt
async def main():
    llm = GoogleGenAI(
        model="gemini-2.0-flash",
        api_key="AIzaSyAG29iZsYDXK_kTH3HcOcXloCKnlLdhiRc",  # uses GOOGLE_API_KEY env var by default
    )

    agent = AgentWorkflow.from_tools_or_functions(
        tools_or_functions=[recommend],
        llm=llm,
        system_prompt="You are a helpful assistant that can recommend courses based on user queries, attempting to call the tool multiple times as needed, and finally curating the results, carefully thinking through the curation process to return an ordered list of the best most relevant results from the recommend function.",
    )

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