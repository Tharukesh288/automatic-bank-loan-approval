import os
import sys

src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.append(src_dir)

import joblib
import pandas as pd
from preprocess import prepare_input_dataframe


MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "loan_model.pkl")

# Cached pipeline instance
_model_pipeline = None

def get_model_pipeline():
    """
    Loads and caches the trained scikit-learn pipeline artifact.
    """
    global _model_pipeline
    if _model_pipeline is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model artifact not found at {MODEL_PATH}. "
                "Please run `python ml/src/train.py` first."
            )
        _model_pipeline = joblib.load(MODEL_PATH)
    return _model_pipeline

def predict_loan(input_data: dict) -> dict:
    """
    Standard prediction interface for loan application feature inputs.

    Accepts raw dictionary input (with backend API keys or dataset column names)
    and returns prediction status and approval probability.

    Example input_data:
    {
        "applicant_name": "Demo Applicant",
        "dependents": "1",
        "education": "Graduate",
        "self_employed": "No",
        "applicant_income": 5000,
        "coapplicant_income": 1500,
        "loan_amount": 200,
        "loan_amount_term": 360,
        "credit_history": 1,
        "property_area": "Urban"
    }

    Example output:
    {
        "prediction": "approved",
        "approval_probability": 0.87
    }
    """
    pipeline = get_model_pipeline()

    # Preprocess and format input payload into single-row DataFrame
    input_df = prepare_input_dataframe(input_data)

    # Class probability for positive class (Approved / Y / 1)
    classes = list(pipeline.classes_)
    positive_idx = classes.index(1) if 1 in classes else 1
    
    probabilities = pipeline.predict_proba(input_df)[0]
    approval_prob = round(float(probabilities[positive_idx]), 4)

    # Prediction label
    predicted_class = pipeline.predict(input_df)[0]
    prediction_label = "approved" if (predicted_class == 1 or predicted_class == "Y") else "rejected"

    return {
        "prediction": prediction_label,
        "approval_probability": approval_prob
    }

if __name__ == "__main__":
    # Quick test execution
    sample_input = {
        "dependents": "1",
        "education": "Graduate",
        "self_employed": "No",
        "applicant_income": 5000,
        "coapplicant_income": 1500,
        "loan_amount": 200,
        "loan_amount_term": 360,
        "credit_history": 1,
        "property_area": "Urban"
    }
    try:
        res = predict_loan(sample_input)
        print("Sample Prediction Result:", res)
    except Exception as e:
        print("Prediction test error:", str(e))
