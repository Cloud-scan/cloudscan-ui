/**
 * Scan hooks using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scanService } from '../services';
import { CreateScanRequest, ScanStatus } from '../types';

export const useScans = (params?: {
  projectId?: string;
  status?: ScanStatus;
  pageSize?: number;
  pageToken?: string;
}) => {
  return useQuery({
    queryKey: ['scans', params],
    queryFn: () => scanService.list(params),
    staleTime: 30 * 1000, // 30 seconds (frequent updates)
  });
};

export const useScan = (id: string | undefined) => {
  return useQuery({
    queryKey: ['scans', id],
    queryFn: () => scanService.getById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Auto-refetch every 5 seconds if scan is running or queued
      const status = query.state.data?.status;
      return status === ScanStatus.RUNNING || status === ScanStatus.QUEUED ? 5000 : false;
    },
  });
};

export const useRecentScans = (limit = 10) => {
  return useQuery({
    queryKey: ['scans', 'recent', limit],
    queryFn: () => scanService.getRecent(limit),
    staleTime: 30 * 1000,
  });
};

export const useProjectScans = (projectId: string | undefined, limit = 10) => {
  return useQuery({
    queryKey: ['scans', 'project', projectId, limit],
    queryFn: () => scanService.getByProject(projectId!, limit),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
};

export const useScanSummary = () => {
  return useQuery({
    queryKey: ['scans', 'summary'],
    queryFn: scanService.getSummary,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScanRequest) => scanService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useCancelScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scanService.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      queryClient.invalidateQueries({ queryKey: ['scans', id] });
    },
  });
};