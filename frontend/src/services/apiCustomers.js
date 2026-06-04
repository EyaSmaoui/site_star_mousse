import httpClient from './httpClient';

export const getAllClients = async () => {
  try {
    const response = await httpClient.get('/api/clients/getAllClients', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all clients error:', error.message);
    throw error;
  }
};

export const createClient = async (data) => {
  try {
    const response = await httpClient.post('/api/clients/addClient', data, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Create client error:', error.message);
    throw error;
  }
};

export const updateClient = async (id, data) => {
  try {
    const response = await httpClient.put(`/api/clients/updateClient/${id}`, data, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Update client error:', error.message);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await httpClient.delete(`/api/clients/deleteClient/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Delete client error:', error.message);
    throw error;
  }
};
