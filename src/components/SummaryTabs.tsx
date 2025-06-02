// src/components/PdfSummary.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card"; // Asumsi ini sudah ada dan berfungsi
import { Button } from "@/components/ui/button"; // Asumsi ini sudah ada dan berfungsi
import { X, TextSearch, FileUp } from "lucide-react"; // Menambahkan TextSearch, FileUp

interface SummaryTab {
  id: string;
  title: string;
  content: string;
}

interface PdfSummaryProps {
  fileName: string;
  summary: string;
  onNewUpload: () => void;
}

const PdfSummary = ({ fileName, summary, onNewUpload }: PdfSummaryProps) => {
  const [tabs, setTabs] = useState<SummaryTab[]>([
    { id: "1", title: fileName, content: summary }, // Menggunakan fileName dan summary dari props
  ]);
  const [activeTabId, setActiveTabId] = useState("1");

  const handleAddTab = () => {
    // Logika untuk menambahkan tab baru (mungkin saat user mengupload file lain)
    // Untuk saat ini, kita akan fokus pada onNewUpload yang akan mengembalikan ke halaman upload.
    // Jika nanti ada kebutuhan untuk multiple summaries di dalam satu halaman, logika ini bisa dikembangkan.
    onNewUpload(); // Kembali ke halaman upload untuk file baru
  };

  const handleCloseTab = (id: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    if (activeTabId === id && updatedTabs.length > 0) {
      setActiveTabId(updatedTabs[0].id);
    } else if (updatedTabs.length === 0) {
      // Jika tidak ada tab tersisa, kembali ke halaman upload
      onNewUpload();
    }
  };

  const handleCopy = () => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      navigator.clipboard.writeText(activeTab.content);
      alert("Summary copied to clipboard!"); // Feedback ke user
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="pdf-summary-container"> {/* Container baru untuk PdfSummary */}
      <header className="hero-header"> {/* Menggunakan header yang sama untuk konsistensi desain */}
        <div className="logo-container">
          <div className="logo-box">
            <TextSearch size={24} color="white" />
          </div>
          <h1 className="logo-text">PDF HERO</h1>
        </div>
      </header>

      <div className="summary-content-wrapper">
        <Card className="summary-main-card">
          <div className="flex gap-2 mb-4 flex-wrap tab-list"> {/* Menambah margin-bottom dan kelas tab-list */}
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer tab-item ${
                  tab.id === activeTabId
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Mencegah klik tab saat menutup
                    handleCloseTab(tab.id);
                  }}
                  className="ml-2 text-xs hover:text-red-500 close-tab-button"
                >
                  <X size={14} />
                </button>
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
          <p className="text-center font-medium text-gray-700 upload-new-text">Summarize another file</p>
          <Button onClick={handleAddTab} className="upload-new-button">
            <FileUp size={20} className="mr-2" /> Upload New PDF
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default PdfSummary;