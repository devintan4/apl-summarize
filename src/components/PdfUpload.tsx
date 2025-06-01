import { useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { TextSearch, FileUp, MousePointer2, MousePointerClick, FileCheck } from 'lucide-react';
import './PdfUpload.css';

interface PdfUploadProps {
  onFileSelect: (file: File | null) => void;
  onSummarizeClick: () => void;
  onUrlChange: (url: string) => void;
  selectedFile: File | null;
  pdfUrl: string;
  isSummarizing: boolean;
}

const PdfUpload = ({ 
  onFileSelect, 
  onSummarizeClick, 
  onUrlChange,
  selectedFile, 
  pdfUrl,
  isSummarizing 
}: PdfUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please select a PDF file');
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please drop a PDF file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfUrl && pdfUrl.match(/\.pdf($|\?)/i)) {
      onSummarizeClick();
    } else {
      alert('Please enter a valid PDF URL');
    }
  };

  return (
    <div className="pdf-hero-container">
      <div className="background-overlay" />

      <header className="hero-header">
        <div className="logo-container">
          <div className="logo-box">
            <TextSearch size={24} color="white" />
          </div>
          <h1 className="logo-text">PDF HERO</h1>
        </div>
        <h2>Hundreds of pages, <u>summarized.</u></h2>
        <p className="subtitle">Save up to 15 hours per PDF - get started for free today!</p>
      </header>

      <div
        className={`upload-area ${selectedFile ? 'file-selected' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!selectedFile ? (
          <>
            <FaCloudUploadAlt className="upload-icon" />
            <p>Drop your PDF file here or click to browse</p>
            <button
              className="browse-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />
          </>
        ) : (
          <div className="selection-confirmation">
            <p className="file-selected-text">✅ File selected: {selectedFile.name}</p>
            <button
              className="browse-button summarize-button"
              onClick={onSummarizeClick}
              disabled={isSummarizing}
            >
              {isSummarizing ? 'Processing...' : 'Summarize'}
            </button>
            <button
              className="browse-button choose-another-button"
              onClick={() => {
                onFileSelect(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Choose Another File
            </button>
          </div>
        )}
      </div>

      <div className="link-section">
        <div className="divider">
          <span>or insert PDF link:</span>
        </div>
        <form onSubmit={handleUrlSubmit}>
          <input
            type="url"
            value={pdfUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/document.pdf"
            className="url-input"
            disabled={!!selectedFile}
          />
          <button
            type="submit"
            className="browse-button url-summarize-button"
            disabled={!pdfUrl || !!selectedFile || isSummarizing}
          >
            {isSummarizing ? 'Processing...' : 'Summarize from URL'}
          </button>
        </form>
      </div>

      <div className="how-to-section">
        <h3>How to Summarize a PDF</h3>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Upload</h4>
            <p>Drop your PDF file here or click to browse</p>
            <div className="step-icons">
              <FileUp size={35} color="#3351B3" />
              <MousePointer2 size={35} color="#3351B3" />
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Summarize</h4>
            <p>Click the summarize button</p>
            <div className="step-icons">
              <MousePointerClick size={35} color="#3351B3" />
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Get Results</h4>
            <p>View your summarized content</p>
            <div className="step-icons">
              <FileCheck size={47} color="#3351B3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;