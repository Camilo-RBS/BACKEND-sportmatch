import api from '../lib/api';

export const chatService = {
  getMessages: (userId) => api.get(userId ? `/chat/${userId}` : '/chat'),
  sendMessage: (messageData) => api.post('/chat', messageData),
  searchUsers: (query) => api.get(`/users/search?search=${query}`),
};