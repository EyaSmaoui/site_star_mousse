import httpClient from './httpClient';

export const getAllManagers = async () => {
  const response = await httpClient.get('managers/getAllManagers');
  return response.data;
};

export const createManager = async (data) => {
  const response = await httpClient.post('managers/addManager', data);
  return response.data;
};

export const updateManager = async (id, data) => {
  const response = await httpClient.put(`managers/updateManager/${id}`, data);
  return response.data;
};

export const deleteManager = async (id) => {
  const response = await httpClient.delete(`managers/deleteManager/${id}`);
  return response.data;
};
