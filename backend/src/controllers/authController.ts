import { Response } from 'express';
import { CustomRequest, ApiResponse } from '../types.js';
import { getUser, createUser, userExists } from '../services/database.js';

// Simple token storage
const tokenToEmailMap = new Map<string, string>();

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

    const user = getUser(email);
    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse<never>);
      return;
    }

    const token = generateToken();
    tokenToEmailMap.set(token, email);

    res.json({
      success: true,
      data: {
        token,
        user: {
          email: user.email,
          streak: user.streak,
          achievements: user.achievements,
          lastActiveDate: user.lastActiveDate
        }
      },
      timestamp: new Date().toISOString()
    } as ApiResponse<any>);
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

    if (userExists(email)) {
      res.status(409).json({
        success: false,
        error: 'Email already registered'
      } as ApiResponse<never>);
      return;
    }

    const newUser = createUser(email, password);
    const token = generateToken();
    tokenToEmailMap.set(token, email);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          email: newUser.email,
          streak: newUser.streak,
          achievements: newUser.achievements,
          lastActiveDate: newUser.lastActiveDate
        }
      },
      timestamp: new Date().toISOString()
    } as ApiResponse<any>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    } as ApiResponse<never>);
  }
}

export function verifyToken(token: string): string | null {
  return tokenToEmailMap.get(token) || null;
}

export async function logout(token: string): Promise<void> {
  tokenToEmailMap.delete(token);
}
