import { useState, useCallback } from 'react';
import profileService from '../services/profileService';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      // BE thường trả về { user: ... } hoặc trực tiếp object user
      setProfile(data.user || data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy thông tin cá nhân';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.updateProfile(data);
      // Cập nhật state local ngay lập tức để UI phản hồi nhanh
      setProfile(prev => ({ ...prev, ...data }));
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật thông tin';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile, updateProfile };
};