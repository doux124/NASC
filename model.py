import joblib
import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.metrics import average_precision_score

PARAMS = {
    "verbosity": -1,
    "objective": "binary",
    "is_unbalance": True,
    "random_state": 42,
    "importance_type": "gain",
}


def _align_categoricals(X_train, X_test=None):
    """Cast object columns to category; align test categories to train."""
    cat_cols = X_train.select_dtypes(include=["object", "category"]).columns
    for col in cat_cols:
        X_train[col] = X_train[col].astype("category")
        if X_test is not None:
            X_test[col] = pd.Categorical(
                X_test[col], categories=X_train[col].cat.categories
            )
    return X_train, X_test


def get_importances(train_df, target_col, feature_cols):
    """Fit a baseline LightGBM and return per-feature gain importances."""
    cols = [c for c in feature_cols if c in train_df.columns]
    X, y = train_df[cols].copy(), train_df[target_col]
    X, _ = _align_categoricals(X)
    m = lgb.LGBMClassifier(**PARAMS)
    m.fit(X, y)
    return dict(zip(cols, m.feature_importances_))


def train_and_predict(train_df, test_df, target_col, feature_cols, test_ids):
    """
    Train final LightGBM on mitigated data, save model, return predictions
    and AU-PRC scores.
    """
    cols = [
        c for c in feature_cols
        if c in train_df.columns and c in test_df.columns
    ]
    X_tr, X_te = train_df[cols].copy(), test_df[cols].copy()
    y_tr = train_df[target_col]

    X_tr, X_te = _align_categoricals(X_tr, X_te)

    m = lgb.LGBMClassifier(**PARAMS)
    m.fit(X_tr, y_tr)
    joblib.dump(m, "model.joblib")

    tr_proba = m.predict_proba(X_tr)[:, 1]
    te_proba = m.predict_proba(X_te)[:, 1]
    train_auprc = average_precision_score(y_tr, tr_proba)

    test_auprc = None
    if target_col in test_df.columns:
        test_auprc = average_precision_score(test_df[target_col], te_proba)

    preds = pd.DataFrame({
        "CustomerID": test_ids.values,
        "probability_score": te_proba,
    })
    return preds, train_auprc, test_auprc
