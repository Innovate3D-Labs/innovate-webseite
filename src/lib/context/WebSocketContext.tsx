'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WebSocketClient, WebSocketEvent, initializeWebSocket } from '@/lib/websocket';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (event: WebSocketEvent, handler: (data: any) => void) => void;
  unsubscribe: (event: WebSocketEvent, handler: (data: any) => void) => void;
  send: (type: string, payload: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (client) {
        client.disconnect();
        setClient(null);
      }
      return;
    }

    // Initialize WebSocket client
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
    const token = localStorage.getItem('token');
    
    const wsClient = initializeWebSocket({
      url: wsUrl,
      authToken: token || undefined,
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
    });

    // Set up connection handlers
    wsClient.subscribe(WebSocketEvent.CONNECTED, () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    wsClient.subscribe(WebSocketEvent.DISCONNECTED, () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    wsClient.subscribe(WebSocketEvent.ERROR, (error) => {
      console.error('WebSocket error:', error);
    });

    // Connect to WebSocket
    wsClient.connect();
    setClient(wsClient);

    // Cleanup on unmount
    return () => {
      wsClient.disconnect();
    };
  }, [user]);

  const subscribe = useCallback((event: WebSocketEvent, handler: (data: any) => void) => {
    if (client) {
      client.subscribe(event, handler);
    }
  }, [client]);

  const unsubscribe = useCallback((event: WebSocketEvent, handler: (data: any) => void) => {
    if (client) {
      client.unsubscribe(event, handler);
    }
  }, [client]);

  const send = useCallback((type: string, payload: any) => {
    if (client) {
      client.send(type, payload);
    }
  }, [client]);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const { subscribe, unsubscribe } = useWebSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleNotification = (data: any) => {
      setNotifications(prev => [...prev, data]);
      
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.title || 'Neue Benachrichtigung', {
          body: data.message,
          icon: '/icon-192x192.png',
        });
      }
    };

    subscribe(WebSocketEvent.USER_NOTIFICATION, handleNotification);

    return () => {
      unsubscribe(WebSocketEvent.USER_NOTIFICATION, handleNotification);
    };
  }, [subscribe, unsubscribe]);

  return notifications;
}

// Hook for real-time order updates
export function useRealtimeOrderUpdates(orderId?: string) {
  const { subscribe, unsubscribe } = useWebSocket();
  const [orderStatus, setOrderStatus] = useState<any>(null);

  useEffect(() => {
    const handleOrderUpdate = (data: any) => {
      if (!orderId || data.orderId === orderId) {
        setOrderStatus(data);
      }
    };

    subscribe(WebSocketEvent.ORDER_UPDATE, handleOrderUpdate);

    return () => {
      unsubscribe(WebSocketEvent.ORDER_UPDATE, handleOrderUpdate);
    };
  }, [subscribe, unsubscribe, orderId]);

  return orderStatus;
}

// Hook for real-time printer status
export function useRealtimePrinterStatus(printerId?: string) {
  const { subscribe, unsubscribe } = useWebSocket();
  const [printerStatus, setPrinterStatus] = useState<any>(null);
  const [printProgress, setPrintProgress] = useState<number>(0);

  useEffect(() => {
    const handlePrinterStatus = (data: any) => {
      if (!printerId || data.printerId === printerId) {
        setPrinterStatus(data);
      }
    };

    const handlePrintProgress = (data: any) => {
      if (!printerId || data.printerId === printerId) {
        setPrintProgress(data.progress);
      }
    };

    subscribe(WebSocketEvent.PRINTER_STATUS, handlePrinterStatus);
    subscribe(WebSocketEvent.PRINT_PROGRESS, handlePrintProgress);

    return () => {
      unsubscribe(WebSocketEvent.PRINTER_STATUS, handlePrinterStatus);
      unsubscribe(WebSocketEvent.PRINT_PROGRESS, handlePrintProgress);
    };
  }, [subscribe, unsubscribe, printerId]);

  return { printerStatus, printProgress };
} 