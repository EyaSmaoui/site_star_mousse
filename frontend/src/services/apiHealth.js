import httpClient from './httpClient';

export const checkApiHealth = async () => {
  const response = await httpClient.get('health');
  return response.data;
};
