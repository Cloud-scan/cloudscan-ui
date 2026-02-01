/**
 * Scan card component for displaying scan summary
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common';
import { ScanStatusBadge } from './ScanStatusBadge';
import { ScanTypeIcon } from './ScanTypeIcon';
import { Scan } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export interface ScanCardProps {
  scan: Scan;
}

export const ScanCard: React.FC<ScanCardProps> = ({ scan }) => {
  const createdAt = new Date(scan.createdAt);

  return (
    <Link to={`/scans/${scan.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" padding="md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Scan #{scan.id.slice(0, 8)}
              </h3>
              <ScanStatusBadge status={scan.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Scan types */}
        <div className="flex items-center gap-2 mb-4">
          {scan.scanTypes.map((type) => (
            <div
              key={type}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <ScanTypeIcon type={type} className="h-4 w-4" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {type}
              </span>
            </div>
          ))}
        </div>

        {/* Findings summary */}
        {scan.totalFindings > 0 && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">Findings:</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {scan.totalFindings}
              </span>
            </div>
            {scan.findingsBySeverity.critical > 0 && (
              <span className="text-red-600 dark:text-red-400 font-medium">
                {scan.findingsBySeverity.critical} Critical
              </span>
            )}
            {scan.findingsBySeverity.high > 0 && (
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                {scan.findingsBySeverity.high} High
              </span>
            )}
          </div>
        )}

        {/* Git info */}
        {scan.gitUrl && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {scan.gitBranch && <span className="font-medium">{scan.gitBranch}</span>}
              {scan.gitCommit && <span className="ml-2">#{scan.gitCommit.slice(0, 7)}</span>}
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
};