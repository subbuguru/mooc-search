import asyncio
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.ollama import Ollama
from llama_index.core.agent.workflow import AgentStream
from llama_index.llms.gemini import Gemini

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re

from llama_index.core.agent import ReActAgent


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
def recommend(query: str = "Python"):
    """Useful for recommending courses based on a user query."""
    cleaned_input = clean_text(query)
    input_embedding = model.encode([cleaned_input])
    similarities = cosine_similarity(input_embedding, embeddings)[0]
    top_indices = np.argsort(similarities)[-5:][::-1]
    recommendations = courses.iloc[top_indices][['name', 'topic', 'link', 'provider']]
    return recommendations.replace({np.nan: ""}).to_dict('records')

# Create an agent workflow with the recommend tool
workflow = ReActAgent.from_tools(
    name="CourseRecommenderAgent",
    description="Useful for recommending courses based on a user query",
    tools=[recommend],
    llm=Gemini(model="models/gemini-2.0-flash", api_key="AIzaSyAG29iZsYDXK_kTH3HcOcXloCKnlLdhiRc"),
    verbose=True,
    system_prompt="You are a helpful assistant that can recommend courses based on user queries, attempting to call the tool multiple times as needed, and finally returning a structured curated ordered list of the best most relavent results from the recommend function",
)

async def main():
    # Run the agent
    handler = workflow.run(user_msg="Can you recommend some Python courses?")

    async for event in handler.stream_events():
        if isinstance(event, AgentStream):
            print(event.delta, end="", flush=True)

# Run the agent
if __name__ == "__main__":
    asyncio.run(main())