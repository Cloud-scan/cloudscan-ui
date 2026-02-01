/**
 * WebSocket hook for real-time scan updates
 */

import { useEffect, useState } from 'react';
import { getWebSocketClient, WebSocketMessage } from '../services';

export const useWebSocket = (scanId: string | undefined) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!scanId) return;

    const wsClient = getWebSocketClient();
    setIsConnected(wsClient.isConnected());

    const handleMessage = (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const unsubscribe = wsClient.subscribeScan(scanId, handleMessage);

    // Check connection status periodically
    const interval = setInterval(() => {
      setIsConnected(wsClient.isConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [scanId]);

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isConnected,
    clearMessages,
  };
};