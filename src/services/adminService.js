import api from './api';

const adminService = {
  createAdmin: async (data) => {
    // Dựa theo Architecture endpoint là /admins/create
    const response = await api.post('/admins/create', data);
    return response.data;
  }
};

export default adminService;