import httpClient from './httpClient';

export const updateProfile = async (profileData) => {
  const response = await httpClient.put('/api/users/update-profile', profileData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await httpClient.get('/api/users/getAllUsers');
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await httpClient.put('/api/users/change-password', passwordData);
  return response.data;
};

export const updateUserProfile = updateProfile;
