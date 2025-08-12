"""
Erotify Music Download Service

A FastAPI-based service for downloading music from Spotify and YouTube
using the powerful SpotDL library.

This module provides RESTful API endpoints for:
- Downloading songs from Spotify URLs
- Downloading songs from YouTube URLs  
- Searching and downloading music by name
- Real-time download progress tracking

Built with SpotDL - https://github.com/spotDL/spotify-downloader
"""

__version__ = "1.0.0"
__author__ = "Eren Uysal"
__license__ = "MIT"

# SpotDL attribution
SPOTDL_ATTRIBUTION = """
This service is powered by SpotDL - An amazing open source tool for downloading music.
SpotDL GitHub: https://github.com/spotDL/spotify-downloader
Special thanks to the SpotDL team for making music downloading possible!
"""
