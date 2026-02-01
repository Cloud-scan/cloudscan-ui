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
  ListResponse,
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
      scanId,
      type,
      filename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      expiresInHours,
    };

    const { artifactId, uploadUrl, uploadHeaders } = await this.getUploadUrl(uploadData);

    // Upload file
    await this.uploadFile(file, uploadUrl, uploadHeaders);

    return artifactId;
  },

  /**
   * Get presigned download URL
   */
  async getDownloadUrl(artifactId: string, expiresInHours = 1): Promise<DownloadResponse> {
    const response = await apiClient.get<DownloadResponse>(`/storage/download/${artifactId}`, {
      params: { expiresInHours },
    });
    return response.data;
  },

  /**
   * Download file
   */
  async download(artifactId: string): Promise<void> {
    const { downloadUrl } = await this.getDownloadUrl(artifactId);
    window.open(downloadUrl, '_blank');
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
    const response = await apiClient.get<ListResponse<Artifact>>('/storage/artifacts', {
      params: { scanId },
    });
    return response.data.data;
  },
};