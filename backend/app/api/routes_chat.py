"""
Chat API route.

Allows the frontend to converse with the Ollama model (Deepseek-v3.1) 
with real-time context injection (live telemetry data) from the dashboard.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.api.routes_villages import get_villages_status
from app.services.ai_insight_engine import query_ollama
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

# System prompt that forces the AI into persona
SYSTEM_PROMPT = """You are the 'SUVIDHA Engine', an elite AI Assistant embedded in the Integrated Drought Warning & Smart Tanker Management System.
You speak clearly, professionally, and concisely to district administrators.
You have access to live telemetry about water stress (WSI), rainfall, groundwater drops, and critical alerts.

Here is the LIVE DATA SNAPSHOT of the district right now:
{live_context}

When answering questions:
- Use the live data directly to support your answers.
- If asked about critical villages, look for WSI > 70.
- If asked about safe villages, look for WSI < 40.
- Keep your answers highly relevant, formatting with markdown (bullet points, bolding) for readability.
- DO NOT invent data. If the dashboard data is empty or missing, state that you don't have telemetry for it.
"""

@router.post("")
async def chat_with_assistant(request: ChatRequest):
    """
    Handle incoming chat messages, inject live telemetry, and return AI response.
    """
    try:
        # 1. Gather live context (this uses our cached weather and DB data)
        villages = await get_villages_status()
        
        context_string = ""
        for v in villages:
            weather = v.get("live_weather", {})
            context_string += (
                f"- Village: {v['name']} (ID: {v['id']}) | "
                f"WSI: {v['wsi']} (Priority: {v['priority_score']}) | "
                f"Rainfall Dev: {v['rainfall_dev_pct']}% | "
                f"Live Weather: {weather.get('rainfall_mm')}mm rain, {weather.get('temp_c')}°C | "
                f"GW Drop: {v['gw_current_level']}m\n"
            )
        
        if not context_string:
            context_string = "No village telemetry is currently available."

        # 2. Build the full prompt for the deepseek model
        final_system_prompt = SYSTEM_PROMPT.format(live_context=context_string)
        
        # We need to format the conversation history for Ollama's generic prompt
        # since we are using the /api/generate endpoint for simplicity.
        conversation = f"System: {final_system_prompt}\n\n"
        
        # Add the history
        for msg in request.messages:
            role = "Admin" if msg.role == "user" else "SUVIDHA AI"
            conversation += f"{role}: {msg.content}\n"
            
        # Add the final suffix to prompt the AI to respond
        conversation += "SUVIDHA AI:"
        
        # 3. Call Ollama
        response_text = query_ollama(prompt=conversation, timeout_sec=120)
        
        if response_text.startswith("Error:"):
            raise HTTPException(status_code=503, detail=response_text)
            
        return {"response": response_text.strip()}
        
    except Exception as e:
        logger.error(f"Chat API failed: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during chat generation.")
