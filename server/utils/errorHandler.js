export function handleApiError(error, requestId) {
  console.error(`[${requestId}] Generation failed:`, {
    error: error.message,
    code: error.code,
    response: error.response?.data,
    status: error.response?.status
  });

  // Handle specific error cases
  if (error.isAxiosError) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('The request took too long to complete. Please try again.');
      }
      throw new Error('Unable to reach the music generation service. Please check your connection.');
    }

    const status = error.response.status;
    const errorData = error.response.data;

    switch (status) {
      case 400:
        throw new Error(errorData?.details || 'Invalid request parameters');
      case 401:
        throw new Error('Authentication failed - Please check your API key');
      case 403:
        throw new Error('Access denied - Please check your API permissions');
      case 404:
        throw new Error('Music generation service is currently unavailable');
      case 429:
        throw new Error('Too many requests. Please wait a moment before trying again.');
      case 503:
        throw new Error('Service is temporarily unavailable. Please try again in a few minutes.');
      default:
        throw new Error(
          errorData?.details || 
          errorData?.error || 
          'An error occurred while generating music. Please try again.'
        );
    }
  }

  // For non-Axios errors, provide a generic message
  throw new Error('Failed to generate music. Please try again.');
}