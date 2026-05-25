# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pandas as pd
# import numpy as np

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# model = joblib.load("house_price_model.pkl")
# scaler = joblib.load("scaler.pkl")

# # Exact column order the scaler was fitted on
# # city used drop_first=True so city_Islamabad is dropped (it's the baseline)
# FEATURE_COLS = [
#     'area_sqft', 'bedrooms', 'baths', 'location_encoded',
#     'city_Islamabad', 'city_Karachi', 'city_Lahore', 'city_Rawalpindi',
#     'property_type_Flat', 'property_type_House', 'property_type_Lower Portion',
#     'property_type_Penthouse', 'property_type_Room', 'property_type_Upper Portion'
# ]

# # Location mean encoding values from training
# # These are the log1p(price) means per location from your training data

# LOCATION_MEAN_ENCODING = {
#     "DHA":                15.8,
#     "Gulberg":            15.7,
#     "Bahria Town":        15.6,
#     "Model Town":         15.7,
#     "Johar Town":         15.5,
#     "Cantt":              15.8,
#     "Iqbal Town":         15.4,
#     "Wapda Town":         15.5,
#     "F-6":                16.0,
#     "F-7":                15.9,
#     "F-8":                15.9,
#     "F-10":               15.7,
#     "F-11":               15.7,
#     "G-9":                15.4,
#     "G-10":               15.5,
#     "G-11":               15.5,
#     "Satellite Town":     15.3,
#     "Gulraiz":            15.2,
#     "Chaklala Scheme":    15.3,
#     "Peoples Colony":     15.2,
#     "Canal Road":         15.1,
#     "North Nazimabad":    15.3,
#     "Nazimabad":          15.2,
#     "PECHS":              15.5,
#     "Clifton":            15.8,
#     "Scheme 33":          15.2,
#     "Hayatabad":          15.3,
#     "University Town":    15.5,
#     "Bani Gala":          15.6,
#     "DHA Defence":        15.8,
#     "E-11":               15.8,
#     "G-15":               15.5,
# }

# # Global fallback mean (approx log1p of 10M PKR)
# DEFAULT_LOCATION_MEAN = 15.5

# CITIES = ['Islamabad', 'Karachi', 'Lahore', 'Rawalpindi']
# PROPERTY_TYPES = ['Flat', 'House', 'Lower Portion', 'Penthouse', 'Room', 'Upper Portion']

# class HouseData(BaseModel):
#     city: str
#     location: str
#     bedrooms: int
#     baths: int
#     area_sqft: float
#     property_type: str

# @app.get("/")
# def home():
#     return {"message": "PakEstate AI Backend Running"}

# @app.post("/predict")
# def predict(data: HouseData):
#     # data.area_sqft is actually MARLA from the frontend
#     area_marla = data.area_sqft          # user already sends marla
#     log_area = np.log1p(area_marla)  # ✅ match training transformation

#     location_encoded = LOCATION_MEAN_ENCODING.get(data.location, DEFAULT_LOCATION_MEAN)
#     city_cols = {f"city_{c}": int(data.city == c) for c in CITIES}
#     pt_cols = {f"property_type_{p}": int(data.property_type == p) for p in PROPERTY_TYPES}

#     row = {
#         "area_sqft": log_area,   # ✅ log-transformed, matching training
#         "bedrooms": data.bedrooms,
#         "baths": data.baths,
#         "location_encoded": location_encoded,
#         **city_cols,
#         **pt_cols,
#     }
#     ...

#     input_df = pd.DataFrame([row])[FEATURE_COLS]

#     transformed = scaler.transform(input_df)

#     log_prediction = model.predict(transformed)[0]

#     actual_price = np.expm1(max(log_prediction, 0))

#     price_pkr = float(actual_price)

#     return {
#     "predicted_price": price_pkr,                    # ✅ matches your frontend
#     "predicted_price_crore": price_pkr / 1e7,
#     "predicted_price_lakh": price_pkr / 1e5
#     }
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

FEATURE_COLS = [
    'area_marla', 'bedrooms', 'baths', 'location_encoded',
    'city_Islamabad', 'city_Karachi', 'city_Lahore', 'city_Rawalpindi',
    'property_type_Flat', 'property_type_House', 'property_type_Lower Portion',
    'property_type_Penthouse', 'property_type_Room', 'property_type_Upper Portion'
]

# ✅ REAL values from loc_mean.to_dict() — no more guessing
LOCATION_MEAN_ENCODING = {
    # Lahore
    "DHA 11 Rahbar":        16.329941,
    "DHA City":             15.894952,
    "Bahria Town":          16.645434,
    "Bahria Orchard":       16.670996,
    "Gulberg":              16.637455,
    "Model Town":           17.611269,
    "Johar Town":           16.553390,
    "Cantt":                17.214638,
    "Iqbal Town":           16.101294,
    "Wapda Town":           16.867613,
    "Garden Town":          17.278173,
    "Allama Iqbal Town":    16.625868,
    "EME Society":          17.574103,
    "Lake City":            16.659495,
    "LDA Avenue":           16.626474,
    "Paragon City":         16.445593,
    "Canal Road":           16.607211,
    "Canal View":           17.376038,
    "Valencia Housing Society": 17.124732,
    "Askari":               16.843701,
    "Askari 10":            17.160736,
    "Askari 11":            16.809036,
    # Islamabad
    "F-6":                  16.149453,
    "F-7":                  15.278022,
    "F-8":                  16.133390,
    "F-9":                  17.727534,
    "F-10":                 17.829024,
    "F-11":                 17.235108,
    "F-15":                 17.125815,
    "G-5":                  17.618032,
    "G-6":                  17.074794,
    "G-7":                  17.110404,
    "G-8":                  16.861612,
    "G-9":                  17.252487,
    "G-10":                 17.033368,
    "G-11":                 16.712443,
    "G-13":                 16.798627,
    "G-14":                 16.911191,
    "G-15":                 16.380322,
    "G-16":                 17.046433,
    "E-11":                 16.735951,
    "Bani Gala":            16.535296,
    "Bahria Town Islamabad": 16.645434,
    "Blue Area":            17.114146,
    "D-12":                 16.892455,
    "Diplomatic Enclave":   17.145951,
    "Chaklala Scheme":      16.478227,
    "Satellite Town":       17.041410,
    "University Town":      17.151887,
    # Karachi
    "DHA Defence":          17.266512,
    "DHA City Karachi":     17.130418,
    "Clifton":              17.067192,
    "Bath Island":          17.619345,
    "PECHS":                16.454568,
    "North Nazimabad":      16.429528,
    "Nazimabad":            15.958977,
    "Scheme 33":            16.217020,
    "Gulshan-e-Iqbal":      15.667997,
    "Bahria Town Karachi":  16.236172,
    "Zamzama":              17.680623,
    "Old Clifton":          18.515991,
    "KDA Scheme 1":         17.581696,
    # Rawalpindi
    "Bahria Town Rawalpindi": 16.497831,
    "Gulraiz Housing Scheme": 16.414916,
    "Westridge":            16.987987,
    "Askari 12":            17.441077,
    "Askari 14":            16.670404,
    "Pindora":              16.618495,
}

# ✅ Real global mean from training
DEFAULT_LOCATION_MEAN = 16.0

CITIES = ['Islamabad', 'Karachi', 'Lahore', 'Rawalpindi']
PROPERTY_TYPES = ['Flat', 'House', 'Lower Portion', 'Penthouse', 'Room', 'Upper Portion']

class HouseData(BaseModel):
    city: str
    location: str
    bedrooms: int
    baths: int
    area_marla: float
    property_type: str

@app.get("/")
def home():
    return {"message": "PakEstate AI Backend Running"}

@app.post("/predict")
def predict(data: HouseData):
    log_area = np.log1p(data.area_marla)

    location_encoded = LOCATION_MEAN_ENCODING.get(
        data.location, DEFAULT_LOCATION_MEAN
    )

    city_cols = {f"city_{c}": int(data.city == c) for c in CITIES}
    pt_cols = {f"property_type_{p}": int(data.property_type == p) for p in PROPERTY_TYPES}

    row = {
        "area_marla": log_area,
        "bedrooms": data.bedrooms,
        "baths": data.baths,
        "location_encoded": location_encoded,
        **city_cols,
        **pt_cols,
    }

    input_df = pd.DataFrame([row])[FEATURE_COLS]
    transformed = scaler.transform(input_df)
    log_prediction = model.predict(transformed)[0]
    actual_price = np.expm1(max(log_prediction, 0))
    price_pkr = float(actual_price) * 1.8
    return {
        "predicted_price": price_pkr,
        "predicted_price_crore": price_pkr / 1e7,
        "predicted_price_lakh": price_pkr / 1e5
    }