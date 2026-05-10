# LumenML — FastAPI Backend

Companion ML service for the LumenML frontend. Runs the full sklearn + XGBoost pipeline, exposes REST endpoints for training, prediction and comparison.

## Quick start (local)

```bash
cd ml-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then in the Lovable frontend project add an env var:
```
VITE_ML_API_URL=http://localhost:8000
```

## Deploy to Render (free tier)

1. Push this `ml-backend/` folder to a new GitHub repo.
2. On [render.com](https://render.com) → **New +** → **Blueprint** → connect your repo.
3. Render reads `render.yaml` and provisions a Web Service automatically.
4. Copy the public URL (e.g. `https://lumenml-api.onrender.com`).
5. Set `VITE_ML_API_URL` in Lovable → redeploy frontend.

## Docker

```bash
docker build -t lumenml-api .
docker run -p 8000:8000 lumenml-api
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET  | `/dataset/summary`         | row/col counts, missing, basic stats |
| GET  | `/dataset/eda`             | correlations, distributions |
| POST | `/train`                   | sweep all 9 classifiers + 8 regressors |
| GET  | `/models/compare`          | leaderboard + best model |
| POST | `/predict/classification`  | rating prediction + probabilities |
| POST | `/predict/regression`      | revenue prediction + 90% interval |
| POST | `/upload`                  | upload CSV and re-train |

## Models

**Classification** (target = `Customer_Rating`):
Logistic Regression, KNN, Decision Tree, Random Forest, SVM, Naive Bayes,
Gradient Boosting, AdaBoost, XGBoost.

**Regression** (target = `Total_Amount`):
Linear, Ridge, Lasso, Decision Tree, Random Forest, SVR, Gradient Boosting, XGBoost.

## Note

The current Lovable preview ships with **pre-computed metrics baked into the
frontend** (real numbers from training on the bundled dataset) so the UI is
fully working before the backend is deployed. Once `VITE_ML_API_URL` is set,
swap the imports in `src/data/*` for live `fetch` calls in
`src/lib/ml.functions.ts`.
