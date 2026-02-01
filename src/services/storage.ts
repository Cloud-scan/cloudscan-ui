/**
 * Storage service for artifact upload/download
 */

import apiClient from './api';
import axios from 'axios';
import {
  UploadArtifactRequest,
  UploadResponse,
  DownloadResponse,
  Artifact,
  ArtifactType,
} from '../types';

export const storageService = {
  /**
   * Get presigned upload URL
   */
  async getUploadUrl(data: UploadArtifactRequest): Promise<UploadResponse> {
    const response = await apiClient.post<UploadResponse>('/storage/upload', data);
    return response.data;
  },

  /**
   * Upload file to presigned URL
   */
  async uploadFile(file: File, uploadUrl: string, headers?: Record<string, string>): Promise<void> {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
        ...headers,
      },
    });
  },

  /**
   * Complete upload flow (get URL + upload file)
   */
  async upload(
    file: File,
    scanId: string,
    type: ArtifactType,
    expiresInHours = 24
  ): Promise<string> {
    // Get presigned URL
    const uploadData: UploadArtifactRequest = {
      scan_id: scanId,
      type,
      filename: file.name,
      content_type: file.type,
      size_bytes: file.size,
      expires_in_hours: expiresInHours,
    };

    const { artifact_id, upload_url, upload_headers } = await this.getUploadUrl(uploadData);

    // Upload file
    await this.uploadFile(file, upload_url, upload_headers);

    return artifact_id;
  },

  /**
   * Get presigned download URL
   */
  async getDownloadUrl(artifactId: string, expiresInHours = 1): Promise<DownloadResponse> {
    const response = await apiClient.get<DownloadResponse>(`/storage/download/${artifactId}`, {
      params: { expires_in_hours: expiresInHours },
    });
    return response.data;
  },

  /**
   * Download file
   */
  async download(artifactId: string): Promise<void> {
    const { download_url } = await this.getDownloadUrl(artifactId);
    window.open(download_url, '_blank');
  },

  /**
   * Delete artifact
   */
  async delete(artifactId: string): Promise<void> {
    await apiClient.delete(`/storage/${artifactId}`);
  },

  /**
   * List artifacts for a scan
   */
  async listByScan(scanId: string): Promise<Artifact[]> {
    const response = await apiClient.get<{ artifacts: Artifact[] }>('/storage/artifacts', {
      params: { scan_id: scanId },
    });
    return response.data.artifacts;
  },
};