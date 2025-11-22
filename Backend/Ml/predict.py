import os
import sys
import json
import numpy as np
import cv2
import warnings

# Suppress all warnings including protobuf warnings
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['PYTHONWARNINGS'] = 'ignore'

import tensorflow as tf
from tensorflow import keras
import pickle

# Suppress TensorFlow warnings and progress bars
tf.get_logger().setLevel('ERROR')
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

# Define constants
IMAGE_SIZE = (64, 64)

def load_model_and_preprocessing_data():
    model_path = os.path.join(os.path.dirname(__file__), 'dfu_model.h5')
    preprocessing_path = os.path.join(os.path.dirname(__file__), 'preprocessing.pkl')

    if not os.path.exists(model_path):
        return None, None, None, {'error': 'Model file not found'}
    if not os.path.exists(preprocessing_path):
        return None, None, None, {'error': 'Preprocessing file not found'}

    model = keras.models.load_model(model_path, compile=False)

    with open(preprocessing_path, 'rb') as f:
        preprocessing_data = pickle.load(f)
        csv_mean = preprocessing_data['csv_mean']
        scaler = preprocessing_data['scaler']
    
    return model, csv_mean, scaler, None

def predict(image_path, model, csv_mean, scaler):
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return {'error': 'Image not found or could not be read'}

        img = cv2.resize(img, IMAGE_SIZE)
        img_features = img.flatten() / 255.0
        img_features = img_features.reshape(1, -1)

        # Create CSV features using the same approach as original saas.py
        csv_features = np.full((IMAGE_SIZE[0] * IMAGE_SIZE[1],), csv_mean if csv_mean is not None else 0)
        if scaler is not None:
            csv_features = scaler.transform(csv_features.reshape(-1, 1)).flatten()
        csv_features = csv_features.reshape(1, -1)

        prediction = model.predict([img_features, csv_features], verbose=0)[0][0]
        return {'prediction': float(prediction) * 100}
    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Please provide an image file path'}))
        sys.exit(1)

    image_file_path = sys.argv[1]

    model, csv_mean, scaler, error = load_model_and_preprocessing_data()

    if error:
        print(json.dumps(error))
        sys.exit(1)

    result = predict(image_file_path, model, csv_mean, scaler)
    print(json.dumps(result))
