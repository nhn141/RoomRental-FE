import api from './api';

const adminService = {
  createAdmin: async (data) => {
    const response = await api.post('/admins/create', data);
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/admins/users', { params });
    return response.data;
  },

  getUserDetail: async (id) => {
    const response = await api.get(`/admins/users/${id}`);
    return response.data;
  },

  getAllContracts: async (params = {}) => {
    const response = await api.get('/admins/contracts', { params });
    return response.data;
  }
};

export default adminService;