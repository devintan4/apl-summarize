const express = require('express');
const cors = require('cors');
const summarizeRoute = require('./routes/summarize');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/summarize', summarizeRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
