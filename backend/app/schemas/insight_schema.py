"""
Pydantic schemas for AI Insight responses.
"""

from pydantic import BaseModel


class InsightResponse(BaseModel):
    """Response schema for AI-generated village insight."""
    village_id: str
    village_name: str
    lang: str
    insight_text: str              # Cleaned 3-bullet advisory text
    model_used: str                # e.g. "deepseek-r1:8b"
