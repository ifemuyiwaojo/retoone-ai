export function requestLogger(req, res, next) {
  const requestId = Date.now().toString(36);
  req.id = requestId;

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log request details
  console.log(`[${requestId}] ${timestamp} Incoming ${req.method} ${req.url}`, {
    query: req.query,
    body: req.body,
    headers: {
      ...req.headers,
      authorization: req.headers.authorization ? '[REDACTED]' : undefined
    }
  });

  // Log response details
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Response sent in ${duration}ms:`, {
      status: res.statusCode,
      statusMessage: res.statusMessage,
      contentLength: res.get('content-length'),
      contentType: res.get('content-type')
    });
  });

  next();
}