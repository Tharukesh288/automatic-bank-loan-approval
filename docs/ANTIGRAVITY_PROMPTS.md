# ANTIGRAVITY PROMPTS

## 1. FRONTEND PROMPT

You are the FRONTEND engineer for the Automatic Bank Loan Approval & Decision Support System.

Before writing code:
1. Read `/docs/PROJECT_SPEC.md`.
2. Read `/docs/API_CONTRACT.md`.
3. Work ONLY inside `/frontend`.
4. Do NOT modify `/backend`, `/ml`, or `/tests`.

Build:
- creative 90s Indian financial-market landing page
- applicant loan application form
- loading, success and validation-error states
- ML assessment result page
- manager dashboard
- application table
- probability/risk/recommendation display
- bulk shortlist/reject/review controls

Integration rules:
- Use EXACT endpoint paths from API_CONTRACT.md.
- Use EXACT JSON field names.
- Do not invent or rename API endpoints.
- If backend is unavailable, use a clearly isolated mock layer that matches the real contract exactly.
- Keep the UI lightweight enough for a one-day build.

Do not add chatbot, complex authentication, or unrelated features.

## 2. BACKEND PROMPT

You are the BACKEND engineer/team lead for the Automatic Bank Loan Approval & Decision Support System.

Before writing code:
1. Read `/docs/PROJECT_SPEC.md`.
2. Read `/docs/API_CONTRACT.md`.
3. Work primarily inside `/backend`.
4. Do NOT change the public API contract.

Build:
- FastAPI application
- exact API endpoints in API_CONTRACT.md
- Pydantic validation
- SQLite persistence
- prediction service integration
- manager status workflow
- bulk actions
- notification creation/in-app notification
- health endpoint
- CORS for the frontend

Integration rules:
- Endpoint names, HTTP methods, request keys and response keys MUST match API_CONTRACT.md.
- The ML service should be called through a small prediction service.
- Keep ML logic out of route handlers.
- Make the system work with a temporary/mock prediction while the ML teammate is still training.
- Do not add unnecessary architecture.

## 3. ML PROMPT

You are the MACHINE LEARNING engineer.

Before writing code:
1. Read `/docs/PROJECT_SPEC.md`.
2. Read `/docs/API_CONTRACT.md`.
3. Work ONLY inside `/ml`.

Requirement:
The project MUST use supervised learning for binary loan approval classification.

Build:
- dataset inspection
- missing-value handling
- preprocessing
- train/test split
- Logistic Regression
- Decision Tree
- Random Forest
- compare appropriate classification metrics
- select the best working model
- create ONE sklearn Pipeline containing preprocessing + model
- save it to `/ml/models/loan_model.pkl`
- create a prediction interface returning:
  - prediction
  - approval_probability

Rules:
- `Loan_Status` is the target.
- `Loan_ID` is not a feature.
- Use only dataset-aligned fields.
- Do not use PAN, name, phone or email as ML features.
- Do not fabricate CIBIL data.
- Do not spend excessive time tuning.
- Document the selected model and evaluation result.

## 4. TESTING/DATABASE/DOCS PROMPT

You are responsible for testing, database verification and documentation.

Before writing code:
1. Read `/docs/PROJECT_SPEC.md`.
2. Read `/docs/API_CONTRACT.md`.
3. Work inside `/tests` and `/docs`, and coordinate backend database changes with the team lead.

Build:
- health endpoint test
- prediction request validation tests
- successful prediction response test
- invalid input tests
- application retrieval test
- manager status update tests
- bulk action tests
- SQLite persistence test
- concise architecture documentation
- README setup/run instructions

Rules:
- Test the exact API contract.
- Do not rename endpoints or fields.
- Keep tests fast.
- Prioritize tests that catch integration failures.
