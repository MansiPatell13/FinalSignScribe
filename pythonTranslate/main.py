import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import tensorflow as tf
import mediapipe as mp
import base64
from io import BytesIO
from PIL import Image
import json
from collections import deque

# Initialize FastAPI app
app = FastAPI()

# --- CORS Configuration ---
# Temporarily disable CORSMiddleware for debugging
# origins = [
#     "http://localhost",
#     "http://localhost:5173",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "OPTIONS"],
#     allow_headers=["*"],
# )

# --- Global Variables (Load Model and Setup Mediapipe here) ---
MODEL_PATH = 'TheLastDance.h5' # Corrected MODEL_PATH: Relative to main.py location
LABEL_MAP = {0: 'Alright', 1: 'Hello', 2: 'Indian', 3: 'Namaste', 4: 'Sign'}
ACTIONS = np.array(['Alright', 'Hello', 'Indian', 'Namaste', 'Sign']) # Match LABEL_MAP keys to array index
SEQUENCE_LENGTH = 30 # Expected sequence length for LSTM
PREDICTION_THRESHOLD = 0.6 # Minimum confidence threshold

# Placeholder for loaded model
model = None
# Placeholder for Mediapipe Holistic instance
mp_holistic = None

# Use deque for efficient appending and popping from both ends
sequence = deque(maxlen=SEQUENCE_LENGTH)

# --- Helper Functions (Mediapipe detection, keypoint extraction, etc.) ---
def mediapipe_detection(image, holistic_model):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
    image_rgb.flags.writeable = False                  # Mark image as not writeable
    results = holistic_model.process(image_rgb)         # Make prediction
    image_rgb.flags.writeable = True                   # Mark image as writeable
    # image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR) # Convert back if needed for drawing, not needed for API
    return results

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() \
        if results.pose_landmarks else np.zeros(33 * 4)
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() \
        if results.face_landmarks else np.zeros(468 * 3)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() \
        if results.left_hand_landmarks else np.zeros(21 * 3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() \
        if results.right_hand_landmarks else np.zeros(21 * 3)
    return np.concatenate([pose, face, lh, rh])

# --- API Endpoints ---
@app.on_event("startup")
async def startup_event():
    """Load the model and initialize Mediapipe on server start."""
    global model, mp_holistic
    try:
        # Load the Keras model
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")

        # Initialize Mediapipe Holistic
        mp_holistic = mp.solutions.holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        print("Mediapipe Holistic initialized successfully.")

    except Exception as e:
        print(f"FATAL: Error during server startup: {e}")
        # Consider exiting or raising a specific error if model/mediapipe fails to load

# Manual OPTIONS handler with required headers
@app.options("/predict")
async def predict_options(request: Request):
    """Handles CORS preflight requests manually."""
    print("--- OPTIONS /predict endpoint hit (manual handling) ---")
    response = Response(status_code=200)
    # Manually add required CORS headers
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*") # Respond to specific origin
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = request.headers.get("Access-Control-Request-Headers", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.post("/predict")
async def predict(image_data: dict, request: Request): # Add Request to access headers
    """
    Receives image data, processes, predicts, and returns result with manual CORS header.
    """
    global sequence

    # Prepare headers for the actual response
    response_headers = {
        "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
        "Access-Control-Allow-Credentials": "true"
    }

    if not model or not mp_holistic:
        print("Error: Model or Mediapipe not initialized.")
        # Return JSON response with headers for errors too
        return Response(
            content=json.dumps({"status": "error", "prediction": None, "confidence": 0.0, "detail": "Model or Mediapipe not initialized"}),
            status_code=503,
            media_type="application/json",
            headers=response_headers
        )

    try:
        if "image" not in image_data or not image_data["image"].startswith("data:image"):
             # Return JSON response with headers for errors too
             return Response(
                 content=json.dumps({"status": "error", "prediction": None, "confidence": 0.0, "detail": "Invalid image data format"}),
                 status_code=400,
                 media_type="application/json",
                 headers=response_headers
             )

        # Decode the base64 image
        header, encoded = image_data["image"].split(",", 1)
        image_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(image_bytes, np.uint8)
        # Decode image using OpenCV
        frame_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame_bgr is None:
            return Response(
                content=json.dumps({"status": "error", "prediction": None, "confidence": 0.0, "detail": "Could not decode image data"}),
                status_code=400,
                media_type="application/json",
                headers=response_headers
            )

        # 1. Process frame with Mediapipe
        results = mediapipe_detection(frame_bgr, mp_holistic)

        # 2. Extract Keypoints
        keypoints = extract_keypoints(results)
        sequence.append(keypoints)

        prediction = None
        confidence = 0.0
        status = "collecting"

        # 3. Predict only when sequence is full
        if len(sequence) == SEQUENCE_LENGTH:
            input_data = np.expand_dims(list(sequence), axis=0)
            res = model.predict(input_data)[0]
            predicted_index = np.argmax(res)
            confidence = float(res[predicted_index]) # Convert numpy float to python float

            # Check threshold
            if confidence > PREDICTION_THRESHOLD:
                prediction = ACTIONS[predicted_index]
                status = "predicted"
            else:
                 status = "predicted" # We made a prediction, but it was below threshold
                 prediction = None # Or maybe return the low-confidence prediction?
                 print(f"Prediction below threshold: {ACTIONS[predicted_index]} ({confidence:.2f})")

            print(f"Prediction: {prediction}, Confidence: {confidence:.2f}, Status: {status}")

        else:
             print(f"Collecting frames... ({len(sequence)}/{SEQUENCE_LENGTH})")
             status = "collecting"

        # Return JSON response manually with headers
        return Response(
            content=json.dumps({"status": status, "prediction": prediction, "confidence": confidence}),
            status_code=200,
            media_type="application/json",
            headers=response_headers
        )

    except Exception as e:
        print(f"Error during prediction: {e}")
        import traceback
        traceback.print_exc()
        # Return JSON response manually with headers for errors too
        return Response(
            content=json.dumps({"status": "error", "prediction": None, "confidence": 0.0, "detail": f"Prediction failed: {str(e)}"}),
            status_code=500,
            media_type="application/json",
            headers=response_headers
        )


@app.get("/")
async def read_root():
    return {"message": "Sign Language Translator API is running."}

# --- Run the server (for local development) ---
if __name__ == "__main__":
    # To run: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
    # Ensure you are in the pythonTranslate directory or adjust MODEL_PATH
    print(f"Starting Uvicorn server for main:app on 0.0.0.0:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 