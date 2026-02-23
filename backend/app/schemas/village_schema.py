"""
Pydantic schemas for Village-related data.
"""

from pydantic import BaseModel
from typing import Optional


class VillageBase(BaseModel):
    """Base schema for village data."""
    id: str
    name: str
    taluka: Optional[str] = None
    district: Optional[str] = None
    population: int
    gw_current_level: float       # Current groundwater level (meters)
    gw_min_required: float        # Minimum required groundwater level (meters)
    rainfall_dev_pct: float       # Rainfall deviation percentage


class VillageStatusResponse(BaseModel):
    """Response schema for village status with computed metrics."""
    id: str
    name: str
    taluka: Optional[str] = None
    district: Optional[str] = None
    population: int
    gw_current_level: float
    gw_min_required: float
    rainfall_dev_pct: float
    wsi: float                    # Computed Water Stress Index (0–100)
    priority_score: float         # Computed priority score


class VillageInsightRequest(BaseModel):
    """Query parameters for village insight endpoint."""
    lang: str = "english"
