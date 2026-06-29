/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';
import socketService from '../services/socketService';

export const RealtimeContext = createContext(null);

export const RealtimeProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const data = await notificationService.getNotifications({ limit: 20 });
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
  }, [user]);

  useEffect(() => {
    if (!user) {
      socketService.disconnect();
      setSocket(null);
      setNotifications([]);
      setUnreadCount(0);
      return undefined;
    }

    const nextSocket = socketService.connect();
    setSocket(nextSocket);
    refreshNotifications().catch((error) => console.error('Refresh notifications error', error));

    const handleNewNotification = (notification) => {
      setNotifications((prev) => {
        if (prev.some((item) => String(item.id) === String(notification.id))) return prev;
        return [notification, ...prev].slice(0, 20);
      });
    };

    const handleUnreadCount = ({ unreadCount: nextUnreadCount }) => {
      setUnreadCount(nextUnreadCount || 0);
    };

    nextSocket?.on('notification:new', handleNewNotification);
    nextSocket?.on('notification:unreadCount', handleUnreadCount);

    return () => {
      nextSocket?.off('notification:new', handleNewNotification);
      nextSocket?.off('notification:unreadCount', handleUnreadCount);
    };
  }, [refreshNotifications, user]);

  const markNotificationAsRead = useCallback(async (notification) => {
    if (!notification || notification.is_read) return notification;

    const data = await notificationService.markAsRead(notification.id);
    setNotifications((prev) => prev.map((item) => (
      String(item.id) === String(notification.id)
        ? { ...item, is_read: true, read_at: data.notification?.read_at || new Date().toISOString() }
        : item
    )));
    setUnreadCount(data.unreadCount || 0);
    return data.notification;
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    const data = await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((item) => ({
      ...item,
      is_read: true,
      read_at: item.read_at || new Date().toISOString(),
    })));
    setUnreadCount(data.unreadCount || 0);
  }, []);

  const value = useMemo(() => ({
    socket,
    notifications,
    unreadCount,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  }), [
    socket,
    notifications,
    unreadCount,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  ]);

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = React.useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
