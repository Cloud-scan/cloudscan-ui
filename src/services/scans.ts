/**
 * Scan service
 */

import apiClient from './api';
import {
  Scan,
  CreateScanRequest,
  ScanStatus,
  ScanSummary,
  ListResponse,
} from '../types';

export const scanService = {
  /**
   * Create a new scan
   */
  async create(data: CreateScanRequest): Promise<Scan> {
    const response = await apiClient.post<Scan>('/scans', data);
    return response.data;
  },

  /**
   * Get scan by ID
   */
  async getById(id: string): Promise<Scan> {
    const response = await apiClient.get<Scan>(`/scans/${id}`);
    return response.data;
  },

  /**
   * List scans with optional filters
   */
  async list(params?: {
    projectId?: string;
    status?: ScanStatus;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListResponse<Scan>> {
    const response = await apiClient.get<ListResponse<Scan>>('/scans', { params });
    return response.data;
  },

  /**
   * Cancel a running scan
   */
  async cancel(id: string): Promise<void> {
    await apiClient.put(`/scans/${id}/cancel`);
  },

  /**
   * Get scan summary/statistics
   */
  async getSummary(): Promise<ScanSummary> {
    const response = await apiClient.get<ScanSummary>('/scans/summary');
    return response.data;
  },

  /**
   * Get scans for a specific project
   */
  async getByProject(projectId: string, limit = 10): Promise<Scan[]> {
    const response = await apiClient.get<ListResponse<Scan>>('/scans', {
      params: { projectId, pageSize: limit },
    });
    return response.data.data;
  },

  /**
   * Get recent scans
   */
  async getRecent(limit = 10): Promise<Scan[]> {
    const response = await apiClient.get<ListResponse<Scan>>('/scans', {
      params: { pageSize: limit },
    });
    return response.data.data;
  },
};