"""
General helper utilities.

Miscellaneous functions that don't fit in other utility modules.
"""


def safe_float(value, default: float = 0.0) -> float:
    """
    Safely convert a value to float.

    Args:
        value: The value to convert.
        default: Default value if conversion fails.

    Returns:
        The float value or the default.
    """
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def clamp(value: float, min_val: float, max_val: float) -> float:
    """
    Clamp a value between a minimum and maximum.

    Args:
        value: The value to clamp.
        min_val: Minimum allowed value.
        max_val: Maximum allowed value.

    Returns:
        The clamped value.
    """
    return max(min_val, min(value, max_val))
