import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Store generation tasks
const tasks = new Map();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.post('/api/generate', async (req, res) => {
  try {
    const { description, genre, subgenres } = req.body;
    
    if (!description || !genre) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    if (!process.env.VITE_SUNO_API_KEY) {
      return res.status(500).json({
        error: 'Suno API key not configured'
      });
    }

    const taskId = uuidv4();
    
    // Store task
    tasks.set(taskId, {
      status: 'pending',
      description,
      genre,
      subgenres,
      createdAt: new Date().toISOString()
    });

    // Start async generation
    generateMusic(taskId, description, genre, subgenres).catch(error => {
      console.error('Background generation error:', error);
      tasks.set(taskId, {
        status: 'failed',
        error: error.message,
        updatedAt: new Date().toISOString()
      });
    });

    res.json({ taskId });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Generation failed',
      details: error.message 
    });
  }
});

app.get('/api/status/:taskId', (req, res) => {
  try {
    const { taskId } = req.params;
    const task = tasks.get(taskId);
    
    if (!task) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Failed to check status',
      details: error.message
    });
  }
});

async function generateMusic(taskId, description, genre, subgenres) {
  const task = tasks.get(taskId);
  
  try {
    // Construct the prompt
    const prompt = `Create a ${genre} song${
      subgenres.length ? ` with elements of ${subgenres.join(', ')}` : ''
    }. ${description}`;

    console.log('Sending request to Suno API with prompt:', prompt);

    const response = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        model_version: 'v2',
        duration_seconds: 30,
        temperature: 0.8,
        top_k: 250,
        top_p: 0.99,
        classifier_free_guidance: 3.0,
        output_format: 'mp3',
        sample_rate: 44100
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Suno API request failed');
    }

    const data = await response.json();
    
    // Update task with result
    const result = {
      status: 'completed',
      result: {
        url: data.url || data.audio_url, // Handle different response formats
        duration: data.duration || 30
      },
      updatedAt: new Date().toISOString()
    };
    
    tasks.set(taskId, {
      ...task,
      ...result
    });

    return result;
  } catch (error) {
    console.error('Generation error:', error);
    tasks.set(taskId, {
      ...task,
      status: 'failed',
      error: error.message,
      updatedAt: new Date().toISOString()
    });
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});