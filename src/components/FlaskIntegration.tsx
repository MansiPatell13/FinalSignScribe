
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FlaskIntegration: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Flask Backend Integration</h2>
          <p className="text-muted-foreground text-lg">
            SignScribe connects to a Flask backend that handles authentication and model inference.
            Below are instructions for setting up your Flask API.
          </p>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Flask API Integration Guide</CardTitle>
            <CardDescription>
              A step-by-step guide to setting up the Flask backend for SignScribe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="setup">
              <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-6">
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
                <TabsTrigger value="model">Model Integration</TabsTrigger>
                <TabsTrigger value="api">API Endpoints</TabsTrigger>
              </TabsList>
              
              <TabsContent value="setup" className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-3">1. Environment Setup</h3>
                <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`# Install required packages
pip install flask flask-cors flask-jwt-extended tensorflow mediapipe

# Basic project structure
/flask_backend
  /app
    /__init__.py
    /auth.py
    /models.py
    /routes.py
  /model
    /lstm_model.h5
  config.py
  run.py`}
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">2. Basic Flask App Setup</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`# app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    JWTManager(app)
    
    # Register blueprints
    from app.auth import auth_bp
    from app.routes import main_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(main_bp, url_prefix='/api')
    
    return app`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="auth" className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-3">JWT Authentication</h3>
                <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`# app/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    new_user = User(
        name=data['name'],
        email=data['email']
    )
    new_user.set_password(data['password'])
    
    # Save user to database
    db.session.add(new_user)
    db.session.commit()
    
    # Generate token
    token = create_access_token(
        identity=new_user.id,
        expires_delta=datetime.timedelta(days=30)
    )
    
    return jsonify({
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        },
        'token': token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Check password
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate token
    token = create_access_token(
        identity=user.id,
        expires_delta=datetime.timedelta(days=30)
    )
    
    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        },
        'token': token
    }), 200

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="model" className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-3">LSTM Model Integration</h3>
                <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`# app/models.py
import tensorflow as tf
import numpy as np
import mediapipe as mp

class SignLanguageModel:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
        self.mp_hands = mp.solutions.hands
        
    def preprocess_landmarks(self, landmarks):
        # Convert the landmarks to the format expected by the model
        # This will depend on how your model was trained
        # Example:
        flattened = []
        for hand_landmarks in landmarks:
            for point in hand_landmarks:
                flattened.extend([point.x, point.y, point.z])
        
        # Normalize and reshape according to your model's input shape
        processed = np.array(flattened).reshape(1, -1)
        return processed
        
    def predict(self, landmarks):
        # Preprocess the landmarks
        processed_input = self.preprocess_landmarks(landmarks)
        
        # Make prediction
        prediction = self.model.predict(processed_input)
        
        # Get the predicted class
        predicted_class = np.argmax(prediction, axis=1)[0]
        
        # Map class index to text (replace with your actual class mappings)
        class_mappings = {
            0: "Hello",
            1: "Thank you",
            2: "How are you",
            # Add more mappings based on your training data
        }
        
        return class_mappings.get(predicted_class, "Unknown gesture")`}
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Model Initialization</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`# In your Flask app
from app.models import SignLanguageModel

# Initialize the model when the app starts
model = SignLanguageModel('model/lstm_model.h5')

# Use in a route
@app.route('/api/translate', methods=['POST'])
@jwt_required()
def translate():
    landmarks = request.json.get('landmarks')
    result = model.predict(landmarks)
    return jsonify({'text': result})`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="api" className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-3">API Endpoints Reference</h3>
                
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Endpoint</th>
                      <th className="border p-2 text-left">Method</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-left">Auth Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">/api/auth/signup</td>
                      <td className="border p-2">POST</td>
                      <td className="border p-2">Register a new user</td>
                      <td className="border p-2">No</td>
                    </tr>
                    <tr>
                      <td className="border p-2">/api/auth/login</td>
                      <td className="border p-2">POST</td>
                      <td className="border p-2">Authenticate a user</td>
                      <td className="border p-2">No</td>
                    </tr>
                    <tr>
                      <td className="border p-2">/api/auth/user</td>
                      <td className="border p-2">GET</td>
                      <td className="border p-2">Get current user info</td>
                      <td className="border p-2">Yes</td>
                    </tr>
                    <tr>
                      <td className="border p-2">/api/translate</td>
                      <td className="border p-2">POST</td>
                      <td className="border p-2">Translate sign language</td>
                      <td className="border p-2">Yes</td>
                    </tr>
                    <tr>
                      <td className="border p-2">/api/user/profile</td>
                      <td className="border p-2">GET</td>
                      <td className="border p-2">Get user profile</td>
                      <td className="border p-2">Yes</td>
                    </tr>
                    <tr>
                      <td className="border p-2">/api/user/profile</td>
                      <td className="border p-2">PUT</td>
                      <td className="border p-2">Update user profile</td>
                      <td className="border p-2">Yes</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3 className="text-lg font-semibold mb-3">Example API Requests & Responses</h3>
                
                <h4 className="font-medium mt-4 mb-2">Translation Request:</h4>
                <div className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`// POST /api/translate
// Headers: Authorization: Bearer <jwt_token>

{
  "landmarks": [
    // Array of hand landmarks from MediaPipe
    // Format will depend on your model's input requirements
    {
      "x": 0.1,
      "y": 0.5,
      "z": 0.0
    },
    // More landmarks...
  ]
}`}
                    </code>
                  </pre>
                </div>
                
                <h4 className="font-medium mt-4 mb-2">Translation Response:</h4>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`{
  "text": "Hello"
}`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FlaskIntegration;
