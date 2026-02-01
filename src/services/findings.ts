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
} from '../types';

export const findingService = {
  /**
   * Get findings for a scan
   */
  async getByScan(
    scanId: string,
    params?: {
      scan_type?: ScanType;
      severity?: Severity;
      page_size?: number;
      page_token?: string;
    }
  ): Promise<{ findings: Finding[]; next_page_token?: string; total_count: number }> {
    const response = await apiClient.get<{ findings: Finding[]; next_page_token?: string; total_count: number }>(`/scans/${scanId}/findings`, {
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
    const response = await apiClient.get<{ findings: Finding[] }>(`/scans/${scanId}/findings`, {
      params: filters,
    });
    return response.data.findings;
  },
};