/**
 * Finding filters component
 */

import React from 'react';
import { Select } from '../common';
import { FindingFilters as FindingFiltersType, Severity, ScanType } from '../../types';

export interface FindingFiltersProps {
  filters: FindingFiltersType;
  onChange: (filters: FindingFiltersType) => void;
}

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: Severity.CRITICAL, label: 'Critical' },
  { value: Severity.HIGH, label: 'High' },
  { value: Severity.MEDIUM, label: 'Medium' },
  { value: Severity.LOW, label: 'Low' },
  { value: Severity.INFO, label: 'Info' },
];

const scanTypeOptions = [
  { value: '', label: 'All Types' },
  { value: ScanType.SAST, label: 'SAST' },
  { value: ScanType.SCA, label: 'SCA' },
  { value: ScanType.SECRETS, label: 'Secrets' },
  { value: ScanType.LICENSE, label: 'License' },
];

export const FindingFiltersComponent: React.FC<FindingFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select
        label="Severity"
        options={severityOptions}
        value={filters.severity || ''}
        onChange={(e) =>
          onChange({ ...filters, severity: (e.target.value as Severity) || undefined })
        }
      />
      <Select
        label="Scan Type"
        options={scanTypeOptions}
        value={filters.scan_type || ''}
        onChange={(e) =>
          onChange({ ...filters, scan_type: (e.target.value as ScanType) || undefined })
        }
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          placeholder="Search findings..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
      </div>
    </div>
  );
};