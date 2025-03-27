import asyncio
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.agent.workflow import AgentWorkflow, ToolCallResult, AgentStream

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re

# Read in data with embeddings
courses = pd.read_csv('backend/data/courses.csv')
embeddings = pd.read_csv('backend/data/embeddings.csv')

# Initialize the model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Text cleaning function
def clean_text(text):
    lemma = WordNetLemmatizer()
    text = re.sub("[^A-Za-z0-9 ]", "", str(text))
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [lemma.lemmatize(word) for word in tokens if word not in stopwords.words("english")]
    return " ".join(tokens)

# Define the recommend function
def recommend(query: str):
    """Useful for recommending courses based on a user query."""
    cleaned_input = clean_text(query)
    input_embedding = model.encode([cleaned_input])
    similarities = cosine_similarity(input_embedding, embeddings)[0]
    top_indices = np.argsort(similarities)[-5:][::-1]
    recommendations = courses.iloc[top_indices][['name', 'topic', 'link', 'provider']]
    return recommendations.replace({np.nan: ""}).to_dict('records')

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