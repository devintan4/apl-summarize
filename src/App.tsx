import { useState } from 'react';
import PdfUpload from './components/PdfUpload';
import PdfSummary from './components/PdfSummary';
import './App.css';
import './components/PdfSummary.css';

type AppStage = 'upload' | 'processing' | 'summary';

interface SummaryData {
  id: string;
  fileName: string;
  summary: string;
}

function App() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [appStage, setAppStage] = useState<AppStage>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    setCurrentFile(selectedFile);
    setPdfUrl(''); // Reset URL when file is selected
  };

  const handleUrlChange = (url: string) => {
    setPdfUrl(url);
    setCurrentFile(null); // Reset file when URL is entered
  };

  // Mock API call - replace with real API call in production
  const generateSummary = async (source: File | string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileName = typeof source === 'string' ? source : source.name;
        resolve(`Summary for ${fileName}\n\n` +
          `This document contains important information about ${fileName.includes('report') ? 
          'business reports' : 'technical documentation'}.\n\n` +
          `Key points include:\n` +
          `1. Main findings and analysis\n` +
          `2. Recommendations for implementation\n` +
          `3. Best practices and conclusions\n\n` +
          `Document consists of ${Math.floor(Math.random() * 10) + 5} pages ` +
          `with relevant and useful content.`);
      }, 2000);
    });
  };

  const handleSummarize = async () => {
    if (!currentFile && !pdfUrl) return;
    
    setIsProcessing(true);
    setAppStage('processing');

    try {
      const summary = await generateSummary(currentFile || pdfUrl);
      const newSummary = {
        id: Date.now().toString(),
        fileName: currentFile?.name || pdfUrl,
        summary
      };
      setSummaries(prev => [...prev, newSummary]);
      setAppStage('summary');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      {appStage === 'upload' && (
        <PdfUpload
          onFileSelect={handleFileSelect}
          onSummarizeClick={handleSummarize}
          onUrlChange={handleUrlChange}
          selectedFile={currentFile}
          pdfUrl={pdfUrl}
          isSummarizing={isProcessing}
        />
      )}

      {appStage === 'processing' && (
        <ProcessingScreen fileName={currentFile?.name || pdfUrl} />
      )}

      {appStage === 'summary' && summaries.length > 0 && (
        <PdfSummary
          summaries={summaries}
          onNewUpload={(file) => {
            setCurrentFile(file);
            setPdfUrl('');
            handleSummarize();
          }}
          onNewUrl={(url) => {
            setPdfUrl(url);
            setCurrentFile(null);
            handleSummarize();
          }}
        />
      )}
    </div>
  );
}

function ProcessingScreen({ fileName }: { fileName: string }) {
  return (
    <div className="processing-screen">
      <div className="processing-content">
        <h2>Processing your PDF</h2>
        <p>File: {fileName}</p>
        <div className="spinner"></div>
        <p>Please wait while we summarize your document...</p>
      </div>
    </div>
  );
}

export default App;