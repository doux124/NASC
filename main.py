import argparse
import os
import sys
import time

import pandas as pd
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from drift import detect_drift, mitigate_drift
from model import get_importances, train_and_predict

META_COLS = {"CustomerID", "Month", "ChurnStatus"}


def get_feature_cols(df):
    return [c for c in df.columns if c not in META_COLS]


def fill_missing(df, ref_df=None):
    """Fill NAs using training statistics where available."""
    df = df.copy()
    for col in df.columns:
        if col in META_COLS:
            continue
        src = ref_df[col] if (ref_df is not None and col in ref_df.columns) else df[col]
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(src.median())
        else:
            mode = src.mode()
            df[col] = df[col].fillna(mode.iloc[0] if len(mode) > 0 else "missing")
    return df


def _divider(title):
    print(f"\n{'=' * 60}")
    print(title)
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="NAISC 2026 — Drift-Aware Churn Pipeline")
    parser.add_argument("--train_data_filepath", required=True)
    parser.add_argument("--test_data_filepath", required=True)
    args = parser.parse_args()

    # ── Load ──────────────────────────────────────────────────────────────────
    train_df = pd.read_csv(args.train_data_filepath)
    test_df = pd.read_csv(args.test_data_filepath)

    train_df = fill_missing(train_df)
    test_df = fill_missing(test_df, ref_df=train_df)

    feature_cols = get_feature_cols(train_df)

    # ── Step 1: Baseline importances (DDLA proxy) ─────────────────────────────
    print("[1/4] Computing baseline feature importances...")
    importances = get_importances(train_df, "ChurnStatus", feature_cols)

    # ── Step 2 & 3: Detect + Mitigate drift ───────────────────────────────────
    print("[2/4] Detecting drift...")
    t0 = time.time()
    drift_report = detect_drift(
        train_df, test_df, feature_cols, feature_importances=importances
    )

    print("[3/4] Mitigating drift...")
    train_m, test_m, mitigation_log = mitigate_drift(train_df, test_df, drift_report)
    drift_time = round(time.time() - t0, 1)

    # ── Step 4: Final model ───────────────────────────────────────────────────
    print("[4/4] Training final model...")
    feature_cols_final = get_feature_cols(train_m)
    preds, train_auprc, test_auprc = train_and_predict(
        train_m, test_m, "ChurnStatus", feature_cols_final, test_df["CustomerID"]
    )

    # ── Outputs ───────────────────────────────────────────────────────────────
    _divider("DATA DRIFT DETECTION AND MITIGATION")
    if len(mitigation_log) > 0:
        print(mitigation_log.to_string(index=False))
    else:
        print("No drift detected.")

    _divider("DRIFT DETECTION AND MITIGATION TIME TAKEN")
    print(pd.DataFrame({"Time Taken (s)": [drift_time]}).to_string(index=False))

    _divider("MODEL PERFORMANCE")
    rows = [("Train Set", round(train_auprc, 3))]
    if test_auprc is not None:
        rows.append(("Test Set", round(test_auprc, 3)))
    print(pd.DataFrame(rows, columns=["", "AU-PRC"]).to_string(index=False))

    preds.to_csv("predictions.csv", index=False)
    _divider("PREDICTIONS (first 3 rows)")
    print(preds.head(3).to_string(index=False))
    print("\nFull predictions saved → predictions.csv")
    print("Model saved          → model.joblib")


if __name__ == "__main__":
    main()
