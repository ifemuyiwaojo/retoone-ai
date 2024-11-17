import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generateMusic } from './services/sunoApi.js';

dotenv.config();

const app = express();

// Security and middleware
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Music generation endpoint
app.post('/api/generate', async (req, res, next) => {
  try {
    const { description, genre, subgenres = [] } = req.body;
    
    if (!description || !genre) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    const result = await generateMusic(description, genre, subgenres);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log('API Keys configured:', {
    suno: !!config.sunoApiKey,
    openai: !!config.openaiApiKey
  });
});