import api from './api';

const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    // BE returns { message, profile }
    return response.data.profile ?? response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/profile/edit-profile', data);
    // BE returns { message, profile }
    return response.data.profile ?? response.data;
  }
};

export default profileService;