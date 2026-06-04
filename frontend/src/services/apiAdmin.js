import httpClient from './httpClient';

export const createEmployer = async (employerData) => {
  try {
    const response = await httpClient.post('/api/users/create-employer', {
      ...employerData,
      role: employerData.role || 'employee',
    }, { timeout: 8000 });
    return response;
  } catch (error) {
    console.error('Create employer error:', error.message);
    throw error;
  }
};
