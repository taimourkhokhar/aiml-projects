# PakEstate AI 🏠

AI-powered real estate price prediction system for Pakistani properties using Machine Learning, FastAPI, and React.

---

# 🚀 Features

- House price prediction using Machine Learning
- React frontend UI
- FastAPI backend API
- Random Forest Regression model
- Property-based predictions
- Price output in PKR, Lakh, and Crore
- Location encoding & preprocessing pipeline

---

# 🧠 ML Journey

This project started with Linear Regression, but the model struggled because of:

- Non-linear housing prices
- Noisy real estate data
- Mixed area units (Marla, Kanal, Sqft)
- Missing values
- Inconsistent formatting

After debugging and experimentation, I switched to Random Forest Regression which improved the model significantly.

---

# 📊 Final Model Performance

| Metric | Score |
|---|---|
| Train R² Score | 0.92 |
| Test R² Score | 0.84 - 0.86 |

---

# ⚙️ Tech Stack

## Frontend
- React.js
- Tailwind CSS

## Backend
- FastAPI
- Pydantic
- Uvicorn

## Machine Learning
- Scikit-learn
- Random Forest Regressor
- Pandas
- NumPy

---

# 🧹 Data Challenges Solved

Some major issues solved during development:

- Mixed area units (Kanal, Marla, Sqft)
- Noisy and inconsistent records
- Feature scaling mismatches
- Unrealistic predictions
- Area normalization problems

---

# 📁 Project Structure

```bash
PakEstate-AI/
│
├── backend/
├── frontend/
├── notebook/
├── dataset/
├── screenshots/
└── README.md
```

---

# ▶️ Run Backend

```bash
cd backend
uvicorn app:app --reload
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

# ▶️ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔮 Future Improvements

- XGBoost integration
- Better location embeddings
- Cloud deployment
- Docker support
- Advanced analytics dashboard

---

# 👨‍💻 Author

Built by Taimour Iftikhar