
# uvicorn main:app --reload
# Initialize FastAPI app

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from agent import stream_agent_events

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
async def recommend_stream(query: str, numRecommendations: int, orderType: str):
    async def event_stream():
        async for event in stream_agent_events(query, numRecommendations, orderType):
            yield event
    return StreamingResponse(event_stream(), media_type="text/plain")
