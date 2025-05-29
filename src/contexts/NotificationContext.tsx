
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageUtils, Notification } from '../utils/localStorageUtils';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = () => {
    const savedNotifications = localStorageUtils.getNotifications();
    setNotifications(savedNotifications);
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    localStorageUtils.addNotification(newNotification);
    refreshNotifications();
  };

  const markAsRead = (id: string) => {
    localStorageUtils.markNotificationAsRead(id);
    refreshNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      unreadCount,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
