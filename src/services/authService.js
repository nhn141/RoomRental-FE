import api from './api';

const clearLegacyAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  registerTenant: async (userData) => {
    const response = await api.post('/auth/tenant/register', userData);
    clearLegacyAuthStorage();
    return response.data;
  },

  registerLandlord: async (userData) => {
    const response = await api.post('/auth/landlord/register', userData);
    clearLegacyAuthStorage();
    return response.data;
  },

  login: async (email, password, role) => {
    const response = await api.post(`/auth/${role}/login`, { email, password });
    clearLegacyAuthStorage();
    return response.data;
  },

  refreshSession: async () => {
    const response = await api.post('/auth/refresh');
    clearLegacyAuthStorage();
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearLegacyAuthStorage();
    }
  },

  getCurrentUser: () => null,

  getToken: () => null,

  isAuthenticated: () => false,

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

export default authService;
