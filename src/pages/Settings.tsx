/**
 * Settings page for user profile and preferences
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input } from '../components/common';
import { useCurrentUser, useUpdateProfile, useChangePassword } from '../hooks';
import { useUiStore } from '../stores';
import { Spinner } from '../components/common';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const Settings: React.FC = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { theme, toggleTheme, addNotification } = useUiStore();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      addNotification({
        type: 'success',
        message: 'Profile updated successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update profile',
      });
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      const { confirmPassword, ...passwordData } = data;
      await changePassword(passwordData);
      addNotification({
        type: 'success',
        message: 'Password changed successfully',
      });
      resetPassword();
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to change password',
      });
    }
  };

  if (userLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card title="Profile Information" subtitle="Update your account details" padding="md">
        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...registerProfile('firstName')}
              error={profileErrors.firstName?.message}
              fullWidth
            />
            <Input
              label="Last Name"
              {...registerProfile('lastName')}
              error={profileErrors.lastName?.message}
              fullWidth
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            {...registerProfile('email')}
            error={profileErrors.email?.message}
            fullWidth
          />

          <div className="flex justify-end">
            <Button type="submit" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change */}
      <Card title="Change Password" subtitle="Update your account password" padding="md">
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...registerPassword('currentPassword')}
            error={passwordErrors.currentPassword?.message}
            fullWidth
          />

          <Input
            label="New Password"
            type="password"
            {...registerPassword('newPassword')}
            error={passwordErrors.newPassword?.message}
            fullWidth
          />

          <Input
            label="Confirm New Password"
            type="password"
            {...registerPassword('confirmPassword')}
            error={passwordErrors.confirmPassword?.message}
            fullWidth
          />

          <div className="flex justify-end">
            <Button type="submit" isLoading={isChangingPassword}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance */}
      <Card title="Appearance" subtitle="Customize your interface" padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current theme: {theme === 'light' ? 'Light' : 'Dark'}
            </p>
          </div>
          <Button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>
      </Card>

      {/* Organization Info (Read-only) */}
      {user.organizationId && (
        <Card title="Organization" subtitle="Your organization details" padding="md">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{user.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
};