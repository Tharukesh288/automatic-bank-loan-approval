import os
import sys
from fastapi import HTTPException

# Ensure project root is in sys.path for ml imports
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if project_root not in sys.path:
    sys.path.append(project_root)

from ml.src.predict import predict_loan

def make_prediction(input_data: dict) -> dict:
    """
    Supervised Machine Learning prediction service.
    Uses trained scikit-learn pipeline (ml/models/loan_model.pkl).
    """
    try:
        # Run real ML model inference
        result = predict_loan(input_data)
    except Exception:
        # Catch model loading or prediction failures without exposing internal details
        raise HTTPException(
            status_code=500,
            detail="ML prediction service unavailable"
        )
    
    approval_prob = result["approval_probability"]
    prediction = result["prediction"]
    
    # Map decision support bands & messages based on project specification
    if approval_prob >= 0.75:
        recommendation = "strong_candidate"
        risk_level = "low"
        message = "The application is a strong candidate for manager review."
    elif approval_prob >= 0.50:
        recommendation = "manual_review"
        risk_level = "medium"
        message = "The application meets the approval threshold but requires manual manager review."
    else:
        recommendation = "higher_risk"
        risk_level = "high"
        message = "The application represents higher risk and requires further scrutiny."
        
    return {
        "prediction": prediction,
        "approval_probability": approval_prob,
        "recommendation": recommendation,
        "risk_level": risk_level,
        "message": message
    }


