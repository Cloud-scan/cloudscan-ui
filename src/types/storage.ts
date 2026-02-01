/**
 * Storage and artifact related types
 */

export interface Artifact {
  id: string;
  scanId: string;
  organizationId: string;
  type: ArtifactType;
  filename: string;
  sizeBytes: number;
  contentType?: string;
  storagePath: string;
  createdAt: string;
  expiresAt?: string;
}

export enum ArtifactType {
  SOURCE_CODE = 'SOURCE_CODE',
  SCAN_RESULTS = 'SCAN_RESULTS',
  REPORT = 'REPORT',
  LOG = 'LOG',
}

export interface UploadArtifactRequest {
  scanId: string;
  type: ArtifactType;
  filename: string;
  contentType: string;
  sizeBytes: number;
  expiresInHours?: number;
}