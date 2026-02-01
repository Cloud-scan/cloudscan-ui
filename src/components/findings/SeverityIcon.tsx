/**
 * Severity icon and badge component
 */

import React from 'react';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import { Badge } from '../common';
import { Severity } from '../../types';

export interface SeverityIconProps {
  severity: Severity;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  [Severity.CRITICAL]: ExclamationTriangleIcon,
  [Severity.HIGH]: ExclamationCircleIcon,
  [Severity.MEDIUM]: ExclamationCircleIcon,
  [Severity.LOW]: InformationCircleIcon,
  [Severity.INFO]: InformationCircleIcon,
};

const colorClasses = {
  [Severity.CRITICAL]: 'text-purple-600 dark:text-purple-400',
  [Severity.HIGH]: 'text-red-600 dark:text-red-400',
  [Severity.MEDIUM]: 'text-orange-600 dark:text-orange-400',
  [Severity.LOW]: 'text-yellow-600 dark:text-yellow-400',
  [Severity.INFO]: 'text-blue-600 dark:text-blue-400',
};

const badgeVariants = {
  [Severity.CRITICAL]: 'danger' as const,
  [Severity.HIGH]: 'danger' as const,
  [Severity.MEDIUM]: 'warning' as const,
  [Severity.LOW]: 'warning' as const,
  [Severity.INFO]: 'info' as const,
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const SeverityIcon: React.FC<SeverityIconProps> = ({
  severity,
  showLabel = false,
  size = 'md',
}) => {
  const Icon = iconMap[severity];

  if (showLabel) {
    return <Badge variant={badgeVariants[severity]}>{severity}</Badge>;
  }

  return <Icon className={`${colorClasses[severity]} ${sizeClasses[size]}`} />;
};