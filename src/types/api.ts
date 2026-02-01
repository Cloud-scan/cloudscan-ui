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
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ListResponse<T> {
  data: T[];
  next_page_token?: string;
  total_count: number;
}

export interface UploadResponse {
  artifact_id: string;
  upload_url: string;
  upload_headers?: Record<string, string>;
}

export interface DownloadResponse {
  download_url: string;
  expires_at: string;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
  services?: Record<string, boolean>;
}