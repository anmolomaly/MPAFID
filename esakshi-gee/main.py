import sys
from pathlib import Path

from celery.result import AsyncResult
from fastapi import FastAPI, HTTPException

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from schemas import ESakshiRequest

from gee_service import (
    initialize_gee,
    create_aoi,
    create_cloud_free_composite,
)
from change_detection import calculate_change_percentage
from risk_engine import calculate_risk

# Deduplication engine (fast tier)
from semantic.dedup_engine import SemanticDeduplicationEngine

# Celery task queue
from tasks import run_full_analysis


# Create FastAPI application
app = FastAPI(
    title="e-Sakshi MPLADS Anomaly Detection API",
    description=(
        "API middleware connecting e-Sakshi data "
        "with Google Earth Engine satellite analysis."
    ),
    version="1.0.0"
)


# Initialize Google Earth Engine
try:
    initialize_gee()
except Exception as error:
    print("Earth Engine initialization failed:")
    print(error)


@app.get("/")
def home():
    return {
        "message": "e-Sakshi MPLADS API is running",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/v1/esakshi/analyze")
def analyze_work(request: ESakshiRequest):
    try:
        # ------------------------------------------------------------
        # Tier 1 – Fast deduplication (remains synchronous)
        # ------------------------------------------------------------
        dedup_engine = SemanticDeduplicationEngine()
        duplicate_result = dedup_engine.check_duplicate(
            proposal_text=request.dict().get("proposal_text", ""),
            latitude=request.latitude,
            longitude=request.longitude,
        )
        if duplicate_result["duplicate_found"]:
            return {"duplicate": True, "details": duplicate_result}

        # ------------------------------------------------------------
        # Tier 2 – Queue heavyweight analysis (asynchronous)
        # ------------------------------------------------------------
        request_payload = request.dict()
        task = run_full_analysis.delay(request_payload)
        return {
            "duplicate": False,
            "task_id": task.id,
            "message": "Analysis queued – poll /tasks/{task_id} for results.",
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))