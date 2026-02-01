/**
 * Scan status badge component
 */

import React from 'react';
import { Badge } from '../common';
import { ScanStatus } from '../../types';

export interface ScanStatusBadgeProps {
  status: ScanStatus;
  className?: string;
}

const statusConfig = {
  [ScanStatus.QUEUED]: {
    variant: 'info' as const,
    label: 'Queued',
  },
  [ScanStatus.RUNNING]: {
    variant: 'warning' as const,
    label: 'Running',
  },
  [ScanStatus.COMPLETED]: {
    variant: 'success' as const,
    label: 'Completed',
  },
  [ScanStatus.FAILED]: {
    variant: 'danger' as const,
    label: 'Failed',
  },
  [ScanStatus.CANCELLED]: {
    variant: 'default' as const,
    label: 'Cancelled',
  },
};

export const ScanStatusBadge: React.FC<ScanStatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};