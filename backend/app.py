from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from typing import List, Dict
import logging
import os

# Configure logging with INFO level to track application events
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    """
    Application configuration class containing model settings and constants.
    
    Attributes:
        CLASSIFICATION_MODEL (str): The pre-trained model path/name for zero-shot classification
        TOPIC_CATEGORIES (list): Default list of topics for classification
        MINIMUM_CONFIDENCE_THRESHOLD (float): Minimum confidence score to consider a topic relevant
    """
    CLASSIFICATION_MODEL = os.getenv('MODEL_NAME', 'facebook/bart-large-mnli')
    TOPIC_CATEGORIES = [
        "technology", "finance", "healthcare", 
        "education", "marketing", "research",
        "environment", "sports", "entertainment",
        "politics", "science"
    ]
    MINIMUM_CONFIDENCE_THRESHOLD = 0.1

# Initialize Flask app
def create_app():
    """
    Creates and configures the Flask application instance.
    
    Returns:
        Flask: Configured Flask application with CORS and loaded ML model
    
    Raises:
        Exception: If model loading fails
    """
    flask_app = Flask(__name__)
    # Enable Cross-Origin Resource Sharing for API accessibility
    CORS(flask_app)
    
    # Initialize the zero-shot classification model
    try:
        flask_app.topic_classifier = pipeline("zero-shot-classification", model=Config.CLASSIFICATION_MODEL)
        logger.info(f"Model {Config.CLASSIFICATION_MODEL} loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise

    return flask_app

app = create_app()

def is_valid_input(input_text: str) -> bool:
    """
    Validates if the provided text input is meaningful and non-empty.
    
    Args:
        input_text (str): The text to validate
    
    Returns:
        bool: True if input is valid, False otherwise
    """
    return bool(input_text and input_text.strip())

def classify_text_topics(input_text: str, topic_list: List[str]) -> List[Dict]:
    """
    Classifies input text into relevant topics using zero-shot classification.
    
    Args:
        input_text (str): The text to classify
        topic_list (List[str]): List of potential topics for classification
    
    Returns:
        List[Dict]: List of dictionaries containing topics and their confidence scores,
                   sorted by confidence in descending order
    
    Example return value:
        [
            {"topic": "technology", "confidence_score": 0.875},
            {"topic": "science", "confidence_score": 0.654}
        ]
    """
    # Perform zero-shot classification on the input text
    classification_result = app.topic_classifier(input_text, topic_list, multi_label=True)
    
    # Filter and format results above the confidence threshold
    relevant_topics = [
        {
            "topic": label,
            "confidence_score": round(score, 3)
        }
        for label, score in zip(classification_result["labels"], classification_result["scores"])
        if score >= Config.MINIMUM_CONFIDENCE_THRESHOLD
    ]
    
    return sorted(relevant_topics, key=lambda x: x["confidence_score"], reverse=True)

@app.route('/extract_keywords', methods=['POST'])
def extract_keywords():
    """
    API endpoint for topic extraction from provided text.
    """
    try:
        # Add request logging
        logger.info(f"Received request with data: {request.get_json()}")
        
        # Parse and validate request data
        request_data = request.get_json()
        if not request_data:
            logger.warning("No JSON data provided in request")
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract and validate input text
        input_text = request_data.get("text", "").strip()
        if not is_valid_input(input_text):
            logger.warning(f"Invalid input text received: {input_text}")
            return jsonify({"error": "No valid text provided"}), 400

        # Get custom topics list or use default categories
        topic_list = request_data.get("labels", Config.TOPIC_CATEGORIES)
        
        # Log classification attempt
        logger.info(f"Attempting classification for text: {input_text[:100]}...")
        
        # Perform topic classification
        classified_topics = classify_text_topics(input_text, topic_list)
        
        # Log successful classification
        logger.info(f"Classification successful. Found {len(classified_topics)} relevant topics")
        
        return jsonify({
            "topics": classified_topics,
            "status": "success"
        })

    except Exception as error:
        # Log any unexpected errors and return error response
        logger.error(f"Error processing request: {str(error)}", exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "details": str(error)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
