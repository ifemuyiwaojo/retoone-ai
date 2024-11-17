import axios, { AxiosError } from 'axios';
import { Track } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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
  } catch {
    return '[Unserializable data]';
  }
};

api.interceptors.request.use(
  config => {
    const safeConfig = {
      url: config.url,
      method: config.method,
      data: config.data
    };
    console.log('API Request:', safeConfig);
    return config;
  },
  error => {
    console.error('Request Error:', safeStringify(error));
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('API Response:', safeStringify(response.data));
    return response;
  },
  error => {
    console.error('API Error:', safeStringify(error));
    return Promise.reject(error);
  }
);

export async function generateTrack(
  description: string,
  genre: string,
  subgenres: string[] = []
): Promise<Track> {
  try {
    const prompt = `Create a ${genre} song${
      subgenres.length ? ` with elements of ${subgenres.join(', ')}` : ''
    }. ${description}`;

    console.log('Generating track with prompt:', prompt);

    const response = await api.post('/generate', {
      prompt,
      make_instrumental: false
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
    console.error('Generation error:', safeStringify(error));
    
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      if (error.response?.status === 503) {
        throw new Error('Service is temporarily unavailable. Please try again later.');
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