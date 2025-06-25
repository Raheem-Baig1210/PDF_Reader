const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

const PDF_DIR = path.join(__dirname, 'pdfs');

// Endpoint to list all PDFs
app.get('/api/pdfs', (req, res) => {
  fs.readdir(PDF_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to list PDFs' });
    }
    const pdfs = files.filter(file => file.endsWith('.pdf'));
    res.json(pdfs);
  });
});

// Endpoint to serve a PDF
app.get('/api/pdfs/:filename', (req, res) => {
  const filePath = path.join(PDF_DIR, req.params.filename);
  if (!filePath.startsWith(PDF_DIR)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    res.sendFile(filePath);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 