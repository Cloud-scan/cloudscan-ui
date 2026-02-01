/**
 * Project hooks using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services';
import { CreateProjectRequest, UpdateProjectRequest } from '../types';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectService.list,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProject = (id: string | undefined) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProjectStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['projects', id, 'stats'],
    queryFn: () => projectService.getStats(id!),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};