import { useState, useEffect, useCallback } from 'react';
import locationService from '../services/locationService';

export const useLocation = () => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      setError(null);
      try {
        const data = await locationService.getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Lỗi khi tải danh sách tỉnh/thành phố');
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch wards when province changes
  const fetchWards = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return;
    }

    setLoadingWards(true);
    setError(null);
    try {
      const data = await locationService.getWards(provinceCode);
      setWards(data);
    } catch (err) {
      console.error('Error fetching wards:', err);
      setError('Lỗi khi tải danh sách phường/xã');
      setWards([]);
    } finally {
      setLoadingWards(false);
    }
  }, []);

  // Search provinces
  const searchProvinces = useCallback(async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      const data = await locationService.getProvinces();
      setProvinces(data);
      return;
    }

    setError(null);
    try {
      const data = await locationService.searchProvinces(keyword);
      setProvinces(data);
    } catch (err) {
      console.error('Error searching provinces:', err);
      setError('Lỗi khi tìm kiếm tỉnh/thành phố');
    }
  }, []);

  // Search wards
  const searchWards = useCallback(async (provinceCode, keyword) => {
    if (!keyword || keyword.trim() === '') {
      const data = await locationService.getWards(provinceCode);
      setWards(data);
      return;
    }

    setError(null);
    try {
      const data = await locationService.searchWards(provinceCode, keyword);
      setWards(data);
    } catch (err) {
      console.error('Error searching wards:', err);
      setError('Lỗi khi tìm kiếm phường/xã');
    }
  }, []);

  return {
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    error,
    fetchWards,
    searchProvinces,
    searchWards
  };
};
