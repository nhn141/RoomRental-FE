import { useState, useCallback } from 'react';
import adminService from '../services/adminService';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAdmin = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.createAdmin(data);
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi tạo admin mới';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllUsers(params);
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy danh sách người dùng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllContracts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllContracts(params);
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy danh sách hợp đồng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, createAdmin, getAllUsers, getAllContracts };
};