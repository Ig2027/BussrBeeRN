from fastapi import APIRouter
from app.chat.service import get_llm_response
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    user_id: str

@router.post("/message")
async def chat(request: ChatRequest):
    """Send message to LLM assistant"""
    response = await get_llm_response(request.message, request.user_id)
    return {"response": response}