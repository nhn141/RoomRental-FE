import api from './api';

const contractService = {
  // CREATE contract mới (Tenant)
  createContract: async (contractData) => {
    const response = await api.post('/contracts', contractData);
    return response.data;
  },

  // GET tất cả contracts của tenant
  getMyContracts: async (params = {}) => {
    const response = await api.get('/contracts/my/contracts', { params });
    return response.data;
  },

  // GET tất cả contracts của landlord
  getLandlordContracts: async (params = {}) => {
    const response = await api.get('/contracts/landlord/contracts', { params });
    return response.data;
  },

  // GET chi tiết contract
  getContractById: async (id) => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  // GET tất cả contracts (Admin)
  getAllContracts: async (params = {}) => {
    const response = await api.get('/contracts', { params });
    return response.data;
  },

  // UPDATE contract
  updateContract: async (id, contractData) => {
    const response = await api.put(`/contracts/${id}`, contractData);
    return response.data;
  },

  // TERMINATE contract (Landlord/Admin)
  terminateContract: async (id) => {
    const response = await api.put(`/contracts/${id}/terminate`);
    return response.data;
  },

  // DELETE contract
  deleteContract: async (id) => {
    const response = await api.delete(`/contracts/${id}`);
    return response.data;
  },
};

export default contractService;
