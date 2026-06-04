import httpClient from './httpClient';

export const getAllReviews = async () => {
  try {
    const response = await httpClient.get('/api/reviews/getAllReviews', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all reviews error:', error.message);
    throw error;
  }
};

export const getMyReviews = async () => {
  try {
    const response = await httpClient.get('/api/reviews/my-reviews', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get my reviews error:', error.message);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await httpClient.get(`/api/reviews/product/${productId}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get product reviews error:', error.message);
    throw error;
  }
};

export const addReview = async (payload) => {
  try {
    const response = await httpClient.post('/api/reviews/addReview', payload, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Add review error:', error.message);
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await httpClient.delete(`/api/reviews/deleteReview/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Delete review error:', error.message);
    throw error;
  }
};
