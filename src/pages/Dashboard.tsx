/**
 * Dashboard page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Card, Button, Spinner } from '../components/common';
import { ScanCard } from '../components/scans';
import { useRecentScans, useScanSummary } from '../hooks';

export const Dashboard: React.FC = () => {
  const { data: recentScans, isLoading: scansLoading } = useRecentScans(5);
  const { data: summary, isLoading: summaryLoading } = useScanSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Overview of your security scans
          </p>
        </div>
        <Link to="/scans/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Scans</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {summary.totalScans}
                </p>
              </div>
              <ShieldCheckIcon className="h-12 w-12 text-blue-500" />
            </div>
          </Card>

          <Card padding="md">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Scans</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {summary.activeScans}
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Today</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {summary.completedToday}
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Duration</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {Math.round(summary.averageDuration / 60)}m
              </p>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Recent Scans */}
      <Card
        title="Recent Scans"
        subtitle="Your latest security scans"
        actions={
          <Link to="/scans">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        }
      >
        {scansLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : recentScans && recentScans.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentScans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No scans yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first security scan
            </p>
            <div className="mt-6">
              <Link to="/scans/new">
                <Button>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Scan
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};