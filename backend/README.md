# Backend API Subsystem — Automatic Bank Loan Approval

This directory contains the **FastAPI backend API**, SQLite database layer, Pydantic schemas, and manager lifecycle workflow services for the **Automatic Bank Loan Approval & Decision Support System**.

---

## 1. Overview & Technology Stack

The backend serves as the central API gateway connecting the React frontend, the machine learning prediction engine, and the SQLite relational database.

### Technology Stack
- **Framework**: FastAPI (Asynchronous Python Web Framework)
- **Language**: Python 3.12
- **ORM / Database**: SQLAlchemy + SQLite (`sqlite:///./sql_app.db`)
- **Data Validation & Serialization**: Pydantic v2
- **ASGI Web Server**: Uvicorn
- **Testing**: `pytest`, `httpx`

---

## 2. System Architecture & Lifecycle Workflow

```text
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │ React Frontend  │  ───> │ FastAPI Gateway │  ───> │ ML Model Engine │  ───> │ SQLite Database │
 │  (Client UI)    │       │ (Endpoints/Auth)│       │ (Scikit-Learn)  │       │ (Single Table)  │
 └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Application Lifecycle Statuses
Applications are managed within a single database table (`applications`) using the `status` column to represent lifecycle progression:

```text
               ┌─────────────────────────────┐
               │         AI_ASSESSED         │
               │   (Pending Manager Queue)   │
               └──────────────┬──────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   [ REVIEW Action ]   [ SHORTLIST Action ]  [ REJECT Action ]
         │                    │                    │
         ▼                    ▼                    ▼
   UNDER_REVIEW          SHORTLISTED            REJECTED
(Under Review Queue)  (Shortlisted Queue)   (Rejected Queue)
```

> **Audit Trail Policy**: Applications are **never deleted** from the database. Status updates mutate the `status` field in-place via database transactions, ensuring complete historical records and reporting accuracy.

---

## 3. Database Schema (`applications` Table)

The database schema (`backend/app/database/models.py`) stores complete applicant details, financial metrics, ML prediction outcomes, and workflow status:

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | Primary key auto-increment ID |
| `application_id` | String(36) | Unique public identifier (e.g., `LA-C4A1B2D3`) |
| `applicant_name` | String | Full name of loan applicant |
| `email` | String | Applicant email address |
| `phone` | String | Contact phone number |
| `pan` | String | Permanent Account Number (e.g., `ABCDE1234F`) |
| `dependents` | String | Number of dependents (`"0"`, `"1"`, `"2"`, `"3+"`) |
| `education` | String | Educational status (`"Graduate"`, `"Not Graduate"`) |
| `self_employed` | String | Self-employment status (`"Yes"`, `"No"`) |
| `applicant_income` | Float | Primary monthly income (in ₹) |
| `coapplicant_income` | Float | Secondary monthly income (in ₹) |
| `loan_amount` | Float | Requested loan principal (in ₹ Thousands) |
| `loan_amount_term` | Float | Loan term duration (in Days/Months) |
| `credit_history` | Float | Credit score status (`1.0` = Good, `0.0` = Bad/None) |
| `property_area` | String | Property location (`"Urban"`, `"Semiurban"`, `"Rural"`) |
| `prediction` | String | Model binary outcome (`"approved"` / `"rejected"`) |
| `approval_probability` | Float | Model confidence score (`0.00` to `1.00`) |
| `recommendation` | String | AI recommendation (`"STRONG CANDIDATE"`, `"MANUAL REVIEW"`, `"HIGHER RISK"`) |
| `risk_level` | String | Risk categorization (`"LOW"`, `"MEDIUM"`, `"HIGH"`) |
| `message` | String | Decision explanation text |
| `status` | String | Current workflow status (`"AI_ASSESSED"`, `"UNDER_REVIEW"`, `"SHORTLISTED"`, `"REJECTED"`) |
| `created_at` | DateTime | Timestamp of creation |
| `updated_at` | DateTime | Timestamp of last modification |

---

## 4. API Endpoints Reference

### 1. Submit Loan Application & Predict
- **HTTP Method**: `POST`
- **Endpoint**: `/api/v1/loan/predict`
- **Request Body**:
```json
{
  "applicant_name": "Rahul Sharma",
  "email": "rahul@example.com",
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
```
- **Response** (`200 OK`):
```json
{
  "application_id": "LA-C4A1B2D3",
  "prediction": "approved",
  "approval_probability": 0.852,
  "recommendation": "STRONG CANDIDATE",
  "risk_level": "LOW",
  "status": "AI_ASSESSED",
  "message": "The application meets strong credit criteria."
}
```

---

### 2. Get Single Application Details
- **HTTP Method**: `GET`
- **Endpoint**: `/api/v1/applications/{application_id}`
- **Response** (`200 OK`): Returns complete application object including profile, financial, identity, and AI assessment attributes.

---

### 3. List Manager Applications (Filtered)
- **HTTP Method**: `GET`
- **Endpoint**: `/api/v1/manager/applications`
- **Query Parameters**:
  - `status` (*optional*): Filter by status (`"AI_ASSESSED"`, `"UNDER_REVIEW"`, `"SHORTLISTED"`, `"REJECTED"`, or empty for All)
  - `sort` (*optional*): Sort field (e.g. `approval_probability`)
  - `order` (*optional*): Sort direction (`asc` or `desc`)
- **Response** (`200 OK`):
```json
{
  "applications": [ ... ]
}
```

---

### 4. Manager Bulk Status Action
- **HTTP Method**: `POST`
- **Endpoint**: `/api/v1/manager/applications/bulk-action`
- **Request Body**:
```json
{
  "application_ids": ["LA-C4A1B2D3"],
  "action": "SHORTLIST"
}
```
- **Actions Allowed**: `"REVIEW"`, `"SHORTLIST"`, `"REJECT"`

---

### 5. Service Health Check
- **HTTP Method**: `GET`
- **Endpoint**: `/api/v1/health`
- **Response**: `{"status": "ok", "service": "automatic-bank-loan-approval"}`

---

## 5. Directory Structure

```text
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── health.py        # Health check route
│   │   │   ├── loan.py          # Prediction & application routes
│   │   │   └── manager.py       # Manager dashboard & bulk action routes
│   │   └── api.py               # Router aggregation
│   ├── core/
│   │   ├── config.py            # Global settings & CORS configuration
│   │   └── logging.py           # Structured logging setup
│   ├── database/
│   │   ├── db.py                # SQLAlchemy engine & session maker
│   │   └── models.py            # SQLite Application table model
│   ├── schemas/
│   │   └── application.py       # Pydantic request & response DTO schemas
│   ├── services/
│   │   └── prediction.py        # ML pipeline integration service wrapper
│   └── main.py                  # FastAPI application instantiation
├── venv/                        # Python virtual environment
└── README.md                    # Subsystem documentation
```

---

## 6. How to Setup & Run

### 1. Activate Environment & Install Dependencies
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Uvicorn Server
```bash
uvicorn app.main:app --port 8000 --reload
```
API Documentation will be available at `http://localhost:8000/docs` (Swagger UI).

### 3. Run Automated Tests
```bash
./venv/bin/pytest
```
