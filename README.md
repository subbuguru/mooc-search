# MOOC Search

## Image

<img width="2284" alt="mooc-search copy" src="https://github.com/user-attachments/assets/330c865f-aa34-473a-8005-43a2e22e3ca5" />

## Overview

MOOC Search is a project designed to help users find Massive Open Online Courses (MOOCs) from various providers. This is a project built with FastAPI and Next.js.

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/subbuguru/mooc-search.git
    cd mooc-search
    ```

2. Set up the backend:
    ```bash
    # Install Python dependencies
    pip install fastapi uvicorn pandas numpy sentence-transformers scikit-learn nltk kaleido

    # Start the FastAPI server (from project root)
    cd backend
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

You can start searching for MOOCs by entering keywords in the search bar.




