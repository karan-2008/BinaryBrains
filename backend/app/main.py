"""
FastAPI application entry point.

Initializes the application, enables CORS, and includes all API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_villages import router as villages_router
from app.api.routes_tankers import router as tankers_router
from app.api.routes_chat import router as chat_router
from app.core.constants import ALLOWED_ORIGINS
from app.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="Drought Warning & Smart Tanker Management System",
    description="Integrated system for drought monitoring, water stress calculation, and tanker dispatch.",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Include Routers
# ---------------------------------------------------------------------------
app.include_router(villages_router)
app.include_router(tankers_router)
app.include_router(chat_router)


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "drought-warning-api"}
