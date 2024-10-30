# spotify_recommendation.py
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Spotify API credentials
client_id = 'your_spotify_client_id'
client_secret = 'your_spotify_client_secret'
redirect_uri = 'http://localhost:8888/callback'

scope = 'user-library-read user-top-read playlist-modify-public'

# Initialize Spotify client
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope))

def get_song_recommendations(emotion, language_preference):
    mood_to_genre = {
        'Happy': 'pop',
        'Sad': 'acoustic',
        'Angry': 'rock',
        'Surprise': 'dance',
        'Neutral': 'chill',
        'Fear': 'ambient',
        'Disgust': 'metal',
    }

    genre = mood_to_genre.get(emotion, 'pop')
    # Fetch recommended tracks
    recommendations = sp.recommendations(seed_genres=[genre], limit=10)
    
    # Filter based on language preference (optional)
    filtered_songs = [track for track in recommendations['tracks'] if any(language in track['name'] for language in language_preference)]
    
    # Format the song data
    song_list = [{'name': track['name'], 'artist': track['artists'][0]['name']} for track in filtered_songs]
    return song_list
