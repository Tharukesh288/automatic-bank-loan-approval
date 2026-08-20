# Automatic Bank Loan Approval & Decision Support System

## 1. Project Goal

Build a one-day, AI-assisted web application that uses **supervised machine learning** to assess loan applications and provide a decision-support recommendation to a loan manager.

**Core principle: ML recommends; the human manager decides.**

The system has two roles:

- Applicant
- Loan Manager

---

## 2. MVP

1. Creative 90s Indian financial-market inspired landing page.
2. Applicant portal.
3. Loan application form.
4. PAN format validation only unless an authorized verification service is available.
5. Supervised binary classification model.
6. Approval probability.
7. AI recommendation and risk level.
8. Manager dashboard.
9. Application sorting/filtering.
10. Individual and bulk shortlist/review/reject actions.
11. SQLite persistence.
12. In-app notification.
13. Automated tests and GitHub CI.
14. Deployment only after local end-to-end integration is stable.

---

## 3. Explicitly Out of Scope

Do NOT spend the one-day build on:

- CIBIL scraping.
- Fake CIBIL APIs.
- Unauthorized government-service scraping.
- Microservices.
- Kubernetes.
- Deep learning.
- Complex authentication.
- Large external integrations.
- LLM chatbot.
- Features unrelated to the core loan workflow.

---

# 4. Dataset

TNS did not provide a dataset.

The project will use the public **Loan Prediction / Eligibility Prediction for Loan** dataset containing historical loan applications with a labeled `Loan_Status` target.

Expected columns:

```text
Loan_ID
Gender
Married
Dependents
Education
Self_Employed
ApplicantIncome
CoapplicantIncome
LoanAmount
Loan_Amount_Term
Credit_History
Property_Area
Loan_Status
```

### Target

```text
Loan_Status
```

Mapping:

```text
Y → APPROVED
N → NOT APPROVED
```

This makes the ML problem a **supervised binary classification task**.

---

# 5. Final ML Feature Contract

The first MVP model MUST use these 9 features:

```text
Dependents
Education
Self_Employed
ApplicantIncome
CoapplicantIncome
LoanAmount
Loan_Amount_Term
Credit_History
Property_Area
```

### NOT ML features

These must NOT be used as model inputs:

```text
Loan_ID
Applicant Name
Email
Phone
PAN
```

`Loan_ID` is an identifier.

Name, email, phone and PAN are application/identity metadata.

`Gender` and `Married` exist in the source dataset but are excluded from the first MVP model. They may be stored as application data if desired, but they are not part of the ML input contract.

---

# 6. ML Architecture

```text
Historical labeled applications
            ↓
        Data cleaning
            ↓
     Missing-value handling
            ↓
      Feature preprocessing
            ↓
       Train/Test Split
            ↓
    ┌───────┼────────┐
    ↓       ↓        ↓
Logistic  Decision  Random
Regression  Tree    Forest
    └───────┼────────┘
            ↓
      Model evaluation
            ↓
       Best model
            ↓
 ONE sklearn Pipeline
            ↓
   loan_model.pkl
```

The final saved pipeline must contain preprocessing + model.

Output:

```text
prediction
approval_probability
```

---

# 7. Decision Support

The ML model does NOT make the final bank decision.

Recommended demo bands:

```text
>= 0.75
Strong Candidate

0.50 – 0.74
Manual Review

< 0.50
Higher Risk
```

These are demonstration decision-support bands, NOT real banking underwriting rules.

---

# 8. Application Flow

```text
Landing
   ↓
Applicant
   ↓
Application Form
   ↓
Validation
   ↓
PAN Format Check
   ↓
FastAPI
   ↓
Supervised ML
   ↓
Prediction + Probability
   ↓
Store Application
   ↓
Manager Dashboard
   ↓
Shortlist / Review / Reject
   ↓
Status + Notification
```

---

# 9. Manager Workflow

Manager can:

- View applications.
- Search applicants.
- Sort by approval probability.
- Filter by recommendation/risk/status.
- View application details.
- Shortlist applicants.
- Send applications for manual review.
- Reject applicants.
- Perform bulk actions.
- View updated status.

The manager remains the final decision-maker.

---

# 10. Status Lifecycle

```text
PENDING
   ↓
AI_ASSESSED
   ↓
UNDER_REVIEW
   ↓
SHORTLISTED
   OR
REJECTED
```

---

# 11. Application Metadata vs ML Data

### Application metadata

```text
applicant_name
email
phone
pan
```

### ML input

```text
dependents
education
self_employed
applicant_income
coapplicant_income
loan_amount
loan_amount_term
credit_history
property_area
```

This separation is mandatory for the MVP.

---

# 12. One-Day Execution

## Wednesday Night

Complete:

- Project specification.
- Dataset decision.
- ML feature contract.
- API contract.
- GitHub structure.
- Individual AI task files.

## Thursday 09:00–09:15

Team checks the actual CSV and confirms the expected columns.

Then the API contract is frozen.

## Thursday 09:15–12:00

Parallel development:

- Frontend
- Backend
- ML
- Testing/Docs

## Thursday 12:00

Hard integration checkpoint.

Minimum working path:

```text
Frontend → Backend → Mock/Real ML → Response
```

## Thursday 12:00–15:00

Replace mock prediction with real ML pipeline.

## Thursday 15:00–17:00

Implement manager workflow.

## Thursday 17:00 onward

Testing, notification, demo data and UI polish.

## Friday

- Bug fixes.
- Deployment.
- README/presentation.
- Demo rehearsal.

No major new features after feature freeze.

---

# 13. AI Development Rule

Every AI agent must read:

```text
/docs/PROJECT_SPEC.md
/docs/API_CONTRACT.md
```

and its own task file.

No AI agent may:

- Rename endpoints.
- Rename API fields.
- Change response schemas.
- Modify another teammate's owned area.
- Invent unsupported ML features.
- Add unrelated architecture.

