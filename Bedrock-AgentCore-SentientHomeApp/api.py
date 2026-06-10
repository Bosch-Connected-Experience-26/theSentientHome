import logging
import os
import time
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agent import generate_agent_response


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOW_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]

api = FastAPI(title='Sentient Home Agent API')
api.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class ChatMessage(BaseModel):
    id: str | None = None
    role: str
    text: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    conversation: list[ChatMessage] = Field(default_factory=list)
    context: dict[str, Any] = Field(default_factory=dict)


class AssistantMessage(BaseModel):
    id: str
    role: str = 'assistant'
    text: str
    suggestedActions: list[str] = Field(default_factory=list)


@api.get('/health')
def health():
    return {'status': 'ok'}


@api.post('/api/chat', response_model=AssistantMessage)
def chat(request: ChatRequest):
    try:
        text = generate_agent_response(
            request.message,
            conversation=[message.dict() for message in request.conversation],
            context=request.context,
        )
    except Exception as e:
        logger.exception('Agent chat request failed')
        raise HTTPException(status_code=500, detail=str(e)) from e

    return AssistantMessage(
        id=f"assistant-{int(time.time() * 1000)}",
        text=text,
        suggestedActions=[],
    )
