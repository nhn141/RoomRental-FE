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
    const response = await api.put('/rental-posts/approve', { post_id: postId });
    return response.data;
  },

  // REJECT bài đăng (Admin)
  rejectPost: async (postId) => {
    const response = await api.put('/rental-posts/reject', { post_id: postId });
    return response.data;
  },
};

export default rentalPostService;
