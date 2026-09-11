from fastapi import FastAPI, HTTPException

from app.schemas import ESakshiRequest

from app.gee_service import (
    initialize_gee,
    create_aoi,
    create_cloud_free_composite
)

from app.change_detection import (
    calculate_change_percentage
)

from app.risk_engine import (
    calculate_risk
)


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

        # --------------------------------
        # 1. Create Area of Interest
        # --------------------------------

        aoi = create_aoi(
            request.latitude,
            request.longitude,
            request.radius_meters
        )


        # --------------------------------
        # 2. Get BEFORE satellite image
        # --------------------------------

        before_image = create_cloud_free_composite(
            aoi,
            request.before_start,
            request.before_end
        )


        # --------------------------------
        # 3. Get AFTER satellite image
        # --------------------------------

        after_image = create_cloud_free_composite(
            aoi,
            request.after_start,
            request.after_end
        )


        # --------------------------------
        # 4. Detect physical/geospatial change
        # --------------------------------

        detected_change = (
            calculate_change_percentage(
                before_image,
                after_image,
                aoi
            )
            .getInfo()
        )


        # --------------------------------
        # 5. Calculate risk
        # --------------------------------

        risk = calculate_risk(
            detected_change,
            request.reported_progress
        )


        # --------------------------------
        # 6. Return result
        # --------------------------------

        return {

            "work_id": request.work_id,

            "location": {
                "latitude": request.latitude,
                "longitude": request.longitude,
                "radius_meters": request.radius_meters
            },

            "satellite_analysis": {

                "detected_change_percent": round(
                    detected_change,
                    2
                ),

                "method": (
                    "Sentinel-2 NDBI "
                    "change detection"
                )
            },

            "reported_progress": (
                request.reported_progress
            ),

            "risk_assessment": risk,

            "human_review_required": (
                risk["risk_level"]
                in ["HIGH", "CRITICAL"]
            )
        }


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )