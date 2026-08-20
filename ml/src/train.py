import os
import sys

src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.append(src_dir)

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from preprocess import build_preprocessor, NUMERICAL_FEATURES, CATEGORICAL_FEATURES
from evaluate import evaluate_model, print_evaluation_summary


DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "Loan_Data.csv")
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "loan_model.pkl")

def train_and_save_model():
    print(f"Loading dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)

    # Validate required columns
    feature_cols = NUMERICAL_FEATURES + CATEGORICAL_FEATURES
    target_col = "Loan_Status"

    for col in feature_cols + [target_col]:
        if col not in df.columns:
            raise ValueError(f"Required column '{col}' not found in dataset.")

    # Target Mapping: Y -> 1, N -> 0
    X = df[feature_cols].copy()
    
    # Cast Credit_History to string category representation to preserve NaN handling
    X["Credit_History"] = X["Credit_History"].apply(
        lambda x: str(int(x)) if pd.notnull(x) and str(x).strip() != "" else None
    )

    y = df[target_col].map({"Y": 1, "N": 0})

    # Train / Test Split (Stratified to maintain 68.7% / 31.3% target ratio)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42
    )

    print(f"Dataset split complete: Train size = {len(X_train)}, Test size = {len(X_test)}")

    # Models to train & compare
    candidate_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    }

    metrics_results = []
    trained_pipelines = {}

    for name, clf in candidate_models.items():
        # Create pipeline with preprocessor + classifier
        preprocessor = build_preprocessor()
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", clf)
        ])

        # Fit model on training data ONLY
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        # Evaluate on test set
        metrics = evaluate_model(pipeline, X_test, y_test, model_name=name)
        metrics_results.append(metrics)

    # Print comparison table
    summary_df = print_evaluation_summary(metrics_results)

    # Model Selection Strategy:
    # We select Logistic Regression / Random Forest based on highest ROC-AUC and high Recall.
    # Sort candidates primarily by ROC-AUC, then by F1 Score.
    best_model_name = summary_df.sort_values(by=["ROC-AUC", "F1 Score", "Recall"], ascending=False).iloc[0]["Model"]
    print(f"SELECTED MODEL: {best_model_name}")

    best_pipeline = trained_pipelines[best_model_name]

    # Ensure model directory exists
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Save COMPLETE pipeline artifact (Preprocessor + Classifier)
    joblib.dump(best_pipeline, MODEL_PATH)
    print(f"Saved trained pipeline artifact to: {MODEL_PATH}")

    # Verify model artifact loading and sample prediction
    loaded_pipeline = joblib.load(MODEL_PATH)
    sample_df = X_test.iloc[:1]
    pred = loaded_pipeline.predict(sample_df)[0]
    proba = loaded_pipeline.predict_proba(sample_df)[0, 1]
    print(f"Artifact verification successful: Test Sample Prediction = {pred}, Approval Probability = {proba:.4f}")

if __name__ == "__main__":
    train_and_save_model()
