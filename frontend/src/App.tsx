// frontend/src/App.tsx
import { useState } from "react";
import PdfSummary from "./components/PdfSummary";
import PdfUpload from "./components/PdfUpload";
import "./App.css";
import "./components/PdfSummary.css";

type AppStage = "upload" | "processing" | "summary";

interface SummaryData {
  id: string;
  fileName: string;
  summary: string;
}

function App() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [appStage, setAppStage] = useState<AppStage>("upload");
  const [isProcessing, setIsProcessing] = useState(false);

  const summarizeFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.summary;
  };

  const summarizeUrl = async (url: string): Promise<string> => {
    const res = await fetch("http://localhost:3000/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "URL summarize failed");
    return data.summary;
  };

  const handleSummarize = async () => {
    if (!currentFile && !pdfUrl) return;
    setIsProcessing(true);
    setAppStage("processing");

    try {
      let summary: string;
      if (currentFile) {
        summary = await summarizeFile(currentFile);
      } else {
        summary = await summarizeUrl(pdfUrl);
      }

      const newSummary = {
        id: Date.now().toString(),
        fileName: currentFile?.name || pdfUrl,
        summary,
      };
      setSummaries((prev) => [...prev, newSummary]);
      setAppStage("summary");
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message);
      setAppStage("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      {appStage === "upload" && (
        <PdfUpload
          onFileSelect={setCurrentFile}
          onUrlChange={setPdfUrl}
          onSummarizeClick={handleSummarize}
          selectedFile={currentFile}
          pdfUrl={pdfUrl}
          isSummarizing={isProcessing}
        />
      )}
      {appStage === "processing" && (
        <ProcessingScreen fileName={currentFile?.name || pdfUrl} />
      )}
      {appStage === "summary" && summaries.length > 0 && (
        <PdfSummary
          summaries={summaries}
          onNewUpload={(f) => {
            setCurrentFile(f);
            setPdfUrl("");
            handleSummarize();
          }}
          onNewUrl={(u) => {
            setPdfUrl(u);
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
        <div className="spinner" />
        <p>Please wait while we summarize your document...</p>
      </div>
    </div>
  );
}

export default App;
