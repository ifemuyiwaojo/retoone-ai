import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3001;
const SUNO_API_URL = 'https://suno-api-sigma-ashen.vercel.app';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const sunoApi = axios.create({
  baseURL: SUNO_API_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, make_instrumental = false } = req.body;
    
    console.log('Forwarding request to Suno API:', {
      prompt,
      make_instrumental
    });

    // Use custom_generate endpoint for better control
    const response = await sunoApi.post('/api/custom_generate', {
      prompt,
      tags: prompt.split('.')[0].trim(), // Use first part of prompt as tags
      title: 'AI Generated Track',
      make_instrumental,
      wait_audio: true
    });

    console.log('Suno API Response:', response.data);

    // Handle different response formats
    let generatedTrack;
    if (Array.isArray(response.data) && response.data[0]?.['0']) {
      generatedTrack = response.data[0]['0'];
    } else if (Array.isArray(response.data) && response.data[0]) {
      generatedTrack = response.data[0];
    } else {
      throw new Error('Invalid response format from Suno API');
    }

    if (!generatedTrack?.audio_url) {
      throw new Error('No audio URL in response');
    }

    const track = {
      id: generatedTrack.id || Date.now().toString(),
      title: generatedTrack.title || 'AI Generated Track',
      artist: 'AI Studio',
      album: 'Generated Music',
      coverUrl: generatedTrack.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      duration: 30,
      liked: false,
      audioUrl: generatedTrack.audio_url,
      lyrics: generatedTrack.lyric || ''
    };

    res.json({ track });
  } catch (error) {
    console.error('Generation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    
    res.status(status).json({ 
      error: 'Generation failed',
      details: message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});