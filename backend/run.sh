#!/bin/bash
# Run the FastAPI development server

set -e

echo "Starting Drought Warning API..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
