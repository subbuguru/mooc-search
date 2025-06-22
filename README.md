# MOOC Search

<table>
  <tr>
    <td><img width="2284" alt="mooc-search copy" src="https://github.com/user-attachments/assets/330c865f-aa34-473a-8005-43a2e22e3ca5" /></td>
    <td><img width="2233" alt="image" src="https://github.com/user-attachments/assets/f185faa4-4b54-432e-bde2-533ea0e98210" /></td>
  </tr>
</table>



## Overview

MOOC Search is a platform that helps users discover Massive Open Online Courses (MOOCs) from various providers.

- Combines multiple MOOC datasets (from Kaggle) and processes them using pandas.
- Generates course embeddings with BERT and exports them as a CSV.
- Uses cosine similarity to match user queries with relevant courses.
- Powered by a FastAPI backend, a Next.js frontend, and an agentic recommendation system (LlamaIndex).

## Why I Built This

Ever since COVID, MOOCs have become all the rage to learn things online and for free. However, there are simply so many of them and often times people quit before they even start due to decision fatigue.
Personally, I built this project both for my own utility and to learn more about AI agents and how they can be integrated into fields such as education.

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




