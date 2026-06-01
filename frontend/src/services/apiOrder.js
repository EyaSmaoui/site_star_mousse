import httpClient from './httpClient';

const ORDERS_CACHE_TTL = 60000;
let ordersCache = {
  data: null,
  key: null,
  timestamp: 0,
  promise: null,
};

export const invalidateOrdersCache = () => {
  ordersCache = {
    data: null,
    key: null,
    timestamp: 0,
    promise: null,
  };
};

export const getAllOrders = async ({ force = false, limit = 300 } = {}) => {
  const now = Date.now();
  const cacheKey = `limit:${limit}`;
  if (!force && ordersCache.data && ordersCache.key === cacheKey && now - ordersCache.timestamp < ORDERS_CACHE_TTL) {
    return ordersCache.data;
  }

  if (!force && ordersCache.promise && ordersCache.key === cacheKey) {
    return ordersCache.promise;
  }

  ordersCache.key = cacheKey;
  ordersCache.promise = httpClient.get('/api/orders/getAllOrders', {
    params: { limit },
    timeout: 10000,
  }).then((response) => {
    ordersCache.data = Array.isArray(response.data) ? response.data : [];
    ordersCache.timestamp = Date.now();
    return ordersCache.data;
  }).finally(() => {
    ordersCache.promise = null;
  });

  return ordersCache.promise;
};

export const getCachedOrders = () => ordersCache.data || [];

export const updateOrder = async (orderId, updateData) => {
  const response = await httpClient.put(`/api/orders/updateOrder/${orderId}`, updateData);
  invalidateOrdersCache();
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await httpClient.delete(`/api/orders/deleteOrder/${orderId}`);
  invalidateOrdersCache();
  return response.data;
};

export const getMyOrders = async () => {
  const response = await httpClient.get('/api/orders/my-orders');
  return response.data;
};

export const addOrder = async (data) => {
  const response = await httpClient.post('/api/orders/addOrder', data);
  invalidateOrdersCache();
  return response.data;
};
