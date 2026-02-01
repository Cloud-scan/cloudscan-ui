/**
 * User and Organization related types
 */

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  organization_id: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface Organization {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  plan: SubscriptionPlan;
  is_active: boolean;
  max_projects: number;
  max_users: number;
  created_at: string;
  updated_at: string;
}

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface OrganizationMember {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  joined_at: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}