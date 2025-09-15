import os
import io
import numpy as np
import pandas as pd
import cv2
import tensorflow as tf
from tensorflow import keras
import pickle
import streamlit as st
from PIL import Image

# Load trained model
model = keras.models.load_model("dfu_model.h5")

# Load preprocessing data
with open("preprocessing.pkl", "rb") as f:
    preprocessing_data = pickle.load(f)
    csv_mean = preprocessing_data["csv_mean"]
    scaler = preprocessing_data["scaler"]

# Define constants
image_size = (64, 64)
csv_size = (64, 64)

def load_image_from_upload(uploaded_file):
    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, image_size)
    img = img.flatten() / 255.0
    return img

def load_csv(filepath):
    df = pd.read_csv(filepath, header=None)
    df = df.to_numpy()
    df = cv2.resize(df, csv_size)
    df = df.flatten()
    df = scaler.fit_transform(df.reshape(-1, 1)).flatten()
    return df

def predict_dfu(image_file):
    # Reset file pointer before processing
    image_file.seek(0)
    img_features = load_image_from_upload(image_file)
    img_features = img_features.reshape(1, -1)
    csv_features = np.full((64*64,), csv_mean if csv_mean is not None else 0).reshape(1, -1)
    prediction = model.predict([img_features, csv_features])[0][0]
    return prediction * 100

def resize_image(uploaded_file, fixed_width=300):
    # Read the image bytes and open with Pillow
    image = Image.open(io.BytesIO(uploaded_file.read()))
    # Reset file pointer after reading for further processing
    uploaded_file.seek(0)
    
    # Calculate the new height maintaining aspect ratio
    original_width, original_height = image.size
    fixed_height = int((fixed_width / original_width) * original_height)
    
    # Resize the image
    resized_image = image.resize((fixed_width, fixed_height))
    return resized_image

# Streamlit UI
st.set_page_config(page_title="DFU Prediction", page_icon="🩺", layout="centered")
st.title("🔬 Diabetic Foot Ulcer Prediction")
st.markdown("### Upload an image to analyze the probability of having DFU.")
st.write("Our AI model will evaluate the uploaded image and provide a probability score.")

st.markdown("---")
st.markdown("## 📤 Upload Image")

uploaded_file = st.file_uploader("Choose a PNG image", type=["png"], help="Upload a grayscale foot image.")

if uploaded_file is not None:
    # Create two columns for parallel display of image and prediction result
    col1, col2 = st.columns(2)
    
    with col1:
        # Resize the image to a fixed width while maintaining aspect ratio
        resized_image = resize_image(uploaded_file, fixed_width=300)
        st.image(resized_image, caption="🖼️ Uploaded Image")
    
    with col2:
        # Predict DFU probability. Reset file pointer for prediction function
        probability = predict_dfu(uploaded_file)
        st.markdown("## 📊 Prediction Result")
        st.success(f"🔍 Probability of having DFU: **{probability:.2f}%**")
        if probability > 50:
            st.warning("⚠️ High risk detected! Consult a medical professional.")
        else:
            st.info("✅ Low risk detected. Maintain good foot care.")
    
    # Optional disclaimer (can be uncommented if needed)
    # st.markdown("---")
    # st.markdown("### ℹ️ Disclaimer: This tool is for informational purposes only and should not be considered medical advice.")
