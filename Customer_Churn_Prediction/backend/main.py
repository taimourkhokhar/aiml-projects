"""
Customer Churn Prediction API
==============================
FastAPI service wrapping a scikit-learn LogisticRegression model trained on the
Telco Customer Churn dataset. Recreates the exact preprocessing pipeline used
in training (one-hot encoding + StandardScaler on tenure/MonthlyCharges/TotalCharges)
so raw, human-friendly customer fields can be sent straight from the frontend.
"""

import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "customer_churn_prediction.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# ---------------------------------------------------------------------------
# Load model + scaler once at startup
# ---------------------------------------------------------------------------
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Exact column order the model was trained on (model.feature_names_in_)
FEATURE_ORDER = [
    "SeniorCitizen", "tenure", "MonthlyCharges", "TotalCharges",
    "gender_Female", "gender_Male",
    "Partner_No", "Partner_Yes",
    "Dependents_No", "Dependents_Yes",
    "PhoneService_No", "PhoneService_Yes",
    "MultipleLines_No", "MultipleLines_No phone service", "MultipleLines_Yes",
    "InternetService_DSL", "InternetService_Fiber optic", "InternetService_No",
    "OnlineSecurity_No", "OnlineSecurity_No internet service", "OnlineSecurity_Yes",
    "OnlineBackup_No", "OnlineBackup_No internet service", "OnlineBackup_Yes",
    "DeviceProtection_No", "DeviceProtection_No internet service", "DeviceProtection_Yes",
    "TechSupport_No", "TechSupport_No internet service", "TechSupport_Yes",
    "StreamingTV_No", "StreamingTV_No internet service", "StreamingTV_Yes",
    "Contract_Month-to-month", "Contract_One year", "Contract_Two year",
    "PaperlessBilling_No", "PaperlessBilling_Yes",
    "PaymentMethod_Bank transfer (automatic)", "PaymentMethod_Credit card (automatic)",
    "PaymentMethod_Electronic check", "PaymentMethod_Mailed check",
    "StreamingMovies_No", "StreamingMovies_No internet service", "StreamingMovies_Yes",
]

NUMERIC_COLS = ["tenure", "MonthlyCharges", "TotalCharges"]

YesNo = Literal["Yes", "No"]
YesNoInternet = Literal["Yes", "No", "No internet service"]

# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------
class CustomerInput(BaseModel):
    gender: Literal["Female", "Male"]
    SeniorCitizen: Literal[0, 1] = Field(..., description="1 = senior citizen, 0 = not")
    Partner: YesNo
    Dependents: YesNo
    tenure: int = Field(..., ge=0, le=100, description="Months with the company")
    PhoneService: YesNo
    MultipleLines: Literal["Yes", "No", "No phone service"]
    InternetService: Literal["DSL", "Fiber optic", "No"]
    OnlineSecurity: YesNoInternet
    OnlineBackup: YesNoInternet
    DeviceProtection: YesNoInternet
    TechSupport: YesNoInternet
    StreamingTV: YesNoInternet
    StreamingMovies: YesNoInternet
    Contract: Literal["Month-to-month", "One year", "Two year"]
    PaperlessBilling: YesNo
    PaymentMethod: Literal[
        "Electronic check", "Mailed check",
        "Bank transfer (automatic)", "Credit card (automatic)"
    ]
    MonthlyCharges: float = Field(..., ge=0)
    TotalCharges: float = Field(..., ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "gender": "Female",
                "SeniorCitizen": 0,
                "Partner": "Yes",
                "Dependents": "No",
                "tenure": 12,
                "PhoneService": "Yes",
                "MultipleLines": "No",
                "InternetService": "Fiber optic",
                "OnlineSecurity": "No",
                "OnlineBackup": "Yes",
                "DeviceProtection": "No",
                "TechSupport": "No",
                "StreamingTV": "Yes",
                "StreamingMovies": "Yes",
                "Contract": "Month-to-month",
                "PaperlessBilling": "Yes",
                "PaymentMethod": "Electronic check",
                "MonthlyCharges": 85.5,
                "TotalCharges": 1020.0,
            }
        }


class PredictionResponse(BaseModel):
    churn: bool
    churn_label: str
    churn_probability: float
    retain_probability: float
    risk_level: str


# ---------------------------------------------------------------------------
# Preprocessing: raw fields -> one-hot vector matching FEATURE_ORDER -> scale
# ---------------------------------------------------------------------------
def build_feature_row(payload: CustomerInput) -> pd.DataFrame:
    raw = payload.dict()

    row = {col: 0 for col in FEATURE_ORDER}
    row["SeniorCitizen"] = raw["SeniorCitizen"]
    row["tenure"] = raw["tenure"]
    row["MonthlyCharges"] = raw["MonthlyCharges"]
    row["TotalCharges"] = raw["TotalCharges"]

    one_hot_fields = {
        "gender": raw["gender"],
        "Partner": raw["Partner"],
        "Dependents": raw["Dependents"],
        "PhoneService": raw["PhoneService"],
        "MultipleLines": raw["MultipleLines"],
        "InternetService": raw["InternetService"],
        "OnlineSecurity": raw["OnlineSecurity"],
        "OnlineBackup": raw["OnlineBackup"],
        "DeviceProtection": raw["DeviceProtection"],
        "TechSupport": raw["TechSupport"],
        "StreamingTV": raw["StreamingTV"],
        "Contract": raw["Contract"],
        "PaperlessBilling": raw["PaperlessBilling"],
        "PaymentMethod": raw["PaymentMethod"],
        "StreamingMovies": raw["StreamingMovies"],
    }

    for field, value in one_hot_fields.items():
        col_name = f"{field}_{value}"
        if col_name not in row:
            raise HTTPException(
                status_code=422,
                detail=f"Unrecognized value '{value}' for field '{field}'.",
            )
        row[col_name] = 1

    df = pd.DataFrame([row], columns=FEATURE_ORDER)
    df[NUMERIC_COLS] = scaler.transform(df[NUMERIC_COLS])
    return df


def risk_bucket(prob: float) -> str:
    if prob < 0.33:
        return "Low"
    if prob < 0.66:
        return "Medium"
    return "High"


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Customer Churn Prediction API",
    description="Predicts the likelihood a telecom customer will churn.",
    version="1.0.0",
)

# CORS: allow the Vercel frontend (and local dev) to call this API.
# Set FRONTEND_ORIGIN as an env var on Railway to your deployed Vercel URL.
frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
origins = [frontend_origin] if frontend_origin != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Customer Churn Prediction API is running."}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: CustomerInput):
    try:
        features = build_feature_row(payload)
        proba = model.predict_proba(features)[0]
        churn_prob = float(proba[1])
        retain_prob = float(proba[0])
        prediction = bool(model.predict(features)[0])

        return PredictionResponse(
            churn=prediction,
            churn_label="Yes" if prediction else "No",
            churn_probability=round(churn_prob, 4),
            retain_probability=round(retain_prob, 4),
            risk_level=risk_bucket(churn_prob),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
