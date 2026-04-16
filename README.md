# NAISC 2026 — Singtel Drift-Aware Churn Pipeline

Binary churn classification with automated data drift detection and mitigation.  
Uses a **DDLA-inspired approach**: feature importance ranks are used as a proxy to distinguish harmful drift (mitigate) from benign drift (ignore), keeping only signal-preserving transformations under fixed LightGBM hyperparameters.

---

## Setup

```bash
pip install -r requirements.txt
```

Requires **Python 3.12**, CPU only.

---

## Run

```bash
python ./src/main.py \
  --train_data_filepath <path/to/train.csv> \
  --test_data_filepath  <path/to/test.csv>
```

---

## Outputs

| File | Description |
|---|---|
| `predictions.csv` | `CustomerID`, `probability_score` for test set |
| `model.joblib` | Trained LightGBM model |
| stdout | Drift report, time taken, AU-PRC scores |

---

## Approach

1. **Baseline model** — fit LightGBM on training data to get gain-based feature importances  
2. **Detect** — K-S test + PSI for numeric features; Chi-squared + new-category check for categoricals  
3. **Classify** — drifted features below median importance → benign (drop); above → harmful (mitigate)  
4. **Mitigate** — IQR-based quantile scaling for numeric drift; mode imputation for new categorical values; drop for extreme or low-importance drift  
5. **Train** — retrain LightGBM on mitigated data with fixed hyperparameters  

---

## Repo Structure

```
src/
  main.py       # entry point
  drift.py      # detection + mitigation
  model.py      # LightGBM wrapper
requirements.txt
README.md
```
