import { Response } from 'express';
import { CustomRequest, ApiResponse } from '../types';
import { verifyToken } from './authController';

interface UserProfile {
  email: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
}

// Simple in-memory user store reference (shared with authController)
const userStore = new Map<string, {
  email: string;
  password: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
  createdAt: string;
}>();

// Initialize with demo user
const demoUser = {
  email: 'demo@imanify.app',
  password: 'demo1234',
  streak: 7,
  achievements: ['beginner', 'consistent'],
  lastActiveDate: new Date().toISOString(),
  createdAt: new Date().toISOString()
};
userStore.set('demo@imanify.app', demoUser);

export async function getProfile(req: CustomRequest, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header'
      } as ApiResponse<never>);
      return;
    }

    const token = authHeader.substring(7);
    const email = verifyToken(token);

    if (!email) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      } as ApiResponse<never>);
      return;
    }

    const user = userStore.get(email);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse<never>);
      return;
    }

    const profile: UserProfile = {
      email: user.email,
      streak: user.streak,
      achievements: user.achievements,
      lastActiveDate: user.lastActiveDate
    };

    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString()
    } as ApiResponse<UserProfile>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    } as ApiResponse<never>);
  }
}

export async function postActivity(req: CustomRequest, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header'
      } as ApiResponse<never>);
      return;
    }

    const token = authHeader.substring(7);
    const email = verifyToken(token);

    if (!email) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      } as ApiResponse<never>);
      return;
    }

    const user = userStore.get(email);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse<never>);
      return;
    }

    // Track daily activity: increment streak if not done today
    const today = new Date().toDateString();
    const lastActive = new Date(user.lastActiveDate).toDateString();

    if (lastActive !== today) {
      user.streak += 1;
    }

    user.lastActiveDate = new Date().toISOString();
    userStore.set(email, user);

    res.json({
      success: true,
      data: { updated: true },
      timestamp: new Date().toISOString()
    } as ApiResponse<{ updated: boolean }>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post activity'
    } as ApiResponse<never>);
  }
}

export function setUserStore(store: Map<string, any>): void {
  // Allow authController to share the same store
  const entries = Array.from(store.entries());
  userStore.clear();
  entries.forEach(([key, value]) => userStore.set(key, value));
}
