# Required pip installations:
# pip install fastapi uvicorn pandas numpy sentence-transformers scikit-learn nltk kaleido
# uvicorn main:app --reload


import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re

# Download NLTK data
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('punkt_tab')

# Read in data with embeddings (update in the future)
courses = pd.read_csv('data/courses.csv')
embeddings = pd.read_csv('data/embeddings.csv')

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

# Initialize FastAPI app
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  
    allow_methods=["*"],
    allow_headers=["*"],
)

# Recommendation endpoint
@app.get("/")
async def recommend(query: str):
    cleaned_input = clean_text(query)
    input_embedding = model.encode([cleaned_input])
    similarities = cosine_similarity(input_embedding, embeddings)[0]
    top_indices = np.argsort(similarities)[-5:][::-1]
    recommendations = courses.iloc[top_indices][['name', 'topic', 'link', 'provider']]
    return recommendations.replace({np.nan: ""}).to_dict('records')
