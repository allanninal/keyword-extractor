import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

/**
 * API endpoint for keyword extraction service
 * @constant {string}
 */
const API_URL = "http://127.0.0.1:5000/extract_keywords";

/**
 * Application-wide styles object
 * @constant {Object}
 */
const styles = {
  container: {
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#2c3e50"
  },
  title: {
    color: "#1a365d",
    marginBottom: "30px",
    fontSize: "2.5rem",
    fontWeight: "600"
  },
  textarea: {
    width: "100%",
    marginBottom: "20px",
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid #cbd5e0",
    fontSize: "16px",
    minHeight: "150px",
    transition: "border-color 0.3s ease",
    backgroundColor: "#ffffff",
    color: "#2d3748",
    "&:focus": {
      borderColor: "#3498db",
      outline: "none"
    }
  },
  button: {
    padding: "12px 24px",
    cursor: "pointer",
    backgroundColor: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#3182ce"
    },
    "&:disabled": {
      backgroundColor: "#a0aec0",
      cursor: "not-allowed"
    }
  },
  error: {
    color: "#e74c3c",
    marginTop: "15px",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#fdeaea"
  },
  keywordsList: {
    marginTop: "30px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  keywordItem: {
    marginBottom: "10px",
    padding: "8px 12px",
    backgroundColor: "#f7fafc",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#2d3748"
  },
  score: {
    backgroundColor: "#4299e1",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500"
  },
  extractedKeywordsTitle: {
    color: "#2d3748",
    marginBottom: "15px",
    fontSize: "1.25rem",
    fontWeight: "600"
  }
};

/**
 * Renders a single keyword item with its confidence score
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.topic - The extracted keyword/topic
 * @param {number} props.confidenceScore - Confidence score for the keyword (0-1)
 * @returns {JSX.Element} Rendered keyword item
 */
const KeywordItem = ({ topic, confidenceScore }) => (
  <li style={styles.keywordItem}>
    <span>{topic}</span>
    <span style={styles.score}>
      {(confidenceScore * 100).toFixed(1)}%
    </span>
  </li>
);

KeywordItem.propTypes = {
  topic: PropTypes.string.isRequired,
  confidenceScore: PropTypes.number.isRequired,
};

/**
 * Renders a list of extracted keywords with their confidence scores
 * @component
 * @param {Object} props - Component properties
 * @param {Array<{topic: string, confidence_score: number}>} props.keywords - Array of keyword objects
 * @returns {JSX.Element} Rendered keywords list
 */
const KeywordsList = ({ keywords }) => (
  <div style={styles.keywordsList}>
    <h3 style={styles.extractedKeywordsTitle}>Extracted Keywords:</h3>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {keywords.map((keyword, index) => (
        <KeywordItem
          key={`${keyword.topic}-${index}`}
          topic={keyword.topic}
          confidenceScore={keyword.confidence_score}
        />
      ))}
    </ul>
  </div>
);

KeywordsList.propTypes = {
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      topic: PropTypes.string.isRequired,
      confidence_score: PropTypes.number.isRequired,
    })
  ).isRequired,
};

/**
 * Main application component for keyword extraction
 * Allows users to input text and extract keywords using the backend API
 * @component
 * @returns {JSX.Element} Rendered application
 */
function App() {
  // State management for the application
  const [inputText, setInputText] = useState(""); // Stores user input text
  const [extractedKeywords, setExtractedKeywords] = useState([]); // Stores extracted keywords
  const [errorMessage, setErrorMessage] = useState(""); // Stores error messages
  const [isProcessing, setIsProcessing] = useState(false); // Tracks API request status

  /**
   * Handles the keyword extraction process
   * Validates input, makes API request, and updates state with results
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleExtractKeywords = async () => {
    // Validate input text
    if (!inputText.trim()) {
      setErrorMessage("Please enter some text.");
      return;
    }

    // Reset state before processing
    setErrorMessage("");
    setExtractedKeywords([]);
    setIsProcessing(true);

    try {
      // Make API request to extract keywords
      const response = await axios.post(API_URL, { text: inputText });
      setExtractedKeywords(response.data.topics || []);
    } catch (err) {
      // Handle any errors during API request
      setErrorMessage(
        err.response?.data?.message ||
        "Failed to extract keywords. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Keyword Extractor</h1>

      {/* Text input area */}
      <textarea
        rows="5"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to extract keywords..."
        style={styles.textarea}
        disabled={isProcessing}
      />

      {/* Extract keywords button */}
      <button
        onClick={handleExtractKeywords}
        style={styles.button}
        disabled={isProcessing}
      >
        {isProcessing ? "Extracting..." : "Extract Keywords"}
      </button>
      
      {/* Error message display */}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {/* Keywords list display */}
      {extractedKeywords.length > 0 && <KeywordsList keywords={extractedKeywords} />}
    </div>
  );
}

export default App;
