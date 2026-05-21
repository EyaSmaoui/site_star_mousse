import httpClient from './httpClient';

export const createEmployer = async (employerData) => {
  const response = await httpClient.post('users/create-employer', {
    ...employerData,
    role: employerData.role || 'manager',
  });
  return response;
};
