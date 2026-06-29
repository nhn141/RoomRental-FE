import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const AUTH_SESSION_REFRESHED_EVENT = 'auth:session-refreshed';
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

const clearLegacyAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const emitAuthEvent = (eventName, detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

const isAuthEndpoint = (url = '') => url.includes('/auth/');

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then((response) => {
        clearLegacyAuthStorage();
        emitAuthEvent(AUTH_SESSION_REFRESHED_EVENT, response.data);
        return response;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        await refreshSession();
        return api(originalRequest);
      } catch (refreshError) {
        clearLegacyAuthStorage();
        emitAuthEvent(AUTH_SESSION_EXPIRED_EVENT);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
