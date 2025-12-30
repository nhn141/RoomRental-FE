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
      // BE trả về { profile }
      setProfile(data.profile || data);
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
      // BE trả về { profile } - cập nhật từ response
      const updatedProfile = res.profile || res;
      setProfile(updatedProfile);
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