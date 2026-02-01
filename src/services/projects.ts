/**
 * Project service
 */

import apiClient from './api';
import { Project, CreateProjectRequest, UpdateProjectRequest, ProjectStats } from '../types';

export const projectService = {
  /**
   * Create a new project
   */
  async create(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  /**
   * List all projects
   */
  async list(): Promise<Project[]> {
    const response = await apiClient.get<{ projects: Project[] }>('/projects');
    return response.data.projects;
  },

  /**
   * Update project
   */
  async update(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete project
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  /**
   * Get project statistics
   */
  async getStats(id: string): Promise<ProjectStats> {
    const response = await apiClient.get<ProjectStats>(`/projects/${id}/stats`);
    return response.data;
  },
};