# Required pip installations:
# pip install fastapi uvicorn pandas numpy sentence-transformers scikit-learn nltk kaleido

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import nltk

# Download NLTK data
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')

# Load and preprocess data
dataMit = pd.read_csv("/kaggle/input/dataset-of-1200-coursera-courses/MIT ocw.csv")
dataMit.columns = map(str.lower, dataMit.columns)
dataMit.rename(columns={'name ': 'name', 'course link': 'link'}, inplace=True)
dataMit['text'] = dataMit['name'] + " " + dataMit['topic'] 
dataMit['provider'] = 'Massachussets Institute of Technology'
dataMit = dataMit[['name', 'topic', 'link', 'provider', 'text']]

dataHarvard = pd.read_csv("/kaggle/input/dataset-of-1200-coursera-courses/Harvard_university.csv")
dataHarvard.columns = map(str.lower, dataHarvard.columns)
dataHarvard.rename(columns={'link to course': 'link', 'about': 'topic'}, inplace=True)
dataHarvard = dataHarvard[dataHarvard['price'] == 'Free']
dataHarvard['text'] = dataHarvard['name'] + " " + dataHarvard['topic'] 
dataHarvard['provider'] = 'Harvard University'
dataHarvard = dataHarvard[['name', 'topic', 'link', 'provider', 'text']]

dataEdx = pd.read_csv("/kaggle/input/edx-courses-dataset-2021/EdX.csv")
dataEdx.columns = map(str.lower, dataEdx.columns)
dataEdx["topic"] = dataEdx['about'] + '. ' + dataEdx['course description']
dataEdx["provider"] = 'edX - ' + dataEdx['university']
dataEdx['text'] = dataEdx['name'] + " " + dataEdx["topic"]
dataEdx = dataEdx[['name', 'topic', 'link', 'provider', 'text']]

dataUdemy = pd.read_csv("/kaggle/input/udemy-course-dataset-categories-ratings-and-trends/udemy_courses.csv")
dataUdemy.columns = map(str.lower, dataUdemy.columns)
dataUdemy.rename(columns={'title': 'name', 'headline': 'topic', 'url': 'link'}, inplace=True)
dataUdemy = dataUdemy[dataUdemy['is_paid'] == False]
dataUdemy['provider'] = 'Udemy'
dataUdemy = dataUdemy[dataUdemy['rating'] > 4.5]
dataUdemy['text'] = dataUdemy['name'] + " " + dataUdemy['topic']
dataUdemy = dataUdemy[['name', 'topic', 'link', 'provider', 'text']]

dataCoursera = pd.read_csv("/kaggle/input/coursera-free-courses-dataset/coursera.csv")
dataCoursera.rename(columns={'title': 'name', 'skills': 'topic', 'url': 'link'}, inplace=True)
dataCoursera = dataCoursera[dataCoursera['price'] == 'Free']
dataCoursera['text'] = dataCoursera['name'] + " " + np.where(pd.notna(dataCoursera['topic']), dataCoursera['topic'], "")
dataCoursera['provider'] = 'Coursera - ' + dataCoursera['course_by']
dataCoursera = dataCoursera[['name', 'topic', 'link', 'provider', 'text']]
dataCoursera = dataCoursera.fillna("")

# Combine all datasets
data = pd.concat([dataUdemy, dataMit, dataHarvard, dataEdx, dataCoursera])

# Text cleaning function
def clean_text(text):
    lemma = WordNetLemmatizer()
    text = re.sub("[^A-Za-z0-9 ]", "", str(text))
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [lemma.lemmatize(word) for word in tokens if word not in stopwords.words("english")]
    return " ".join(tokens)

# Clean text data
data['cleaned_text'] = data['text'].apply(clean_text)

# Initialize SentenceTransformer model and generate embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')
document_embeddings = model.encode(data['cleaned_text'].tolist())

# Initialize FastAPI app
from fastapi import FastAPI
app = FastAPI()

# Recommendation endpoint
@app.get("/recommend")
async def recommend(query: str):
    cleaned_input = clean_text(query)
    input_embedding = model.encode([cleaned_input])
    similarities = cosine_similarity(input_embedding, document_embeddings)[0]
    top_indices = np.argsort(similarities)[-5:][::-1]
    recommendations = data.iloc[top_indices][['name', 'topic', 'link', 'provider']]
    return recommendations.to_dict('records')