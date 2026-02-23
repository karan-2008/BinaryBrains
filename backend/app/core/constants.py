"""
Core constants for the Drought Warning & Smart Tanker Management System.

All threshold values and configuration constants are defined here
to ensure deterministic, centralized configuration.
"""

# ---------------------------------------------------------------------------
# Water Stress Index (WSI) Thresholds
# ---------------------------------------------------------------------------
WSI_CRITICAL_THRESHOLD = 70      # WSI above this → critical (red)
WSI_MODERATE_THRESHOLD = 40      # WSI above this → moderate (yellow)
WSI_MAX = 100                    # Maximum WSI value (hard cap)
WSI_MIN = 0                     # Minimum WSI value

# ---------------------------------------------------------------------------
# Tanker Defaults
# ---------------------------------------------------------------------------
DEFAULT_TANKER_CAPACITY_LITERS = 10_000   # Standard tanker capacity
MIN_WATER_REQUIREMENT_LPCD = 40           # Liters per capita per day (LPCD)

# ---------------------------------------------------------------------------
# Ollama / LLM Configuration
# ---------------------------------------------------------------------------
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_GENERATE_ENDPOINT = f"{OLLAMA_BASE_URL}/api/generate"
OLLAMA_MODEL = "deepseek-v3.1671b-cloud"

# ---------------------------------------------------------------------------
# API Configuration
# ---------------------------------------------------------------------------
API_PREFIX = "/api"
ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
