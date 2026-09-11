import ee


def initialize_gee():
    """
    Initialize Google Earth Engine.
    """

    try:
        ee.Initialize(project="esakshi-gee")
        print("Google Earth Engine initialized successfully.")

    except Exception:
        print("Earth Engine authentication required.")
        ee.Authenticate()
        ee.Initialize(project="esakshi-gee")

        print("Google Earth Engine initialized successfully.")


def create_aoi(latitude, longitude, radius_meters):
    """
    Create an Area of Interest (AOI) around the MPLADS work location.
    """

    point = ee.Geometry.Point([
        longitude,
        latitude
    ])

    aoi = point.buffer(radius_meters)

    return aoi


def get_sentinel_collection(
    aoi,
    start_date,
    end_date
):
    """
    Get Sentinel-2 satellite images.
    """

    collection = (
        ee.ImageCollection(
            "COPERNICUS/S2_SR_HARMONIZED"
        )
        .filterBounds(aoi)
        .filterDate(
            str(start_date),
            str(end_date)
        )
        .filter(
            ee.Filter.lt(
                "CLOUDY_PIXEL_PERCENTAGE",
                60
            )
        )
    )

    return collection


def get_cloud_probability_collection(
    aoi,
    start_date,
    end_date
):
    """
    Get Sentinel-2 cloud probability data.
    """

    collection = (
        ee.ImageCollection(
            "COPERNICUS/S2_CLOUD_PROBABILITY"
        )
        .filterBounds(aoi)
        .filterDate(
            str(start_date),
            str(end_date)
        )
    )

    return collection


def join_sentinel_clouds(
    sentinel_collection,
    cloud_collection
):
    """
    Match Sentinel-2 images with
    their cloud probability images.
    """

    joined = ee.Join.saveFirst(
        "cloud_mask"
    ).apply(
        primary=sentinel_collection,
        secondary=cloud_collection,
        condition=ee.Filter.equals(
            leftField="system:index",
            rightField="system:index"
        )
    )

    return ee.ImageCollection(joined)


def mask_clouds(image):
    """
    Remove cloudy pixels.
    """

    cloud_probability = ee.Image(
        image.get("cloud_mask")
    ).select("probability")

    mask = cloud_probability.lt(40)

    return image.updateMask(mask)


def create_cloud_free_composite(
    aoi,
    start_date,
    end_date
):
    """
    Create a cloud-free Sentinel-2 composite.
    """

    sentinel = get_sentinel_collection(
        aoi,
        start_date,
        end_date
    )

    clouds = get_cloud_probability_collection(
        aoi,
        start_date,
        end_date
    )

    joined = join_sentinel_clouds(
        sentinel,
        clouds
    )

    composite = (
        joined
        .map(mask_clouds)
        .median()
        .clip(aoi)
    )

    return composite          