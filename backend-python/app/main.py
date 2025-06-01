# Import Libraries & Modules
from flask import Flask
from flask_cors import CORS
import os

from services.summarizer import PDFSummarizer

# Import Blueprint untuk route
from routes.summarize import summarize_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    print("Initializing PDFSummarizer...")
    try:
        pdf_summarizer_instance = PDFSummarizer(model_name="facebook/bart-large-cnn")
    
        if not hasattr(app, 'extensions'):
            app.extensions = {}
        app.extensions['pdf_summarizer'] = pdf_summarizer_instance
        print("Instance PDFSummarizer successfully initialized and saved in app.extensions.")
    except Exception as e:
        print(f"Failed to initialize PDFSummarizer: {e}")
        if not hasattr(app, 'extensions'):
            app.extensions = {}
        app.extensions['pdf_summarizer'] = None

    @app.route('/')
    def index():
        return "Welcome to the PDF Summarizer API!"

    app.register_blueprint(summarize_bp, url_prefix='/api')
    
    return app

# --- Jalankan Aplikasi ---
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0')