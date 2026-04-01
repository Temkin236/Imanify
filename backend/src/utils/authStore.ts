// Shared in-memory user and token store (dev/demo only)
export interface StoredUser {
  email: string;
  password: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
  createdAt: string;
}

export const users = new Map<string, StoredUser>();
export const tokens = new Map<string, string>(); // token -> email

// Initialize with demo user
users.set('demo@imanify.app', {
  email: 'demo@imanify.app',
  password: 'demo1234',
  streak: 7,
  achievements: ['beginner', 'consistent'],
  lastActiveDate: new Date().toISOString(),
  createdAt: new Date().toISOString()
});

export function generateToken(): string {
  return `token_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

export function verifyToken(token: string): string | null {
  return tokens.get(token) || null;
}
