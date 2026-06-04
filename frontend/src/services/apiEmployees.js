import httpClient from './httpClient';

const STAFF_ROLES = new Set(['manager', 'employee', 'employeur']);

export const getAllEmployees = async () => {
  try {
    const response = await httpClient.get('/api/users/getAllUsers', { timeout: 8000 });
    const users = Array.isArray(response.data) ? response.data : [];
    return users.filter((u) => u.role !== 'admin' && u.role !== 'client' && u.role !== 'user');
  } catch (error) {
    console.error('Get all employees error:', error.message);
    throw error;
  }
};

export const createEmployee = async (data) => {
  try {
    const response = await httpClient.post('/api/users/create-employer', data, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Create employee error:', error.message);
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await httpClient.put(`/api/users/update-user/${id}`, data, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Update employee error:', error.message);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await httpClient.delete(`/api/users/deleteUser/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error('Delete employee error:', error.message);
    throw error;
  }
};

export const isStaffRole = (role) => STAFF_ROLES.has(role);
