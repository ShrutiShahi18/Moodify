// App.jsx
import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [emotion, setEmotion] = useState("");
    const [language, setLanguage] = useState("US"); // Default language
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState("");

    // Language mapping
    const languageMapping = {
        English: 'US',
        Hindi: 'IN',
        Spanish: 'ES',
        French: 'FR',
        German: 'DE',
        // Add more languages as needed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Get the language code based on the selected language name
        const languageCode = languageMapping[language] || 'US'; // Default to 'US' if not found

        try {
            const response = await axios.post("http://localhost:5000/api/suggest-songs", {
                emotion,
                language: languageCode,
            });

            setSongs(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch recommendations. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-4xl font-bold mb-6">Moodify</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-300">Enter Your Emotion:</label>
                    <input
                        type="text"
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        className="mt-1 p-2 border border-gray-700 rounded w-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Select Your Preferred Language:</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="mt-1 p-2 border border-gray-700 rounded w-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    >
                        {Object.keys(languageMapping).map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-500 transition duration-200 w-full">
                    Get Song Suggestions
                </button>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {songs.length > 0 && (
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Song Recommendations</h2>
                    <ul className="space-y-4">
                        {songs.map((song, index) => (
                            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition duration-200">
                                <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                    {song.name} by {song.artists.map(artist => artist.name).join(", ")}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
