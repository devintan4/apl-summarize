import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, TextSearch, FileUp, Link } from "lucide-react";
import './PdfSummary.css';

interface SummaryTab {
  id: string;
  title: string;
  content: string;
}

interface PdfSummaryProps {
  summaries: {
    id: string;
    fileName: string;
    summary: string;
  }[];
  onNewUpload: (file: File) => void;
  onNewUrl: (url: string) => void;
}

const PdfSummary = ({ summaries, onNewUpload, onNewUrl }: PdfSummaryProps) => {
  const [tabs, setTabs] = useState<SummaryTab[]>(
    summaries.map(summary => ({
      id: summary.id,
      title: summary.fileName,
      content: summary.summary
    }))
  );
  const [activeTabId, setActiveTabId] = useState(summaries[0]?.id || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newPdfUrl, setNewPdfUrl] = useState('');

  const handleAddFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf';
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const formData = new FormData();
      formData.append("file", target.files[0]);

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setTabs(prev => [...prev, {
        id: crypto.randomUUID(),
        title: target.files[0].name,
        content: data.summary
      }]);
    }
  };
  input.click();
};


  const handleAddUrl = async (e: React.FormEvent) => {
  e.preventDefault();
  if (newPdfUrl.match(/\.pdf($|\?)/i)) {
    const response = await fetch("http://localhost:8000/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newPdfUrl })
    });

    const data = await response.json();
    setTabs(prev => [...prev, {
      id: crypto.randomUUID(),
      title: newPdfUrl,
      content: data.summary
    }]);
    
    setNewPdfUrl('');
    setShowUrlInput(false);
  } else {
    alert('Please enter a valid PDF URL');
  }
};


  const handleCloseTab = (id: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    
    if (activeTabId === id) {
      setActiveTabId(updatedTabs[0]?.id || '');
    }
  };

  const handleCopy = () => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      navigator.clipboard.writeText(activeTab.content);
      alert("Summary copied to clipboard!");
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="pdf-summary-container">
      <header className="hero-header">
        <div className="logo-container">
          <div className="logo-box">
            <TextSearch size={24} color="white" />
          </div>
          <h1 className="logo-text">PDF HERO</h1>
        </div>
        <h2>
          Hundreds of pages, <u>summarized.</u>
        </h2>
        <p className="subtitle">
          Save up to 15 hours per PDF - get started for free today!
        </p>
      </header>

      <div className="summary-content-wrapper">
        <Card className="summary-main-card">
          <div className="tab-list">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-item ${tab.id === activeTabId ? "active-tab" : ""}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.title.length > 20 ? `${tab.title.substring(0, 20)}...` : tab.title}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tab.id);
                    }}
                    className="close-tab-button"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {activeTab && (
            <>
              <div className="summary-text-area">
                {activeTab.content}
              </div>
              <Button onClick={handleCopy} className="copy-button">
                Copy text
              </Button>
            </>
          )}
        </Card>

        <Card className="upload-new-file-card">
          <p className="upload-new-text">Summarize another file</p>
          
          <div className="upload-options">
            <Button onClick={handleAddFile} className="upload-new-button">
              <FileUp size={20} className="mr-2" /> Upload PDF
            </Button>
            
            <Button 
              onClick={() => setShowUrlInput(!showUrlInput)} 
              className="upload-new-button url-button"
            >
              <Link size={20} className="mr-2" /> From URL
            </Button>
          </div>

          {showUrlInput && (
            <form onSubmit={handleAddUrl} className="url-input-container">
              <input
                type="url"
                value={newPdfUrl}
                onChange={(e) => setNewPdfUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="url-input-field"
                required
              />
              <Button type="submit" className="submit-url-button">
                Summarize
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PdfSummary;