import httpClient from './httpClient';

export const getAllCarts = async () => {
  const response = await httpClient.get('paniers/C');
  return response.data;
};

export const getCartById = async (id) => {
  const response = await httpClient.get(`paniers/${id}`);
  return response.data;
};

export const addCart = async (cartData) => {
  const response = await httpClient.post('paniers/addCart', cartData);
  return response.data;
};

export const updateCart = async (id, cartData) => {
  const response = await httpClient.put(`paniers/updateCart/${id}`, cartData);
  return response.data;
};

export const deleteCart = async (id) => {
  const response = await httpClient.delete(`paniers/deleteCart/${id}`);
  return response.data;
};

export const addProductToCart = async (id, productData) => {
  const response = await httpClient.post(`paniers/addProduct/${id}`, productData);
  return response.data;
};

export const removeProductFromCart = async (id, productData) => {
  const response = await httpClient.delete(`paniers/removeProduct/${id}`, { data: productData });
  return response.data;
};
