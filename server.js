const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // Change this to your desired port number

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests for clean URLs without .html extension
app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, `public/${page}.html`));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
