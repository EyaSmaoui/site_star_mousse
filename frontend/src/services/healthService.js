import httpClient from './httpClient';

export const checkApiHealth = async () => {
  try {
    const response = await httpClient.get('/api/health', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Check API health error:', error.message);
    throw error;
  }
};
