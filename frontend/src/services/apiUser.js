import httpClient from './httpClient';

export const updateProfile = async (profileData) => {
  const response = await httpClient.put('users/update-profile', profileData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await httpClient.get('users/getAllUsers');
  return response.data;
};

export const updateUserProfile = updateProfile;
