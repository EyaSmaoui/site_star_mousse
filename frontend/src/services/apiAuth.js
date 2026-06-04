import httpClient from './httpClient';

export const register = async (userData) => {
  const response = await httpClient.post('/api/users/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await httpClient.post('/api/users/login', credentials, { timeout: 6000 });
  return response.data;
};

export const managerLogin = async (credentials) => {
  const response = await httpClient.post('/api/managers/login', credentials, { timeout: 6000 });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await httpClient.post('/api/users/forgot-password', { email });
  return response.data;
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  const response = await httpClient.post(`/api/users/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

export const logout = async () => {
  try {
    const response = await httpClient.get('/api/users/logout');
    return response.data;
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getProfile = async () => {
  const response = await httpClient.get('/api/users/profile');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await httpClient.put('/api/users/update-profile', userData);
  return response.data;
};
