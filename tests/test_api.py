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

def test_manager_status_filtering_and_lifecycle():
    """F. Status filtering and full action lifecycle (Review, Shortlist, Reject)"""
    # Create 3 applications
    res1 = client.post("/api/v1/loan/predict", json=VALID_PAYLOAD).json()
    res2 = client.post("/api/v1/loan/predict", json=VALID_PAYLOAD).json()
    res3 = client.post("/api/v1/loan/predict", json=VALID_PAYLOAD).json()

    id1, id2, id3 = res1["application_id"], res2["application_id"], res3["application_id"]

    # 1. Pending view (AI_ASSESSED) includes all three
    pending_res = client.get("/api/v1/manager/applications?status=AI_ASSESSED").json()
    pending_ids = [a["application_id"] for a in pending_res["applications"]]
    assert id1 in pending_ids
    assert id2 in pending_ids
    assert id3 in pending_ids

    # 2. Action: Review id1
    review_res = client.post("/api/v1/manager/applications/bulk-action", json={"application_ids": [id1], "action": "REVIEW"})
    assert review_res.status_code == 200
    assert review_res.json()["status"] == "UNDER_REVIEW"

    # 3. Action: Shortlist id2
    shortlist_res = client.post("/api/v1/manager/applications/bulk-action", json={"application_ids": [id2], "action": "SHORTLIST"})
    assert shortlist_res.status_code == 200
    assert shortlist_res.json()["status"] == "SHORTLISTED"

    # 4. Action: Reject id3
    reject_res = client.post("/api/v1/manager/applications/bulk-action", json={"application_ids": [id3], "action": "REJECT"})
    assert reject_res.status_code == 200
    assert reject_res.json()["status"] == "REJECTED"

    # 5. Verify Pending filter no longer contains id1, id2, id3
    pending_res_after = client.get("/api/v1/manager/applications?status=AI_ASSESSED").json()
    pending_ids_after = [a["application_id"] for a in pending_res_after["applications"]]
    assert id1 not in pending_ids_after
    assert id2 not in pending_ids_after
    assert id3 not in pending_ids_after

    # 6. Verify Under Review filter contains id1
    review_list = client.get("/api/v1/manager/applications?status=UNDER_REVIEW").json()["applications"]
    assert any(a["application_id"] == id1 for a in review_list)

    # 7. Verify Shortlisted filter contains id2
    shortlist_list = client.get("/api/v1/manager/applications?status=SHORTLISTED").json()["applications"]
    assert any(a["application_id"] == id2 for a in shortlist_list)

    # 8. Verify Rejected filter contains id3
    reject_list = client.get("/api/v1/manager/applications?status=REJECTED").json()["applications"]
    assert any(a["application_id"] == id3 for a in reject_list)

    # 9. Verify All filter contains id1, id2, id3 with correct statuses in DB
    all_list = client.get("/api/v1/manager/applications").json()["applications"]
    all_dict = {a["application_id"]: a["status"] for a in all_list}
    assert all_dict[id1] == "UNDER_REVIEW"
    assert all_dict[id2] == "SHORTLISTED"
    assert all_dict[id3] == "REJECTED"
