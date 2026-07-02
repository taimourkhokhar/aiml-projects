# 🚀 Customer Churn Prediction

Predict whether a telecom customer is likely to churn using Machine Learning.

This is an end-to-end Machine Learning project that covers the complete workflow—from data preprocessing and model training to deployment using FastAPI and React.

---

## 🌐 Live Demo

https://aiml-projects-d9nk.vercel.app/

---

## 📌 Project Overview

Customer churn is one of the biggest challenges faced by subscription-based businesses. Losing existing customers is often more expensive than acquiring new ones.

This project predicts whether a customer is likely to leave a telecom company based on customer demographics, account information, and subscribed services.

The project follows the complete Machine Learning lifecycle:

* Data Cleaning
* Exploratory Data Analysis (EDA)
* Feature Engineering
* Data Preprocessing
* Model Training
* Model Evaluation
* Model Selection
* Model Deployment
* Frontend Integration

---

## ✨ Features

* 📊 Clean and responsive React interface
* ⚡ Real-time churn prediction
* 🤖 Machine Learning model served with FastAPI
* 📈 Confidence score for predictions
* 🔍 Interactive API documentation using Swagger
* 🌐 Fully deployable frontend and backend

---

## 🛠️ Tech Stack

### Frontend

* React
* CSS

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib / Pickle

### Deployment

* Vercel
* Railway

---

## 📂 Machine Learning Workflow

Dataset

⬇️

Data Cleaning

⬇️

Exploratory Data Analysis

⬇️

Feature Engineering

⬇️

Encoding & Scaling

⬇️

Train-Test Split

⬇️

Model Training

⬇️

Model Evaluation

⬇️

Best Model Selection

⬇️

Model Serialization

⬇️

FastAPI Backend

⬇️

React Frontend

⬇️

Deployment

---

## 📈 Models Compared

| Model               | Accuracy | Precision | Recall | F1-Score |
| ------------------- | -------: | --------: | -----: | -------: |
| Logistic Regression |   0.82% |     0.86 |  0.90|    0.88  |
| Random Forest       |   0.81% |     0.84 |  0.92 |    0.88 |
| XGBoost             |   0.81% |     0.85 |  0.91 |    0.88|

> Replace the values above with your actual evaluation results.

---

## 🏆 Final Model

After comparing multiple algorithms, **Logistic Regression** was selected as the production model because it provided the best overall balance of:

* Accuracy
* Precision
* Recall
* F1-Score
* ROC-AUC Score

making it the most reliable model for this dataset.

---

## 📸 Project Preview

### Home Page
![alt text](image-1.png)

---

### Prediction Form

![alt text](image-2.png)
---


### Confusion Matrix

![alt text](image-4.png)
---

## 📁 Project Structure

```text
Customer-Churn-Prediction/

├── backend/
│   ├── app.py
│   ├── customer_churn_prediction.pkl
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── notebook/
│   └── model.ipynb
│
├── screenshots/
│
├── README.md
│
└── LICENSE
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/taimourkhokhar/aiml-projects.git
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 📬 API Endpoint

### POST /predict

Example Request

```json
{
    "gender": "Female",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "...": "..."
}
```

Example Response

```json
{
    "prediction": "No Churn"
}
```

---

## 🚀 Future Improvements

* Docker support
* CI/CD pipeline
* User authentication
* Prediction history
* Explainable AI (SHAP)
* Cloud database integration

---

## 👨‍💻 Author

**Taimour Iftikhar**

AI/ML Engineer

If you found this project useful, consider giving it a ⭐ on GitHub.
