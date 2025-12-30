import api from './api';

const locationService = {
  getProvinces: async () => {
    const response = await api.get('/locations/provinces');
    return response.data.provinces ?? [];
  },

  getWards: async (provinceCode) => {
    const response = await api.get('/locations/wards', {
      params: { province_code: provinceCode }
    });
    return response.data.wards ?? [];
  },

  searchProvinces: async (keyword) => {
    const response = await api.get('/locations/search-province', {
      params: { keyword }
    });
    return response.data.provinces ?? [];
  },

  searchWards: async (provinceCode, keyword) => {
    const response = await api.get('/locations/search-ward', {
      params: { province_code: provinceCode, keyword }
    });
    return response.data.wards ?? [];
  }
};

export default locationService;
