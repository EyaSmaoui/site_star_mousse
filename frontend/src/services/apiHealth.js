import httpClient from './httpClient';

export const checkApiHealth = async () => {
  const response = await httpClient.get('/api/health');
  return response.data;
};
