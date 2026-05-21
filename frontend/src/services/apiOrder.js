import httpClient from './httpClient';

export const getAllOrders = async () => {
  const response = await httpClient.get('orders/getAllOrders');
  return response.data;
};

export const updateOrder = async (orderId, updateData) => {
  const response = await httpClient.put(`orders/updateOrder/${orderId}`, updateData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await httpClient.get('orders/my-orders');
  return response.data;
};

export const addOrder = async (data) => {
  const response = await httpClient.post('orders/addOrder', data);
  return response.data;
};
