from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("house_price_model.pkl")
scaler = joblib.load("scaler.pkl")

# Exact column order the scaler was fitted on
# city used drop_first=True so city_Islamabad is dropped (it's the baseline)
FEATURE_COLS = [
    'area_sqft', 'bedrooms', 'baths', 'location_encoded',
    'city_Islamabad', 'city_Karachi', 'city_Lahore', 'city_Rawalpindi',
    'property_type_Flat', 'property_type_House', 'property_type_Lower Portion',
    'property_type_Penthouse', 'property_type_Room', 'property_type_Upper Portion'
]

# Location mean encoding values from training
# These are the log1p(price) means per location from your training data

LOCATION_MEAN_ENCODING = {
    "DHA":                15.8,
    "Gulberg":            15.7,
    "Bahria Town":        15.6,
    "Model Town":         15.7,
    "Johar Town":         15.5,
    "Cantt":              15.8,
    "Iqbal Town":         15.4,
    "Wapda Town":         15.5,
    "F-6":                16.0,
    "F-7":                15.9,
    "F-8":                15.9,
    "F-10":               15.7,
    "F-11":               15.7,
    "G-9":                15.4,
    "G-10":               15.5,
    "G-11":               15.5,
    "Satellite Town":     15.3,
    "Gulraiz":            15.2,
    "Chaklala Scheme":    15.3,
    "Peoples Colony":     15.2,
    "Canal Road":         15.1,
    "North Nazimabad":    15.3,
    "Nazimabad":          15.2,
    "PECHS":              15.5,
    "Clifton":            15.8,
    "Scheme 33":          15.2,
    "Hayatabad":          15.3,
    "University Town":    15.5,
    "Bani Gala":          15.6,
    "DHA Defence":        15.8,
    "E-11":               15.8,
    "G-15":               15.5,
}

# Global fallback mean (approx log1p of 10M PKR)
DEFAULT_LOCATION_MEAN = 15.5

CITIES = ['Islamabad', 'Karachi', 'Lahore', 'Rawalpindi']
PROPERTY_TYPES = ['Flat', 'House', 'Lower Portion', 'Penthouse', 'Room', 'Upper Portion']

class HouseData(BaseModel):
    city: str
    location: str
    bedrooms: int
    baths: int
    area_sqft: float
    property_type: str

@app.get("/")
def home():
    return {"message": "PakEstate AI Backend Running"}

@app.post("/predict")
def predict(data: HouseData):

    # 1. Mean encode location (same as training)
    location_encoded = LOCATION_MEAN_ENCODING.get(data.location, DEFAULT_LOCATION_MEAN)

    # 2. One-hot encode city (drop_first=True means Islamabad is baseline = all zeros)
    city_cols = {f"city_{c}": int(data.city == c) for c in CITIES}

    # 3. One-hot encode property_type (drop_first=True means Flat is baseline = all zeros)
    pt_cols = {f"property_type_{p}": int(data.property_type == p) for p in PROPERTY_TYPES}

    # 4. Build DataFrame in exact column order
    row = {
        "area_sqft":        data.area_sqft,
        "bedrooms":         data.bedrooms,
        "baths":            data.baths,
        "location_encoded": location_encoded,
        **city_cols,
        **pt_cols,
    }

    input_df = pd.DataFrame([row])[FEATURE_COLS]

    # 5. Scale
    transformed = scaler.transform(input_df)

    # 6. Predict — model was trained on np.log1p(price), so reverse with np.expm1()
    log_prediction = model.predict(transformed)[0]
    actual_price = np.expm1(log_prediction)

    return {
        "predicted_price": round(float(actual_price), 2)
    }