def calculate_risk(
    detected_change,
    reported_progress
):
    """
    Compare satellite-detected physical change
    with the progress reported by e-Sakshi.
    """

    # If e-Sakshi has not provided progress
    if reported_progress is None:
        return {
            "risk_score": 0,
            "risk_level": "UNKNOWN",
            "progress_discrepancy": None,
            "reason": "Reported progress unavailable"
        }

    # Difference between reported progress
    # and satellite-detected change
    discrepancy = abs(
        reported_progress - detected_change
    )

    # Determine risk level
    if discrepancy >= 50:
        score = 90
        level = "CRITICAL"

    elif discrepancy >= 30:
        score = 70
        level = "HIGH"

    elif discrepancy >= 15:
        score = 40
        level = "MEDIUM"

    else:
        score = 10
        level = "LOW"

    return {
        "risk_score": score,
        "risk_level": level,
        "progress_discrepancy": round(
            discrepancy,
            2
        )
    }