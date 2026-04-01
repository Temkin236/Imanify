import { Response } from 'express';
import { CustomRequest, ApiResponse } from '../types';
import { getUser, updateUser } from '../services/database';
import { verifyToken } from './authController';

interface UserProfile {
  email: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
}

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

    const user = getUser(email);
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

    const user = getUser(email);
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

    updateUser(email, {
      streak: lastActive !== today ? user.streak + 1 : user.streak,
      lastActiveDate: new Date().toISOString()
    });

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
