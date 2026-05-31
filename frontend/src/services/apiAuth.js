import httpClient from './httpClient';

export const register = async (userData) => {
  const response = await httpClient.post('users/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await httpClient.post('users/login', credentials, { timeout: 6000 });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await httpClient.post('users/forgot-password', { email });
  return response.data;
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  const response = await httpClient.post(`users/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

export const logout = async () => {
  try {
    const response = await httpClient.get('users/logout');
    return response.data;
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getProfile = async () => {
  const response = await httpClient.get('users/profile');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await httpClient.put('users/update-profile', userData);
  return response.data;
};
