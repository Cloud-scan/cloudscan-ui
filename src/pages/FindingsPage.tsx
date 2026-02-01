/**
 * Findings page with filters and table
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Card, Button, Spinner } from '../components/common';
import {
  FindingsTable,
  FindingDetailModal,
  FindingFiltersComponent,
} from '../components/findings';
import { useScanFindings, useExportFindings } from '../hooks';
import { Finding, FindingFilters } from '../types';

export const FindingsPage: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const [filters, setFilters] = useState<FindingFilters>({});
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // Convert filters to API parameters (remove search field as it's not supported by backend)
  const apiParams = {
    scan_type: filters.scan_type,
    severity: filters.severity,
  };

  const { data: findingsResponse, isLoading } = useScanFindings(scanId, apiParams);
  const exportFindings = useExportFindings();

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    if (!scanId) return;
    await exportFindings(scanId, format);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/scans/${scanId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Findings</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {findingsResponse?.total_count || 0} total findings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => handleExport('csv')}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleExport('json')}>
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="md">
        <FindingFiltersComponent filters={filters} onChange={setFilters} />
      </Card>

      {/* Findings Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <FindingsTable
            findings={findingsResponse?.findings || []}
            onFindingClick={setSelectedFinding}
          />
        )}
      </Card>

      {/* Finding Detail Modal */}
      <FindingDetailModal
        finding={selectedFinding}
        isOpen={!!selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
};