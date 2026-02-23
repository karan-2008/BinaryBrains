"""
Water Stress Index (WSI) Calculator.

CRITICAL: This module contains ONLY deterministic mathematical calculations.
No AI/LLM calls are permitted here.
"""

from app.utils.helpers import clamp
from app.core.constants import WSI_MAX, WSI_MIN


def compute_wsi(
    gw_current_level: float,
    gw_min_required: float,
    rainfall_dev_pct: float,
) -> float:
    """
    Compute the Water Stress Index (WSI) for a village.

    The WSI is a deterministic composite score (0–100) that quantifies
    water stress based on groundwater depletion and rainfall deviation.

    Formula:
        groundwater_stress = ((gw_min_required - gw_current_level) / gw_min_required) * 100
        rainfall_stress    = abs(rainfall_dev_pct) if rainfall_dev_pct < 0 else 0
        wsi                = 0.6 * groundwater_stress + 0.4 * rainfall_stress

    Args:
        gw_current_level: Current groundwater level in meters.
        gw_min_required: Minimum required groundwater level in meters.
        rainfall_dev_pct: Rainfall deviation from normal as a percentage
                          (negative = deficit, positive = surplus).

    Returns:
        WSI value clamped between 0 and 100.
    """
    # Groundwater stress: how far below minimum the current level is
    if gw_min_required > 0:
        groundwater_stress = (
            (gw_min_required - gw_current_level) / gw_min_required
        ) * 100.0
    else:
        groundwater_stress = 0.0

    # Rainfall stress: only counts when there's a deficit
    rainfall_stress = abs(rainfall_dev_pct) if rainfall_dev_pct < 0 else 0.0

    # Weighted composite
    wsi = 0.6 * groundwater_stress + 0.4 * rainfall_stress

    return clamp(wsi, WSI_MIN, WSI_MAX)


def compute_priority_score(population: int, wsi: float) -> float:
    """
    Compute a priority score for resource allocation.

    Higher score = higher priority for tanker allocation.
    Combines population impact with water stress severity.

    Formula:
        priority_score = (population / 1000) * wsi

    Args:
        population: Village population count.
        wsi: Computed Water Stress Index (0–100).

    Returns:
        A non-negative priority score.
    """
    return (population / 1000.0) * wsi


def calculate_rainfall_deviation(actual_rainfall: float, expected_rainfall: float) -> float:
    """
    Deterministic rainfall deviation calculation.

    Computes how far below the expected rainfall the actual rainfall is,
    expressed as a percentage (0–100). A higher value indicates a larger
    deficit (more drought stress).

    Args:
        actual_rainfall: Actual observed rainfall in mm.
        expected_rainfall: Expected/normal rainfall in mm for this period.

    Returns:
        Deviation percentage clamped between 0 and 100.
        0 = no deficit, 100 = total drought (zero rainfall vs expectation).
    """
    if expected_rainfall <= 0:
        return 0.0

    deviation = ((expected_rainfall - actual_rainfall) / expected_rainfall) * 100.0
    return max(0.0, min(deviation, 100.0))
