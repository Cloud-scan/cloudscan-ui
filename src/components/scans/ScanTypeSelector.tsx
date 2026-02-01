/**
 * Scan type checkbox selector component
 */

import React from 'react';
import { ScanType } from '../../types';
import { ScanTypeIcon, ScanTypeLabel } from './ScanTypeIcon';

export interface ScanTypeSelectorProps {
  selected: ScanType[];
  onChange: (types: ScanType[]) => void;
  disabled?: boolean;
}

const scanTypes: { type: ScanType; description: string }[] = [
  {
    type: ScanType.SAST,
    description: 'Static Application Security Testing - Find code vulnerabilities',
  },
  {
    type: ScanType.SCA,
    description: 'Software Composition Analysis - Detect vulnerable dependencies',
  },
  {
    type: ScanType.SECRETS,
    description: 'Secrets Detection - Find exposed credentials and API keys',
  },
  {
    type: ScanType.LICENSE,
    description: 'License Compliance - Check open source license compatibility',
  },
];

export const ScanTypeSelector: React.FC<ScanTypeSelectorProps> = ({
  selected,
  onChange,
  disabled = false,
}) => {
  const handleToggle = (type: ScanType) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="space-y-3">
      {scanTypes.map(({ type, description }) => {
        const isSelected = selected.includes(type);

        return (
          <label
            key={type}
            className={`
              flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all
              ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(type)}
              disabled={disabled}
              className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ScanTypeIcon type={type} />
                <span className="font-medium text-gray-900 dark:text-white">
                  <ScanTypeLabel type={type} />
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
};