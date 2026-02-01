/**
 * Scan details page with real-time updates
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Card, Button, Spinner, ProgressBar } from '../components/common';
import { ScanStatusBadge, LogViewer, ScanTypeLabel } from '../components/scans';
import { useScan, useCancelScan } from '../hooks';
import { useUiStore } from '../stores';
import { ScanStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const ScanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scan, isLoading } = useScan(id);
  const { mutateAsync: cancelScan, isPending: isCancelling } = useCancelScan();
  const { addNotification } = useUiStore();

  const handleCancel = async () => {
    if (!id || !confirm('Are you sure you want to cancel this scan?')) return;

    try {
      await cancelScan(id);
      addNotification({
        type: 'success',
        message: 'Scan cancelled successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to cancel scan',
      });
    }
  };

  if (isLoading || !scan) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  const isActive = scan.status === ScanStatus.RUNNING || scan.status === ScanStatus.QUEUED;
  const progress = scan.status === ScanStatus.COMPLETED ? 100 : scan.status === ScanStatus.RUNNING ? 50 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/scans">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Scan #{scan.id.slice(0, 8)}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Created {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ScanStatusBadge status={scan.status} />
          {isActive && (
            <Button variant="danger" onClick={handleCancel} isLoading={isCancelling} size="sm">
              <XCircleIcon className="h-5 w-5 mr-2" />
              Cancel Scan
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <ProgressBar
          progress={progress}
          variant={scan.status === ScanStatus.RUNNING ? 'default' : 'info'}
          showLabel
          label={scan.status}
          size="lg"
        />
      )}

      {/* Scan Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Scan Information" padding="md" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1">
                <ScanStatusBadge status={scan.status} />
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Scan Types</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {scan.scanTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <ScanTypeLabel type={type} />
                  </span>
                ))}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(scan.createdAt).toLocaleString()}
              </dd>
            </div>

            {scan.completedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(scan.completedAt).toLocaleString()}
                </dd>
              </div>
            )}

            {scan.gitUrl && (
              <>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Repository
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all">
                    {scan.gitUrl}
                  </dd>
                </div>

                {scan.gitBranch && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Branch</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {scan.gitBranch}
                    </dd>
                  </div>
                )}

                {scan.gitCommit && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Commit</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {scan.gitCommit.slice(0, 7)}
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </Card>

        {/* Findings Summary */}
        <Card title="Findings" padding="md">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {scan.totalFindings}
                </span>
              </div>
            </div>

            {scan.totalFindings > 0 && (
              <>
                {scan.findingsBySeverity.critical > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                    <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {scan.findingsBySeverity.critical}
                    </span>
                  </div>
                )}

                {scan.findingsBySeverity.high > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {scan.findingsBySeverity.high}
                    </span>
                  </div>
                )}

                {scan.findingsBySeverity.medium > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      {scan.findingsBySeverity.medium}
                    </span>
                  </div>
                )}

                {scan.findingsBySeverity.low > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                    <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {scan.findingsBySeverity.low}
                    </span>
                  </div>
                )}

                <div className="pt-4">
                  <Link to={`/scans/${scan.id}/findings`}>
                    <Button fullWidth>View All Findings</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Error Message */}
      {scan.errorMessage && (
        <Card padding="md">
          <div className="flex gap-3">
            <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Scan Error</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{scan.errorMessage}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Live Logs */}
      <LogViewer scanId={scan.id} maxHeight="600px" />
    </div>
  );
};