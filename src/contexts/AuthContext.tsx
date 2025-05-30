
'use client';

import type { User, Role, FirestoreUser, FirestoreRole } from '@/types';
import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseAuth, firestoreDB } from '@/lib/firebase/config';
import { onAuthStateChanged, type User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null; // This will be our app's User type, enriched with role
  firebaseUser: FirebaseUser | null; // Raw Firebase Auth user
  role: Role;
  isLoading: boolean;
  logout: () => void;
  // Login is now handled by the login page UI directly with Firebase SDK
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('ANONYMOUS');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserRoleAndProfile = useCallback(async (fbUser: FirebaseUser) => {
    if (!fbUser) {
      setAppUser(null);
      setRole('ANONYMOUS');
      setIsLoading(false);
      return;
    }

    try {
      const roleDocRef = doc(firestoreDB, 'roles', fbUser.uid);
      const roleDocSnap = await getDoc(roleDocRef);
      let currentRole: Role = 'VOTER'; // Default role if not found

      if (roleDocSnap.exists()) {
        currentRole = roleDocSnap.data()?.role as Role || 'VOTER';
      }
      setRole(currentRole);

      const userDocRef = doc(firestoreDB, 'users', fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as FirestoreUser;
        setAppUser({
          uid: fbUser.uid,
          phone: fbUser.phoneNumber,
          email: fbUser.email,
          name: userData.name,
          role: currentRole,
          photoURL: userData.photoURL || fbUser.photoURL,
          regionId: userData.regionId,
        });
      } else {
        // User exists in Auth, but not in Firestore users collection yet.
        // This might happen if profile creation is pending or failed.
        // For now, set basic app user from FirebaseUser and role.
        setAppUser({
          uid: fbUser.uid,
          phone: fbUser.phoneNumber,
          email: fbUser.email,
          role: currentRole,
          name: fbUser.displayName || undefined,
          photoURL: fbUser.photoURL,
        });
        // Consider redirecting to a profile completion page if necessary
      }

    } catch (error) {
      console.error("Error fetching user role/profile:", error);
      // Fallback if Firestore fetch fails
      setAppUser({
        uid: fbUser.uid,
        phone: fbUser.phoneNumber,
        email: fbUser.email,
        role: 'VOTER', // Default to VOTER on error
        name: fbUser.displayName || undefined,
        photoURL: fbUser.photoURL,
      });
      setRole('VOTER');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await fetchUserRoleAndProfile(fbUser);
      } else {
        setAppUser(null);
        setRole('ANONYMOUS');
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [fetchUserRoleAndProfile]);

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(firebaseAuth);
      setFirebaseUser(null);
      setAppUser(null);
      setRole('ANONYMOUS');
      router.push('/login'); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user: appUser, firebaseUser, role, isLoading, logout }}>
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
