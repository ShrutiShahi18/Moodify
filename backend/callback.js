// moodify/backend/callback.js
const express = require('express');
const path = require('path');
const app = express();
const port = 8888;

// Serve the callback endpoint
app.get('/callback', (req, res) => {
    // The access token will be in the URL fragment (not accessible in req.query)
    // You can parse the token from the URL manually on the frontend
    res.sendFile(path.join(__dirname, 'callback.html'));
});

// Serve a static HTML file for the callback
app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
