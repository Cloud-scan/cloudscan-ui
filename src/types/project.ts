/**
 * Project related types
 */

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  gitUrl?: string;
  gitBranch?: string;
  isActive: boolean;
  scanCount: number;
  lastScanAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  gitUrl?: string;
  gitBranch?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  gitUrl?: string;
  gitBranch?: string;
  isActive?: boolean;
}

export interface ProjectStats {
  totalScans: number;
  activeScans: number;
  completedScans: number;
  failedScans: number;
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
}