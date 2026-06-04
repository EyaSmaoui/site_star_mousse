import httpClient from './httpClient';

export const getAllCategories = async () => {
  try {
    const response = await httpClient.get('/api/categories/getAllCategories', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all categories error:', error.message);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await httpClient.get(`/api/categories/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get category by id error:', error.message);
    throw error;
  }
};
