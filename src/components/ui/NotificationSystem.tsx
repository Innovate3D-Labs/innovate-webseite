'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRealtimeNotifications } from '@/lib/context/WebSocketContext';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface NotificationSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}

// Global notification emitter
class NotificationEmitter {
  private listeners: ((notification: Notification) => void)[] = [];

  subscribe(listener: (notification: Notification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(notification: Omit<Notification, 'id'>) {
    const fullNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.listeners.forEach(listener => listener(fullNotification));
  }
}

export const notificationEmitter = new NotificationEmitter();

// Helper functions for easy notification creation
export const notify = {
  success: (title: string, message?: string, options?: Partial<Notification>) => {
    notificationEmitter.emit({ type: 'success', title, message, ...options });
  },
  error: (title: string, message?: string, options?: Partial<Notification>) => {
    notificationEmitter.emit({ type: 'error', title, message, ...options });
  },
  warning: (title: string, message?: string, options?: Partial<Notification>) => {
    notificationEmitter.emit({ type: 'warning', title, message, ...options });
  },
  info: (title: string, message?: string, options?: Partial<Notification>) => {
    notificationEmitter.emit({ type: 'info', title, message, ...options });
  },
};

export default function NotificationSystem({
  position = 'top-right',
  maxNotifications = 5,
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const realtimeNotifications = useRealtimeNotifications();

  // Subscribe to notification emitter
  useEffect(() => {
    const unsubscribe = notificationEmitter.subscribe((notification) => {
      setNotifications(prev => {
        const newNotifications = [notification, ...prev];
        // Limit number of notifications
        return newNotifications.slice(0, maxNotifications);
      });

      // Auto-remove after duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || 5000);
      }
    });

    return unsubscribe;
  }, [maxNotifications]);

  // Handle real-time notifications from WebSocket
  useEffect(() => {
    realtimeNotifications.forEach(notification => {
      notify.info(notification.title || 'Neue Benachrichtigung', notification.message);
    });
  }, [realtimeNotifications]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 pointer-events-none`}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto mb-4"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                    )}
                    {notification.action && (
                      <div className="mt-3">
                        <button
                          onClick={notification.action.handler}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {notification.action.label}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span className="sr-only">Schließen</span>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Progress bar for auto-dismiss */}
              {notification.duration !== 0 && (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{
                    duration: (notification.duration || 5000) / 1000,
                    ease: 'linear',
                  }}
                  className="h-1 bg-gray-200 origin-left"
                  style={{
                    backgroundColor:
                      notification.type === 'success'
                        ? '#10b981'
                        : notification.type === 'error'
                        ? '#ef4444'
                        : notification.type === 'warning'
                        ? '#f59e0b'
                        : '#3b82f6',
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// React hook for using notifications
export function useNotification() {
  return notify;
} 