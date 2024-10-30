// server.js
const express = require("express");
const axios = require("axios");
const qs = require("qs");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to get Spotify access token
async function getSpotifyAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            qs.stringify({ grant_type: "client_credentials" }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${authHeader}`,
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting Spotify access token:", error.response?.data || error.message);
        throw new Error("Failed to fetch Spotify access token.");
    }
}

// Function to get song recommendations
async function getSongRecommendations(emotion, language) {
    const accessToken = await getSpotifyAccessToken();

    const query = `?seed_genres=${emotion}&market=${language}`;

    try {
        const response = await axios.get(`https://api.spotify.com/v1/recommendations${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.tracks;
    } catch (error) {
        console.error("Error fetching song recommendations:", error.response?.data || error.message);
        console.error("Request Config:", error.config);
        throw new Error("Failed to fetch song recommendations.");
    }
}

// API endpoint to get song suggestions
app.post("/api/suggest-songs", async (req, res) => {
    const { emotion, language } = req.body;

    try {
        const recommendations = await getSongRecommendations(emotion, language);
        res.json(recommendations);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
