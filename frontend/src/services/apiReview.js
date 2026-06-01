import httpClient from './httpClient';

export const getAllReviews = async () => {
  const response = await httpClient.get('/api/reviews/getAllReviews');
  return response.data;
};

export const getMyReviews = async () => {
  const response = await httpClient.get('/api/reviews/my-reviews');
  return response.data;
};

export const getProductReviews = async (productId) => {
  const response = await httpClient.get(`/api/reviews/product/${productId}`);
  return response.data;
};

export const addReview = async (payload) => {
  const response = await httpClient.post('/api/reviews/addReview', payload);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await httpClient.delete(`/api/reviews/deleteReview/${id}`);
  return response.data;
};
