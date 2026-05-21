import httpClient from './httpClient';

export const getAll = async () => {
  const response = await httpClient.get('products');
  return response.data;
};

export const getRecommended = async (limit = 6) => {
  const response = await httpClient.get('products/recommended', {
    params: { limit },
  });
  return response.data;
};

export const getById = async (id) => {
  const response = await httpClient.get(`products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await httpClient.post('products/add', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await httpClient.put(`products/update/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await httpClient.delete(`products/delete/${id}`);
  return response.data;
};

export const search = async (query) => {
  const response = await httpClient.get('products/search', {
    params: { name: query },
  });
  return response.data;
};
