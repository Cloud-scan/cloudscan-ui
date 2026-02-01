/**
 * Finding hooks using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { findingService } from '../services';
import { FindingFilters, Severity, ScanType } from '../types';

export const useScanFindings = (
  scanId: string | undefined,
  params?: {
    scanType?: ScanType;
    severity?: Severity;
    pageSize?: number;
    pageToken?: string;
  }
) => {
  return useQuery({
    queryKey: ['findings', scanId, params],
    queryFn: () => findingService.getByScan(scanId!, params),
    enabled: !!scanId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFinding = (scanId: string | undefined, findingId: string | undefined) => {
  return useQuery({
    queryKey: ['findings', scanId, findingId],
    queryFn: () => findingService.getById(scanId!, findingId!),
    enabled: !!scanId && !!findingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFindingStats = (scanId: string | undefined) => {
  return useQuery({
    queryKey: ['findings', scanId, 'stats'],
    queryFn: () => findingService.getStats(scanId!),
    enabled: !!scanId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSearchFindings = (scanId: string | undefined, filters: FindingFilters) => {
  return useQuery({
    queryKey: ['findings', scanId, 'search', filters],
    queryFn: () => findingService.search(scanId!, filters),
    enabled: !!scanId && Object.keys(filters).length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useExportFindings = () => {
  return async (scanId: string, format: 'json' | 'csv' | 'pdf') => {
    const blob = await findingService.export(scanId, format);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `findings-${scanId}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
};