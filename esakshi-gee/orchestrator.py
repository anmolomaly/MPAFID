def run_image_forensics_tier1(image_urls):
    """
    MOCK: Tier 1 Image Verification (Member 3)
    Will validate milestone images to stop recycled, stock, or edited proof-of-work.
    """
    if not image_urls:
        return {"fraud_detected": False, "score": 0, "message": "No images provided."}
    
    # Mocking a safe response
    return {
        "fraud_detected": False,
        "score": 10,  # low risk
        "message": "Images passed initial forensics check."
    }

def run_cartel_detection_tier2(contractor_info):
    """
    MOCK: Tier 2 Cartel & Network Detection (Member 5)
    Will uncover contractor cartels, shell entities, and circular bidding rings.
    """
    # Mocking a safe response
    return {
        "cartel_risk_detected": False,
        "score": 15,
        "message": "No circular bidding or cartel networks detected."
    }

def calculate_composite_risk_score(tier1_dedup, tier1_forensics, tier2_satellite, tier2_cartel):
    """
    Design the Composite Risk Scoring engine (0 to 100) that triggers automatic PFMS payout holds.
    """
    score = 0
    
    # 1. Deduplication Risk (0 - 40 points)
    if tier1_dedup.get("duplicate_found"):
        score += 40
        
    # 2. Image Forensics Risk (0 - 20 points)
    if tier1_forensics.get("fraud_detected"):
        score += 20
    else:
        score += min(20, tier1_forensics.get("score", 0))
        
    # 3. Satellite Verification Risk (0 - 20 points)
    # Re-using the existing risk_assessment which returns risk_score out of 90, scale to 20
    satellite_risk = tier2_satellite.get("risk_assessment", {}).get("risk_score", 0)
    score += (satellite_risk / 90.0) * 20
    
    # 4. Cartel Detection Risk (0 - 20 points)
    if tier2_cartel.get("cartel_risk_detected"):
        score += 20
    else:
        score += min(20, tier2_cartel.get("score", 0))
        
    # Cap at 100
    final_score = min(100, int(score))
    
    risk_level = "LOW"
    if final_score >= 70:
        risk_level = "CRITICAL"
    elif final_score >= 50:
        risk_level = "HIGH"
    elif final_score >= 30:
        risk_level = "MEDIUM"
        
    return {
        "composite_score": final_score,
        "risk_level": risk_level,
        "requires_payout_hold": final_score >= 70
    }
