from celery_app import celery
from gee_service import (
    initialize_gee,
    create_aoi,
    create_cloud_free_composite,
)
from change_detection import calculate_change_percentage
from risk_engine import calculate_risk

# Ensure GEE is initialized once per worker process
initialize_gee()

@celery.task(bind=True, name="run_full_analysis")
def run_full_analysis(self, request_dict: dict, tier1_dedup: dict, tier1_forensics: dict) -> dict:
    """Execute the expensive satellite & risk pipeline.

    `request_dict` mirrors the `ESakshiRequest` schema so that the worker can be
    completely independent of the FastAPI process.
    """
    # ------------------------------------------------------------
    # Step 4: Tier 2 Satellite Ground Verification (GEE - MOCKED)
    # ------------------------------------------------------------
    print("MOCK: Skipping GEE actual calls")
    detected_change = 45.0
    satellite_risk = {"risk_score": 50, "risk_level": "HIGH"}


    tier2_satellite = {
        "detected_change_percent": round(detected_change, 2),
        "method": "Sentinel-2 NDBI change detection",
        "risk_assessment": satellite_risk
    }

    # ------------------------------------------------------------
    # Step 5: Tier 2 Cartel & Network Detection (Mock)
    # ------------------------------------------------------------
    from orchestrator import run_cartel_detection_tier2, calculate_composite_risk_score
    
    tier2_cartel = run_cartel_detection_tier2(contractor_info={})

    # ------------------------------------------------------------
    # Step 6: Composite Risk Scoring Engine
    # ------------------------------------------------------------
    composite_risk = calculate_composite_risk_score(
        tier1_dedup, tier1_forensics, tier2_satellite, tier2_cartel
    )

    return {
        "work_id": request_dict.get("work_id"),
        "location": {
            "latitude": request_dict["latitude"],
            "longitude": request_dict["longitude"],
            "radius_meters": request_dict["radius_meters"],
        },
        "tier1_dedup": tier1_dedup,
        "tier1_forensics": tier1_forensics,
        "tier2_satellite": tier2_satellite,
        "tier2_cartel": tier2_cartel,
        "composite_risk": composite_risk,
        "status": "COMPLETED"
    }
