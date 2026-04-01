import fs from 'fs';
import path from 'path';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
  createdAt: string;
}

const dbPath = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readDatabase(): Map<string, StoredUser> {
  ensureDataDir();
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      const users = JSON.parse(data) as StoredUser[];
      const map = new Map<string, StoredUser>();
      users.forEach(user => map.set(user.email, user));
      return map;
    }
  } catch (err) {
    console.warn('Could not read database:', err);
  }
  return new Map();
}

function writeDatabase(users: Map<string, StoredUser>): void {
  ensureDataDir();
  try {
    const data = Array.from(users.values());
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Could not write database:', err);
  }
}

// In-memory cache that syncs to disk
let usersCache = readDatabase();

export function getUser(email: string): StoredUser | null {
  return usersCache.get(email) || null;
}

export function createUser(email: string, password: string): StoredUser {
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const user: StoredUser = {
    id,
    email,
    password,
    streak: 0,
    achievements: [],
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  usersCache.set(email, user);
  writeDatabase(usersCache);
  return user;
}

export function updateUser(email: string, updates: Partial<StoredUser>): StoredUser | null {
  const user = usersCache.get(email);
  if (!user) return null;
  
  const updated = { ...user, ...updates };
  usersCache.set(email, updated);
  writeDatabase(usersCache);
  return updated;
}

export function getAllUsers(): StoredUser[] {
  return Array.from(usersCache.values());
}

export function userExists(email: string): boolean {
  return usersCache.has(email);
}

// Sync updates from disk
export function reloadDatabase(): void {
  usersCache = readDatabase();
}
