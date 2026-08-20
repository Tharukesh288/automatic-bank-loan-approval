# Automatic Bank Loan Approval & Decision Support System

An end-to-end AI-assisted web application that uses **supervised machine learning** to evaluate loan applications, assess credit risk, calculate approval probability scores, and support bank loan managers with workflow lifecycle management.

> **Core Principle**: ML recommends; the human loan manager decides.

---

## 1. High-Level System Architecture

```text
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                            REACT FRONTEND                               │
 │                                                                         │
 │  ┌──────────────┐      ┌────────────────┐      ┌─────────────────────┐  │
 │  │ Landing Page │ ───> │ Application    │ ───> │ Manager Dashboard   │  │
 │  │ (90s Theme)  │      │ Form (PAN/₹)   │      │ (Status Queue/Sheet)│  │
 │  └──────────────┘      └────────────────┘      └─────────────────────┘  │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼  REST API (HTTP/JSON)
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                             FASTAPI BACKEND                             │
 │                                                                         │
 │  ┌───────────────────────┐             ┌─────────────────────────────┐  │
 │  │ Pydantic Validation   │ ──────────> │ Application Lifecycle Queue │  │
 │  │ & Route Handlers      │             │ (AI_ASSESSED/REVIEW/etc.)   │  │
 │  └───────────┬───────────┘             └──────────────┬──────────────┘  │
 └──────────────┼────────────────────────────────────────┼─────────────────┘
                │                                        │
                ▼                                        ▼
 ┌─────────────────────────────┐         ┌─────────────────────────────┐
 │       SUPERVISED ML         │         │       SQLITE DATABASE       │
 │   Scikit-Learn Classifier   │         │    Single `applications`    │
 │ (Logistic Reg / Preprocess) │         │       Persistent Table      │
 └─────────────────────────────┘         └─────────────────────────────┘
```

---

## 2. Subsystem Documentation Navigation

This repository is organized into three core modular subsystems. For dedicated technical documentation, architecture details, and subsystem-specific setups, see:

- [🤖 **Machine Learning Subsystem (`/ml`)**](./ml/README.md): Detailed explanation of supervised learning, feature contracts, standard scaling, probabilistic calculations ($P(\text{Approved}) \times 100\%$), decision bands, and model training scripts.
- [⚙️ **FastAPI Backend Subsystem (`/backend`)**](./backend/README.md): Complete REST API documentation, Pydantic schemas, database model specifications, manager lifecycle queue handling, and backend testing suite.
- [💻 **React Frontend Subsystem (`/frontend`)**](./frontend/README.md): UI design system, page components, PAN validation, status filter tabs, Application Details document sheet modal, and Vite build configuration.

---

## 3. Technology Stack Summary

- **Frontend**: React 18, Vite 8, React Router DOM v6, Vanilla CSS Design System, HTML5, Fetch API.
- **Backend**: FastAPI, Python 3.12, SQLAlchemy, Pydantic v2, SQLite, Uvicorn, pytest.
- **Machine Learning**: `scikit-learn` (Logistic Regression Classifier, `ColumnTransformer`, `StandardScaler`), `pandas`, `numpy`, `joblib`.

---

## 4. Key Features

1. **Supervised Credit Risk Assessment**: Machine learning model predicts approval probability score ($0-100\%$) and categorizes risk (`LOW`, `MEDIUM`, `HIGH`).
2. **PAN Format Validation**: Enforces Indian Permanent Account Number structure (`ABCDE1234F`).
3. **Indian Rupee (₹) Currency Standard**: Currency inputs and document detail sheets render formatted Rupee values (`en-IN`).
4. **Manager Dashboard Lifecycle**: Status filter tabs (`Pending`, `Under Review`, `Shortlisted`, `Rejected`, `All`) for managing application queues without deleting historical records.
5. **Application Details Document Sheet**: Detailed white modal sheet presenting full applicant identity, demographic profile, financial metrics, and AI credit assessment note.
6. **Bulk Manager Actions**: Execute single or bulk `Review`, `Shortlist`, or `Reject` actions with status badge indicators.

---

## 5. Quick Start Guide

### 1. Start FastAPI Backend (Port 8000)
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --port 8000 --reload
```

### 2. Start Frontend Dev Server (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
./backend/venv/bin/pytest
```