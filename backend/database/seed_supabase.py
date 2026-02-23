"""
Database Seeding Script — Phase 4.

Reads dummy CSV files and uploads them to Supabase tables.
Run from the backend/database/ directory:
    cd backend/database
    python seed_supabase.py
"""

import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv(dotenv_path="../.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def seed_table(csv_path: str, table_name: str):
    """Read a CSV file and upsert its records into the given Supabase table."""
    print(f"Seeding {table_name} from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
        records = df.to_dict(orient="records")

        # Upsert data to avoid duplicates on multiple runs
        response = supabase.table(table_name).upsert(records).execute()
        print(f"  ✓ Inserted {len(records)} records into '{table_name}'.")
    except Exception as e:
        print(f"  ✗ Failed to seed {table_name}: {e}")


if __name__ == "__main__":
    base_dir = "dummy_data"

    print("=" * 50)
    print("  Supabase Database Seeder — rbu_hack")
    print("=" * 50)
    print(f"  URL: {SUPABASE_URL}")
    print()

    # Order matters: villages first (referenced by groundwater)
    seed_table(f"{base_dir}/villages.csv", "villages")
    seed_table(f"{base_dir}/groundwater.csv", "groundwater")
    seed_table(f"{base_dir}/tankers.csv", "tankers")

    print()
    print("Database seeding complete.")
