import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  picture?: string | null;
  sub: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  login: (redirectUrl?: string) => void;
  logout: () => void;
  refresh: () => void;
}

const STORAGE_KEY = 'lite-lms-user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as AuthUser;
    if (!parsed?.email || !parsed?.name || !parsed?.sub) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Unable to read stored user', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const syncUser = useCallback(() => {
    const nextUser = readUser();
    setUser(nextUser);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    syncUser();
    setIsReady(true);
  }, [syncUser]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => syncUser();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [syncUser]);

  const login = useCallback((redirectUrl?: string) => {
    if (typeof window === 'undefined') return;
    const redirectTarget = redirectUrl ?? `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const url = `/api/login?redirect=${encodeURIComponent(redirectTarget || '/')}`;
    window.location.href = url;
  }, []);

  const logout = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const refresh = useCallback(() => {
    if (typeof window === 'undefined') return;
    syncUser();
  }, [syncUser]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isReady,
    login,
    logout,
    refresh,
  }), [user, isReady, login, logout, refresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AUTH_STORAGE_KEY = STORAGE_KEY;

