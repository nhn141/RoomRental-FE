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
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // { message, avatar_url }
  },
};

export default profileService;