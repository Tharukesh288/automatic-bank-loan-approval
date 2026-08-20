# TEAM TASKS — THURSDAY

## Team Lead — Backend + Integration
Own:
- `/backend`
- API contract implementation
- SQLite integration
- ML pipeline integration
- decision/status workflow
- final integration
- deployment
- final debugging

Do not spend the day building optional UI features.

## Member 2 — Frontend
Own:
- `/frontend`

Build:
- landing page
- applicant form
- loading/error states
- result page
- manager dashboard
- applicant table
- bulk selection/actions
- status display

Rules:
- Read `PROJECT_SPEC.md` and `API_CONTRACT.md` first.
- Use exact endpoint names and JSON keys.
- Do not modify backend or ML.

## Member 3 — ML
Own:
- `/ml`

Build:
- dataset loading/inspection
- preprocessing
- train/test split
- Logistic Regression, Decision Tree, Random Forest candidates
- evaluation
- best model selection
- saved sklearn pipeline
- prediction interface

Rules:
- The task MUST use supervised learning.
- Do not spend excessive time on model tuning.
- Deliver the saved pipeline early.
- Do not change API field names.

## Member 4 — Testing + Database + Documentation
Own:
- `/tests`
- `/docs`
- database-related implementation under backend, coordinated with team lead

Build:
- API tests
- validation tests
- prediction tests
- status workflow tests
- SQLite verification
- architecture diagram
- README updates

## Shared rules
- Nobody works directly on `main`.
- Each person works on a feature branch.
- Pull requests are required.
- CI must pass before merge.
- Do not rewrite another member's area without agreement.
- Commit small, meaningful changes.
- At 12 PM Thursday, stop feature work for integration.
