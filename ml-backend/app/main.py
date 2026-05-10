"""LumenML FastAPI service.

Loads the bundled dataset, trains the full sweep of classifiers and regressors
on first request, caches results in-memory, and exposes prediction endpoints.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd, numpy as np, io, time, warnings
warnings.filterwarnings("ignore")

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier,
                              RandomForestRegressor, GradientBoostingRegressor)
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC, SVR
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                              mean_absolute_error, mean_squared_error, r2_score, confusion_matrix)

try:
    from xgboost import XGBClassifier, XGBRegressor
    HAS_XGB = True
except Exception:
    HAS_XGB = False

DATA_PATH = "data/E-commerce_Dataset.csv"
CAT_COLS = ["Gender","City","Product_Category","Payment_Method","Device_Type","Is_Returning_Customer"]

app = FastAPI(title="LumenML API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

STATE = {"df": None, "encoders": {}, "scaler_clf": None, "scaler_reg": None,
         "results_clf": None, "results_reg": None, "models_clf": {}, "models_reg": {},
         "cm": None, "fi_clf": None, "fi_reg": None, "feature_cols_clf": None, "feature_cols_reg": None}


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
    sc_c = StandardScaler(); Xtrs = sc_c.fit_transform(Xtr); Xtes = sc_c.transform(Xte)

    clf_models = {
        "Logistic Regression": LogisticRegression(max_iter=500),
        "KNN": KNeighborsClassifier(n_neighbors=15),
        "Decision Tree": DecisionTreeClassifier(max_depth=8, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=80, max_depth=10, random_state=42, n_jobs=-1),
        "SVM": SVC(kernel="rbf", probability=True),
        "Naive Bayes": GaussianNB(),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=80, max_depth=4, random_state=42),
        "AdaBoost": AdaBoostClassifier(n_estimators=80, random_state=42),
    }
    if HAS_XGB:
        clf_models["XGBoost"] = XGBClassifier(n_estimators=120, max_depth=5, eval_metric="mlogloss", use_label_encoder=False)

    results_clf = []; cm = None; fi = None
    for name, m in clf_models.items():
        t = time.time()
        if name in ("KNN","Logistic Regression","Naive Bayes","SVM"):
            m.fit(Xtrs, ytr); p = m.predict(Xtes)
        elif name == "XGBoost":
            m.fit(Xtr, ytr - ytr.min()); p = m.predict(Xte) + ytr.min()
        else:
            m.fit(Xtr, ytr); p = m.predict(Xte)
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
    sc_r = StandardScaler(); Xtrs = sc_r.fit_transform(Xtr); Xtes = sc_r.transform(Xte)

    reg_models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Lasso Regression": Lasso(alpha=0.1),
        "Decision Tree": DecisionTreeRegressor(max_depth=10, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=80, max_depth=12, random_state=42, n_jobs=-1),
        "SVR": SVR(kernel="rbf"),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=80, max_depth=4, random_state=42),
    }
    if HAS_XGB:
        reg_models["XGBoost"] = XGBRegressor(n_estimators=120, max_depth=5)

    results_reg = []; fi_reg = None
    for name, m in reg_models.items():
        t = time.time()
        if name in ("Linear Regression","Ridge Regression","Lasso Regression","SVR"):
            if name == "SVR":
                idx = np.random.RandomState(42).choice(len(Xtrs), min(3000, len(Xtrs)), replace=False)
                m.fit(Xtrs[idx], ytr.iloc[idx])
            else:
                m.fit(Xtrs, ytr)
            p = m.predict(Xtes)
        else:
            m.fit(Xtr, ytr); p = m.predict(Xte)
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
        "scaler_clf": sc_c, "scaler_reg": sc_r,
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
        raise HTTPException(404, f"Model {name} not found")
    m = STATE["models_clf"][name]
    X = encode_row(payload.features, STATE["feature_cols_clf"])
    if name in ("KNN","Logistic Regression","Naive Bayes","SVM"):
        X = STATE["scaler_clf"].transform(X)
    label = int(m.predict(X)[0])
    probs = m.predict_proba(X)[0].tolist() if hasattr(m, "predict_proba") else None
    return {"model": name, "label": label, "probabilities": probs, "classes": STATE["cm_labels"]}


@app.post("/predict/regression")
def predict_reg(payload: PredictInput):
    ensure_trained()
    name = payload.model or "Random Forest"
    if name not in STATE["models_reg"]:
        raise HTTPException(404, f"Model {name} not found")
    m = STATE["models_reg"][name]
    X = encode_row(payload.features, STATE["feature_cols_reg"])
    if name in ("Linear Regression","Ridge Regression","Lasso Regression","SVR"):
        X = STATE["scaler_reg"].transform(X)
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
