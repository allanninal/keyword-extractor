
# Keyword Extractor

The Keyword Extractor leverages Hugging Face’s **facebook/bart-large-mnli** model to extract relevant keywords or categories from user-provided text. Built with a **ReactJS (Vite)** frontend and a **Flask** backend, this tool provides real-time results in an interactive interface.

---

## Features

- **AI-Powered Keyword Extraction**: Utilizes state-of-the-art zero-shot classification for extracting key terms.
- **Interactive Interface**: Built with ReactJS for a smooth user experience.
- **Real-Time Results**: Processes and displays keywords instantly.
- **Predefined Categories**: Classifies text into predefined labels such as technology, healthcare, education, and more.

---

## Tech Stack

### **Frontend**
- ReactJS with Vite for responsive and fast UI.
- Axios for API communication.

### **Backend**
- Flask for handling API requests and processing text.
- Hugging Face’s **facebook/bart-large-mnli** for zero-shot classification.

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone git@github.com:allanninal/keyword-extractor.git
cd keyword-extractor
```

### 2. Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Install dependencies using `requirements.txt` from the backend folder:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the Flask backend:
   ```bash
   python backend/app.py
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

Visit the app at `http://localhost:5173`.

---

## How It Works

1. **Input Text**: Enter the text into the input box on the frontend.
2. **Backend Processing**: Flask processes the input text using Hugging Face’s `facebook/bart-large-mnli`.
3. **Display Results**: Extracted keywords are displayed in real time on the frontend.

---

## Future Enhancements

1. **Custom Categories**: Allow users to define their own keyword categories.
2. **Keyword Limits**: Provide options to limit the number of extracted keywords.
3. **Multi-Language Support**: Add support for non-English text using multilingual models.
4. **Export Results**: Enable downloading of extracted keywords in CSV or JSON formats.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support

If you find this project helpful, consider supporting me on Ko-fi:  
[ko-fi.com/allanninal](https://ko-fi.com/allanninal)

---

## Explore More Projects

For more exciting projects, check out my list of **AI Mini Projects**:  
[Mini AI Projects GitHub List](https://github.com/stars/allanninal/lists/mini-ai-projects)
