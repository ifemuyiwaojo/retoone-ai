import axios, { AxiosError } from 'axios';
import { Track } from '../types';

// Use environment variable for API URL with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Rest of your API code...
export async function generateTrack(
  description: string,
  genre: string,
  subgenres: string[] = []
): Promise<Track> {
  try {
    console.log('Generating track:', { description, genre, subgenres });

    const response = await api.post('/api/generate', {
      description,
      genre,
      subgenres
    });

    if (!response.data?.track) {
      throw new Error('Invalid response from API');
    }

    const { track } = response.data;

    if (!track.audioUrl) {
      throw new Error('Generated track is missing audio URL');
    }

    return track;
  } catch (error) {
    console.error('Generation error:', error);
    
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      }

      if (error.response?.status === 503) {
        throw new Error('Service is temporarily unavailable.');
      }

      if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      }
    }
    
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate music'
    );
  }
}