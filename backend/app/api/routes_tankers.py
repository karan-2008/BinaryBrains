"""
Tanker API routes — Phase 4 (Live DB).

Endpoints:
    GET /api/tankers/allocation — Calculate and return tanker allocation plan from live data
"""

from fastapi import APIRouter

from app.database.queries import get_all_villages_with_groundwater, get_available_tankers
from app.services.wsi_calculator import compute_wsi, compute_priority_score
from app.services.tanker_allocator import allocate_tankers
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/tankers", tags=["Tankers"])


@router.get("/allocation")
async def get_tanker_allocation():
    """
    Compute tanker allocation plan from live Supabase data.

    Steps:
    1. Fetch all villages with groundwater data from Supabase
    2. Compute WSI and priority score for each village
    3. Fetch available tankers from Supabase
    4. Run deterministic allocation algorithm
    5. Return allocation plan
    """
    # Step 1: Fetch village data
    villages_raw = get_all_villages_with_groundwater()

    # Step 2: Enrich with computed metrics
    villages = []
    for v in villages_raw:
        wsi = compute_wsi(
            gw_current_level=v["gw_current_level"],
            gw_min_required=v["gw_min_required"],
            rainfall_dev_pct=v["rainfall_dev_pct"],
        )
        priority = compute_priority_score(population=v["population"], wsi=wsi)

        villages.append({
            **v,
            "wsi": round(wsi, 2),
            "priority_score": round(priority, 2),
        })

    # Step 3: Fetch tankers
    tankers = get_available_tankers()

    # Step 4: Run allocation
    allocations = allocate_tankers(villages=villages, tankers=tankers)

    # Step 5: Build response
    return {
        "total_villages_in_need": len(allocations),
        "total_tankers_assigned": len(allocations),
        "allocations": allocations,
    }
