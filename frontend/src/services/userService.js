import httpClient from './httpClient';

export const updateProfile = async (profileData) => {
  try {
    const response = await httpClient.put('/api/users/update-profile', profileData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await httpClient.get('/api/users/getAllUsers', { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error.message);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await httpClient.put('/api/users/change-password', passwordData, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error.message);
    throw error;
  }
};

export const updateUserProfile = updateProfile;
