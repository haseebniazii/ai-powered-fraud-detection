import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


# =========================================================
# Load trained model
# =========================================================

model = joblib.load("fraud_detection_model.pkl")


# =========================================================
# FastAPI App
# =========================================================

app = FastAPI(
    title="AI-Powered Fraud Detection API",
    description="API for detecting fraudulent financial transactions.",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Input Data Schema
# =========================================================

class TransactionData(BaseModel):

    transaction_hour: int = Field(
        ...,
        ge=0,
        le=23,
        description="Transaction hour from 0 to 23"
    )

    account_age_days: int = Field(
        ...,
        ge=0,
        description="Age of customer account in days"
    )

    previous_chargebacks: int = Field(
        ...,
        ge=0,
        description="Number of previous chargebacks"
    )

    merchant_category: str = Field(
        ...,
        description="Merchant category"
    )

    transaction_country: str = Field(
        ...,
        description="Country where transaction occurred"
    )

    device_type: Literal[
        "Mobile",
        "Desktop",
        "Tablet"
    ]

    is_international: int = Field(
        ...,
        ge=0,
        le=1,
        description="1 = International, 0 = Domestic"
    )

    is_high_risk_merchant: int = Field(
        ...,
        ge=0,
        le=1,
        description="1 = High risk merchant, 0 = Normal merchant"
    )

    transaction_amount: float = Field(
        ...,
        ge=0,
        description="Transaction amount"
    )

    transaction_velocity_1h: int = Field(
        ...,
        ge=0,
        description="Number of transactions in the last 1 hour"
    )

    transaction_velocity_24h: int = Field(
        ...,
        ge=0,
        description="Number of transactions in the last 24 hours"
    )

    avg_transaction_amount_30d: float = Field(
        ...,
        gt=0,
        description="Average transaction amount over last 30 days"
    )


# =========================================================
# Response Schema
# =========================================================

class PredictionResponse(BaseModel):

    prediction: Literal[
        "Legitimate",
        "Fraud"
    ]

    fraud_probability: float

    legitimate_probability: float


# =========================================================
# Home Route
# =========================================================

@app.get("/")
def home():

    return {
        "message": "AI-Powered Fraud Detection API is running",
        "status": "success",
        "docs": "/docs"
    }


# =========================================================
# Health Check
# =========================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "model_loaded": True
    }


# =========================================================
# Prediction Route
# =========================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_transaction(data: TransactionData):

    # -----------------------------------------------------
    # Feature Engineering
    # -----------------------------------------------------

    amount_ratio = (
        data.transaction_amount /
        data.avg_transaction_amount_30d
    )


    # -----------------------------------------------------
    # Create DataFrame
    # -----------------------------------------------------

    input_data = pd.DataFrame([{

        "transaction_hour":
            data.transaction_hour,

        "account_age_days":
            data.account_age_days,

        "previous_chargebacks":
            data.previous_chargebacks,

        "merchant_category":
            data.merchant_category,

        "transaction_country":
            data.transaction_country,

        "device_type":
            data.device_type,

        "is_international":
            data.is_international,

        "is_high_risk_merchant":
            data.is_high_risk_merchant,

        "transaction_amount":
            data.transaction_amount,

        "transaction_velocity_1h":
            data.transaction_velocity_1h,

        "transaction_velocity_24h":
            data.transaction_velocity_24h,

        "avg_transaction_amount_30d":
            data.avg_transaction_amount_30d,

        "amount_ratio":
            amount_ratio
    }])


    # -----------------------------------------------------
    # Prediction
    # -----------------------------------------------------

    prediction = model.predict(input_data)[0]


    # -----------------------------------------------------
    # Probability
    # -----------------------------------------------------

    probabilities = model.predict_proba(input_data)[0]

    legitimate_probability = probabilities[0]
    fraud_probability = probabilities[1]


    # -----------------------------------------------------
    # Convert prediction
    # -----------------------------------------------------

    if prediction == 1:

        result = "Fraud"

    else:

        result = "Legitimate"


    # -----------------------------------------------------
    # Return response
    # -----------------------------------------------------

    return PredictionResponse(

        prediction=result,

        fraud_probability=round(
            float(fraud_probability),
            4
        ),

        legitimate_probability=round(
            float(legitimate_probability),
            4
        )
    )