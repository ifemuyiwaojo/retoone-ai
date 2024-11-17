import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const corsOrigin = process.env.CORS_ORIGINS || '*';

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

let generationCounter = 0;

app.post("/api/generate", async (req, res) => {
  try {
    console.log('\n=== New Generation Request ===');
    
    const { description, genre, subgenres } = req.body;
    console.log('Request Body:', { description, genre, subgenres });
    
    if (!description || !genre) {
      return res.status(400).json({ 
        error: "Missing required parameters" 
      });
    }

    const sunoApiUrl = process.env.SUNO_API_URL;
    const prompt = `Create a ${genre} song${
      subgenres?.length ? ` with elements of ${subgenres.join(", ")}` : ""
    }. ${description}`;

    const generateUrl = `http://${sunoApiUrl}/api/generate`;
    console.log('Making request to:', generateUrl);

    const generateResponse = await axios({
      method: "post",
      url: generateUrl,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      data: {
        prompt,
        make_instrumental: false
      }
    });

    console.log('\n=== Processing Response ===');
    const generations = Array.isArray(generateResponse.data) 
      ? generateResponse.data 
      : [generateResponse.data];

    console.log(`Received ${generations.length} generations`);

    return res.json({
      status: "submitted",
      message: "Generation started. Suno API provides two versions.",
      generations: generations.map(gen => ({
        id: gen.id,
        status: gen.status,
        created_at: gen.created_at,
        prompt: gen.gpt_description_prompt,
        audio_url: gen.audio_url || null
      }))
    });

  } catch (error) {
    console.error('\n=== Generation Error ===');
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: "Generation failed",
      details: error.message
    });
  }
});

app.get("/api/generate/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const sunoApiUrl = process.env.SUNO_API_URL;
    
    console.log('\n=== Checking Status for Generation ===');
    console.log('Generation ID:', id);
    
    const statusUrl = `http://${sunoApiUrl}/api/generate`;
    console.log('Checking status at:', statusUrl);
    
    const statusResponse = await axios({
      method: "post",
      url: statusUrl,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        prompt: ""
      }
    });

    console.log('\n=== Raw Status Response ===');
    console.log(JSON.stringify(statusResponse.data, null, 2));

    const generations = Array.isArray(statusResponse.data) 
      ? statusResponse.data 
      : [statusResponse.data];

    console.log(`\n=== Processed ${generations.length} generations ===`);
    generations.forEach((gen, index) => {
      console.log(`\nGeneration ${index + 1}:`);
      console.log('ID:', gen.id);
      console.log('Status:', gen.status);
      console.log('Created:', gen.created_at);
      console.log('Audio URL:', gen.audio_url || 'none');
    });
    
    // Look for either generation with matching ID
    const matchingGeneration = generations.find(gen => gen.id === id);

    if (matchingGeneration) {
      console.log('\n=== Found Matching Generation ===');
      console.log(matchingGeneration);
      return res.json({
        id: matchingGeneration.id,
        status: matchingGeneration.status,
        audio_url: matchingGeneration.audio_url || null,
        created_at: matchingGeneration.created_at,
        details: matchingGeneration
      });
    } else {
      console.log('\n=== No Matching Generation Found ===');
      console.log('Requested ID:', id);
      console.log('Available IDs:', generations.map(g => g.id).join(', '));
    }

    return res.status(202).json({
      status: "processing",
      message: "Generation is still being processed.",
      id: id
    });

  } catch (error) {
    console.error('\n=== Status Check Error ===');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    return res.status(500).json({
      error: "Status check failed",
      details: error.message
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  console.log('CORS Test Request:', {
    origin: req.headers.origin,
    allowedOrigin: process.env.CORS_ORIGINS
  });

  res.json({
    message: "CORS test endpoint",
    yourOrigin: req.headers.origin || 'no origin',
    allowedOrigin: process.env.CORS_ORIGINS,
    corsConfigured: true,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("API Key configured:", !!process.env.SUNO_API_URL);
});
