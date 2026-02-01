/**
 * Finding service
 */

import apiClient from './api';
import {
  Finding,
  FindingFilters,
  FindingStats,
  Severity,
  ScanType,
  ListResponse,
} from '../types';

export const findingService = {
  /**
   * Get findings for a scan
   */
  async getByScan(
    scanId: string,
    params?: {
      scanType?: ScanType;
      severity?: Severity;
      pageSize?: number;
      pageToken?: string;
    }
  ): Promise<ListResponse<Finding>> {
    const response = await apiClient.get<ListResponse<Finding>>(`/scans/${scanId}/findings`, {
      params,
    });
    return response.data;
  },

  /**
   * Get finding by ID
   */
  async getById(scanId: string, findingId: string): Promise<Finding> {
    const response = await apiClient.get<Finding>(`/scans/${scanId}/findings/${findingId}`);
    return response.data;
  },

  /**
   * Get finding statistics for a scan
   */
  async getStats(scanId: string): Promise<FindingStats> {
    const response = await apiClient.get<FindingStats>(`/scans/${scanId}/findings/stats`);
    return response.data;
  },

  /**
   * Export findings
   */
  async export(scanId: string, format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    const response = await apiClient.get(`/scans/${scanId}/findings/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Search findings with filters
   */
  async search(scanId: string, filters: FindingFilters): Promise<Finding[]> {
    const response = await apiClient.get<ListResponse<Finding>>(`/scans/${scanId}/findings`, {
      params: filters,
    });
    return response.data.data;
  },
};