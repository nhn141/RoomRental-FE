/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_SESSION_REFRESHED_EVENT,
} from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await authService.refreshSession();
        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const handleSessionRefreshed = (event) => {
      setUser(event.detail?.user || null);
    };

    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener(AUTH_SESSION_REFRESHED_EVENT, handleSessionRefreshed);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    restoreSession();

    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_SESSION_REFRESHED_EVENT, handleSessionRefreshed);
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const login = async (email, password, role) => {
    const response = await authService.login(email, password, role);
    setUser(response.user);
    return response;
  };

  const registerTenant = async (userData) => {
    const response = await authService.registerTenant(userData);
    setUser(response.user);
    return response;
  };

  const registerLandlord = async (userData) => {
    const response = await authService.registerLandlord(userData);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    setUser(null);
    authService.logout().catch((error) => console.error('Logout error', error));
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updatedFields };
    });
  };

  const value = {
    user,
    loading,
    login,
    registerTenant,
    registerLandlord,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
