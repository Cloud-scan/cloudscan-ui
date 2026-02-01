/**
 * Generic API response types
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListResponse<T> {
  data: T[];
  nextPageToken?: string;
  totalCount: number;
}

export interface UploadResponse {
  artifactId: string;
  uploadUrl: string;
  uploadHeaders?: Record<string, string>;
}

export interface DownloadResponse {
  downloadUrl: string;
  expiresAt: string;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
  services?: Record<string, boolean>;
}