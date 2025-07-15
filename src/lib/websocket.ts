// WebSocket client for real-time features
import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export enum WebSocketEvent {
  // Connection events
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  
  // Business events
  ORDER_UPDATE = 'order_update',
  PAYMENT_UPDATE = 'payment_update',
  PRINTER_STATUS = 'printer_status',
  PRINT_PROGRESS = 'print_progress',
  NEW_DESIGN_LIKE = 'new_design_like',
  NEW_COMMENT = 'new_comment',
  USER_NOTIFICATION = 'user_notification',
}

interface WebSocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  authToken?: string;
}

export class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig & {
    reconnect: boolean;
    reconnectInterval: number;
    maxReconnectAttempts: number;
    heartbeatInterval: number;
  };
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;
  private messageQueue: WebSocketMessage[] = [];

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;
    const wsUrl = this.config.authToken 
      ? `${this.config.url}?token=${this.config.authToken}`
      : this.config.url;

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit(WebSocketEvent.CONNECTED);
      this.startHeartbeat();
      this.flushMessageQueue();
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected', event);
      this.stopHeartbeat();
      this.emit(WebSocketEvent.DISCONNECTED, event);
      
      if (!this.isIntentionallyClosed && this.config.reconnect) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error', error);
      this.handleError(error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    // Emit specific event based on message type
    this.emit(message.type, message.payload);
    
    // Also emit a general message event
    this.emit('message', message);
  }

  private handleError(error: any): void {
    this.emit(WebSocketEvent.ERROR, error);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send('ping', {});
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendRaw(message);
      }
    }
  }

  send(type: string, payload: any): void {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now(),
    };

    if (this.isConnected()) {
      this.sendRaw(message);
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
    }
  }

  private sendRaw(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Subscribe to specific event types
  subscribe(event: WebSocketEvent, handler: (data: any) => void): void {
    this.on(event, handler);
  }

  // Unsubscribe from specific event types
  unsubscribe(event: WebSocketEvent, handler: (data: any) => void): void {
    this.off(event, handler);
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(config?: WebSocketConfig): WebSocketClient {
  if (!wsClient && config) {
    wsClient = new WebSocketClient(config);
  }
  
  if (!wsClient) {
    throw new Error('WebSocket client not initialized');
  }
  
  return wsClient;
}

export function initializeWebSocket(config: WebSocketConfig): WebSocketClient {
  wsClient = new WebSocketClient(config);
  return wsClient;
} 