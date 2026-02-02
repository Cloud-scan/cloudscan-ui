/**
 * New Scan wizard page
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Select } from '../components/common';
import { ScanTypeSelector } from '../components/scans';
import { useProjects, useCreateScan } from '../hooks';
import { useUiStore } from '../stores';
import { ScanType } from '../types';

const scanSchema = z.object({
  projectId: z.string().min(1, 'Please select a project'),
  scanTypes: z.array(z.nativeEnum(ScanType)).min(1, 'Select at least one scan type'),
});

type ScanFormData = z.infer<typeof scanSchema>;

export const ScanNew: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = searchParams.get('projectId') || '';

  const [selectedTypes, setSelectedTypes] = useState<ScanType[]>([]);
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { mutateAsync: createScan, isPending } = useCreateScan();
  const { addNotification } = useUiStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ScanFormData>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      projectId: preSelectedProjectId,
      scanTypes: [],
    },
  });

  const projectId = watch('projectId');
  const selectedProject = projects?.find((p) => p.id === projectId);

  // Update form when scan types change
  React.useEffect(() => {
    setValue('scanTypes', selectedTypes);
  }, [selectedTypes, setValue]);

  const onSubmit = async (data: ScanFormData) => {
    try {
      // Send to API - will use project's repository settings automatically
      const scanData = {
        project_id: data.projectId,
        scan_types: data.scanTypes,
      };
      const scan = await createScan(scanData);
      addNotification({
        type: 'success',
        message: 'Scan created successfully',
      });
      navigate(`/scans/${scan.id}`);
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create scan',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Scan</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Configure and launch a security scan
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Select Project */}
        <Card title="1. Select Project" subtitle="Choose the project to scan" padding="md">
          <Select
            label="Project"
            options={
              projects?.map((p) => ({
                value: p.id,
                label: p.name,
              })) || []
            }
            {...register('projectId')}
            error={errors.projectId?.message}
            fullWidth
            placeholder="Select a project"
            disabled={projectsLoading}
          />

          {selectedProject && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Selected Project:</strong> {selectedProject.name}
              </p>
              {selectedProject.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {selectedProject.description}
                </p>
              )}
              {selectedProject.repository_url && (
                <div className="border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Will scan:</strong> {selectedProject.repository_url}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Branch:</strong> {selectedProject.default_branch || 'main'}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Step 2: Select Scan Types */}
        <Card
          title="2. Select Scan Types"
          subtitle="Choose which security scans to run"
          padding="md"
        >
          <ScanTypeSelector selected={selectedTypes} onChange={setSelectedTypes} />
          {errors.scanTypes && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.scanTypes.message}
            </p>
          )}
        </Card>

        {/* Step 3: Review and Launch */}
        <Card title="3. Review and Launch" subtitle="Review your scan configuration" padding="md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Project:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedProject?.name || 'Not selected'}
              </span>
            </div>
            {selectedProject?.repository_url && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Repository:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right truncate max-w-md">
                  {selectedProject.repository_url}
                </span>
              </div>
            )}
            {selectedProject?.default_branch && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Branch:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedProject.default_branch}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Scan Types:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'None selected'}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" isLoading={isPending} fullWidth size="lg">
              Launch Scan
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} fullWidth size="lg">
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};