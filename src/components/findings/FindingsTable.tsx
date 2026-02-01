/**
 * Findings table component
 */

import React from 'react';
import { Finding } from '../../types';
import { SeverityIcon } from './SeverityIcon';
import { ScanTypeLabel } from '../scans';

export interface FindingsTableProps {
  findings: Finding[];
  onFindingClick?: (finding: Finding) => void;
  isLoading?: boolean;
}

export const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  onFindingClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No findings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Severity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              CVE/CWE
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {findings.map((finding) => (
            <tr
              key={finding.id}
              onClick={() => onFindingClick?.(finding)}
              className={onFindingClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <SeverityIcon severity={finding.severity} showLabel size="sm" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <ScanTypeLabel type={finding.scan_type} />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {finding.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                  {finding.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {finding.file_path && (
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-white font-mono text-xs truncate max-w-xs">
                      {finding.file_path}
                    </div>
                    {finding.line_number && (
                      <div className="text-gray-500 dark:text-gray-400">
                        Line {finding.line_number}
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {finding.cve_id && (
                  <div className="text-gray-900 dark:text-white font-mono">{finding.cve_id}</div>
                )}
                {finding.cwe_id && (
                  <div className="text-gray-500 dark:text-gray-400 font-mono">{finding.cwe_id}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};