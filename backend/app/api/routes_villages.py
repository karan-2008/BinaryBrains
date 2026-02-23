"""
Village API routes — Phase 4 (Live DB).

Endpoints:
    GET /api/villages/status                — Fetch all villages from Supabase with computed WSI
    GET /api/villages/{village_id}/insight   — Generate AI advisory for a specific village
"""

from fastapi import APIRouter, HTTPException, Query

from app.database.queries import get_all_villages_with_groundwater, get_village_by_id
from app.services.wsi_calculator import compute_wsi, compute_priority_score
from app.services.ai_insight_engine import generate_drought_insight
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/villages", tags=["Villages"])


def _wsi_status_label(wsi: float) -> str:
    """Return a human-readable status label for a WSI value."""
    if wsi > 70:
        return "Severe Stress"
    if wsi > 40:
        return "Moderate Stress"
    return "Safe"


@router.get("/status")
async def get_villages_status():
    """
    Fetch all villages from Supabase, compute WSI and priority for each,
    and return sorted by priority (highest first).
    """
    villages = get_all_villages_with_groundwater()

    results = []
    for v in villages:
        wsi = compute_wsi(
            gw_current_level=v["gw_current_level"],
            gw_min_required=v["gw_min_required"],
            rainfall_dev_pct=v["rainfall_dev_pct"],
        )
        priority = compute_priority_score(population=v["population"], wsi=wsi)

        results.append({
            **v,
            "wsi": round(wsi, 2),
            "priority_score": round(priority, 2),
        })

    results.sort(key=lambda r: r["priority_score"], reverse=True)
    return results


@router.get("/{village_id}/insight")
async def get_village_insight(
    village_id: str,
    lang: str = Query(default="English", description="Response language"),
):
    """
    Fetch village data from Supabase, compute WSI deterministically,
    then pass pre-computed metrics to the AI engine for a 3-bullet advisory.
    """
    village = get_village_by_id(village_id)
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")

    wsi = compute_wsi(
        gw_current_level=village["gw_current_level"],
        gw_min_required=village["gw_min_required"],
        rainfall_dev_pct=village["rainfall_dev_pct"],
    )
    status_label = _wsi_status_label(wsi)

    # Compute groundwater drop (max_capacity - current)
    g_drop = round(village.get("gw_max_capacity", 0) - village["gw_current_level"], 2)

    insight = generate_drought_insight(
        village_name=village["name"],
        population=village["population"],
        wsi=round(wsi, 2),
        status=status_label,
        r_dev=village["rainfall_dev_pct"],
        g_drop=g_drop,
        tankers=0,  # Will be computed from tanker allocator in future phases
        target_language=lang,
    )

    if "Error" in insight:
        raise HTTPException(status_code=503, detail="AI Service Unavailable")

    return {
        "village_id": village["id"],
        "village_name": village["name"],
        "language": lang,
        "insight": insight,
    }
