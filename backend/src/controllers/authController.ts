import { Response } from 'express';
import { CustomRequest, ApiResponse } from '../types';

// Simple in-memory user store and token map (dev/demo only)
interface StoredUser {
  email: string;
  password: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
  createdAt: string;
}

interface AuthPayload {
  token: string;
  user: {
    email: string;
    streak: number;
    achievements: string[];
    lastActiveDate: string;
  };
}

const users = new Map<string, StoredUser>();
const tokens = new Map<string, string>(); // token -> email

// Demo user for testing
users.set('demo@imanify.app', {
  email: 'demo@imanify.app',
  password: 'demo1234',
  streak: 7,
  achievements: ['beginner', 'consistent'],
  lastActiveDate: new Date().toISOString(),
  createdAt: new Date().toISOString()
});

function generateToken(): string {
  return `token_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

export async function login(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse<never>);
      return;
    }

    const user = users.get(email);
    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse<never>);
      return;
    }

    // Generate token
    const token = generateToken();
    tokens.set(token, email);

    // Update last active
    user.lastActiveDate = new Date().toISOString();

    const payload: AuthPayload = {
      token,
      user: {
        email: user.email,
        streak: user.streak,
        achievements: user.achievements,
        lastActiveDate: user.lastActiveDate
      }
    };

    res.json({
      success: true,
      data: payload,
      timestamp: new Date().toISOString()
    } as ApiResponse<AuthPayload>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    } as ApiResponse<never>);
  }
}

export async function register(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse<never>);
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      } as ApiResponse<never>);
      return;
    }

    if (users.has(email)) {
      res.status(409).json({
        success: false,
        error: 'Email already registered'
      } as ApiResponse<never>);
      return;
    }

    const newUser: StoredUser = {
      email,
      password,
      streak: 0,
      achievements: [],
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    users.set(email, newUser);

    // Generate token
    const token = generateToken();
    tokens.set(token, email);

    const payload: AuthPayload = {
      token,
      user: {
        email: newUser.email,
        streak: newUser.streak,
        achievements: newUser.achievements,
        lastActiveDate: newUser.lastActiveDate
      }
    };

    res.status(201).json({
      success: true,
      data: payload,
      timestamp: new Date().toISOString()
    } as ApiResponse<AuthPayload>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    } as ApiResponse<never>);
  }
}

export function verifyToken(token: string): string | null {
  return tokens.get(token) || null;
}
