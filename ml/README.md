# ML Module — Automatic Bank Loan Approval System

This directory contains the machine-learning pipeline for predicting loan approval using supervised classification algorithms.

---

## 1. Directory Structure

```text
ml/
├── data/
│   └── Loan_Data.csv          # Raw labeled dataset (614 rows, 13 columns)
├── notebooks/
│   └── eda_and_train.ipynb    # Jupyter Notebook for EDA & model experimentation
├── src/
│   ├── preprocess.py          # ColumnTransformer & backend feature mapping logic
│   ├── train.py               # Model training, evaluation & artifact serialization
│   ├── evaluate.py            # Evaluation metrics & summary table generator
│   └── predict.py             # Prediction interface utility for backend consumption
├── models/
│   └── loan_model.pkl         # Serialized complete scikit-learn Pipeline (Preprocessing + Model)
├── ML_TASK.md                 # Scope and guidelines for ML task
└── README.md                  # Comprehensive ML documentation
```

---

## 2. ML Feature Contract & Target Mapping

### Target Variable
- **`Loan_Status`**:
  - `Y` (Approved) → `1`
  - `N` (Not Approved) → `0`

### Input Features (9 MVP Features)
1. `ApplicantIncome` (`applicant_income`) — Numerical
2. `CoapplicantIncome` (`coapplicant_income`) — Numerical
3. `LoanAmount` (`loan_amount`) — Numerical
4. `Loan_Amount_Term` (`loan_amount_term`) — Numerical
5. `Credit_History` (`credit_history`) — Categorical/Discrete (`"0"`, `"1"`)
6. `Dependents` (`dependents`) — Categorical (`"0"`, `"1"`, `"2"`, `"3+"`)
7. `Education` (`education`) — Categorical (`"Graduate"`, `"Not Graduate"`)
8. `Self_Employed` (`self_employed`) — Categorical (`"Yes"`, `"No"`)
9. `Property_Area` (`property_area`) — Categorical (`"Urban"`, `"Semiurban"`, `"Rural"`)

> **Excluded Fields:** `Loan_ID` (Identifier), `Gender`, `Married`, and personal identifiers (`Name`, `Email`, `Phone`, `PAN`).

---

## 3. Preprocessing & Data Leakage Prevention

- **Numerical Pipeline:** `SimpleImputer(strategy='median')` → `StandardScaler()`
- **Categorical Pipeline:** `SimpleImputer(strategy='most_frequent')` → `OneHotEncoder(handle_unknown='ignore', sparse_output=False)`
- Combined into a single `ColumnTransformer`.
- **Preventing Data Leakage:** Preprocessing statistics (mean, std, median, one-hot categories) are learned **strictly from the training set** after a stratified 80/20 train/test split.

---

## 4. Supervised Model Benchmark Results

All models were evaluated on the test set (123 samples) with `random_state=42`:

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | **0.8618** | **0.8400** | **0.9882** | **0.9081** | **0.8474** |
| **Random Forest** | 0.8455 | 0.8235 | 0.9882 | 0.8984 | 0.8121 |
| **Decision Tree** | 0.8211 | 0.8247 | 0.9412 | 0.8791 | 0.7259 |

### Selection Rationale
**Logistic Regression** was selected as the final production model because:
1. It achieved the highest **ROC-AUC (0.8474)** and **Accuracy (86.18%)**.
2. It achieved an outstanding **Recall of 98.82%**, minimizing false rejections of eligible applicants.
3. It provides well-calibrated class probabilities (`predict_proba`) suitable for decision-support thresholding.
4. It is lightweight, fast, interpretable, and immune to overfitting on small datasets.

---

## 5. Artifact Serialization

The complete pipeline (Preprocessing + Selected Logistic Regression classifier) is serialized as **a single joblib artifact**:

```text
/ml/models/loan_model.pkl
```

---

## 6. How Backend Consumes the Model

The backend prediction service can import `predict_loan` from `ml.src.predict`:

```python
from ml.src.predict import predict_loan

# Payload matching FastAPI request schema
input_payload = {
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

result = predict_loan(input_payload)
# Result schema:
# {
#     "prediction": "approved",
#     "approval_probability": 0.7198
# }
```

---

## 7. How to Re-train the Model

To execute the training pipeline and update the saved artifact:

```bash
python ml/src/train.py
```
