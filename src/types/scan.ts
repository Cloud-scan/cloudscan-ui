/**
 * Scan related types
 */

export interface Scan {
  id: string;
  organizationId: string;
  projectId: string;
  status: ScanStatus;
  scanTypes: ScanType[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  gitUrl?: string;
  gitBranch?: string;
  gitCommit?: string;
  totalFindings: number;
  findingsBySeverity: Record<string, number>;
  errorMessage?: string;
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
  projectId: string;
  scanTypes: ScanType[];
  gitUrl?: string;
  gitBranch?: string;
  gitCommit?: string;
  sourceArtifactId?: string;
}

export interface ScanProgress {
  scanId: string;
  status: ScanStatus;
  progress: number; // 0-100
  currentStep?: string;
  message?: string;
}

export interface ScanLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  scanType?: ScanType;
}

export interface ScanSummary {
  totalScans: number;
  activeScans: number;
  completedToday: number;
  averageDuration: number; // in seconds
}