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
  if (force) {
    invalidateOrdersCache();
  }

  const now = Date.now();
  const cacheKey = `limit:${limit}`;
  if (!force && ordersCache.data && ordersCache.key === cacheKey && now - ordersCache.timestamp < ORDERS_CACHE_TTL) {
    return ordersCache.data;
  }

  if (!force && ordersCache.promise && ordersCache.key === cacheKey) {
    return ordersCache.promise;
  }

  ordersCache.key = cacheKey;
  ordersCache.promise = (async () => {
    try {
      const response = await httpClient.get('/api/orders/getAllOrders', {
        params: force ? { limit, _t: Date.now() } : { limit },
        timeout: 8000,
      });
      ordersCache.data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.orders)
          ? response.data.orders
          : [];
      ordersCache.timestamp = Date.now();
      return ordersCache.data;
    } catch (error) {
      console.error('Get all orders error:', error.message);
      throw error;
    } finally {
      ordersCache.promise = null;
    }
  })();

  return ordersCache.promise;
};

export const getCachedOrders = () => ordersCache.data || [];

export const checkOrdersConnection = async () => {
  try {
    const response = await httpClient.get('/api/orders/ping', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Check orders connection error:', error.message);
    throw error;
  }
};

export const updateOrder = async (orderId, updateData) => {
  try {
    const response = await httpClient.put(`/api/orders/updateOrder/${orderId}`, updateData, { timeout: 8000 });
    invalidateOrdersCache();
    return response.data;
  } catch (error) {
    console.error('Update order error:', error.message);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await httpClient.delete(`/api/orders/deleteOrder/${orderId}`, { timeout: 8000 });
    invalidateOrdersCache();
    return response.data;
  } catch (error) {
    console.error('Delete order error:', error.message);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await httpClient.get('/api/orders/my-orders', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get my orders error:', error.message);
    throw error;
  }
};

export const addOrder = async (data) => {
  try {
    const response = await httpClient.post('/api/orders/addOrder', data, { timeout: 8000 });
    invalidateOrdersCache();
    return response.data;
  } catch (error) {
    console.error('Add order error:', error.message);
    throw error;
  }
};
