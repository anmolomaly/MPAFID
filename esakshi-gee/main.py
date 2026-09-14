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


from celery_app import celery
from orchestrator import run_image_forensics_tier1

@app.get("/")
def home():
    return {
        "message": "e-Sakshi MPLADS API Orchestrator is running",
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
        request_payload = request.dict()

        # ------------------------------------------------------------
        # Step 1: Tier 1 – Semantic Deduplication (synchronous)
        # ------------------------------------------------------------
        dedup_engine = SemanticDeduplicationEngine()
        tier1_dedup = dedup_engine.check_duplicate(
            proposal_text=request_payload.get("proposal_text", ""),
            latitude=request.latitude,
            longitude=request.longitude,
        )
        
        # Ensure numpy int64/float32 types are converted to standard python types for Celery JSON serialization
        import json
        tier1_dedup = json.loads(json.dumps(tier1_dedup, default=lambda x: x.item() if hasattr(x, 'item') else str(x)))

        
        # ------------------------------------------------------------
        # Step 2: Tier 1 – Image Forensics (synchronous)
        # ------------------------------------------------------------
        image_urls = request_payload.get("image_urls", [])
        tier1_forensics = run_image_forensics_tier1(image_urls)

        # ------------------------------------------------------------
        # Orchestrator Decision: Short-circuit if Tier 1 finds Critical Risk
        # ------------------------------------------------------------
        if tier1_dedup.get("duplicate_found") and tier1_forensics.get("fraud_detected"):
            return {
                "status": "REJECTED_AT_TIER_1",
                "message": "Critical fraud indicators detected at Tier 1. Payout hold triggered.",
                "tier1_dedup": tier1_dedup,
                "tier1_forensics": tier1_forensics
            }

        # ------------------------------------------------------------
        # Step 3: Tier 2 – Queue heavyweight analysis (asynchronous)
        # ------------------------------------------------------------
        # Pass Tier 1 results to the Celery worker for composite scoring
        task = run_full_analysis.delay(request_payload, tier1_dedup, tier1_forensics)
        return {
            "status": "PROCESSING",
            "task_id": task.id,
            "message": "Tier 1 complete. Tier 2 queued – poll /api/v1/esakshi/tasks/{task_id} for composite results.",
            "tier1_dedup_summary": "Checked",
            "tier1_forensics_summary": "Checked"
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/api/v1/esakshi/tasks/{task_id}")
def get_task_status(task_id: str):
    """
    Poll this endpoint to get the result of the asynchronous Tier 2 analysis and final risk score.
    """
    try:
        task_result = AsyncResult(task_id, app=celery)
        if task_result.state == 'PENDING':
            return {"task_id": task_id, "status": "PENDING"}
        elif task_result.state == 'SUCCESS':
            return {"task_id": task_id, "status": "COMPLETED", "result": task_result.result}
        elif task_result.state == 'FAILURE':
            return {"task_id": task_id, "status": "FAILED", "error": str(task_result.info)}
        else:
            return {"task_id": task_id, "status": task_result.state}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))