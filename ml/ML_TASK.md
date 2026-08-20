# ML TASK — Automatic Bank Loan Approval

## Scope Lock

You are the MACHINE LEARNING engineer.

Work ONLY inside:

```text
/ml
```

### DO NOT MODIFY

```text
/frontend
/backend
/tests
/docs
.github
README.md
```

Do not modify API routes, frontend code, database code, CI, or deployment.

Before coding, read:

```text
/docs/PROJECT_SPEC.md
/docs/API_CONTRACT.md
```

---

# Mandatory Requirement

The project MUST use:

# SUPERVISED LEARNING

Problem type:

```text
Binary Classification
```

Target:

```text
Loan_Status
```

Mapping:

```text
Y → approved
N → not approved
```

---

# Final ML Features

Use EXACTLY these initial MVP features:

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

Do NOT use:

```text
Loan_ID
Applicant Name
Email
Phone
PAN
```

`Gender` and `Married` are excluded from the first MVP model.

---

# Training Pipeline

```text
CSV
 ↓
Inspect
 ↓
Clean
 ↓
Handle missing values
 ↓
Preprocess categorical/numerical data
 ↓
Train/Test Split
 ↓
Logistic Regression
Decision Tree
Random Forest
 ↓
Compare metrics
 ↓
Select best working model
 ↓
ONE sklearn Pipeline
 ↓
loan_model.pkl
```

Save:

```text
/ml/models/loan_model.pkl
```

The saved pipeline must contain preprocessing + classifier.

---

# Evaluation

Compare suitable metrics:

```text
Accuracy
Precision
Recall
F1
ROC-AUC if practical
```

Do not spend excessive time tuning.

---

# Prediction Interface

Return exactly:

```json
{
  "prediction": "approved",
  "approval_probability": 0.87
}
```

The backend will handle:

```text
recommendation
risk_level
manager status
```

Do not implement backend endpoints.

---

# Important

Do not use:

```text
PAN
Name
Email
Phone
```

as model features.

Do not fabricate CIBIL information.

Do not create an unsupervised model.

Do not train inside a request.

---

# Definition of Done

- Dataset loads.
- Missing values handled.
- Supervised classifiers trained.
- Models evaluated.
- Best model selected.
- Complete sklearn pipeline saved.
- `loan_model.pkl` exists.
- Prediction returns exact required fields.
- Only `/ml` was modified.
