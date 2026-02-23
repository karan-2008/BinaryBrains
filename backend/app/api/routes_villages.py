"""
Village API routes — Phase 4 (Live DB + Live Weather).

Endpoints:
    GET /api/villages/status                — Fetch all villages with live weather + computed WSI
    GET /api/villages/{village_id}/insight   — Generate AI advisory for a specific village
"""

from fastapi import APIRouter, HTTPException, Query

from app.database.queries import get_all_villages_with_groundwater, get_village_by_id
from app.services.wsi_calculator import compute_wsi, compute_priority_score, calculate_rainfall_deviation
from app.services.ai_insight_engine import generate_drought_insight
from app.services.weather_service import fetch_weather
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/villages", tags=["Villages"])

# ---------------------------------------------------------------------------
# Expected monthly rainfall (mm/hr equivalent) per village.
# TODO: Replace with historical averages from a database table.
# ---------------------------------------------------------------------------
EXPECTED_RAINFALL_MM = {
    "V001": 2.5,   # Ramtek
    "V002": 2.0,   # Saoner
    "V003": 1.8,   # Katol
    "V004": 2.2,   # Hingna
    "V005": 1.5,   # Umred
}
DEFAULT_EXPECTED_RAINFALL = 2.0


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
    Fetch all villages from Supabase, enrich with live weather data from
    OpenWeather, compute WSI and priority for each, and return sorted by
    priority (highest first).

    Weather data is cached in-memory for 15 minutes per village.
    If the weather API is unavailable, the system falls back to the
    database-stored rainfall_dev_pct value.
    """
    villages = get_all_villages_with_groundwater()

    results = []
    for v in villages:
        # ---- Live Weather Integration ----
        lat = v.get("lat", 0.0)
        lon = v.get("lng", 0.0)
        weather = fetch_weather(village_id=v["id"], lat=lat, lon=lon)

        # Retrieve the seasonal cumulative deviation from the database
        base_dev_pct = v.get("rainfall_dev_pct", 0.0)
        
        actual_rain = weather["rainfall_mm_last_hour"]

        if weather["humidity_percent"] > 0:
            if actual_rain > 0:
                # When actual rain happens, it relieves the existing drought deficit.
                # Example: If deficit is -15%, and it rains 2mm, we improve deviation.
                # Using a factor of +5% deviation improvement per mm of rain.
                rainfall_dev_pct = min(100.0, base_dev_pct + (actual_rain * 5.0))
            else:
                # If it's not currently raining, reverting to hourly expectation produces 
                # an unrealistic -100% deficit. We instead stick to the realistic seasonal base.
                rainfall_dev_pct = base_dev_pct
        else:
            # Weather API failed completely, fallback to DB
            rainfall_dev_pct = base_dev_pct

        wsi = compute_wsi(
            gw_current_level=v["gw_current_level"],
            gw_min_required=v["gw_min_required"],
            rainfall_dev_pct=rainfall_dev_pct,
        )
        priority = compute_priority_score(population=v["population"], wsi=wsi)

        results.append({
            **v,
            "wsi": round(wsi, 2),
            "priority_score": round(priority, 2),
            "rainfall_dev_pct": round(rainfall_dev_pct, 2),
            "live_weather": {
                "rainfall_mm": weather["rainfall_mm_last_hour"],
                "humidity": weather["humidity_percent"],
                "temp_c": weather["temperature_celsius"],
            },
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

    if insight.startswith("Error:"):
        raise HTTPException(status_code=503, detail=insight)

    return {
        "village_id": village["id"],
        "village_name": village["name"],
        "language": lang,
        "insight": insight,
    }


@router.get("/{village_id}/forecast")
async def get_village_forecast(village_id: str):
    """
    Fetch 5-day weather forecast for a specific village.
    """
    from app.services.weather_service import fetch_forecast
    
    village = get_village_by_id(village_id)
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")

    lat = village.get("lat", 0.0)
    lon = village.get("lng", 0.0)
    
    forecast = fetch_forecast(village_id=village_id, lat=lat, lon=lon)
    return {
        "village_id": village_id,
        "village_name": village["name"],
        "forecast": forecast
    }
