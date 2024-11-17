import axios from 'axios';

const SUNO_API_URL = 'https://suno-api-sigma-ashen.vercel.app';
const TIMEOUT = 100000; // 100 seconds as per API docs

const apiClient = axios.create({
  baseURL: SUNO_API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function generateMusic(description, genre, subgenres = []) {
  const prompt = `Create a ${genre} song${
    subgenres.length ? ` with elements of ${subgenres.join(', ')}` : ''
  }. ${description}`;

  console.log('Sending request to Suno API:', {
    prompt,
    make_instrumental: false,
    wait_audio: true
  });

  try {
    const response = await apiClient.post('/api/generate', {
      prompt,
      make_instrumental: false,
      wait_audio: true
    });

    // The API returns an array with a single object containing numbered tracks
    if (!Array.isArray(response.data) || !response.data[0]?.['0']) {
      console.error('Invalid API response:', response.data);
      throw new Error('Invalid response format from Suno API');
    }

    const track = response.data[0]['0'];

    if (!track.audio_url) {
      throw new Error('Generated track is missing audio URL');
    }

    return {
      id: track.id || Date.now().toString(),
      title: track.title || `${genre} Generation`,
      artist: 'AI Studio',
      album: 'Generated Music',
      coverUrl: track.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      duration: 30,
      liked: false,
      audioUrl: track.audio_url,
      lyrics: track.lyric || ''
    };
  } catch (error) {
    console.error('Suno API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    throw error;
  }
}