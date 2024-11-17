import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const sunoApi = axios.create({
  baseURL: 'https://suno-api-sigma-ashen.vercel.app',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

async function generateLyrics(description, genre, subgenres = []) {
  try {
    const prompt = `Write emotional and engaging lyrics for a ${genre} song${
      subgenres.length ? ` with influences from ${subgenres.join(', ')}` : ''
    }. Theme: ${description}

    Return ONLY the lyrics as a JSON array of objects with "time" and "text" properties, where:
    - "time" is the timestamp in MM:SS format, spaced 15 seconds apart
    - "text" is the line of lyrics
    - Include enough lyrics for a 3-minute song
    - Make it a complete, coherent song with verses, chorus, and bridge
    
    Example format:
    [
      {"time": "0:00", "text": "First line of lyrics"},
      {"time": "0:15", "text": "Second line of lyrics"}
    ]`;

    console.log('Generating lyrics with OpenAI:', { genre, subgenres, description });

    const response = await openaiApi.post('/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7
    });

    const content = response.data.choices[0].message.content.trim();
    console.log('OpenAI Response:', content);

    // Ensure we're parsing only the JSON array
    const jsonStr = content.replace(/^```json\s*|\s*```$/g, '');
    const lyrics = JSON.parse(jsonStr);

    if (!Array.isArray(lyrics)) {
      throw new Error('Invalid lyrics format from OpenAI');
    }

    return lyrics;
  } catch (error) {
    console.error('Lyrics generation error:', error);
    throw new Error('Failed to generate lyrics: ' + error.message);
  }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { description, genre, subgenres = [] } = req.body;
    
    console.log('Generating lyrics and music:', { description, genre, subgenres });

    // Generate lyrics first
    const lyrics = await generateLyrics(description, genre, subgenres);
    console.log('Generated lyrics:', lyrics);

    // Extract just the lyrics text for the music generation prompt
    const lyricsText = lyrics.map(line => line.text).join('\n');

    // Send only the lyrics to Suno, let the genre/subgenre tags handle the style
    console.log('Sending to Suno:', { 
      prompt: lyricsText,
      tags: [genre, ...subgenres].join(' ')
    });

    // Generate music with lyrics
    const response = await sunoApi.post('/api/custom_generate', {
      prompt: lyricsText, // Only send the lyrics as the prompt
      tags: [genre, ...subgenres].join(' '), // Use tags for genre/style
      title: 'AI Generated Track',
      make_instrumental: false,
      wait_audio: true,
      duration: 180 // Request 3-minute duration
    });

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
      duration: 180, // Set to 3 minutes
      liked: false,
      audioUrl: generatedTrack.audio_url,
      lyrics // Use the OpenAI-generated lyrics
    };

    res.json({ track });
  } catch (error) {
    console.error('Generation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Generation failed',
      details: error.response?.data?.error || error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('API Key configured:', !!process.env.OPENAI_API_KEY);
});