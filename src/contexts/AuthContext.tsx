
'use client';

import type { User, Role, FirestoreUser, FirestoreRole } from '@/types';
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
  logout: () => void; // Will be a no-op for now
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null); // Removed
  const [appUser, setAppUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('ANONYMOUS');
  const [isLoading, setIsLoading] = useState(false); // Assume not loading if auth is disabled
  const router = useRouter();

  // The Firebase auth listeners and profile fetching logic are removed for now.
  // useEffect(() => {
  //   setIsLoading(true);
  //   const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
  //     setFirebaseUser(fbUser);
  //     if (fbUser) {
  //       await fetchUserRoleAndProfile(fbUser);
  //     } else {
  //       setAppUser(null);
  //       setRole('ANONYMOUS');
  //       setIsLoading(false);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [fetchUserRoleAndProfile]);

  const logout = async () => {
    // setIsLoading(true);
    // try {
    //   await signOut(firebaseAuth);
    //   setFirebaseUser(null);
    //   setAppUser(null);
    //   setRole('ANONYMOUS');
    //   router.push('/'); // Or a dedicated logged-out page
    // } catch (error) {
    //   console.error("Logout error:", error);
    // } finally {
    //   setIsLoading(false);
    // }
    console.log("Logout called, but login is currently disabled.");
    setAppUser(null);
    setRole('ANONYMOUS');
    router.push('/'); // Redirect to home or a public page
  };
  
  return (
    <AuthContext.Provider value={{ user: appUser, firebaseUser: null, role, isLoading, logout }}>
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
