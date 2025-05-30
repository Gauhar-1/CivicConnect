
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

export function RequiredAuth({ children, allowedRoles, redirectTo = '/' }: RequiredAuthProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // If login is disabled, user will be null and isLoading false.
  // In this state, allow access to all "protected" routes.
  // When login is re-enabled, this logic will correctly protect routes.
  if (!user && !isLoading) { 
    // If we intended to block access when no user, this would be where redirection happens.
    // For "login removed for now", we let them pass.
    // Original logic for redirection:
    // if (!user || !allowedRoles.includes(role)) {
    //   setTimeout(() => router.push(redirectTo), 0);
    //   return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Redirecting...</p><Loader2 className="ml-2 h-5 w-5 animate-spin text-primary" /></div>;
    // }
  } else if (user && !allowedRoles.includes(role)) { // If there IS a user, but wrong role
    setTimeout(() => router.push(redirectTo), 0);
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Redirecting (Access Denied)...</p><Loader2 className="ml-2 h-5 w-5 animate-spin text-primary" /></div>;
  }


  return <>{children}</>;
}

export function HideIfAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  // If login is disabled, user is null, so this will show children.
  if (user) {
    return null;
  }
  return <>{children}</>;
}

export function ShowIfAuth({ children, roles }: { children: ReactNode, roles?: Role[] }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  // If login is disabled, user is null, so this will show nothing.
  if (!user) {
    return null;
  }
  
  if (roles && !roles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
