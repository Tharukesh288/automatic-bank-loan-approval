import sys
import os

# Ensure backend directory is in sys.path for app imports
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {
    "applicant_name": "Test Applicant",
    "email": "test@example.com",
    "phone": "9876543210",
    "pan": "ABCDE1234F",
    "dependents": "1",
    "education": "Graduate",
    "self_employed": "No",
    "applicant_income": 5000.0,
    "coapplicant_income": 1500.0,
    "loan_amount": 200.0,
    "loan_amount_term": 360.0,
    "credit_history": 1.0,
    "property_area": "Urban"
}

def test_predict_loan_success():
    """A. POST /api/v1/loan/predict returns HTTP 200 and required fields"""
    response = client.post("/api/v1/loan/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert "application_id" in data
    assert data["application_id"].startswith("LA-")
    assert "prediction" in data
    assert "approval_probability" in data
    assert isinstance(data["approval_probability"], float)
    assert "recommendation" in data
    assert "risk_level" in data
    assert "message" in data
    assert "status" in data
    assert data["status"] == "AI_ASSESSED"

def test_predict_loan_invalid_pan():
    """B. Invalid PAN format returns HTTP 422"""
    invalid_payload = VALID_PAYLOAD.copy()
    invalid_payload["pan"] = "INVALID123"
    response = client.post("/api/v1/loan/predict", json=invalid_payload)
    assert response.status_code == 422

def test_predict_loan_missing_field():
    """C. Missing required field returns HTTP 422"""
    incomplete_payload = VALID_PAYLOAD.copy()
    del incomplete_payload["applicant_name"]
    response = client.post("/api/v1/loan/predict", json=incomplete_payload)
    assert response.status_code == 422

def test_database_persistence_and_get_application():
    """D & E. Database persistence: prediction creates record retrieved by GET endpoints"""
    # Create application via predict endpoint
    response = client.post("/api/v1/loan/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    app_id = data["application_id"]

    # Verify retrieval via GET /api/v1/applications/{application_id}
    get_res = client.get(f"/api/v1/applications/{app_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["application_id"] == app_id
    assert get_data["applicant_name"] == "Test Applicant"
    assert get_data["approval_probability"] == data["approval_probability"]

    # Verify retrieval via GET /api/v1/manager/applications
    mgr_res = client.get("/api/v1/manager/applications")
    assert mgr_res.status_code == 200
    mgr_data = mgr_res.json()
    assert "applications" in mgr_data
    app_ids = [a["application_id"] for a in mgr_data["applications"]]
    assert app_id in app_ids
