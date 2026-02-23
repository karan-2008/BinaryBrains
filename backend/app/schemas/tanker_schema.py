"""
Pydantic schemas for Tanker-related data.
"""

from pydantic import BaseModel
from typing import Optional


class TankerBase(BaseModel):
    """Base schema for tanker data."""
    id: str
    vehicle_number: Optional[str] = None
    capacity_liters: float
    status: str                     # e.g. "available", "dispatched", "maintenance"
    current_location: Optional[str] = None


class TankerAllocation(BaseModel):
    """Schema for a single tanker-to-village allocation."""
    village_id: str
    village_name: str
    tanker_id: str
    allocated_liters: float
    deficit_liters: float
    priority_score: float


class TankerAllocationResponse(BaseModel):
    """Response schema for the complete allocation plan."""
    total_villages_in_need: int
    total_tankers_assigned: int
    allocations: list[TankerAllocation]
