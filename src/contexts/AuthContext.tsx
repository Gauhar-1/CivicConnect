
'use client';

import type { User, Role } from '@/types';
import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import { loginAction, type LoginCredentials } from '@/app/(auth)/login/actions'; // Updated import path
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; user?: User | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // For this prototype, if a user is in localStorage, assume it's valid.
        // The loginAction is the source of truth for actual validation against mockUsers.
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check auth status", error);
      setUser(null);
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const result = await loginAction(credentials);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('authUser', JSON.stringify(result.user));
    } else {
      setUser(null);
      localStorage.removeItem('authUser');
    }
    setIsLoading(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    router.push('/login'); // Path remains /login due to route group
  };

  const role = user?.role || 'ANONYMOUS';

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
