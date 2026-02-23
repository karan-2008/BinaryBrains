"""
Tanker Allocation Engine.

CRITICAL: This module contains ONLY deterministic mathematical calculations.
No AI/LLM calls are permitted here.

Matches water-deficit villages against available tanker capacity.
"""

from app.core.constants import MIN_WATER_REQUIREMENT_LPCD, WSI_CRITICAL_THRESHOLD
from app.utils.logger import get_logger

logger = get_logger(__name__)


def calculate_deficit(population: int, gw_current_level: float, gw_min_required: float) -> float:
    """
    Calculate daily water deficit for a village in liters.

    If groundwater is below minimum, the village needs external water supply
    proportional to the shortfall.

    Args:
        population: Village population count.
        gw_current_level: Current groundwater level in meters.
        gw_min_required: Minimum required groundwater level in meters.

    Returns:
        Water deficit in liters (0 if no deficit).
    """
    if gw_current_level >= gw_min_required:
        return 0.0

    shortfall_ratio = (gw_min_required - gw_current_level) / gw_min_required
    deficit = population * MIN_WATER_REQUIREMENT_LPCD * shortfall_ratio
    return max(deficit, 0.0)


def allocate_tankers(
    villages: list[dict],
    tankers: list[dict],
    wsi_threshold: float = WSI_CRITICAL_THRESHOLD,
) -> list[dict]:
    """
    Allocate available tankers to villages based on deficit and priority.

    Algorithm:
        1. Filter villages with WSI above threshold.
        2. Sort by priority_score (descending).
        3. Greedily assign tankers to highest-priority villages first.

    Args:
        villages: List of village dicts, each must contain:
            - id, name, population, gw_current_level, gw_min_required,
              wsi, priority_score
        tankers: List of tanker dicts, each must contain:
            - id, capacity_liters
        wsi_threshold: Minimum WSI to qualify for tanker allocation.

    Returns:
        List of allocation dicts with village_id, tanker_id,
        allocated_liters, deficit_liters, priority_score.
    """
    # Filter and sort villages by priority
    needy_villages = [v for v in villages if v.get("wsi", 0) > wsi_threshold]
    needy_villages.sort(key=lambda v: v.get("priority_score", 0), reverse=True)

    available_tankers = list(tankers)  # Copy to avoid mutation
    allocations = []

    for village in needy_villages:
        if not available_tankers:
            logger.warning("No more tankers available for allocation.")
            break

        deficit = calculate_deficit(
            population=village["population"],
            gw_current_level=village["gw_current_level"],
            gw_min_required=village["gw_min_required"],
        )

        if deficit <= 0:
            continue

        # Assign the first available tanker
        tanker = available_tankers.pop(0)
        allocated = min(deficit, tanker["capacity_liters"])

        allocations.append({
            "village_id": village["id"],
            "village_name": village["name"],
            "tanker_id": tanker["id"],
            "allocated_liters": allocated,
            "deficit_liters": deficit,
            "priority_score": village.get("priority_score", 0),
        })

        logger.info(
            f"Allocated tanker {tanker['id']} → village {village['name']} "
            f"({allocated:.0f}L / {deficit:.0f}L deficit)"
        )

    return allocations
