import httpClient from './httpClient';

export const createEmployer = async (employerData) => {
  const response = await httpClient.post('/api/users/create-employer', {
    ...employerData,
    role: employerData.role || 'employee',
  });
  return response;
};
