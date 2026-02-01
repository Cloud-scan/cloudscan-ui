/**
 * Storage and artifact related types
 */

export interface Artifact {
  id: string;
  scan_id: string;
  organization_id: string;
  type: ArtifactType;
  filename: string;
  size_bytes: number;
  content_type?: string;
  storage_path: string;
  created_at: string;
  expires_at?: string;
}

export enum ArtifactType {
  SOURCE_CODE = 'SOURCE_CODE',
  SCAN_RESULTS = 'SCAN_RESULTS',
  REPORT = 'REPORT',
  LOG = 'LOG',
}

export interface UploadArtifactRequest {
  scan_id: string;
  type: ArtifactType;
  filename: string;
  content_type: string;
  size_bytes: number;
  expires_in_hours?: number;
}