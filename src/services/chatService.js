import api from './api';

const chatService = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  createConversation: async (payload) => {
    const response = await api.post('/chat/conversations', payload);
    return response.data;
  },

  searchUsers: async (email) => {
    const response = await api.get('/chat/users/search', { params: { email } });
    return response.data;
  },

  getMessages: async (conversationId, params = {}) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  markConversationRead: async (conversationId) => {
    const response = await api.post(`/chat/conversations/${conversationId}/read`);
    return response.data;
  },

  sendMessage: async (payload) => {
    const response = await api.post('/chat/messages', payload);
    return response.data;
  },
};

export default chatService;
