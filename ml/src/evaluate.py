import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def evaluate_model(model, X_test, y_test, model_name: str = "Model") -> dict:
    """
    Evaluates a trained model pipeline on test data and returns metrics.
    """
    y_pred = model.predict(X_test)
    
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X_test)[:, 1]
    else:
        y_proba = y_pred

    metrics = {
        "Model": model_name,
        "Accuracy": round(accuracy_score(y_test, y_pred), 4),
        "Precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
        "Recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
        "F1 Score": round(f1_score(y_test, y_pred, zero_division=0), 4),
        "ROC-AUC": round(roc_auc_score(y_test, y_proba), 4)
    }

    return metrics

def print_evaluation_summary(metrics_list: list) -> pd.DataFrame:
    """
    Prints a comparison table for evaluated models.
    """
    df = pd.DataFrame(metrics_list)
    print("\n" + "=" * 60)
    print("               MODEL EVALUATION COMPARISON")
    print("=" * 60)
    print(df.to_string(index=False))
    print("=" * 60 + "\n")
    return df
