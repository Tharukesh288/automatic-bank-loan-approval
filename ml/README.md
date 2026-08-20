# Machine Learning Subsystem — Automatic Bank Loan Approval

This directory contains the machine learning pipeline, dataset preprocessing, model evaluation scripts, and serialized artifacts for the **Automatic Bank Loan Approval & Decision Support System**.

---

## 1. Overview & Technology Stack

The ML subsystem uses **supervised binary classification** to evaluate bank loan applications, predict credit risk, calculate an approval probability score, and output AI-assisted decision recommendations for human loan managers.

### Technology Stack
- **Language**: Python 3.12
- **Core ML Library**: `scikit-learn` (Logistic Regression, Random Forest, Decision Tree, ColumnTransformer, Pipelines)
- **Data Manipulation**: `pandas`, `numpy`
- **Model Serialization**: `joblib`
- **Environment**: Virtual Environment (`venv`) / Jupyter Notebook (`notebooks/eda_and_train.ipynb`)

---

## 2. Supervised Learning & Problem Formulation

### Where Supervised Learning is Used
Supervised machine learning is used to learn a predictive mapping function $f(X) \to Y$ from historical labeled bank loan application data (`ml/data/Loan_Data.csv`).

- **Historical Dataset**: 614 rows of loan application records with known historical outcomes (`Loan_Status`).
- **Target Variable ($Y$)**: `Loan_Status`
  - `Y` (Approved) $\to$ Class `1`
  - `N` (Not Approved) $\to$ Class `0`
- **Input Features ($X$)**: 9 curated applicant profile & financial attributes:
  1. `applicant_income` (`ApplicantIncome`) — Numerical
  2. `coapplicant_income` (`CoapplicantIncome`) — Numerical
  3. `loan_amount` (`LoanAmount`) — Numerical (in ₹ Thousands)
  4. `loan_amount_term` (`Loan_Amount_Term`) — Numerical (in Days/Months)
  5. `credit_history` (`Credit_History`) — Discrete (`"1"` = Good, `"0"` = Bad/None)
  6. `dependents` (`Dependents`) — Categorical (`"0"`, `"1"`, `"2"`, `"3+"`)
  7. `education` (`Education`) — Categorical (`"Graduate"`, `"Not Graduate"`)
  8. `self_employed` (`Self_Employed`) — Categorical (`"Yes"`, `"No"`)
  9. `property_area` (`Property_Area`) — Categorical (`"Urban"`, `"Semiurban"`, `"Rural"`)

> **Fairness & Privacy Guarantee**: Personal identity attributes (`applicant_name`, `email`, `phone`, `pan`) and `Loan_ID` are **excluded** from the ML model input features to eliminate algorithmic bias and ensure data protection compliance.

---

## 3. Preprocessing & Feature Transformation

Raw application data undergoes structured preprocessing using a scikit-learn `ColumnTransformer` to handle missing values and feature scaling without data leakage:

```text
                      ┌──────────────────────┐
                      │ Raw Input Dictionary │
                      └──────────┬───────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
        ┌─────────────────────┐     ┌─────────────────────┐
        │ Numerical Features  │     │Categorical Features │
        └──────────┬──────────┘     └──────────┬──────────┘
                   │                           │
                   ▼                           ▼
        ┌─────────────────────┐     ┌─────────────────────┐
        │ SimpleImputer       │     │ SimpleImputer       │
        │ (strategy='median') │     │(strategy='most_freq')│
        └──────────┬──────────┘     └──────────┬──────────┘
                   │                           │
                   ▼                           ▼
        ┌─────────────────────┐     ┌─────────────────────┐
        │ StandardScaler      │     │ OneHotEncoder       │
        │ (z = (x - μ) / σ)   │     │ (handle_unknown)    │
        └──────────┬──────────┘     └──────────┬──────────┘
                   │                           │
                   └─────────────┬─────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Preprocessed Array X  │
                     └───────────────────────┘
```

### Numerical Scaling ($z$-score normalization)
Standard scaling standardizes numerical values using:
$$z = \frac{x - \mu}{\sigma}$$
Where $\mu$ is the feature mean and $\sigma$ is the standard deviation learned from the training set. This makes numerical features unit-agnostic (functioning identically for raw numeric values regardless of currency units).

---

## 4. How ML Calculates Approval Percentage & Recommendations

The ML pipeline calculates the final approval percentage and decision recommendation in **3 distinct steps**:

```text
 ┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
 │ Model Inference │  ───> │ Approval Percentage  │  ───> │ Decision-Support Band  │
 │ (predict_proba) │       │ P(Approved) * 100%   │       │ Recommendation & Risk  │
 └─────────────────┘       └──────────────────────┘       └────────────────────────┘
```

### Step 1: Probabilistic Prediction (`predict_proba`)
Instead of outputting a rigid binary 0/1 decision, the trained Logistic Regression model calculates the posterior probability of loan approval given feature vector $X$:
$$P(Y = 1 \mid X) = \frac{1}{1 + e^{-(\beta_0 + \mathbf{\beta}^T X)}}$$

### Step 2: Conversion to Approval Percentage
The backend converts the raw probability float score $P(Y=1 \mid X) \in [0.0, 1.0]$ into a human-readable percentage:
$$\text{Approval Percentage} = P(Y = 1 \mid X) \times 100\%$$
*Example*: A probability score of `0.852` $\to$ **`85.2% Approval Probability`**.

### Step 3: Decision-Support Recommendation Thresholding
To assist loan managers without overriding human authority, the approval percentage maps to decision-support recommendation bands:

| Approval Probability ($P$) | Recommendation Text | Risk Level | Description |
| :--- | :--- | :--- | :--- |
| **$\ge 75\%$** (`0.75 - 1.00`) | `STRONG CANDIDATE` | `LOW` | High credit confidence; recommended for quick approval. |
| **$50\% - 74\%$** (`0.50 - 0.74`) | `MANUAL REVIEW` | `MEDIUM` | Moderate confidence; requires human manager verification. |
| **$< 50\%$** (`0.00 - 0.49`) | `HIGHER RISK` | `HIGH` | Elevated credit risk score; detailed scrutiny advised. |

---

## 5. Model Benchmarks & Selection Rationale

Three supervised algorithms were trained and evaluated on a stratified 20% test split (123 test applications) with `random_state=42`:

| Model Algorithm | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | **86.18%** | **84.00%** | **98.82%** | **0.9081** | **0.8474** |
| **Random Forest Classifier** | 84.55% | 82.35% | 98.82% | 0.8984 | 0.8121 |
| **Decision Tree Classifier** | 82.11% | 82.47% | 94.12% | 0.8791 | 0.7259 |

### Why Logistic Regression Was Selected
1. **Highest ROC-AUC (0.8474) & Accuracy (86.18%)**: Superior discrimination capability between eligible and high-risk applicants.
2. **Exceptional Recall (98.82%)**: Minimizes false rejections, ensuring qualified applicants are not incorrectly flagged as high risk.
3. **Calibrated Probabilities**: Provides smooth, continuous probability estimates ideal for percentage calculation.
4. **Interpretability & Resilience**: Avoids overfitting on medium-sized banking tabular datasets.

---

## 6. Directory Layout & Artifacts

```text
ml/
├── data/
│   └── Loan_Data.csv          # Training dataset (614 records)
├── models/
│   └── loan_model.pkl         # Serialized scikit-learn Pipeline (Preprocessor + Classifier)
├── notebooks/
│   └── eda_and_train.ipynb    # Exploratory Data Analysis & experiments
├── src/
│   ├── preprocess.py          # ColumnTransformer & feature mapping dictionary
│   ├── train.py               # Training execution & joblib serialization
│   ├── evaluate.py            # Model evaluation metrics generator
│   └── predict.py             # Backend inference interface helper
├── ML_TASK.md                 # Technical specification
└── README.md                  # Comprehensive subsystem documentation
```

---

## 7. How to Execute & Re-train

### Run Prediction Inference Utility
```bash
python ml/src/predict.py
```

### Re-train and Serialize Production Pipeline
To re-fit the preprocessing transformer and model on updated data:
```bash
python ml/src/train.py
```
This updates the serialized artifact at `ml/models/loan_model.pkl`.
