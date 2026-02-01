/**
 * Signup page
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/common';
import { useSignup } from '../hooks';
import { useUiStore } from '../stores';

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    organizationName: z.string().min(1, 'Organization name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending } = useSignup();
  const { addNotification } = useUiStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      addNotification({
        type: 'success',
        message: 'Account created successfully',
      });
      navigate('/dashboard');
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Signup failed',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CloudScan</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create your account
          </p>
        </div>

        {/* Signup form */}
        <Card padding="lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Sign up
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                {...register('firstName')}
                error={errors.firstName?.message}
                fullWidth
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                {...register('lastName')}
                error={errors.lastName?.message}
                fullWidth
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              fullWidth
              autoComplete="email"
            />

            <Input
              label="Organization name"
              {...register('organizationName')}
              error={errors.organizationName?.message}
              fullWidth
              helperText="Your company or team name"
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              fullWidth
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              fullWidth
              autoComplete="new-password"
            />

            <Button type="submit" isLoading={isPending} fullWidth size="lg">
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};