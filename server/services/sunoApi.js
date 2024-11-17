import axios from 'axios';
import { formatTrack } from '../utils/trackFormatter.js';
import { handleApiError } from '../utils/errorHandler.js';

const API_BASE_URL = 'https://suno-api-sigma-ashen.vercel.app';
const API_TIMEOUT = 180000; // 3 minutes

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use(request => {
  console.log('Outgoing request to Suno:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: {
      ...request.headers,
      Authorization: request.headers.Authorization ? '[REDACTED]' : undefined
    }
  });
  return request;
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  response => {
    console.log('Suno API response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Suno API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

// Validate response data
function validateResponse(data) {
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid response format from API');
  }

  let tracks = [];
  
  // Handle different response formats
  if (data[0]) {
    if ('0' in data[0]) {
      tracks = Object.values(data[0]);
    } else if (Array.isArray(data[0])) {
      tracks = data[0];
    } else {
      tracks = [data[0]];
    }
  }

  if (!tracks.length) {
    throw new Error('No tracks returned from API');
  }

  const invalidTracks = tracks.filter(track => !track?.audio_url);
  if (invalidTracks.length > 0) {
    throw new Error('One or more tracks are missing audio URLs');
  }

  return tracks;
}

export async function generateMusic(description, genre, subgenres = []) {
  const requestId = Date.now().toString(36);
  console.log(`[${requestId}] Starting music generation:`, { description, genre, subgenres });

  try {
    // Validate input
    if (!description?.trim()) {
      throw new Error('Description is required');
    }
    if (!genre?.trim()) {
      throw new Error('Genre is required');
    }

    const prompt = `Create a ${genre} song${
      subgenres.length ? ` with elements of ${subgenres.join(', ')}` : ''
    }. ${description}`;

    console.log(`[${requestId}] Sending request to Suno API:`, {
      url: `${API_BASE_URL}/api/generate`,
      prompt,
      tags: [genre, ...subgenres].join(' ')
    });

    const response = await apiClient.post('/api/generate', {
      prompt,
      tags: [genre, ...subgenres].join(' '),
      title: `${genre} Generation`,
      make_instrumental: false,
      wait_audio: true,
      duration: 180
    });

    console.log(`[${requestId}] Received response:`, {
      status: response.status,
      hasData: !!response.data
    });

    const tracks = validateResponse(response.data);
    
    const processedTracks = tracks.map((track, index) => 
      formatTrack(track, index, { genre, subgenres, description })
    );

    console.log(`[${requestId}] Successfully processed ${processedTracks.length} tracks`);

    return {
      track: processedTracks[0],
      alternates: processedTracks.slice(1)
    };

  } catch (error) {
    return handleApiError(error, requestId);
  }
}