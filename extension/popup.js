document.addEventListener("DOMContentLoaded", function () {
  // DOMContentLoaded memastikan HTML sudah sepenuhnya dimuat sebelum JS dijalankan
  const API_URL = "http://127.0.0.1:5000/api/summarize"; // Ganti dengan URL API yang sesuai

  const pdfFileInput = document.getElementById("pdfFile");
  const summarizeButton = document.getElementById("summarizeButton");
  const messageElement = document.getElementById("message");
  const summaryOutputElement = document.getElementById("summaryOutput");

  summarizeButton.addEventListener("click", async function () {
    try {
      summarizeButton.disabled = true;
      const files = pdfFileInput.files;

      if (files.length === 0) {
        messageElement.textContent = "Tolong pilih file PDF terlebih dahulu!";
        messageElement.style.color = "red";
        return;
      }

      const pdfFile = files[0];
      messageElement.textContent = `Memproses ${pdfFile.name}...`;
      messageElement.style.color = "black";
      summaryOutputElement.textContent = "";

      const formData = new FormData();
      formData.append("file", pdfFile);
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi server: " + response.statusText);
      }

      const result = await response.json();
      if (!result.success)
        throw new Error(
          result.message || "Gagal mendapatkan ringkasan dari server."
        );

      // Asumsikan server mengembalikan ringkasan dalam format JSON
      const summary =
        result.data.summary || "Tidak ada ringkasan yang tersedia.";
      summaryOutputElement.innerHTML = `<h2>Ringkasan:</h2><p>${summary}</p>`;
      messageElement.textContent = "Peringkasan selesai.";
    } catch (error) {
      messageElement.textContent = `Terjadi kesalahan: ${error.message}`;
      messageElement.style.color = "red";
      return;
    } finally {
      summarizeButton.disabled = false;
    }
  });

  pdfFileInput.addEventListener("change", function () {
    if (pdfFileInput.files.length > 0) {
      messageElement.textContent = `File dipilih: ${pdfFileInput.files[0].name}`;
      messageElement.style.color = "blue";
    }
  });
});
