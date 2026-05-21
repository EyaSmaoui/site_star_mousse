import httpClient from './httpClient';

export const getAllClients = async () => {
  const response = await httpClient.get('clients/getAllClients');
  return response.data;
};

export const createClient = async (data) => {
  const response = await httpClient.post('clients/addClient', data);
  return response.data;
};

export const updateClient = async (id, data) => {
  const response = await httpClient.put(`clients/updateClient/${id}`, data);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await httpClient.delete(`clients/deleteClient/${id}`);
  return response.data;
};
