export function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';
  const timestamp = new Date().toISOString();

  // Log detailed error information
  console.error(`[${requestId}] Error at ${timestamp}:`, {
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    headers: {
      ...req.headers,
      authorization: req.headers.authorization ? '[REDACTED]' : undefined
    }
  });

  // Determine appropriate status code
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'Internal server error';

  // Send user-friendly error response
  res.status(statusCode).json({
    error: 'Generation failed',
    details: process.env.NODE_ENV === 'production' 
      ? errorMessage.replace(/\b(api|key|token|secret)\b/gi, '[REDACTED]')
      : errorMessage,
    requestId
  });
}