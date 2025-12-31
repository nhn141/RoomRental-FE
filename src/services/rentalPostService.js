import api from './api';

const rentalPostService = {
  // GET tất cả bài đăng (có phân trang, filter)
  getAllPosts: async (params = {}) => {
    const response = await api.get('/rental-posts', { params });
    return response.data;
  },

  // GET bài đăng của tôi
  getMyPosts: async (params = {}) => {
    const response = await api.get('/rental-posts/my/posts', { params });
    return response.data;
  },

  // GET chi tiết bài đăng
  getPostById: async (id) => {
    const response = await api.get(`/rental-posts/${id}`);
    return response.data;
  },

  // CREATE bài đăng mới
  createPost: async (postData) => {
    const response = await api.post('/rental-posts', postData);
    return response.data;
  },

  // UPDATE bài đăng
  updatePost: async (id, postData) => {
    const response = await api.put(`/rental-posts/${id}`, postData);
    return response.data;
  },

  // DELETE bài đăng
  deletePost: async (id) => {
    const response = await api.delete(`/rental-posts/${id}`);
    return response.data;
  },

  // APPROVE bài đăng (Admin)
  approvePost: async (postId) => {
    const response = await api.put('/rental-posts/approve', { id: postId });
    return response.data;
  },

  // REJECT bài đăng (Admin)
  rejectPost: async (postId, reason) => {
    const response = await api.put('/rental-posts/reject', { id: postId, rejection_reason: reason });
    return response.data;
  },

  // GET danh sách phòng được gợi ý cho tenant
  getRecommendedPosts: async () => {
    const response = await api.get('/rental-posts/recommendations/my');
    return response.data;
  },
};

export default rentalPostService;
