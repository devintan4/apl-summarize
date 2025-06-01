const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const fs = require('fs').promises;
const { pythonExec, pythonScript } = require('../config');

/**
 * summarize
 *  - Menjalankan skrip Python run_summarize.py
 *  - Menunggu proses selesai, lalu membaca file .txt hasil ringkasan
 *  - Mengembalikan isi ringkasannya (string)
 *
 * @param {string} pdfPath    Path lengkap ke file PDF input
 * @param {string} txtOutput  Path lengkap ke file .txt output
 * @returns {Promise<string>} Text ringkasan yang ada di txtOutput
 */
async function summarize(pdfPath, txtOutput) {
  const cmd = `"${pythonExec}" "${pythonScript}" "${pdfPath}" -o "${txtOutput}"`;

  const { stderr } = await execAsync(cmd);
  if (stderr) {
    throw new Error(stderr);
  }

  const summaryText = await fs.readFile(txtOutput, 'utf‐8');
  return summaryText;
}

module.exports = { summarize };
