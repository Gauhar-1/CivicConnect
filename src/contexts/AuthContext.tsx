
'use client';

import type { User, Role } from '@/types';
import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Firebase Auth related imports are removed for now
// import { firebaseAuth, firestoreDB } from '@/lib/firebase/config';
// import { onAuthStateChanged, type User as FirebaseUser, signOut } from 'firebase/auth';
// import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: null; // Kept for type consistency, but will be null
  role: Role;
  isLoading: boolean;
  loginWithOtp: (phone: string, otp: string) => boolean; // Updated for simulated login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null); // Removed
  const [appUser, setAppUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('ANONYMOUS');
   const [isLoading, setIsLoading] = useState(true); // Start as true until we check session
  const router = useRouter();


  // Simulate checking for an existing session on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = sessionStorage.getItem('civic-connect-user');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setAppUser(user);
        setRole(user.role);
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('civic-connect-user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithOtp = (phone: string, otp: string): boolean => {
    // This is a simulation. A real implementation would use Firebase Auth.
    const MOCK_OTP = '123456';
    if (otp === MOCK_OTP) {
      setIsLoading(true);
      // Create a mock user object.
      const mockUser: User = {
        uid: `simulated-${Date.now()}`,
        phone: phone,
        email: 'user@example.com', // Placeholder email
        role: 'VOTER', // Default role after login
        name: 'Jane Doe', // Placeholder name
        photoURL: `https://placehold.co/40x40.png?text=JD`,
      };
      
      setAppUser(mockUser);
      setRole(mockUser.role);
      
      // Persist mock session to sessionStorage
      try {
        sessionStorage.setItem('civic-connect-user', JSON.stringify(mockUser));
      } catch (error) {
        console.error("Failed to save user to sessionStorage", error);
      }
      
      setIsLoading(false);
      return true; // Indicate success
    }
    return false; // Indicate failure
  };

  const logout = async () => {
    setIsLoading(true);
    setAppUser(null);
    setRole('ANONYMOUS');
    
    // Clear mock session from sessionStorage
    try {
      sessionStorage.removeItem('civic-connect-user');
    } catch (error) {
       console.error("Failed to remove user from sessionStorage", error);
    }

    setIsLoading(false);
    router.push('/login'); // Redirect to login page after logout
  };
  
  return (
    <AuthContext.Provider value={{ user: appUser, firebaseUser: null, role, isLoading, loginWithOtp, logout }}>
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
