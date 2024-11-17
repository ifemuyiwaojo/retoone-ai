import axios, { AxiosError } from 'axios';
import { Track } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ensure all data is serializable before logging
const safeStringify = (obj: unknown) => {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Error) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack
        };
      }
      return value;
    });
  } catch (error) {
    return '[Unserializable data]';
  }
};

api.interceptors.request.use(request => {
  const safeRequest = {
    url: request.url,
    method: request.method,
    data: request.data
  };
  console.log('Starting API request:', safeRequest);
  return request;
});

api.interceptors.response.use(
  response => {
    const safeResponse = {
      status: response.status,
      data: response.data
    };
    console.log('Received API response:', safeResponse);
    return response;
  },
  error => {
    const safeError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
    console.error('API request failed:', safeError);
    return Promise.reject(error);
  }
);

export async function generateMusic(description: string, genre: string, subgenres: string[] = []): Promise<Track> {
  try {
    const requestData = {
      description: description.trim(),
      genre,
      subgenres
    };

    console.log('Initiating music generation:', requestData);

    const response = await api.post('/generate', requestData);

    if (!response.data) {
      throw new Error('Empty response from server');
    }

    const track = response.data?.track;

    if (!track) {
      throw new Error('No track data in response');
    }

    if (!track.audioUrl) {
      throw new Error('Generated track is missing audio URL');
    }

    // Ensure all track data is properly structured
    return {
      id: track.id || String(Date.now()),
      title: track.title || `${genre} Generation`,
      artist: track.artist || 'AI Studio',
      album: track.album || 'Generated Music',
      coverUrl: track.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      duration: typeof track.duration === 'number' ? track.duration : 30,
      liked: Boolean(track.liked),
      audioUrl: track.audioUrl,
      lyrics: track.lyrics || '',
      description: track.description || description // Store original description
    };
  } catch (error) {
    const safeError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: axios.isAxiosError(error) ? error.code : undefined,
      response: axios.isAxiosError(error) ? error.response?.data : undefined
    };

    console.error('Music generation failed:', safeStringify(safeError));

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
        throw new Error('Network error - Please check your connection');
      }

      const status = error.response.status;
      const errorData = error.response.data as any;

      if (status === 404) {
        throw new Error('Music generation service is temporarily unavailable');
      }

      if (status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      }

      if (status === 503) {
        throw new Error('Service is temporarily unavailable. Please try again in a few minutes.');
      }

      throw new Error(
        errorData?.details || 
        errorData?.error || 
        'Failed to generate music'
      );
    }

    throw new Error('An unexpected error occurred');
  }
}