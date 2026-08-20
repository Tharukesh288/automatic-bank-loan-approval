# API CONTRACT — v1.0

## STATUS: FROZEN AFTER THURSDAY 09:15

This is the single source of truth for:

```text
Frontend ↔ Backend ↔ ML
```

Do NOT rename endpoints, HTTP methods, request keys, or response keys without team-lead approval.

---

# Base URL

Development:

```text
http://localhost:8000
```

API prefix:

```text
/api/v1
```

---

# 1. Health

## GET

```text
/api/v1/health
```

Response:

```json
{
  "status": "ok"
}
```

---

# 2. Loan Prediction

## POST

```text
/api/v1/loan/predict
```

This endpoint accepts application metadata + ML input fields, runs the supervised model, stores the application, and returns the assessment.

## Request

```json
{
  "applicant_name": "Demo Applicant",
  "email": "demo@example.com",
  "phone": "9999999999",
  "pan": "ABCDE1234F",

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
```

## Application metadata

```text
applicant_name
email
phone
pan
```

These are NOT ML features.

## ML input fields

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

These MUST match the ML feature contract.

## Response

```json
{
  "application_id": "LA-0001",
  "prediction": "approved",
  "approval_probability": 0.87,
  "recommendation": "strong_candidate",
  "risk_level": "low",
  "status": "AI_ASSESSED",
  "message": "The application is a strong candidate for manager review."
}
```

Do NOT call `approval_probability` "confidence".

---

# 3. Get Application

## GET

```text
/api/v1/applications/{application_id}
```

Response:

```json
{
  "application_id": "LA-0001",
  "applicant_name": "Demo Applicant",
  "approval_probability": 0.87,
  "recommendation": "strong_candidate",
  "risk_level": "low",
  "status": "AI_ASSESSED"
}
```

---

# 4. Manager Application List

## GET

```text
/api/v1/manager/applications
```

Optional query parameters:

```text
status
sort=approval_probability
order=desc
```

Response:

```json
{
  "applications": [
    {
      "application_id": "LA-0001",
      "applicant_name": "Demo Applicant",
      "approval_probability": 0.87,
      "recommendation": "strong_candidate",
      "risk_level": "low",
      "status": "AI_ASSESSED"
    }
  ]
}
```

---

# 5. Manager Status Update

## PATCH

```text
/api/v1/manager/applications/{application_id}/status
```

Request:

```json
{
  "status": "SHORTLISTED"
}
```

Allowed values:

```text
UNDER_REVIEW
SHORTLISTED
REJECTED
```

Response:

```json
{
  "application_id": "LA-0001",
  "status": "SHORTLISTED",
  "notification_created": true
}
```

---

# 6. Manager Bulk Action

## POST

```text
/api/v1/manager/applications/bulk-action
```

Request:

```json
{
  "application_ids": [
    "LA-0001",
    "LA-0002"
  ],
  "action": "SHORTLIST"
}
```

Allowed actions:

```text
SHORTLIST
REJECT
REVIEW
```

Response:

```json
{
  "updated": 2,
  "status": "SHORTLISTED"
}
```

---

# 7. Error Format

Validation/application errors:

```json
{
  "detail": "Human-readable error message"
}
```

HTTP conventions:

```text
200 Success
400 Invalid request/business rule
404 Application not found
422 Validation error
500 Unexpected server error
```

---

# 8. Integration Rules

Frontend MUST use these exact paths.

Backend MUST expose these exact paths.

ML integration MUST return:

```text
prediction
approval_probability
```

No teammate may silently rename:

```text
loan_amount
```

to:

```text
loanAmount
```

or:

```text
approval_probability
```

to:

```text
confidence
```

The API contract is the integration law.
