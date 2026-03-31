import { apiRequest } from './client';
import { UserProfile } from './authApi';

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  return apiRequest<UserProfile>('/user/profile', { method: 'GET' }, token);
}

export async function postDailyActivity(token: string): Promise<{ updated: boolean }> {
  return apiRequest<{ updated: boolean }>('/user/activity', { method: 'POST' }, token);
}
