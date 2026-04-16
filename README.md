# NAISC 2026 — Singtel Adaptive Drift Intelligence

> Binary churn classification with automated data drift detection and mitigation,
> plus a production-grade React dashboard for exploring the results.
>
> Submission for **NAISC 2026 · Local Track 06** (Singtel).

The pipeline uses a **DDLA-inspired approach**: baseline feature importance ranks
act as a proxy to distinguish harmful drift (mitigate) from benign drift (drop),
keeping only signal-preserving transformations under fixed LightGBM
hyperparameters.

---

## Repo layout

The repository is split into two deliverables including the Python ML pipeline
(required) and the React dashboard.

```
naisc-2026-singtel/
│
├── src/                            # 🐍 ML pipeline (required deliverable)
│   ├── main.py                     # entry point
│   ├── drift.py                    # detection + mitigation
│   └── model.py                    # LightGBM wrapper
├── requirements.txt
│
└── naisc-drift-dashboard/          # ⚛️  React dashboard (optional)
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── charts/             # Recharts wrappers
    │   │   │   ├── AUPRCChart.jsx
    │   │   │   ├── ChartTooltip.jsx
    │   │   │   ├── DriftScoreChart.jsx
    │   │   │   └── ScoreHistogram.jsx
    │   │   ├── layout/             # Header, tab nav
    │   │   │   ├── Header.jsx
    │   │   │   └── TabNav.jsx
    │   │   ├── tabs/               # One file per tab
    │   │   │   ├── OverviewTab.jsx
    │   │   │   ├── DriftTab.jsx
    │   │   │   └── PredictionsTab.jsx
    │   │   ├── ui/                 # Reusable primitives
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Chip.jsx
    │   │   │   ├── MetricCard.jsx
    │   │   │   └── ProgressBar.jsx
    │   │   ├── DriftTable.jsx
    │   │   ├── MitigationSummary.jsx
    │   │   ├── PipelineFlow.jsx
    │   │   └── UploadZone.jsx
    │   ├── data/
    │   │   └── defaults.js         # Seed data for the dashboard
    │   ├── hooks/
    │   │   └── useCsvUpload.js
    │   ├── lib/
    │   │   ├── tokens.js           # JS-side design tokens
    │   │   └── utils.js
    │   ├── App.jsx
    │   ├── index.css               # Tailwind entry + component classes
    │   └── main.jsx
    ├── docker/
    │   └── Dockerfile.pipeline     # Pipeline image
    ├── Dockerfile                  # Dashboard image (multi-stage → Nginx)
    ├── docker-compose.yml
    ├── nginx.conf
    ├── eslint.config.js
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── index.html
    └── package.json
```

### Why this layout

- **`components/ui/`** holds primitives (`Button`, `Card`, `Chip`, …) with no
  domain knowledge — reusable anywhere.
- **`components/charts/`** holds Recharts wrappers. All chart styling lives here
  so tabs stay readable.
- **`components/layout/`** is for chrome (header, nav) that sits outside any
  single tab.
- **`components/tabs/`** is one file per tab. Each tab composes primitives +
  charts + domain components. This is the first place to look when adding a new
  section.
- **`hooks/`** holds stateful logic that is tab-agnostic (e.g. CSV upload).
- **`lib/`** holds pure helpers and design tokens consumed by JS (Recharts fills,
  color math). The matching Tailwind-side tokens live in `tailwind.config.js`.
- **`data/`** holds seed data so the dashboard renders meaningfully on first
  load, before a real `predictions.csv` is uploaded.

---

## Part A — ML Pipeline (required deliverable)

### Run locally (Python 3.12, CPU only)

```bash
pip install -r requirements.txt

python ./src/main.py \
  --train_data_filepath path/to/train.csv \
  --test_data_filepath  path/to/test.csv
```

### Outputs

| File              | Description                                         |
| ----------------- | --------------------------------------------------- |
| `predictions.csv` | `CustomerID`, `probability_score` for the test set  |
| `model.joblib`    | Trained LightGBM model                              |
| stdout            | Drift report, time taken, AU-PRC scores             |

### Run in Docker

```bash
# From the repo root
docker build \
  -f naisc-drift-dashboard/docker/Dockerfile.pipeline \
  -t naisc-pipeline .

docker run --rm \
  -v "$(pwd)/data:/data:ro" \
  -v "$(pwd)/outputs:/outputs" \
  naisc-pipeline \
  --train_data_filepath /data/train.csv \
  --test_data_filepath  /data/test.csv
```

`predictions.csv` and `model.joblib` will appear in `./outputs`.

### Approach (summary)

1. **Baseline model** — fit LightGBM on training data to get gain-based feature importances.
2. **Detect** — K-S test + PSI for numeric features; Chi-squared + new-category check for categoricals.
3. **Classify** — drifted features below median importance → benign (drop); above → harmful (mitigate).
4. **Mitigate** — IQR-based quantile scaling for numeric drift; mode imputation for new categorical values; drop for extreme or low-importance drift.
5. **Train** — retrain LightGBM on mitigated data with fixed hyperparameters.

---

## Part B — Dashboard

A production-grade React dashboard (Vite + React 18 + Tailwind CSS + Recharts)
for visualizing drift severity, mitigation actions, and exploring predictions.

### Features

| Tab                | What you can do                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Overview**       | Pipeline step status · AU-PRC comparison · edit metrics from your run                        |
| **Drift Analysis** | Interactive bar chart of drift scores per feature · mitigation breakdown · editable drift report |
| **Predictions**    | Upload `predictions.csv` → score distribution histogram · risk segmentation · top-20 at-risk customers |

### Run locally (dev)

Requires Node.js ≥ 18 and npm ≥ 9.

```bash
cd naisc-drift-dashboard
npm install
npm run dev         # → http://localhost:5173
```

### Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build on http://localhost:4173
```

### Run in Docker (production)

```bash
cd naisc-drift-dashboard

docker build -t naisc-dashboard .
docker run --rm -p 8080:80 naisc-dashboard
#   → open http://localhost:8080
```

The image is a multi-stage build:
1. `node:20-alpine` builds the Vite bundle.
2. `nginx:1.27-alpine` serves `dist/` with gzip, long-cache for hashed assets,
   SPA fallback, and hardened security headers.

### Loading your own pipeline results

1. Run the pipeline to generate `predictions.csv`.
2. Open the **Predictions** tab and drag-and-drop or click to upload the CSV.
3. Update AU-PRC and time-taken values in the **Overview** tab.
4. The drift report table auto-populates with defaults; edit rows to match your
   run's `stdout` output.

---

## Part C — Compose (pipeline + dashboard together)

A single `docker-compose.yml` orchestrates both services. The pipeline runs
under a `ml` profile so `docker compose up` doesn't accidentally re-run it.

```bash
cd naisc-drift-dashboard

# 1. Run the pipeline (writes to ../outputs)
docker compose --profile ml run --rm pipeline \
  --train_data_filepath /data/train.csv \
  --test_data_filepath  /data/test.csv

# 2. Start the dashboard
docker compose up -d dashboard
#   → open http://localhost:8080

# 3. Tear down
docker compose down
```

Place your CSVs in `./data/` at the repo root before running the pipeline.

---

## Tech stack

**Pipeline** — Python 3.12 · LightGBM 4.6 · scikit-learn · pandas · numpy
**Dashboard** — Vite 5 · React 18 · Tailwind CSS 3 · Recharts · Papaparse · lucide-react
**Infra** — Docker multi-stage · Nginx 1.27 · docker-compose

---

## Scripts cheat sheet

Inside `naisc-drift-dashboard/`:

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server on :5173 with HMR        |
| `npm run build`   | Production bundle → `dist/`              |
| `npm run preview` | Preview the production bundle on :4173   |
| `npm run lint`    | ESLint (flat config)                     |
