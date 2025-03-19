import asyncio
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI


# Define a simple calculator tool
def multiply(a: float, b: float) -> float:
    """Useful for multiplying two numbers."""
    return a * b


# Create an agent workflow with our calculator tool
agent = FunctionAgent(
    name="Agent",
    description="Useful for multiplying two numbers",
    tools=[multiply],
    llm=OpenAI(model="gpt-4o-mini"),
    system_prompt="You are a helpful assistant that can multiply two numbers.",
)


async def main():
    # Run the agent
    response = await agent.run("What is 1234 * 4567?")
    print(str(response))


# Run the agent
if __name__ == "__main__":
    asyncio.run(main())

[{'name': 'Advanced Semantics', 'topic': 'Humanities, Linguistics, Semantics', 'link': 'https://ocw.mit.edu/courses/24-973-advanced-semantics-spring-2009/', 'provider': 'Massachussets Institute of Technology'}, {'name': 'Language Processing', 'topic': 'Science, Humanities, Linguistics', 'link': 'https://ocw.mit.edu/courses/9-591j-language-processing-fall-2004/', 'provider': 'Massachussets Institute of Technology'}, {'name': 'Grammar of a Less Familiar Language', 'topic': 'Humanities, Linguistics, ', 'link': 'https://ocw.mit.edu/courses/24-942-grammar-of-a-less-familiar-language-spring-2003/', 'provider': 'Massachussets Institute of Technology'}, {'name': 'Topics in Linguistics Theory', 'topic': 'Humanities, Linguistics, Semantics', 'link': 'https://ocw.mit.edu/courses/24-910-topics-in-linguistics-theory-spring-2003/', 'provider': 'Massachussets Institute of Technology'}, {'name': 'Advanced Syntax', 'topic': 'Humanities, Linguistics, Syntax', 'link': 'https://ocw.mit.edu/courses/24-952-advanced-syntax-spring-2007/', 'provider': 'Massachussets Institute of Technology'}]