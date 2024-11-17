export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',') : 
    ['http://localhost:5173', 'https://localhost:5173'],
  sunoApiKey: process.env.SUNO_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY
};