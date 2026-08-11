# 🥔 Potato Disease Classification — Deep Learning & MLOps

An end-to-end **Deep Learning application for potato leaf disease classification** using **TensorFlow CNN**, **FastAPI**, **React**, and **Docker**.

The system classifies potato leaves into three categories:

* 🌿 **Healthy**
* 🦠 **Early Blight**
* 🦠 **Late Blight**

The trained CNN model achieves approximately **98–99% accuracy** on the evaluation data.

The project goes beyond model training by integrating the model into a complete web application and deploying the application using modern cloud and containerization technologies.

---

## 🚀 Live Demo

**Frontend:**
[Add your Vercel URL here]
https://potato-disease-app-v1.vercel.app/


## 📌 Project Overview

Potato crops can be affected by diseases such as Early Blight and Late Blight, which can negatively impact crop production.

This project uses **Convolutional Neural Networks (CNNs)** to automatically classify potato leaf images into three categories.

The trained model is exposed through a **FastAPI REST API**, while a **React frontend** provides a user-friendly interface for uploading images and viewing predictions.

The application is containerized using **Docker** and deployed using cloud infrastructure.

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │  Upload Leaf Image   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │      (Vercel)        │
                    └──────────┬───────────┘
                               │
                         HTTP Request
                               │
                               ▼
                    ┌──────────────────────┐
                    │     FastAPI API      │
                    │      (Railway)       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ TensorFlow CNN Model  │
                    │                      │
                    │ Image Preprocessing  │
                    │        ↓             │
                    │ CNN Inference        │
                    │        ↓             │
                    │ Disease Prediction   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Prediction +          │
                    │ Confidence Score      │
                    └──────────────────────┘
```

---

## 🧠 Model

The classification model is based on a **Convolutional Neural Network (CNN)** implemented using **TensorFlow/Keras**.

### Classes

| Class        | Description                          |
| ------------ | ------------------------------------ |
| Healthy      | Healthy potato leaf                  |
| Early Blight | Potato leaf affected by Early Blight |
| Late Blight  | Potato leaf affected by Late Blight  |

### Model Pipeline

```text
Input Image
     ↓
Image Resizing
     ↓
Normalization
     ↓
CNN
     ↓
Feature Extraction
     ↓
Classification Layers
     ↓
Softmax
     ↓
Disease Prediction
```

---

## 📊 Model Performance

The model achieved approximately:

**98–99% accuracy**

Evaluation metrics can be added here:

| Metric    |     Score |
| --------- | --------: |
| Accuracy  |   ~98–99% |


### Example Prediction

```text
Input:
Potato leaf image

Prediction:
Early Blight

Confidence:
98.7%
```

---

## 🛠️ Tech Stack

### Deep Learning

* Python
* TensorFlow
* Keras
* CNN
* NumPy
* OpenCV / PIL

### Backend

* FastAPI
* Python
* REST API
* Uvicorn

### Frontend

* React
* JavaScript
* HTML
* CSS

### MLOps / Deployment

* Docker
* Docker Container
* AWS EC2
* Railway
* Vercel

### Development

* Git
* GitHub

---

## 📁 Project Structure

```text
potato-disease-classification/
│
├── api/
│   ├── main.py
│   
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Model/
│   └── model.ipynb
│
├── assets/
│   ├── screenshots/
│
├── Dockerfile
└── README.md
```



# ⚙️ How It Works

## 1. Image Upload

The user selects a potato leaf image from the React frontend.

## 2. API Request

The frontend sends the image to the FastAPI backend.

```text
React → HTTP POST → FastAPI
```

## 3. Image Preprocessing

The backend preprocesses the image before sending it to the model.

Typical preprocessing includes:

* Image resizing
* Pixel normalization
* Tensor conversion
* Batch dimension creation

## 4. CNN Prediction

The processed image is passed to the trained TensorFlow model.

The model outputs probabilities for the three classes.

Example:

```text
Healthy       → 0.02
Early Blight  → 0.96
Late Blight   → 0.02
```

The class with the highest probability becomes the final prediction.

## 5. API Response

FastAPI returns the prediction and confidence score to the React application.

## 6. Result Display

The frontend displays the predicted disease and confidence to the user.

---

# 🐳 Docker

The backend application is containerized using Docker.

Example Docker workflow:

```bash
docker build -t potato-disease-api .
```

Run the container:

```bash
docker run -p 8000:8000 potato-disease-api
```

The API can then be accessed locally through:

```text
http://localhost:8000
```

---

# ☁️ Deployment

The project uses multiple deployment services for different components.

### Frontend

The React frontend is deployed using:

**Vercel**

```text
React Application
       ↓
     Vercel
```

### Backend

The FastAPI backend is deployed using:

**Railway**

```text
FastAPI + Docker
       ↓
    Railway
```

### Cloud / MLOps

The Dockerized application was also deployed and tested using:

**AWS EC2**

```text
Docker Container
       ↓
     AWS EC2
       ↓
 FastAPI Application
```

This allowed the project to be deployed as a containerized ML application rather than running the model only inside a notebook.

---

# 🔌 API

### Prediction Endpoint

```http
POST /predict
```

The endpoint accepts an image and returns the predicted potato leaf disease.

Example response:

```json
{
  "prediction": "Early Blight",
  "confidence": 0.987
}
```

### API Documentation

FastAPI automatically provides interactive API documentation.

```text
/docs
```

Example:

```text
http://localhost:8000/docs
```

---

# 💻 Run Locally

## Clone Repository

```bash
git clone https://github.com/taimourkhokhar/aiml-projects.git

---

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The React application will normally be available at:

```text
http://localhost:5173
```

---

# 🐳 Run Using Docker

Build the backend image:

```bash
docker build -t potato-disease-api .
```

Run:

```bash
docker run -p 8000:8000 potato-disease-api
```

Then open:

```text
http://localhost:8000/docs
```

---

# 🔮 Future Improvements

Possible improvements include:

* Add Grad-CAM visualizations to explain CNN predictions
* Improve robustness using additional datasets
* Add more crop diseases
* Add model versioning
* Add automated CI/CD pipeline
* Add monitoring for model/API performance
* Add automated model retraining
* Add cloud object storage for uploaded images
* Add authentication and user accounts
* Add prediction history

---

# 🎯 Key Learning Outcomes

Through this project, I worked on:

* Image classification using CNNs
* TensorFlow/Keras model development
* Image preprocessing
* Model evaluation
* REST API development with FastAPI
* React frontend integration
* Connecting ML models with web applications
* Docker containerization
* Cloud deployment
* AWS EC2
* Railway deployment
* Vercel deployment
* Git/GitHub
* End-to-end ML application development

---

# 👨‍💻 Author

**Taimour Iftikhar**

Software Engineering Student | AI/ML | Full-Stack Development | MLOps

---

## ⭐ If you found this project interesting

Feel free to star ⭐ the repository and explore the project.
