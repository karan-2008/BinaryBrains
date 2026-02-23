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


def fetch_forecast(village_id: str, lat: float, lon: float) -> list:
    """
    Fetch 5-day / 3-hour forecast for the given coordinates from OpenWeather API,
    and aggregate it into a daily forecast.

    Returns a list of daily dictionaries:
        [{
            "date": "2026-02-23",
            "temp_min": float,
            "temp_max": float,
            "rainfall_mm": float,
            "humidity_avg": float
        }, ...]
    """
    cache_key = f"{village_id}_forecast"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    api_key = settings.OPENWEATHER_API_KEY
    if not api_key:
        return []

    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric",
    }

    try:
        from app.core.constants import OPENWEATHER_FORECAST_URL
        response = requests.get(OPENWEATHER_FORECAST_URL, params=params, timeout=5)

        if response.status_code != 200:
            logger.error("Forecast API error %d for %s", response.status_code, village_id)
            return []

        data = response.json()
        daily_forecast = {}

        # Aggregate 3-hour chunks into daily
        for item in data.get("list", []):
            dt_txt = item.get("dt_txt", "")
            if not dt_txt:
                continue
            
            date_str = dt_txt.split(" ")[0]  # YYYY-MM-DD
            
            main = item.get("main", {})
            rain = item.get("rain", {}).get("3h", 0.0)

            if date_str not in daily_forecast:
                daily_forecast[date_str] = {
                    "date": date_str,
                    "temp_min": main.get("temp_min", 999),
                    "temp_max": main.get("temp_max", -999),
                    "rainfall_mm": 0.0,
                    "humidity_sum": 0.0,
                    "count": 0
                }
            
            day = daily_forecast[date_str]
            day["temp_min"] = min(day["temp_min"], main.get("temp_min", 999))
            day["temp_max"] = max(day["temp_max"], main.get("temp_max", -999))
            day["rainfall_mm"] += rain
            day["humidity_sum"] += main.get("humidity", 0)
            day["count"] += 1

        # Format output
        result = []
        for d in sorted(daily_forecast.values(), key=lambda x: x["date"]):
            d["humidity_avg"] = round(d["humidity_sum"] / d["count"], 1) if d["count"] > 0 else 0
            d["rainfall_mm"] = round(d["rainfall_mm"], 2)
            d["temp_min"] = round(d["temp_min"], 1)
            d["temp_max"] = round(d["temp_max"], 1)
            del d["humidity_sum"]
            del d["count"]
            result.append(d)

        _set_cache(cache_key, result)
        return result

    except Exception as exc:
        logger.error("Forecast API request failed for village %s: %s", village_id, exc)
        return []

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
