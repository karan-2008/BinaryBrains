"""
Database query functions — Phase 4.

Pure data-access layer — no business logic.
All functions return raw data from Supabase.

Schema:
  - villages: village_id, village_name, population, lat, lng
  - groundwater: village_id (FK), gw_min_required, gw_max_capacity, gw_current_level, rainfall_dev_pct
  - tankers: tanker_id, capacity_liters, status
"""

from app.database.supabase_client import supabase


def get_all_villages_with_groundwater() -> list[dict]:
    """
    Fetch all villages joined with their groundwater data.

    Returns:
        A list of village dictionaries containing groundwater metrics.
    """
    # Fetch villages
    villages_res = supabase().table("villages").select("*").execute()
    villages = {v["village_id"]: v for v in villages_res.data}

    # Fetch groundwater
    gw_res = supabase().table("groundwater").select("*").execute()

    # Join in Python (Supabase-py doesn't support direct joins easily)
    results = []
    for gw in gw_res.data:
        vid = gw["village_id"]
        if vid in villages:
            v = villages[vid]
            results.append({
                "id": v["village_id"],
                "name": v["village_name"],
                "population": v["population"],
                "lat": v.get("lat"),
                "lng": v.get("lng"),
                "gw_current_level": gw["gw_current_level"],
                "gw_min_required": gw["gw_min_required"],
                "gw_max_capacity": gw.get("gw_max_capacity"),
                "rainfall_dev_pct": gw["rainfall_dev_pct"],
            })

    return results


def get_available_tankers() -> list[dict]:
    """
    Fetch all tankers that are currently available for dispatch.

    Returns:
        A list of tanker dictionaries with capacity and location info.
    """
    response = (
        supabase().table("tankers")
        .select("*")
        .eq("status", "Available")
        .execute()
    )

    # Normalize field names for the tanker_allocator
    return [
        {
            "id": t["tanker_id"],
            "capacity_liters": t["capacity_liters"],
            "status": t["status"],
        }
        for t in response.data
    ]


def get_village_by_id(village_id: str) -> dict | None:
    """
    Fetch a single village with its groundwater data by village_id.

    Args:
        village_id: The unique identifier of the village (e.g. "V001").

    Returns:
        A merged village dict, or None if not found.
    """
    v_res = (
        supabase().table("villages")
        .select("*")
        .eq("village_id", village_id)
        .single()
        .execute()
    )
    v = v_res.data
    if not v:
        return None

    gw_res = (
        supabase().table("groundwater")
        .select("*")
        .eq("village_id", village_id)
        .single()
        .execute()
    )
    gw = gw_res.data

    return {
        "id": v["village_id"],
        "name": v["village_name"],
        "population": v["population"],
        "lat": v.get("lat"),
        "lng": v.get("lng"),
        "gw_current_level": gw["gw_current_level"] if gw else 0,
        "gw_min_required": gw["gw_min_required"] if gw else 0,
        "gw_max_capacity": gw.get("gw_max_capacity", 0) if gw else 0,
        "rainfall_dev_pct": gw["rainfall_dev_pct"] if gw else 0,
    }
