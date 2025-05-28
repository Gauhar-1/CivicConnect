
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Role } from '@/types';
import { Loader2 } from 'lucide-react';

interface RequiredAuthProps {
  children: ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

export function RequiredAuth({ children, allowedRoles, redirectTo = '/login' }: RequiredAuthProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user || !allowedRoles.includes(role)) {
    // Use timeout to ensure navigation happens after current render cycle
    setTimeout(() => router.push(redirectTo), 0);
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Redirecting...</p><Loader2 className="ml-2 h-5 w-5 animate-spin text-primary" /></div>;
  }

  return <>{children}</>;
}

export function HideIfAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loader, but typically for "hide if auth", hiding is fine
  }

  if (user) {
    return null;
  }
  return <>{children}</>;
}

export function ShowIfAuth({ children, roles }: { children: ReactNode, roles?: Role[] }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loader
  }

  if (!user) {
    return null;
  }
  
  if (roles && !roles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
