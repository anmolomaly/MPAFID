from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class ESakshiRequest(BaseModel):
    work_id: str

    # Location of the MPLADS work
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)

    # Satellite comparison periods
    before_start: date
    before_end: date
    after_start: date
    after_end: date

    # Information reported by e-Sakshi
    reported_progress: Optional[float] = Field(
        default=None,
        ge=0,
        le=100
    )

    sanctioned_amount: Optional[float] = Field(
        default=None,
        ge=0
    )

    estimated_cost: Optional[float] = Field(
        default=None,
        ge=0
    )

    expenditure: Optional[float] = Field(
        default=None,
        ge=0
    )

    payment_count: Optional[int] = Field(
        default=None,
        ge=0
    )

    work_type: Optional[str] = None

    # Area around the work to analyze
    radius_meters: int = Field(
        default=100,
        ge=20,
        le=1000
    )

    # Added for Semantic Deduplication
    proposal_text: str = Field(default="")

    # Added for Image Forensics (Member 3)
    image_urls: Optional[list[str]] = Field(default_factory=list)