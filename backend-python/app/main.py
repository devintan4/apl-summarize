# Import Libraries & Modules
from flask import Flask

from routes.summarize import summarize_bp

# Create Flask App
app = Flask(__name__)

# Application Routes
@app.route('/')
def index():
    return "Welcome to the PDF Summarizer API!"

app.register_blueprint(summarize_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)