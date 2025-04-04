# MOOC Search

## Image

<img width="2284" alt="mooc-search copy" src="https://github.com/user-attachments/assets/330c865f-aa34-473a-8005-43a2e22e3ca5" />

## Overview

MOOC Search is a platform that helps users discover Massive Open Online Courses (MOOCs) from various providers.

- The project combines several online course datasets obtained from Kaggle, processes them using pandas, and generates embeddings with BERT.
- These embeddings are exported as a CSV file and used in a Python function that uses cosine similarity to compare a query string with relevant courses.
- This function serves as a tool for the LlamaIndex agent, which powers and oversees the recommendation system.
- The project is built using FastAPI for the backend and Next.js for the frontend.

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/subbuguru/mooc-search.git
   cd mooc-search
   ```

2. Set up the backend:

   ```bash
    # Open a new terminal and navigate to backend
    cd backend

   # Install Python dependencies
   pip install -r requirements.txt

   # create a .env file in the backend directory
   echo "GEMINI_API_KEY=<goes here>" > .env

   # Start the FastAPI server
   uvicorn main:app --reload
   ```

   The backend API will be running at `http://localhost:8000`

3. Set up the frontend:

   ```bash
   # Open new terminal and navigate to frontend
   cd frontend

   # Install Node dependencies
   npm install

   # Create or edit .env file with API URL
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env

   # Start the Next.js dev server
   npm run dev
   ```

   The frontend will be running at `http://localhost:3000`

## Usage

Once both servers are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

You can start searching for MOOCs!
