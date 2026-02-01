/**
 * Scan related types
 */

export interface Scan {
  id: string;
  organization_id: string;
  project_id: string;
  status: ScanStatus;
  scan_types: ScanType[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  git_url?: string;
  git_branch?: string;
  git_commit?: string;
  total_findings: number;
  findings_by_severity: Record<string, number>;
  error_message?: string;
}

export enum ScanStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum ScanType {
  SAST = 'SAST',     // Static Application Security Testing (Semgrep)
  SCA = 'SCA',       // Software Composition Analysis (Trivy)
  SECRETS = 'SECRETS', // Secrets detection (TruffleHog)
  LICENSE = 'LICENSE', // License compliance (ScanCode)
}

export interface CreateScanRequest {
  project_id: string;
  scan_types: ScanType[];
  git_url?: string;
  git_branch?: string;
  git_commit?: string;
  source_artifact_id?: string;
}

export interface ScanProgress {
  scan_id: string;
  status: ScanStatus;
  progress: number; // 0-100
  current_step?: string;
  message?: string;
}

export interface ScanLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  scan_type?: ScanType;
}

export interface ScanSummary {
  total_scans: number;
  active_scans: number;
  completed_today: number;
  average_duration: number; // in seconds
}