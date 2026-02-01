/**
 * Live log viewer component with WebSocket
 */

import React, { useEffect, useRef } from 'react';
import { Card } from '../common';
import { useWebSocket } from '../../hooks';
import { ScanLog } from '../../types';

export interface LogViewerProps {
  scanId: string;
  maxHeight?: string;
}

const logLevelColors = {
  info: 'text-gray-700 dark:text-gray-300',
  warn: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  debug: 'text-blue-600 dark:text-blue-400',
};

export const LogViewer: React.FC<LogViewerProps> = ({ scanId, maxHeight = '400px' }) => {
  const { messages, isConnected } = useWebSocket(scanId);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const logs = messages
    .filter((msg) => msg.type === 'log')
    .map((msg) => msg.data as ScanLog);

  return (
    <Card
      title="Scan Logs"
      subtitle={
        <span className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      }
      padding="none"
    >
      <div
        ref={logContainerRef}
        className="overflow-y-auto font-mono text-sm p-4 bg-gray-50 dark:bg-gray-900"
        style={{ maxHeight }}
      >
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No logs yet. Waiting for scan to start...
          </p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1 flex gap-2">
              <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`font-medium flex-shrink-0 ${logLevelColors[log.level]}`}>
                [{log.level.toUpperCase()}]
              </span>
              {log.scanType && (
                <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                  [{log.scanType}]
                </span>
              )}
              <span className="text-gray-900 dark:text-gray-100">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};