import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ToolCallResult, AgentStream


def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


def subtract(a: int, b: int) -> int:
    """Subtract two numbers"""
    return a - b


def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
    return a * b


def divide(a: int, b: int) -> int:
    """Divide two numbers"""
    return a / b


async def main():
    llm = GoogleGenAI(
        model="gemini-2.0-flash",
        api_key="AIzaSyAG29iZsYDXK_kTH3HcOcXloCKnlLdhiRc",  # uses GOOGLE_API_KEY env var by default
    )

    agent = AgentWorkflow.from_tools_or_functions(
        tools_or_functions=[subtract, multiply, divide, add],
        llm=llm,
        system_prompt="You are a math agent that can add, subtract, multiply, and divide numbers using provided tools.",
    )

    handler = agent.run("What is (2 + 2) * 2?")
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