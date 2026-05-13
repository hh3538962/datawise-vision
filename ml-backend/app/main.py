"""LumenML FastAPI service.

Trains the exact 4 classifiers and 4 regressors used in the course notebook
on the bundled dataset and exposes prediction / comparison endpoints.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd, numpy as np, io, time, warnings
warnings.filterwarnings("ignore")

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,
                              RandomForestRegressor, GradientBoostingRegressor)
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                              mean_absolute_error, mean_squared_error, r2_score, confusion_matrix)

DATA_PATH = "data/E-commerce_Dataset.csv"
CAT_COLS = ["Gender","City","Product_Category","Payment_Method","Device_Type","Is_Returning_Customer"]

CLF_NAMES = ["Logistic Regression", "Decision Tree", "Random Forest", "Gradient Boosting"]
REG_NAMES = ["Linear Regression", "Decision Tree", "Random Forest", "Gradient Boosting"]

app = FastAPI(title="LumenML API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

STATE = {"df": None, "encoders": {},
         "results_clf": None, "results_reg": None, "models_clf": {}, "models_reg": {},
         "cm": None, "fi_clf": None, "fi_reg": None,
         "feature_cols_clf": None, "feature_cols_reg": None, "cm_labels": None}


def load_data(df: Optional[pd.DataFrame] = None):
    if df is None:
        df = pd.read_csv(DATA_PATH)
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Month"] = df["Date"].dt.month
    df["DayOfWeek"] = df["Date"].dt.dayofweek
    df = df.drop(columns=["Order_ID","Customer_ID","Date"])
    for c in df.select_dtypes(include=[np.number]).columns:
        df[c] = df[c].fillna(df[c].median())
    for c in df.select_dtypes(include=["object","bool"]).columns:
        df[c] = df[c].fillna(df[c].mode()[0])
    encoders = {}
    for c in CAT_COLS:
        le = LabelEncoder(); df[c] = le.fit_transform(df[c].astype(str)); encoders[c] = le
    STATE["df"] = df; STATE["encoders"] = encoders
    return df


def train_all():
    df = STATE["df"] if STATE["df"] is not None else load_data()

    Xc = df.drop(columns=["Customer_Rating"]); yc = df["Customer_Rating"].astype(int)
    Xtr, Xte, ytr, yte = train_test_split(Xc, yc, test_size=0.2, random_state=42, stratify=yc)
    clf_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(max_depth=8, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42),
    }
    results_clf = []; cm = None; fi = None
    for name, m in clf_models.items():
        t = time.time(); m.fit(Xtr, ytr); p = m.predict(Xte)
        results_clf.append({
            "model": name,
            "accuracy": round(float(accuracy_score(yte, p)), 4),
            "precision": round(float(precision_score(yte, p, average="weighted", zero_division=0)), 4),
            "recall": round(float(recall_score(yte, p, average="weighted", zero_division=0)), 4),
            "f1": round(float(f1_score(yte, p, average="weighted", zero_division=0)), 4),
            "time_s": round(time.time() - t, 2),
        })
        STATE["models_clf"][name] = m
        if name == "Random Forest":
            cm = confusion_matrix(yte, p).tolist()
            fi = sorted(zip(Xc.columns, m.feature_importances_), key=lambda z: -z[1])

    Xr = df.drop(columns=["Total_Amount"]); yr = df["Total_Amount"]
    Xtr, Xte, ytr, yte = train_test_split(Xr, yr, test_size=0.2, random_state=42)
    reg_models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(max_depth=10, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=100, max_depth=14, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42),
    }
    results_reg = []; fi_reg = None
    for name, m in reg_models.items():
        t = time.time(); m.fit(Xtr, ytr); p = m.predict(Xte)
        results_reg.append({
            "model": name,
            "rmse": round(float(np.sqrt(mean_squared_error(yte, p))), 2),
            "mae": round(float(mean_absolute_error(yte, p)), 2),
            "r2": round(float(r2_score(yte, p)), 4),
            "mse": round(float(mean_squared_error(yte, p)), 2),
            "time_s": round(time.time() - t, 2),
        })
        STATE["models_reg"][name] = m
        if name == "Random Forest":
            fi_reg = sorted(zip(Xr.columns, m.feature_importances_), key=lambda z: -z[1])

    STATE.update({
        "results_clf": results_clf, "results_reg": results_reg,
        "cm": cm, "fi_clf": fi, "fi_reg": fi_reg,
        "feature_cols_clf": list(Xc.columns), "feature_cols_reg": list(Xr.columns),
        "cm_labels": sorted(yc.unique().tolist()),
    })
    return {"classification": results_clf, "regression": results_reg}


def ensure_trained():
    if STATE["results_clf"] is None:
        train_all()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/dataset/summary")
def dataset_summary():
    if STATE["df"] is None: load_data()
    df = STATE["df"]
    return {"rows": len(df), "cols": df.shape[1], "features": list(df.columns),
            "missing_total": int(df.isna().sum().sum())}


@app.post("/train")
def train():
    return train_all()


@app.get("/models/list")
def list_models():
    return {"classification": CLF_NAMES, "regression": REG_NAMES}


@app.get("/models/compare")
def compare(task: str = "classification"):
    ensure_trained()
    if task == "classification":
        return {"results": STATE["results_clf"], "cm": STATE["cm"], "cm_labels": STATE["cm_labels"],
                "feature_importance": [{"feature": k, "importance": float(v)} for k, v in STATE["fi_clf"][:10]]}
    return {"results": STATE["results_reg"],
            "feature_importance": [{"feature": k, "importance": float(v)} for k, v in STATE["fi_reg"][:10]]}


class PredictInput(BaseModel):
    features: dict
    model: Optional[str] = None


def encode_row(features: dict, columns: list) -> np.ndarray:
    row = {}
    for c in columns:
        v = features.get(c, 0)
        if c in STATE["encoders"]:
            le = STATE["encoders"][c]
            try: v = int(le.transform([str(v)])[0])
            except Exception: v = 0
        row[c] = v
    return np.array([[row[c] for c in columns]], dtype=float)


@app.post("/predict/classification")
def predict_clf(payload: PredictInput):
    ensure_trained()
    name = payload.model or "Random Forest"
    if name not in STATE["models_clf"]:
        raise HTTPException(404, f"Model {name} not found. Available: {CLF_NAMES}")
    m = STATE["models_clf"][name]
    X = encode_row(payload.features, STATE["feature_cols_clf"])
    label = int(m.predict(X)[0])
    probs = m.predict_proba(X)[0].tolist() if hasattr(m, "predict_proba") else None
    return {"model": name, "label": label, "probabilities": probs, "classes": STATE["cm_labels"]}


@app.post("/predict/regression")
def predict_reg(payload: PredictInput):
    ensure_trained()
    name = payload.model or "Random Forest"
    if name not in STATE["models_reg"]:
        raise HTTPException(404, f"Model {name} not found. Available: {REG_NAMES}")
    m = STATE["models_reg"][name]
    X = encode_row(payload.features, STATE["feature_cols_reg"])
    pred = float(m.predict(X)[0])
    return {"model": name, "prediction": pred, "interval": {"low": pred * 0.9, "high": pred * 1.1}}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    load_data(df)
    return train_all()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
