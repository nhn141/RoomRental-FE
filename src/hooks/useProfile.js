import { useState, useCallback } from 'react';
import profileService from '../services/profileService';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { updateUser } = useAuth();

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

  const uploadAvatar = useCallback(async (file) => {
    setUploadingAvatar(true);
    try {
      const res = await profileService.uploadAvatar(file);
      // Cập nhật profile state
      setProfile((prev) => prev ? { ...prev, avatar_url: res.avatar_url } : prev);
      // Cập nhật AuthContext → Header avatar render lại ngay
      updateUser({ avatar_url: res.avatar_url });
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi upload ảnh';
      throw new Error(errorMessage);
    } finally {
      setUploadingAvatar(false);
    }
  }, [updateUser]);

  return { profile, loading, error, fetchProfile, updateProfile, uploadAvatar, uploadingAvatar };
};