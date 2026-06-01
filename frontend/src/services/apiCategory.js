import httpClient from './httpClient';

export const getAllCategories = async () => {
  const response = await httpClient.get('/api/categories/getAllCategories');
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await httpClient.get(`/api/categories/${id}`);
  return response.data;
};
