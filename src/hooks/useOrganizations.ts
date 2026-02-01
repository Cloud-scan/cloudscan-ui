/**
 * Organization hooks using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '../services';
import { Organization } from '../types';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.list,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrganization = (id: string | undefined) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationMembers = (id: string | undefined) => {
  return useQuery({
    queryKey: ['organizations', id, 'members'],
    queryFn: () => organizationService.getMembers(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => organizationService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      email,
      role,
    }: {
      organizationId: string;
      email: string;
      role: 'user' | 'admin';
    }) => organizationService.addMember(organizationId, email, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', variables.organizationId, 'members'],
      });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string; userId: string }) =>
      organizationService.removeMember(organizationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', variables.organizationId, 'members'],
      });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
      role,
    }: {
      organizationId: string;
      userId: string;
      role: 'user' | 'admin';
    }) => organizationService.updateMemberRole(organizationId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', variables.organizationId, 'members'],
      });
    },
  });
};