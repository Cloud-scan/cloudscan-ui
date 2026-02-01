/**
 * Organization service
 */

import apiClient from './api';
import { Organization, OrganizationMember, ListResponse } from '../types';

export const organizationService = {
  /**
   * Get organization by ID
   */
  async getById(id: string): Promise<Organization> {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  },

  /**
   * List all organizations for current user
   */
  async list(): Promise<Organization[]> {
    const response = await apiClient.get<ListResponse<Organization>>('/organizations');
    return response.data.data;
  },

  /**
   * Update organization
   */
  async update(
    id: string,
    data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Organization> {
    const response = await apiClient.put<Organization>(`/organizations/${id}`, data);
    return response.data;
  },

  /**
   * Get organization members
   */
  async getMembers(id: string): Promise<OrganizationMember[]> {
    const response = await apiClient.get<ListResponse<OrganizationMember>>(
      `/organizations/${id}/members`
    );
    return response.data.data;
  },

  /**
   * Add member to organization
   */
  async addMember(
    id: string,
    email: string,
    role: 'user' | 'admin'
  ): Promise<OrganizationMember> {
    const response = await apiClient.post<OrganizationMember>(`/organizations/${id}/members`, {
      email,
      role,
    });
    return response.data;
  },

  /**
   * Remove member from organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    await apiClient.delete(`/organizations/${organizationId}/members/${userId}`);
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: 'user' | 'admin'
  ): Promise<OrganizationMember> {
    const response = await apiClient.put<OrganizationMember>(
      `/organizations/${organizationId}/members/${userId}`,
      { role }
    );
    return response.data;
  },
};