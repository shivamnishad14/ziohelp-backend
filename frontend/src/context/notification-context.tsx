import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Notification type (should match backend NotificationMessage)
export interface NotificationMessage {
  id?: string;
  title: string;
  body: string;
  type: string;
  ticketId?: string;
  url?: string;
  createdAt?: string;
  isRead?: boolean;
}

interface NotificationContextType {
  notifications: NotificationMessage[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: NotificationMessage) => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const stompClient = useRef<Client | null>(null);
  const userId = localStorage.getItem('userId');

  // Fetch initial notifications and unread count
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/v1/notifications`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter((n: NotificationMessage) => !n.isRead).length);
      }
    } catch (e) {
      // handle error
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    await fetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = async () => {
    await fetch(`/api/v1/notifications/mark-all-read`, { method: 'PUT' });
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // Add notification (from WebSocket)
  const addNotification = (notification: NotificationMessage) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  // WebSocket connection
  useEffect(() => {
    if (!userId) return;
    const socket = new SockJS('/ws');
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to user queue
        client.subscribe(`/queue/notifications-${userId}`, (message: IMessage) => {
          const notif = JSON.parse(message.body);
          addNotification(notif);
        });
        // Subscribe to global topic
        client.subscribe('/topic/notifications', (message: IMessage) => {
          const notif = JSON.parse(message.body);
          addNotification(notif);
        });
      },
    });
    client.activate();
    stompClient.current = client;
    return () => {
      client.deactivate();
    };
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}; 