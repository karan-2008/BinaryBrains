"""
Application configuration.

Loads environment variables using python-dotenv.
All external service credentials are sourced from the .env file.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    def validate(self) -> None:
        """Raise an error if required settings are missing."""
        missing = []
        if not self.SUPABASE_URL:
            missing.append("SUPABASE_URL")
        if not self.SUPABASE_KEY:
            missing.append("SUPABASE_KEY")
        if missing:
            raise EnvironmentError(
                f"Missing required environment variables: {', '.join(missing)}"
            )


settings = Settings()
