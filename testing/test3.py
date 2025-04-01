# react agent testing

import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ReActAgent, ToolCallResult, AgentStream

# Define some tools
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

def subtract(a: int, b: int) -> int:
    """Subtract two numbers."""
    return a - b

def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

def divide(a: int, b: int) -> int:
    """Divide two numbers."""
    return a / b

# Initialize the LLM
llm = GoogleGenAI(
    model="gemini-2.0-flash",
    api_key="AIzaSyAG29iZsYDXK_kTH3HcOcXloCKnlLdhiRc",  # uses GOOGLE_API_KEY env var by default
)

# Create ReActAgent
calculator_agent = ReActAgent(
    name="calculator",
    description="Performs basic arithmetic operations",
    system_prompt="You are a calculator assistant. Use your tools for any math operation.",
    tools=[add, subtract, multiply, divide],
    llm=llm,
)

# Create and run the workflow
agent = AgentWorkflow(agents=[calculator_agent], root_agent="calculator")

# Main function
async def main():
    handler = agent.run(user_msg="What is (2 + 2) * 2?")
    async for ev in handler.stream_events():
        if isinstance(ev, ToolCallResult):
            print("")
            print("Called tool: ", ev.tool_name, ev.tool_kwargs, "=>", ev.tool_output)
        elif isinstance(ev, AgentStream):
            print(ev.delta, end="", flush=True)
    resp = await handler
    print(resp)

asyncio.run(main())