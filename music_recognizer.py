from shazamio import Shazam

async def recognize_audio(file_path):
    """
    Recognizes music from a given file path (audio/video).
    Returns a dictionary with 'title', 'artist', and 'track_id' if found, else None.
    """
    try:
        shazam = Shazam()
        out = await shazam.recognize(file_path)
        
        if 'track' in out:
            track = out['track']
            title = track.get('title', 'Unknown Title')
            artist = track.get('subtitle', 'Unknown Artist')
            return {
                'title': title,
                'artist': artist,
                'full_name': f"{artist} - {title}"
            }
        return None
    except Exception as e:
        print(f"Error identifying music: {e}")
        return None
