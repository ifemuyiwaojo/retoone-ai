import axios from 'axios';

const API_BASE_URL = 'https://suno-api-sigma-ashen.vercel.app';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function generateMusic(description, genre, subgenres = []) {
  try {
    const prompt = `Create a ${genre} song${
      subgenres.length ? ` with elements of ${subgenres.join(', ')}` : ''
    }. ${description}`;

    console.log('Sending request to Suno API:', {
      url: `${API_BASE_URL}/api/custom_generate`,
      prompt,
      tags: [genre, ...subgenres].join(' '),
      title: `${genre} Generation`,
      wait_audio: true
    });

    const response = await apiClient.post('/api/custom_generate', {
      prompt,
      tags: [genre, ...subgenres].join(' '),
      title: `${genre} Generation`,
      make_instrumental: false,
      wait_audio: true
    });

    console.log('Raw API Response:', response.data);

    // Check if response has the expected structure
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response format from API');
    }

    const firstResult = response.data[0]?.[0];
    if (!firstResult?.audio_url) {
      console.error('Missing audio URL in response:', firstResult);
      throw new Error('No audio URL in response');
    }

    return {
      status: 'completed',
      track: {
        id: firstResult.id || String(Date.now()),
        title: firstResult.title || `${genre} Generation`,
        artist: 'AI Studio',
        album: 'Generated Music',
        coverUrl: firstResult.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
        duration: 30,
        liked: false,
        audioUrl: firstResult.audio_url,
        lyrics: firstResult.lyric || ''
      }
    };
  } catch (error) {
    console.error('Detailed API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }

    if (error.response?.status === 503) {
      throw new Error('API service is temporarily unavailable. Please try again later.');
    }
    
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.details || 
      'Failed to generate music. Please try again.'
    );
  }
}