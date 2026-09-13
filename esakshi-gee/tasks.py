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
def run_full_analysis(self, request_dict: dict) -> dict:
    """Execute the expensive satellite & risk pipeline.

    `request_dict` mirrors the `ESakshiRequest` schema so that the worker can be
    completely independent of the FastAPI process.
    """
    aoi = create_aoi(
        request_dict["latitude"],
        request_dict["longitude"],
        request_dict["radius_meters"],
    )

    before_image = create_cloud_free_composite(
        aoi, request_dict["before_start"], request_dict["before_end"]
    )
    after_image = create_cloud_free_composite(
        aoi, request_dict["after_start"], request_dict["after_end"]
    )

    detected_change = (
        calculate_change_percentage(before_image, after_image, aoi).getInfo()
    )

    risk = calculate_risk(detected_change, request_dict["reported_progress"])

    return {
        "work_id": request_dict.get("work_id"),
        "location": {
            "latitude": request_dict["latitude"],
            "longitude": request_dict["longitude"],
            "radius_meters": request_dict["radius_meters"],
        },
        "satellite_analysis": {
            "detected_change_percent": round(detected_change, 2),
            "method": "Sentinel-2 NDBI change detection",
        },
        "reported_progress": request_dict["reported_progress"],
        "risk_assessment": risk,
        "human_review_required": risk["risk_level"] in ["HIGH", "CRITICAL"],
    }
