import httpClient from './httpClient';

export const register = async (userData) => {
  try {
    const response = await httpClient.post('/api/users/register', userData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Register error:', error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await httpClient.post('/api/users/login', credentials, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const managerLogin = async (credentials) => {
  try {
    const response = await httpClient.post('/api/managers/login', credentials, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Manager login error:', error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await httpClient.post('/api/users/forgot-password', { email }, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error.message);
    throw error;
  }
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  try {
    const response = await httpClient.post(`/api/users/reset-password/${token}`, {
      password,
      confirmPassword,
    }, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await httpClient.get('/api/users/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.message);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getProfile = async () => {
  try {
    const response = await httpClient.get('/api/users/profile', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.message);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await httpClient.put('/api/users/update-profile', userData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.message);
    throw error;
  }
};
