const fetch = require('node-fetch');

// Function to get Spotify access token
async function getAccessToken(clientId, clientSecret) {
    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        if (!response.ok) {
            throw new Error(`Error getting Spotify access token: ${response.statusText}`);
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error(error);
        return null; // Return null on error
    }
}

// Export the function for use in other files
module.exports = getAccessToken;
