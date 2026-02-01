/**
 * Toast notification component
 */

import React, { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colorClasses = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

const iconColorClasses = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
};

const textColorClasses = {
  success: 'text-green-900 dark:text-green-100',
  error: 'text-red-900 dark:text-red-100',
  warning: 'text-yellow-900 dark:text-yellow-100',
  info: 'text-blue-900 dark:text-blue-100',
};

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  title,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const Icon = iconMap[type];

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg ${colorClasses[type]}`}
    >
      <Icon className={`h-6 w-6 flex-shrink-0 ${iconColorClasses[type]}`} />
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold text-sm ${textColorClasses[type]}`}>{title}</h4>
        )}
        <p className={`text-sm ${title ? 'mt-1' : ''} ${textColorClasses[type]}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${iconColorClasses[type]} hover:opacity-75 focus:outline-none`}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

/**
 * Toast container component to render notifications
 */
import { useUiStore } from '../../stores';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useUiStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Transition
          key={notification.id}
          as="div"
          show={true}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-x-4"
          enterTo="opacity-100 translate-x-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-4"
        >
          <Alert
            type={notification.type}
            message={notification.message}
            title={notification.title}
            onClose={() => removeNotification(notification.id)}
            autoClose={notification.duration !== undefined && notification.duration > 0}
            duration={notification.duration}
          />
        </Transition>
      ))}
    </div>
  );
};