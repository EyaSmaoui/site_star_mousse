import httpClient from './httpClient';

const PRODUCTS_CACHE_TTL = 60000;
let productsCache = {
  data: null,
  timestamp: 0,
  promise: null,
};

export const invalidateProductsCache = () => {
  productsCache = {
    data: null,
    timestamp: 0,
    promise: null,
  };
};

export const getAll = async ({ force = false } = {}) => {
  const now = Date.now();
  if (!force && productsCache.data && now - productsCache.timestamp < PRODUCTS_CACHE_TTL) {
    return productsCache.data;
  }

  if (!force && productsCache.promise) {
    return productsCache.promise;
  }

  productsCache.promise = (async () => {
    try {
      const response = await httpClient.get('/api/products', { timeout: 8000 });
      productsCache.data = Array.isArray(response.data) ? response.data : [];
      productsCache.timestamp = Date.now();
      return productsCache.data;
    } catch (error) {
      console.error('Get all products error:', error.message);
      throw error;
    } finally {
      productsCache.promise = null;
    }
  })();

  return productsCache.promise;
};

export const getAllProductsFresh = async () => {
  try {
    const response = await httpClient.get('/api/products', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all products fresh error:', error.message);
    throw error;
  }
};

export const getRecommended = async (limit = 6) => {
  try {
    const response = await httpClient.get('/api/products/recommended', {
      params: { limit },
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.error('Get recommended products error:', error.message);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await httpClient.get(`/api/products/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get product by id error:', error.message);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await httpClient.post('/api/products/add', productData, { timeout: 8000 });
    invalidateProductsCache();
    return response.data;
  } catch (error) {
    console.error('Create product error:', error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await httpClient.put(`/api/products/update/${id}`, productData, { timeout: 8000 });
    invalidateProductsCache();
    return response.data;
  } catch (error) {
    console.error('Update product error:', error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await httpClient.delete(`/api/products/delete/${id}`, { timeout: 8000 });
    invalidateProductsCache();
    return response.data;
  } catch (error) {
    console.error('Delete product error:', error.message);
    throw error;
  }
};

export const search = async (query) => {
  try {
    const response = await httpClient.get('/api/products/search', {
      params: { name: query },
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.error('Search products error:', error.message);
    throw error;
  }
};
