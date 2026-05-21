import httpClient from './httpClient';

const STAFF_ROLES = new Set(['manager', 'employee', 'employeur']);

export const getAllEmployees = async () => {
  const response = await httpClient.get('users/getAllUsers');
  const users = Array.isArray(response.data) ? response.data : [];
  return users.filter((u) => u.role !== 'admin' && u.role !== 'client' && u.role !== 'user');
};

export const createEmployee = async (data) => {
  const response = await httpClient.post('users/create-employer', data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await httpClient.put(`users/update-user/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await httpClient.delete(`users/deleteUser/${id}`);
  return response.data;
};

export const isStaffRole = (role) => STAFF_ROLES.has(role);
