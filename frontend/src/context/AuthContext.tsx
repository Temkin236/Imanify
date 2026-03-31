import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  UserProfile,
  fetchUserProfile,
  loginRequest,
  postDailyActivity,
  registerRequest
} from '../services/api';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const TOKEN_KEY = 'imanify_auth_token';
const USER_KEY = 'imanify_auth_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistAuth(token: string, user: UserProfile): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function readStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const profile = await fetchUserProfile(token);
      setUser(profile);
      persistAuth(token, profile);
    } catch {
      logout();
    }
  }, [logout, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = readStoredUser();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(storedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    refreshProfile();
  }, [refreshProfile, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    postDailyActivity(token)
      .then(() => refreshProfile())
      .catch(() => {
        // Keep UX smooth even if daily activity endpoint is temporarily unavailable.
      });
  }, [refreshProfile, token]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const payload = await loginRequest({ email, password });
      setToken(payload.token);
      setUser(payload.user);
      persistAuth(payload.token, payload.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const payload = await registerRequest({ email, password });
      setToken(payload.token);
      setUser(payload.user);
      persistAuth(payload.token, payload.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [loading, login, logout, refreshProfile, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
