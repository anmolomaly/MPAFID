"""
MPAFID - Tier 1 Milestone Image Verification Microservice

Install:
    pip install fastapi uvicorn pillow imagehash opencv-python numpy python-multipart exifread pydantic

Run API:
    uvicorn mpafid_verifier:app --reload --host 127.0.0.1 --port 8000

Run self-test:
    python mpafid_verifier.py
"""
from __future__ import annotations

import json
import logging
import math
import os
import sqlite3
import tempfile
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import Any, Optional, Sequence

import cv2
import exifread
import imagehash
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, ConfigDict, Field
from starlette.middleware.base import BaseHTTPMiddleware

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
ELA_DIR = STATIC_DIR / "ela"
DB_PATH = BASE_DIR / "mpafid_hash_registry.sqlite3"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
ELA_DIR.mkdir(parents=True, exist_ok=True)

MAX_IMAGE_BYTES = 20 * 1024 * 1024
GEO_MISMATCH_METERS = 100.0
HASH_HAMMING_THRESHOLD = 6
ELA_TAMPERING_THRESHOLD = 60.0
JPEG_QUALITY = 92

class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            payload["request_id"] = record.request_id
        if hasattr(record, "event"):
            payload["event"] = record.event
        structured = getattr(record, "structured", None)
        if isinstance(structured, dict):
            payload.update(structured)
        return json.dumps(payload, ensure_ascii=False)

def configure_logging() -> None:
    root = logging.getLogger()
    root.setLevel(logging.INFO)
    if not root.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        root.addHandler(handler)
configure_logging()
logger = logging.getLogger("mpafid")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        started = datetime.now(timezone.utc)
        try:
            response = await call_next(request)
            elapsed_ms = (datetime.now(timezone.utc) - started).total_seconds() * 1000.0
            logger.info("request_completed", extra={"request_id": request_id, "event": "http_request", "structured": {"method": request.method, "path": request.url.path, "status_code": response.status_code, "duration_ms": round(elapsed_ms, 2)}})
            response.headers["X-Request-ID"] = request_id
            return response
        except Exception:
            logger.exception("request_failed", extra={"request_id": request_id, "event": "http_request", "structured": {"method": request.method, "path": request.url.path, "status_code": 500}})
            raise

class GPSCoordinates(BaseModel):
    model_config = ConfigDict(extra="forbid")
    lat: float
    lon: float

class MetadataResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    has_exif: bool
    capture_time: Optional[str] = None
    extracted_gps: Optional[GPSCoordinates] = None
    distance_to_target_meters: Optional[float] = None

class DuplicateCheckResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    is_duplicate: bool
    matched_project_id: Optional[str] = None
    hamming_distance: Optional[int] = None
    similarity_percentage: Optional[float] = None

class ELAAnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    tampering_score: float
    tampering_detected: bool
    heatmap_url: str

class VerificationResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    image_id: str
    project_id: str
    composite_risk_score: int = Field(ge=0, le=100)
    verdict: str
    flags: list[str]
    metadata: MetadataResponse
    duplicate_check: DuplicateCheckResponse
    ela_analysis: ELAAnalysisResponse

@dataclass(frozen=True)
class GPSResult:
    latitude: float
    longitude: float

@dataclass(frozen=True)
class MetadataResult:
    has_exif: bool
    has_camera_data: bool
    has_gps_data: bool
    capture_time: Optional[str]
    gps: Optional[GPSResult]
    raw_tag_count: int

@dataclass(frozen=True)
class DuplicateResult:
    is_duplicate: bool
    matched_project_id: Optional[str]
    matched_image_path: Optional[str]
    hamming_distance: Optional[int]
    similarity_percentage: Optional[float]

@dataclass(frozen=True)
class ELAResult:
    tampering_score: float
    tampering_detected: bool
    heatmap_url: str
    heatmap_path: Path

def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))

def normalize(value: float, low: float, high: float) -> float:
    return clamp((value - low) / (high - low), 0.0, 1.0) if high > low else 0.0

def validate_coordinates(lat: float, lon: float) -> None:
    if not math.isfinite(lat) or not math.isfinite(lon):
        raise ValueError("Coordinates must be finite numbers.")
    if not -90.0 <= lat <= 90.0:
        raise ValueError("Latitude must be between -90 and 90.")
    if not -180.0 <= lon <= 180.0:
        raise ValueError("Longitude must be between -180 and 180.")

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6_371_008.8
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))

class MetadataForensics:
    CAPTURE_TIME_TAGS = {"EXIF DateTimeOriginal", "EXIF DateTimeDigitized", "Image DateTime"}
    CAMERA_TAG_PREFIXES = ("Image Make", "Image Model", "Image Software", "EXIF LensModel", "EXIF BodySerialNumber", "EXIF LensMake", "EXIF CameraOwnerName")

    @staticmethod
    def _ratio_to_float(value: Any) -> Optional[float]:
        try:
            if hasattr(value, "num") and hasattr(value, "den"):
                return None if value.den == 0 else float(value.num) / float(value.den)
            return float(value)
        except (TypeError, ValueError, ZeroDivisionError):
            return None

    @classmethod
    def _dms_to_decimal(cls, values: Sequence[Any], hemisphere: str) -> Optional[float]:
        if len(values) < 3:
            return None
        d, m, s = (cls._ratio_to_float(v) for v in values[:3])
        if d is None or m is None or s is None:
            return None
        result = abs(d) + m / 60.0 + s / 3600.0
        if hemisphere.strip().upper() in {"S", "W"}:
            result *= -1.0
        return result

    @classmethod
    def analyze(cls, image_bytes: bytes) -> MetadataResult:
        with BytesIO(image_bytes) as stream:
            tags = exifread.process_file(stream, details=False, strict=False)
        has_exif = bool(tags)
        camera_data = any(k.startswith(cls.CAMERA_TAG_PREFIXES) for k in tags.keys())
        lat_tag = tags.get("GPS GPSLatitude")
        lon_tag = tags.get("GPS GPSLongitude")
        lat_ref = str(tags.get("GPS GPSLatitudeRef", "N"))
        lon_ref = str(tags.get("GPS GPSLongitudeRef", "E"))
        gps = None
        if lat_tag is not None and lon_tag is not None:
            lat = cls._dms_to_decimal(list(lat_tag.values), lat_ref)
            lon = cls._dms_to_decimal(list(lon_tag.values), lon_ref)
            if lat is not None and lon is not None:
                try:
                    validate_coordinates(lat, lon)
                    gps = GPSResult(lat, lon)
                except ValueError:
                    gps = None
        capture_time = None
        for key in cls.CAPTURE_TIME_TAGS:
            if key in tags:
                capture_time = str(tags[key])
                break
        return MetadataResult(has_exif, camera_data, gps is not None, capture_time, gps, len(tags))

class HashRegistry:
    def __init__(self, db_path: Path):
        self.db_path = db_path
        self._initialize()
    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=10.0, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    def _initialize(self) -> None:
        with self._connect() as conn:
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("CREATE TABLE IF NOT EXISTS image_hashes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT NOT NULL, image_path TEXT NOT NULL, phash TEXT NOT NULL, dhash TEXT NOT NULL, ahash TEXT NOT NULL, created_at TEXT NOT NULL)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_image_hashes_project ON image_hashes(project_id)")
            conn.commit()
    @staticmethod
    def _hash_image(image: Image.Image) -> tuple[str, str, str]:
        image = image.convert("RGB")
        return str(imagehash.phash(image)), str(imagehash.dhash(image)), str(imagehash.average_hash(image))
    def register(self, project_id: str, image_path: str, image: Image.Image) -> None:
        ph, dh, ah = self._hash_image(image)
        with self._connect() as conn:
            conn.execute("INSERT INTO image_hashes (project_id,image_path,phash,dhash,ahash,created_at) VALUES (?,?,?,?,?,?)", (project_id, image_path, ph, dh, ah, datetime.now(timezone.utc).isoformat()))
            conn.commit()
    def compare(self, image: Image.Image) -> DuplicateResult:
        incoming = tuple(imagehash.hex_to_hash(x) for x in self._hash_image(image))
        best = None
        with self._connect() as conn:
            rows = conn.execute("SELECT project_id,image_path,phash,dhash,ahash FROM image_hashes ORDER BY id DESC").fetchall()
        for row in rows:
            stored = tuple(imagehash.hex_to_hash(row[k]) for k in ("phash", "dhash", "ahash"))
            for inc, st in zip(incoming, stored):
                distance = inc - st
                if distance <= HASH_HAMMING_THRESHOLD:
                    bits = inc.hash.size
                    similarity = round(clamp(100.0 * (1.0 - distance / float(bits)), 0.0, 100.0), 2)
                    candidate = (int(distance), -similarity, row["project_id"], row["image_path"], similarity)
                    if best is None or candidate[:2] < best[:2]:
                        best = candidate
        if best is None:
            return DuplicateResult(False, None, None, None, None)
        return DuplicateResult(True, best[2], best[3], best[0], best[4])

class ELAAnalyzer:
    @staticmethod
    def _roundtrip(image: Image.Image) -> Image.Image:
        stream = BytesIO()
        image.convert("RGB").save(stream, format="JPEG", quality=JPEG_QUALITY, optimize=False, progressive=False)
        stream.seek(0)
        return Image.open(stream).convert("RGB").copy()
    def analyze(self, image: Image.Image) -> ELAResult:
        original = np.asarray(image.convert("RGB"), dtype=np.uint8)
        recompressed = np.asarray(self._roundtrip(image), dtype=np.uint8)
        if original.shape != recompressed.shape:
            recompressed = cv2.resize(recompressed, (original.shape[1], original.shape[0]), interpolation=cv2.INTER_AREA)
        a = original.astype(np.float32)
        b = recompressed.astype(np.float32)
        diff = np.abs(a - b)
        gray_diff = np.mean(diff, axis=2)
        mse = float(np.mean((a - b) ** 2))
        gray = cv2.cvtColor(original, cv2.COLOR_RGB2GRAY).astype(np.float32)
        gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
        gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
        mag = cv2.magnitude(gx, gy)
        mask = mag >= float(np.percentile(mag, 75.0))
        values = gray_diff[mask] if np.any(mask) else gray_diff.ravel()
        boundary_mean = float(np.mean(values))
        boundary_variance = float(np.var(values))
        extreme_threshold = max(18.0, float(np.percentile(values, 95.0)))
        extreme_ratio = float(np.mean(values >= extreme_threshold))
        score = 100.0 * (0.30 * normalize(boundary_mean, 0, 12) + 0.25 * normalize(boundary_variance, 0, 90) + 0.20 * normalize(mse, 0, 35) + 0.25 * normalize(extreme_ratio, 0, 0.20))
        score = round(clamp(score, 0, 100), 2)
        dynamic_max = max(1.0, float(np.percentile(gray_diff, 99.5)))
        scale = clamp(255.0 / dynamic_max, 10.0, 20.0)
        amplified = np.clip(gray_diff * scale, 0, 255).astype(np.uint8)
        heatmap = cv2.applyColorMap(amplified, cv2.COLORMAP_JET)
        name = f"{uuid.uuid4()}.jpg"
        path = ELA_DIR / name
        if not cv2.imwrite(str(path), heatmap, [cv2.IMWRITE_JPEG_QUALITY, 92]):
            raise RuntimeError("Unable to save ELA artifact")
        return ELAResult(score, score > ELA_TAMPERING_THRESHOLD, f"/static/ela/{name}", path)

class MilestoneVerifier:
    def __init__(self, registry: HashRegistry):
        self.registry = registry
        self.metadata = MetadataForensics()
        self.ela = ELAAnalyzer()
    @staticmethod
    def _load_image(data: bytes) -> Image.Image:
        if not data:
            raise ValueError("Empty image payload.")
        if len(data) > MAX_IMAGE_BYTES:
            raise ValueError(f"Image exceeds {MAX_IMAGE_BYTES // (1024 * 1024)} MiB.")
        try:
            with BytesIO(data) as s:
                img = Image.open(s)
                img.verify()
            with BytesIO(data) as s:
                img = Image.open(s)
                img.load()
                return img.convert("RGB")
        except (UnidentifiedImageError, OSError) as exc:
            raise ValueError("Uploaded payload is not a valid image.") from exc
    def verify(self, image_bytes: bytes, project_id: str, target_lat: float, target_lon: float, image_id: str) -> VerificationResponse:
        if not project_id.strip():
            raise ValueError("project_id cannot be empty.")
        validate_coordinates(target_lat, target_lon)
        image = self._load_image(image_bytes)
        metadata = self.metadata.analyze(image_bytes)
        duplicate = self.registry.compare(image)
        distance = None
        if metadata.gps:
            distance = round(haversine_distance_meters(metadata.gps.latitude, metadata.gps.longitude, target_lat, target_lon), 3)
        flags: list[str] = []
        risk = 0
        if not metadata.has_exif or not metadata.has_camera_data or not metadata.has_gps_data:
            flags.append("STRIPPED_METADATA_SUSPECTED")
            risk += 35
        if distance is not None and distance > GEO_MISMATCH_METERS:
            flags.append("GEOLOCATION_MISMATCH")
            risk += 40
        if duplicate.is_duplicate:
            flags.append("RECYCLED_OR_DUPLICATE_IMAGE")
            risk += 50
        ela = self.ela.analyze(image)
        if ela.tampering_detected:
            flags.append("ELA_TAMPERING_SUSPECTED")
            risk += 40
        risk = min(100, risk)
        verdict = "REJECTED" if risk >= 80 else "FLAGGED_FOR_REVIEW" if risk >= 35 else "APPROVED"
        self.registry.register(project_id, f"milestones/{project_id}/{image_id}.jpg", image)
        return VerificationResponse(
            image_id=image_id,
            project_id=project_id,
            composite_risk_score=risk,
            verdict=verdict,
            flags=flags,
            metadata=MetadataResponse(has_exif=metadata.has_exif, capture_time=metadata.capture_time, extracted_gps=GPSCoordinates(lat=metadata.gps.latitude, lon=metadata.gps.longitude) if metadata.gps else None, distance_to_target_meters=distance),
            duplicate_check=DuplicateCheckResponse(is_duplicate=duplicate.is_duplicate, matched_project_id=duplicate.matched_project_id, hamming_distance=duplicate.hamming_distance, similarity_percentage=duplicate.similarity_percentage),
            ela_analysis=ELAAnalysisResponse(tampering_score=ela.tampering_score, tampering_detected=ela.tampering_detected, heatmap_url=ela.heatmap_url),
        )

app = FastAPI(title="MPAFID - Tier 1 Milestone Image Verification", version="1.0.0")
app.add_middleware(RequestLoggingMiddleware)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
registry = HashRegistry(DB_PATH)
verifier = MilestoneVerifier(registry)

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "mpafid-tier1-image-verification"}

@app.post("/api/v1/verify-milestone", response_model=VerificationResponse, response_model_exclude_none=False)
async def verify_milestone(request: Request, image: UploadFile = File(...), project_id: str = Form(...), target_lat: float = Form(...), target_lon: float = Form(...)) -> VerificationResponse:
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    allowed = {"image/jpeg", "image/png", "image/webp", "image/tiff", "image/bmp"}
    if not image.content_type or image.content_type.lower() not in allowed:
        raise HTTPException(415, detail={"message": "Unsupported image type.", "request_id": request_id})
    data = await image.read()
    try:
        validate_coordinates(target_lat, target_lon)
        return verifier.verify(data, project_id, target_lat, target_lon, str(uuid.uuid4()))
    except ValueError as exc:
        raise HTTPException(422, detail={"message": str(exc), "request_id": request_id}) from exc
    except Exception as exc:
        logger.exception("verification_exception", extra={"request_id": request_id, "event": "verification_exception"})
        raise HTTPException(500, detail={"message": "Image verification failed.", "request_id": request_id}) from exc

def _create_synthetic_image() -> bytes:
    h, w = 480, 640
    yy, xx = np.mgrid[0:h, 0:w]
    base = np.zeros((h, w, 3), dtype=np.uint8)
    base[..., 0] = ((xx * 255) // w).astype(np.uint8)
    base[..., 1] = ((yy * 255) // h).astype(np.uint8)
    base[..., 2] = (((xx + yy) * 255) // (w + h)).astype(np.uint8)
    cv2.rectangle(base, (80, 70), (300, 240), (230, 230, 230), -1)
    cv2.circle(base, (450, 220), 90, (30, 30, 30), -1)
    cv2.line(base, (40, 400), (600, 360), (255, 255, 255), 8)
    out = BytesIO()
    Image.fromarray(base, "RGB").save(out, format="JPEG", quality=95)
    return out.getvalue()

def run_self_test() -> None:
    fd, name = tempfile.mkstemp(prefix="mpafid_selftest_", suffix=".sqlite3")
    os.close(fd)
    try:
        test_registry = HashRegistry(Path(name))
        test_verifier = MilestoneVerifier(test_registry)
        data = _create_synthetic_image()
        first = test_verifier.verify(data, "SIH-DEMO-001", 30.9048, 77.0967, str(uuid.uuid4()))
        second = test_verifier.verify(data, "SIH-DEMO-002", 30.9048, 77.0967, str(uuid.uuid4()))
        print("\nFINAL JSON\n")
        print(first.model_dump_json(indent=2))
        print("\nSELF TESTS")
        print("Metadata:", "PASS" if "STRIPPED_METADATA_SUSPECTED" in first.flags else "FAIL")
        print("ELA:", "PASS" if 0 <= first.ela_analysis.tampering_score <= 100 else "FAIL")
        print("Duplicate detection:", "PASS" if second.duplicate_check.is_duplicate and second.duplicate_check.matched_project_id == "SIH-DEMO-001" else "FAIL")
    finally:
        try:
            os.remove(name)
        except FileNotFoundError:
            pass

if __name__ == "__main__":
    run_self_test()
