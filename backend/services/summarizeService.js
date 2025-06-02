const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
const fs = require("fs").promises;
const { pythonExec, pythonScript } = require("../config");

async function summarize(pdfPath, txtOutput) {
  // Debugging: cetak persis apa yang akan dijalankan
  console.log("🔍 [summarizeService] pythonExec:", pythonExec);
  console.log("🔍 [summarizeService] pythonScript:", pythonScript);
  console.log("🔍 [summarizeService] pdfPath:", pdfPath);
  console.log("🔍 [summarizeService] txtOutput:", txtOutput);
  console.log("🔍 [summarizeService] args:", [
    pythonScript,
    pdfPath,
    "-o",
    txtOutput,
  ]);

  let result;
  try {
    // NOTE: execFile langsung menerima array args → lebih aman
    result = await execFileAsync(pythonExec, [
      pythonScript,
      pdfPath,
      "-o",
      txtOutput,
    ]);
  } catch (err) {
    console.error("❌ [summarizeService] execFile error:", err);
    throw err;
  }

  const { stdout, stderr } = result;
  console.log("✅ [summarizeService] stdout:", stdout);
  console.log("⚠️  [summarizeService] stderr:", stderr);

  if (stderr) {
    console.warn("⚠️ [summarizeService] Python warnings:", stderr);
  }

  const summaryText = await fs.readFile(txtOutput, "utf-8");
  return summaryText;
}

module.exports = { summarize };
