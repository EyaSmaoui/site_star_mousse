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

  productsCache.promise = httpClient.get('products').then((response) => {
    productsCache.data = Array.isArray(response.data) ? response.data : [];
    productsCache.timestamp = Date.now();
    return productsCache.data;
  }).finally(() => {
    productsCache.promise = null;
  });

  return productsCache.promise;
};

export const getAllProductsFresh = async () => {
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
  invalidateProductsCache();
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await httpClient.put(`products/update/${id}`, productData);
  invalidateProductsCache();
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await httpClient.delete(`products/delete/${id}`);
  invalidateProductsCache();
  return response.data;
};

export const search = async (query) => {
  const response = await httpClient.get('products/search', {
    params: { name: query },
  });
  return response.data;
};
