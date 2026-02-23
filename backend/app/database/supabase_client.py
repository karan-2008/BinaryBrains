"""
Supabase client initialization.

Provides a lazily-initialized singleton Supabase client.
The client is only created on the first DB call, so the server
starts cleanly even before real credentials are configured.
"""

from __future__ import annotations
from supabase import create_client, Client
from app.config import settings

_client: Client | None = None


def get_supabase_client() -> Client:
    """
    Return the Supabase client, creating it on first call.

    Returns:
        A configured Supabase Client.

    Raises:
        EnvironmentError: If Supabase credentials are not configured.
    """
    global _client
    if _client is None:
        settings.validate()
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _client


# Convenience alias — resolved lazily
def supabase() -> Client:
    return get_supabase_client()
