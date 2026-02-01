/**
 * Projects page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import { Card, Button, Input, Modal, Spinner } from '../components/common';
import { useProjects, useCreateProject, useDeleteProject } from '../hooks';
import { useUiStore } from '../stores';
import { formatDistanceToNow } from 'date-fns';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  gitUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  gitBranch: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();
  const { mutateAsync: createProject, isPending: isCreating } = useCreateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const { addNotification } = useUiStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject(data);
      addNotification({
        type: 'success',
        message: 'Project created successfully',
      });
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create project',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      addNotification({
        type: 'success',
        message: 'Project deleted successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to delete project',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your projects and repositories
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} padding="md" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FolderIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.scanCount} scans
                    </p>
                  </div>
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
              )}

              {project.lastScanAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Last scan: {formatDistanceToNow(new Date(project.lastScanAt), { addSuffix: true })}
                </p>
              )}

              <div className="flex gap-2">
                <Link to={`/scans/new?projectId=${project.id}`} className="flex-1">
                  <Button size="sm" fullWidth>
                    New Scan
                  </Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => handleDelete(project.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No projects yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new project
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Name"
            {...register('name')}
            error={errors.name?.message}
            fullWidth
            placeholder="My Project"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              placeholder="Optional project description"
            />
          </div>

          <Input
            label="Git Repository URL"
            {...register('gitUrl')}
            error={errors.gitUrl?.message}
            fullWidth
            placeholder="https://github.com/user/repo (optional)"
            helperText="Optional: Link to your Git repository"
          />

          <Input
            label="Git Branch"
            {...register('gitBranch')}
            error={errors.gitBranch?.message}
            fullWidth
            placeholder="main (optional)"
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" isLoading={isCreating} fullWidth>
              Create Project
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};