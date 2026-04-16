import numpy as np
import pandas as pd
from scipy.stats import ks_2samp, chi2_contingency

PSI_MILD = 0.1
PSI_SEVERE = 0.25


def _psi(expected, actual, buckets=10):
    bp = np.unique(np.nanpercentile(expected, np.linspace(0, 100, buckets + 1)))
    if len(bp) < 2:
        return 0.0
    exp_c = np.histogram(expected, bins=bp)[0].astype(float) + 1e-4
    act_c = np.histogram(actual, bins=bp)[0].astype(float) + 1e-4
    exp_p, act_p = exp_c / exp_c.sum(), act_c / act_c.sum()
    return float(np.sum((act_p - exp_p) * np.log(act_p / exp_p)))


def detect_drift(train_df, test_df, feature_cols, feature_importances=None):
    """
    Detect per-feature drift. Returns DataFrame of drifted features.
    Uses feature importances as a DDLA proxy: only high-importance drifted
    features are flagged as 'harmful' (requiring mitigation).
    """
    imp_threshold = (
        np.percentile(list(feature_importances.values()), 50)
        if feature_importances else None
    )

    records = []
    for col in feature_cols:
        if col not in test_df.columns:
            continue
        tr = train_df[col].dropna()
        te = test_df[col].dropna()
        if len(tr) == 0 or len(te) == 0:
            continue

        is_num = pd.api.types.is_float_dtype(tr) or (
            pd.api.types.is_integer_dtype(tr) and tr.nunique() > 15
        )

        if is_num:
            _, pval = ks_2samp(tr.values, te.values)
            psi = _psi(tr.values, te.values)
            if pval >= 0.05 or psi < PSI_MILD:
                continue
            if psi >= PSI_SEVERE:
                desc = f"Feature ranges explode in test set (PSI={psi:.3f})"
            elif te.mean() > tr.mean():
                desc = f"Feature demonstrates greater right-skewness in test set compared to training set (PSI={psi:.3f})"
            else:
                desc = f"Feature demonstrates greater left-skewness in test set compared to training set (PSI={psi:.3f})"
            score, col_type, has_new_cats = psi, "Float" if pd.api.types.is_float_dtype(tr) else "Int", False

        else:
            tr_cats, te_cats = set(tr.unique()), set(te.unique())
            new_cats = te_cats - tr_cats
            if new_cats:
                desc = "Feature has new set of categorical features in test set compared to training set"
                score = len(new_cats) / max(len(tr_cats), 1)
                col_type, has_new_cats = "Object", True
            else:
                all_cats = list(tr_cats | te_cats)
                contingency = np.array([
                    tr.value_counts().reindex(all_cats, fill_value=0).values,
                    te.value_counts().reindex(all_cats, fill_value=0).values,
                ]).astype(float)
                try:
                    _, pval, _, _ = chi2_contingency(contingency)
                except Exception:
                    continue
                if pval >= 0.05:
                    continue
                desc = f"Feature distribution shift detected in test set (chi2 p={pval:.4f})"
                score, col_type, has_new_cats = 1 - pval, "Object", False

        is_important = (
            feature_importances.get(col, 0) >= imp_threshold
            if imp_threshold is not None else True
        )

        records.append({
            "col": col,
            "col_type": col_type,
            "drift_description": desc,
            "drift_score": score,
            "is_important": is_important,
            "is_num": is_num,
            "has_new_cats": has_new_cats,
        })

    return pd.DataFrame(records)


def mitigate_drift(train_df, test_df, drift_report):
    """
    Apply targeted mitigation only to harmful (high-importance) drifted features.
    Returns mitigated train_df, test_df, and human-readable mitigation log.
    """
    tr, te = train_df.copy(), test_df.copy()
    log, drops = [], []

    for _, row in drift_report.iterrows():
        col = row["col"]

        if not row["is_important"]:
            drops.append(col)
            action = "Drop Feature"

        elif row["is_num"]:
            if row["drift_score"] > PSI_SEVERE * 2:
                drops.append(col)
                action = "Drop Feature"
            else:
                tr_v = tr[col].values.astype(float)
                te_v = te[col].values.astype(float)
                tr_q = np.nanpercentile(tr_v, [25, 50, 75])
                te_q = np.nanpercentile(te_v, [25, 50, 75])
                iqr_te = te_q[2] - te_q[0]
                iqr_tr = tr_q[2] - tr_q[0]
                if iqr_te > 1e-8:
                    te[col] = (te_v - te_q[1]) / iqr_te * iqr_tr + tr_q[1]
                action = "Feature Scaling"

        else:
            if row["has_new_cats"]:
                mode_val = tr[col].mode().iloc[0] if len(tr[col].mode()) > 0 else "unknown"
                valid = set(tr[col].dropna().unique())
                te[col] = te[col].apply(lambda x: x if x in valid else mode_val)
                action = "Seasonality Matching"
            else:
                action = "No Action"

        log.append({
            "Columns with Drift": col,
            "Column Type": row["col_type"],
            "Drift Description": row["drift_description"],
            "Drift Mitigation": action,
        })

    if drops:
        tr.drop(columns=[c for c in drops if c in tr.columns], inplace=True)
        te.drop(columns=[c for c in drops if c in te.columns], inplace=True)

    return tr, te, pd.DataFrame(log)
