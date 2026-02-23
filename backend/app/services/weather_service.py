"""
Weather Service — Deterministic Rainfall Data Ingestion.

Fetches current weather data from OpenWeather API for a given lat/lon.
Includes a simple in-memory cache (15 min TTL) to avoid redundant API calls.

STRICT RULES:
- This module does NOT perform business logic or AI calls.
- It only fetches, caches, and formats weather data.
- The API key is loaded from environment variables and NEVER logged.

TODO: Integrate OpenWeather Forecast API (5-day / 3-hour) for predictive drought modelling.
"""

import time
import requests

from app.config import settings
from app.core.constants import OPENWEATHER_BASE_URL, WEATHER_CACHE_TTL_SECONDS
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# In-Memory Weather Cache
# ---------------------------------------------------------------------------
# Structure: { "village_id": { "data": {...}, "timestamp": float } }
_weather_cache: dict = {}


def _get_cached(village_id: str) -> dict | None:
    """Return cached weather data if still fresh, else None."""
    entry = _weather_cache.get(village_id)
    if entry and (time.time() - entry["timestamp"]) < WEATHER_CACHE_TTL_SECONDS:
        logger.debug("Weather cache HIT for %s", village_id)
        return entry["data"]
    return None


def _set_cache(village_id: str, data: dict) -> None:
    """Store weather data in the in-memory cache."""
    _weather_cache[village_id] = {
        "data": data,
        "timestamp": time.time(),
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def fetch_weather(village_id: str, lat: float, lon: float) -> dict:
    """
    Fetch current weather for the given coordinates from OpenWeather API.

    Returns a structured dictionary:
        {
            "rainfall_mm_last_hour": float,
            "humidity_percent": float,
            "temperature_celsius": float,
        }

    If the API call fails or times out, returns safe defaults (rainfall=0)
    so the system NEVER crashes.

    Args:
        village_id: Used as the cache key.
        lat: Latitude of the village.
        lon: Longitude of the village.

    Returns:
        Weather data dictionary.
    """
    # 1. Check cache first
    cached = _get_cached(village_id)
    if cached is not None:
        return cached

    # 2. Build request
    api_key = settings.OPENWEATHER_API_KEY
    if not api_key:
        logger.warning("OPENWEATHER_API_KEY not set — returning default weather data.")
        return _default_weather()

    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric",
    }

    # 3. Call OpenWeather API with 5-second timeout
    try:
        response = requests.get(OPENWEATHER_BASE_URL, params=params, timeout=5)

        if response.status_code != 200:
            logger.error(
                "OpenWeather API returned status %d for village %s: %s",
                response.status_code,
                village_id,
                response.text[:200],
            )
            return _default_weather()

        data = response.json()
        result = _parse_weather_response(data)
        _set_cache(village_id, result)
        logger.info("Weather fetched for village %s: %s", village_id, result)
        return result

    except requests.exceptions.Timeout:
        logger.error("OpenWeather API TIMEOUT for village %s (5s exceeded).", village_id)
        return _default_weather()

    except requests.exceptions.RequestException as exc:
        logger.error("OpenWeather API request failed for village %s: %s", village_id, exc)
        return _default_weather()


# ---------------------------------------------------------------------------
# Internal Helpers
# ---------------------------------------------------------------------------

def _parse_weather_response(data: dict) -> dict:
    """
    Extract only the fields we need from the raw OpenWeather response.
    Handles missing 'rain' key gracefully.
    """
    rain_section = data.get("rain", {})
    main_section = data.get("main", {})

    return {
        "rainfall_mm_last_hour": rain_section.get("1h", 0.0),
        "humidity_percent": main_section.get("humidity", 0.0),
        "temperature_celsius": main_section.get("temp", 0.0),
    }


def _default_weather() -> dict:
    """Return safe default weather data when the API is unavailable."""
    return {
        "rainfall_mm_last_hour": 0.0,
        "humidity_percent": 0.0,
        "temperature_celsius": 0.0,
    }
