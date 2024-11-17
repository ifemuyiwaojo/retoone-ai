import axios from 'axios';

const testApiCall = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/generate', {
      description: "Create an upbeat song with a catchy melody",
      genre: "Pop",
      subgenres: ["Dance-pop", "Synth-pop"]
    });
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
};

testApiCall();