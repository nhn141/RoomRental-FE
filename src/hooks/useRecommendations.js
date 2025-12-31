import { useState, useCallback } from 'react';
import rentalPostService from '../services/rentalPostService';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.getRecommendedPosts();
      setRecommendations(data.recommendations || []);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy danh sách gợi ý phòng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations
  };
};
