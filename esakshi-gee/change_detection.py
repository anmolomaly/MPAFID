import ee


def calculate_change_percentage(before_image, after_image, aoi):
    """
    Measure normalized built-up index change between before and after images.
    Returns a percentage-like value representing the magnitude of detected change.
    """
    before_ndbi = before_image.normalizedDifference(["B11", "B8"]).rename("NDBI")
    after_ndbi = after_image.normalizedDifference(["B11", "B8"]).rename("NDBI")

    delta = after_ndbi.subtract(before_ndbi).abs()
    mean_change = delta.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9,
    ).get("NDBI")

    percent = (
        ee.Number(mean_change).multiply(100)
        .clamp(0, 100)
    )

    return percent

