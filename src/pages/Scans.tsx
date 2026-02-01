/**
 * All Scans page - Shows all scans with filters
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, FunnelIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Card, Button, Spinner } from '../components/common';
import { ScanCard } from '../components/scans';
import { useScans, useProjects } from '../hooks';
import { ScanStatus } from '../types';

export const Scans: React.FC = () => {
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ScanStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all projects for filter dropdown
  const { data: projects } = useProjects();

  // Fetch scans with filters
  const { data: scansResponse, isLoading } = useScans({
    projectId: projectFilter || undefined,
    status: statusFilter || undefined,
    pageSize: 50, // Show 50 scans per page
  });

  const scans = scansResponse?.scans || [];

  const clearFilters = () => {
    setProjectFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = projectFilter || statusFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Scans</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            View and manage all security scans
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {(projectFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
              </span>
            )}
          </Button>
          <Link to="/scans/new">
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              New Scan
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project
              </label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Projects</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ScanStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value={ScanStatus.QUEUED}>Queued</option>
                <option value={ScanStatus.RUNNING}>Running</option>
                <option value={ScanStatus.COMPLETED}>Completed</option>
                <option value={ScanStatus.FAILED}>Failed</option>
                <option value={ScanStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      {!isLoading && scansResponse && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {scans.length} of {scansResponse.total_count} scans
        </div>
      )}

      {/* Scans List */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {hasActiveFilters ? 'No scans match filters' : 'No scans yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'Get started by creating your first security scan'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              <Link to="/scans/new">
                <Button>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Scan
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {scans.map((scan) => (
                <ScanCard key={scan.id} scan={scan} />
              ))}
            </div>

            {/* Pagination info */}
            {scansResponse?.next_page_token && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  More scans available (pagination not yet implemented)
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};