import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

let socket = null;

const socketService = {
  connect: () => {
    if (socket?.connected) {
      return socket;
    }

    socket = io(getSocketUrl(), {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,
};

export default socketService;
