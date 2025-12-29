import { useState, useCallback } from 'react';
import rentalPostService from '../services/rentalPostService';

export const useRentalPosts = () => {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  const fetchAllPosts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.getAllPosts(params);
      setPosts(data.posts || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy danh sách bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyPosts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.getMyPosts(params);
      setMyPosts(data.posts || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy bài đăng của tôi';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.getPostById(id);
      setCurrentPost(data.post || data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lấy chi tiết bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.createPost(postData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi tạo bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.updatePost(id, postData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.deletePost(id);
      setMyPosts(myPosts.filter(post => post.id !== id));
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi xóa bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [myPosts]);

  const approvePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.approvePost(postId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi phê duyệt bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectPost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalPostService.rejectPost(postId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi từ chối bài đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    myPosts,
    currentPost,
    loading,
    error,
    pagination,
    fetchAllPosts,
    fetchMyPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    approvePost,
    rejectPost,
  };
};
