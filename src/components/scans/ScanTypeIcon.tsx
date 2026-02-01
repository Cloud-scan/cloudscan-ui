/**
 * Scan type icon component
 */

import React from 'react';
import { ShieldCheckIcon, CubeIcon, KeyIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ScanType } from '../../types';

export interface ScanTypeIconProps {
  type: ScanType;
  className?: string;
}

const iconMap = {
  [ScanType.SAST]: ShieldCheckIcon,
  [ScanType.SCA]: CubeIcon,
  [ScanType.SECRETS]: KeyIcon,
  [ScanType.LICENSE]: DocumentTextIcon,
};

const labelMap = {
  [ScanType.SAST]: 'SAST',
  [ScanType.SCA]: 'SCA',
  [ScanType.SECRETS]: 'Secrets',
  [ScanType.LICENSE]: 'License',
};

export const ScanTypeIcon: React.FC<ScanTypeIconProps> = ({ type, className = 'h-5 w-5' }) => {
  const Icon = iconMap[type];
  return <Icon className={className} title={labelMap[type]} />;
};

export const ScanTypeLabel: React.FC<{ type: ScanType }> = ({ type }) => {
  return <span>{labelMap[type]}</span>;
};