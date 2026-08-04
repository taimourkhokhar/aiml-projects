from fastapi import FastAPI,File,UploadFile
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests


app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (e.g., http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)


model_version = "1.0.0"
MODEL = tf.keras.models.load_model(
    f"../Model/potato_disease_model_v{model_version}.h5"
)
CLASS_NAMES=  ["Early Blight","Late Blight","Healthy"]

@app.get("/home")
async def ping():
  return "Hello , I am alive"


def read_file_as_image(data)->np.ndarray:
  image=np.array(Image.open(BytesIO(data)))
  return image

@app.post("/predict")
async def predict(file:UploadFile=File(...)):
  image=read_file_as_image(await file.read())
  img_batch=np.expand_dims(image,0)
  prediction=MODEL.predict(img_batch)


  predictions = MODEL.predict(img_batch)

  predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
  confidence = float(np.max(predictions[0]))

  return {"class": predicted_class, "confidence": confidence}


  
if __name__=="__main__":
  uvicorn.run(app,host='localhost',port =8000)