const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { pythonExec, pythonScript } = require('../config');

async function summarize(pdfPath, txtOutput) {
  const cmd = `${pythonExec} "${pythonScript}" "${pdfPath}" -o "${txtOutput}"`;
  const { stderr } = await execAsync(cmd);
  if (stderr) throw new Error(stderr);
  return txtOutput;
}

module.exports = { summarize };