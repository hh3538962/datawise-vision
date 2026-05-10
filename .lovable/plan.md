
# ML Business Analytics Platform — Build Plan

A premium, dashboard-style web app for your ML for Business Analytics final project. Frontend in this Lovable project (TanStack Start + React + Tailwind + Framer Motion + Recharts). ML lives in a separate FastAPI service that **you host** (Render / Railway / HuggingFace Spaces). Lovable will generate that Python service as a downloadable folder with deployment instructions.

---

## Architecture

```text
┌───────────────────────────────┐        ┌──────────────────────────────┐
│  Lovable Frontend (this app) │ HTTPS  │  Python FastAPI ML Service   │
│  TanStack Start + React      │ ─────► │  scikit-learn + xgboost      │
│  Recharts, Framer Motion     │        │  pandas, numpy, joblib       │
└───────────────────────────────┘        └──────────────────────────────┘
              │                                        │
              │  baked-in dataset (CSV in /public)     │
              │  TanStack server fns proxy to API      │  trains, predicts,
              │  VITE_ML_API_URL env var               │  returns metrics
```

- **Targets**: Classification → `Customer_Rating` (1–5 buckets). Regression → `Total_Amount`.
- **Dataset**: `E-commerce_Dataset.csv` baked into `/public`. Users may upload a CSV with the same schema to re-run analysis.
- **Hosting**: Frontend on Lovable. Python API hosted by you — we'll provide a `Dockerfile` + `render.yaml` and step-by-step deploy guide.

## Frontend pages (TanStack Start routes)

```text
src/routes/
  __root.tsx              shell, sidebar layout, theme provider
  index.tsx               Landing — hero, animated bg, team, project overview
  _app.tsx                authenticated/dashboard layout w/ sidebar + topbar
  _app/dashboard.tsx      KPI cards, dataset overview, model perf snapshot
  _app/analysis.tsx       EDA: correlation heatmap, distributions, missing vals
  _app/classification.tsx Prediction form + probability bars + explanation
  _app/regression.tsx     Prediction form + trend chart + interval
  _app/comparison.tsx     All models ranked, metric tables, feature importance
  _app/upload.tsx         CSV upload, schema check, train trigger, progress
  _app/about.tsx          Problem, objectives, dataset, tech, recommendations
```

## Components & visual system

- Glassmorphism cards, gradient accents, dark/light toggle (default dark).
- Sidebar nav (shadcn `sidebar`), topbar with search, breadcrumbs.
- Reusable: `KpiCard`, `MetricTable`, `ModelRankCard`, `ProbabilityBars`, `CorrelationHeatmap`, `FeatureImportanceChart`, `ConfusionMatrixGrid`, `RocCurveChart`, `LoadingShimmer`, `BusinessInsightCard`.
- Charts via Recharts (bar, line, area, scatter, radar). Heatmap = custom SVG grid.
- Framer Motion for page transitions, count-up KPIs, staggered card entrance.
- Typography: Space Grotesk (display) + Inter (body). Palette: deep navy + electric cyan + violet accents (oklch tokens in `src/styles.css`).

## Backend: FastAPI ML service (delivered as `/ml-backend` folder)

```text
ml-backend/
  app/
    main.py                FastAPI app, CORS
    routes/
      dataset.py           /dataset/summary, /dataset/eda
      train.py             /train (classification + regression sweep)
      predict.py           /predict/classification, /predict/regression
      compare.py           /models/compare
    ml/
      preprocessing.py     impute, encode, scale, split
      classifiers.py       LR, KNN, DT, RF, SVM, NB, GB, AdaBoost, XGB
      regressors.py        Linear, Ridge, Lasso, DT, RF, SVR, GB, XGB
      evaluate.py          accuracy/prec/rec/f1/ROC/CM, RMSE/MAE/R²/MSE
      registry.py          joblib save/load, best-model selection
    schemas.py             Pydantic request/response models
  models/                  saved .joblib files (pre-trained on bundled CSV)
  data/E-commerce_Dataset.csv
  requirements.txt
  Dockerfile
  render.yaml
  README.md                deploy steps for Render / Railway / HF Spaces
```

Endpoints:
- `GET /dataset/summary` — rows, cols, dtypes, missing, basic stats
- `GET /dataset/eda` — correlations, distributions, category counts
- `POST /train` — runs full sweep, returns metrics for all models
- `GET /models/compare?task=classification|regression` — leaderboard + best
- `POST /predict/classification` — input dict → label + probabilities
- `POST /predict/regression` — input dict → predicted total + interval
- `POST /upload` — accept CSV, re-train, return metrics

CORS allows the Lovable preview + published origins.

## Frontend ↔ Backend wiring

- Add `VITE_ML_API_URL` env var (you set it after deploying the Python service).
- TanStack server functions in `src/lib/ml.functions.ts` proxy requests to the API (keeps any auth tokens server-side, gives clean error handling).
- React Query for caching, loading, retries.
- All numerical responses are pre-computed on the server; the frontend only renders.

## Build phases

1. **Frontend foundation** — design tokens, layout, sidebar, theme toggle, landing page, routing skeleton.
2. **Mock-data pages** — Dashboard, Analysis, Comparison, Prediction forms wired to a local mock so the UI is fully reviewable before the API exists.
3. **Python service** — generate `ml-backend/` with all models, evaluation, save baseline models trained on the bundled CSV.
4. **Wire frontend to API** — replace mocks with server-fn calls, add `VITE_ML_API_URL`, error/loading states.
5. **Polish** — animations, PDF/CSV export of report, business insight copy, accessibility pass, responsive QA.

## Deliverables

- Complete frontend (this Lovable project).
- `ml-backend/` folder with FastAPI service, Dockerfile, `render.yaml`, README with one-click deploy steps.
- `.env.example` documenting `VITE_ML_API_URL`.
- About page documenting problem, objectives, methodology, business recommendations.

## What I need from you to ship phase 3+

- Where you want to host the Python API (Render is easiest free tier — I'll default the README to that).
- Team member names / roles for the landing + About pages (or I'll use placeholders you swap later).
- Any university branding/logo to include (optional).

## Technical notes

- TanStack Start workers can't run scikit-learn — that's why ML is a separate Python service.
- Until you deploy the API, the app runs against bundled mock JSON snapshots derived from your notebook so the demo is never broken.
- XGBoost is included; if Render's free tier struggles with it, the README shows how to drop to GradientBoosting only.
- Dataset CSV (~17k rows) is small enough to bake into the repo and the API container.
