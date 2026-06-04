import httpClient from './httpClient';

export const getAllManagers = async () => {
  try {
    const response = await httpClient.get('/api/managers/getAllManagers', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all managers error:', error.message);
    throw error;
  }
};

export const createManager = async (data) => {
  try {
    const response = await httpClient.post('/api/managers/addManager', data, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Create manager error:', error.message);
    throw error;
  }
};

export const updateManager = async (id, data) => {
  try {
    const response = await httpClient.put(`/api/managers/updateManager/${id}`, data, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Update manager error:', error.message);
    throw error;
  }
};

export const deleteManager = async (id) => {
  try {
    const response = await httpClient.delete(`/api/managers/deleteManager/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Delete manager error:', error.message);
    throw error;
  }
};
