import { apiRequest } from './client';

export interface UserProfile {
  email: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
}

interface AuthPayload {
  token: string;
  user: UserProfile;
}

interface AuthRequest {
  email: string;
  password: string;
}

export async function loginRequest(credentials: AuthRequest): Promise<AuthPayload> {
  return apiRequest<AuthPayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function registerRequest(credentials: AuthRequest): Promise<AuthPayload> {
  return apiRequest<AuthPayload>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}
