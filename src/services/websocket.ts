/**
 * WebSocket service for real-time updates
 */

import { ScanLog, ScanProgress, ScanStatus } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:9090';

export type WebSocketMessageType = 'log' | 'progress' | 'status';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  scanId: string;
  data: ScanLog | ScanProgress | { status: ScanStatus };
  timestamp: string;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Map<string, Set<(message: WebSocketMessage) => void>> = new Map();
  private scanSubscriptions: Set<string> = new Set();

  constructor() {
    this.connect();
  }

  /**
   * Connect to WebSocket server
   */
  private connect(): void {
    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;

        // Re-subscribe to scans after reconnection
        this.scanSubscriptions.forEach((scanId) => {
          this.send({ type: 'subscribe', scanId });
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.notifyListeners(message);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        this.handleReconnect();
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      this.handleReconnect();
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[WebSocket] Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
    }
  }

  /**
   * Send message to server
   */
  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Subscribe to scan updates
   */
  subscribeScan(scanId: string, callback: (message: WebSocketMessage) => void): () => void {
    // Add to subscriptions
    this.scanSubscriptions.add(scanId);

    // Add listener
    if (!this.listeners.has(scanId)) {
      this.listeners.set(scanId, new Set());
    }
    this.listeners.get(scanId)!.add(callback);

    // Send subscribe message
    this.send({ type: 'subscribe', scanId });

    // Return unsubscribe function
    return () => this.unsubscribeScan(scanId, callback);
  }

  /**
   * Unsubscribe from scan updates
   */
  private unsubscribeScan(scanId: string, callback: (message: WebSocketMessage) => void): void {
    const listeners = this.listeners.get(scanId);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(scanId);
        this.scanSubscriptions.delete(scanId);
        this.send({ type: 'unsubscribe', scanId });
      }
    }
  }

  /**
   * Notify all listeners for a scan
   */
  private notifyListeners(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.scanId);
    if (listeners) {
      listeners.forEach((callback) => callback(message));
    }
  }

  /**
   * Close connection
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.scanSubscriptions.clear();
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null;

export const getWebSocketClient = (): WebSocketClient => {
  if (!wsClient) {
    wsClient = new WebSocketClient();
  }
  return wsClient;
};