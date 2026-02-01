/**
 * Project related types
 */

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  repository_url?: string;
  default_branch?: string;
  is_active: boolean;
  scan_count: number;
  last_scan_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  repository_url?: string;
  default_branch?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  repository_url?: string;
  default_branch?: string;
  is_active?: boolean;
}

export interface ProjectStats {
  total_scans: number;
  active_scans: number;
  completed_scans: number;
  failed_scans: number;
  total_findings: number;
  critical_findings: number;
  high_findings: number;
}