from flask import Blueprint, request, jsonify
from services.summarizer import PDFSummarizer

summarize_bp = Blueprint('summarize', __name__)

@summarize_bp.route('/summarize', methods=['POST'])
def summarize():
    pass