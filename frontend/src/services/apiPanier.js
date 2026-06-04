import httpClient from './httpClient';

export const getAllCarts = async () => {
  try {
    const response = await httpClient.get('/api/paniers/C', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all carts error:', error.message);
    throw error;
  }
};

export const getCartById = async (id) => {
  try {
    const response = await httpClient.get(`/api/paniers/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get cart by id error:', error.message);
    throw error;
  }
};

export const addCart = async (cartData) => {
  try {
    const response = await httpClient.post('/api/paniers/addCart', cartData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Add cart error:', error.message);
    throw error;
  }
};

export const updateCart = async (id, cartData) => {
  try {
    const response = await httpClient.put(`/api/paniers/updateCart/${id}`, cartData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Update cart error:', error.message);
    throw error;
  }
};

export const deleteCart = async (id) => {
  try {
    const response = await httpClient.delete(`/api/paniers/deleteCart/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Delete cart error:', error.message);
    throw error;
  }
};

export const addProductToCart = async (id, productData) => {
  try {
    const response = await httpClient.post(`/api/paniers/addProduct/${id}`, productData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Add product to cart error:', error.message);
    throw error;
  }
};

export const removeProductFromCart = async (id, productData) => {
  try {
    const response = await httpClient.delete(`/api/paniers/removeProduct/${id}`, { data: productData, timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Remove product from cart error:', error.message);
    throw error;
  }
};
