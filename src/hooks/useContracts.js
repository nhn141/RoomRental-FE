import { useState, useCallback } from 'react';
import contractService from '../services/contractService';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [myContracts, setMyContracts] = useState([]);
  const [landlordContracts, setLandlordContracts] = useState([]);
  const [currentContract, setCurrentContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  // Fetch all contracts (Admin)
  const fetchAllContracts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getAllContracts(params);
      setContracts(data.contracts || []);
      if (data.total) {
        setPagination({ ...pagination, total: data.total });
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy danh sách hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // Fetch my contracts (Tenant)
  const fetchMyContracts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getMyContracts(params);
      setMyContracts(data.contracts || []);
      if (data.total) {
        setPagination({ ...pagination, total: data.total });
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy hợp đồng của tôi';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // Fetch landlord contracts (Landlord)
  const fetchLandlordContracts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getLandlordContracts(params);
      setLandlordContracts(data.contracts || []);
      if (data.total) {
        setPagination({ ...pagination, total: data.total });
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy hợp đồng của tôi';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // Fetch contract detail
  const fetchContractById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getContractById(id);
      setCurrentContract(data.contract);
      return data.contract;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy chi tiết hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create contract (Tenant)
  const createContract = useCallback(async (contractData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.createContract(contractData);
      setCurrentContract(data.contract);
      // Refresh my contracts list
      await fetchMyContracts();
      return data.contract;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi tạo hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyContracts]);

  // Update contract
  const updateContract = useCallback(async (id, contractData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.updateContract(id, contractData);
      setCurrentContract(data.contract);
      // Refresh lists
      await fetchMyContracts();
      await fetchLandlordContracts();
      return data.contract;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyContracts, fetchLandlordContracts]);

  // Terminate contract (Landlord/Admin)
  const terminateContract = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.terminateContract(id);
      setCurrentContract(data.contract);
      // Refresh lists
      await fetchLandlordContracts();
      await fetchMyContracts();
      return data.contract;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi kết thúc hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLandlordContracts, fetchMyContracts]);

  // Delete contract
  const deleteContract = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await contractService.deleteContract(id);
      setCurrentContract(null);
      // Refresh lists
      await fetchMyContracts();
      await fetchLandlordContracts();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi xóa hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyContracts, fetchLandlordContracts]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    contracts,
    myContracts,
    landlordContracts,
    currentContract,
    loading,
    error,
    pagination,
    fetchAllContracts,
    fetchMyContracts,
    fetchLandlordContracts,
    fetchContractById,
    createContract,
    updateContract,
    terminateContract,
    deleteContract,
    clearError,
  };
};
