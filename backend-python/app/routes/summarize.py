import os

from flask import Blueprint, request, jsonify, current_app
from utils import api_response

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads_temp')

summarize_bp = Blueprint('summarize', __name__)

@summarize_bp.route('/summarize', methods=['POST'])
def summarize():
    summarizer = current_app.extensions.get('pdf_summarizer')
    if not summarizer:
        return api_response.error(jsonify, "PDF Summarizer not initialized", status_code=500)
    
    if 'file' not in request.files:
        return api_response.error(jsonify, "No file part in the request", status_code=400)
    
    pdf_file = request.files['file']
    if pdf_file.filename == '':
        return api_response.error(jsonify, "No selected file", status_code=400)
    
    if not pdf_file or not pdf_file.filename.endswith('.pdf'):
        return api_response.error(jsonify, "File is not a PDF", status_code=400)
    
    if not os.path.exists(UPLOAD_FOLDER):
        try:
            os.makedirs(UPLOAD_FOLDER)
            print(f"Upload directory created: {UPLOAD_FOLDER}")
        except Exception as e:
            print(f"Failed to create upload directory: {e}")
            return api_response.error(jsonify, "Failed to create upload directory", status_code=500)
        
    temp_pdf_path = os.path.join(UPLOAD_FOLDER, pdf_file.filename)
    try:
        pdf_file.save(temp_pdf_path)
        print(f"Temporary file was saved: {temp_pdf_path}")

        result_summary = summarizer.summarize_pdf(temp_pdf_path)
        
        return api_response.success(jsonify, {
            "filename": pdf_file.filename,
            "summary": result_summary
        })
    except Exception as e:
        print(f"ERROR saat meringkas file {temp_pdf_path}: {e}")
        return api_response.error({f"Terjadi kesalahan saat memproses file: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_pdf_path):
            try:
                os.remove(temp_pdf_path)
                print(f"File sementara {temp_pdf_path} berhasil dihapus.")
            except Exception as e_remove:
                print(f"ERROR: Gagal menghapus file sementara {temp_pdf_path}: {e_remove}")
