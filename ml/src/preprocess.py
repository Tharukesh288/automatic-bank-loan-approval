import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Feature mapping from backend API field names to training dataset column names
FEATURE_MAPPING = {
    "applicant_income": "ApplicantIncome",
    "coapplicant_income": "CoapplicantIncome",
    "loan_amount": "LoanAmount",
    "loan_amount_term": "Loan_Amount_Term",
    "credit_history": "Credit_History",
    "dependents": "Dependents",
    "education": "Education",
    "self_employed": "Self_Employed",
    "property_area": "Property_Area"
}

NUMERICAL_FEATURES = [
    "ApplicantIncome",
    "CoapplicantIncome",
    "LoanAmount",
    "Loan_Amount_Term"
]

CATEGORICAL_FEATURES = [
    "Dependents",
    "Education",
    "Self_Employed",
    "Credit_History",
    "Property_Area"
]

def build_preprocessor() -> ColumnTransformer:
    """
    Builds a reproducible scikit-learn ColumnTransformer for loan application data.
    Numerical features: Median imputation + Standard scaling.
    Categorical features: Most-frequent imputation + One-Hot encoding.
    """
    num_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    cat_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_transformer, NUMERICAL_FEATURES),
            ("cat", cat_transformer, CATEGORICAL_FEATURES)
        ]
    )

    return preprocessor

def prepare_input_dataframe(input_dict: dict) -> pd.DataFrame:
    """
    Converts backend input payload into a Pandas DataFrame matching training dataset columns.
    """
    mapped_data = {}
    for api_key, dataset_col in FEATURE_MAPPING.items():
        val = input_dict.get(api_key, input_dict.get(dataset_col))
        
        # Ensure proper data types
        if dataset_col in NUMERICAL_FEATURES:
            val = float(val) if val is not None and str(val).strip() != "" else None
        elif dataset_col == "Credit_History":
            val = str(int(float(val))) if val is not None and str(val).strip() != "" else None
        else:
            val = str(val) if val is not None else None
            
        mapped_data[dataset_col] = [val]

    return pd.DataFrame(mapped_data)
