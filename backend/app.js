const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const uploadRoute = require("./routes/upload");
const urlRoute = require("./routes/url"); // ← new
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const pdfContentType = require("./middleware/pdfContentType");
const rateLimiter = require("./middleware/rateLimiter");
const { uploadsDir, resultsDir } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(resultsDir, { recursive: true });
  console.log("✔️  Folder uploads/ dan results/ siap digunakan");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

app.use(logger);
app.use(rateLimiter);

app.use("/upload", pdfContentType, uploadRoute);
app.use("/url", urlRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);
