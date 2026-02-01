/**
 * All Findings page - Shows scans with findings
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Spinner } from '../components/common';
import { SeverityIcon } from '../components/findings';
import { useRecentScans } from '../hooks';
import { Severity } from '../types';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export const AllFindings: React.FC = () => {
  const { data: scans, isLoading } = useRecentScans(50); // Get more scans

  // Filter scans that have findings
  const scansWithFindings = scans?.filter((scan) => scan.total_findings > 0) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Findings</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          View findings across all scans
        </p>
      </div>

      {/* Scans with Findings */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : scansWithFindings.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No findings yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Run some scans to see security findings
            </p>
            <div className="mt-6">
              <Link to="/scans/new">
                <Button>Create New Scan</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Scan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Findings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    By Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {scansWithFindings.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Scan #{scan.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {scan.scan_types.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {scan.total_findings}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        {scan.findings_by_severity.critical > 0 && (
                          <SeverityIcon severity={Severity.CRITICAL} showLabel size="sm" />
                        )}
                        {scan.findings_by_severity.high > 0 && (
                          <SeverityIcon severity={Severity.HIGH} showLabel size="sm" />
                        )}
                        {scan.findings_by_severity.medium > 0 && (
                          <SeverityIcon severity={Severity.MEDIUM} showLabel size="sm" />
                        )}
                        {scan.findings_by_severity.low > 0 && (
                          <SeverityIcon severity={Severity.LOW} showLabel size="sm" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link to={`/scans/${scan.id}/findings`}>
                        <Button size="sm" variant="primary">
                          View Findings
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};