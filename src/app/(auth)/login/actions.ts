
'use server';

import { z } from 'zod';
import { firestoreDB } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import type { Role, FirestoreUser, FirestoreRole } from '@/types';

const createUserProfileSchema = z.object({
  uid: z.string().min(1),
  phone: z.string().nullable(),
  email: z.string().email().nullable().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.').optional(),
  role: z.enum(['VOTER', 'VOLUNTEER', 'CANDIDATE', 'ADMIN']),
  photoURL: z.string().url().nullable().optional(),
  regionId: z.string().optional(),
});

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>;

interface ActionResult {
  success: boolean;
  error?: string | null;
  userId?: string;
}

export async function createUserProfileAndRoleAction(input: CreateUserProfileInput): Promise<ActionResult> {
  try {
    const validatedData = createUserProfileSchema.parse(input);
    const { uid, role, ...userProfileData } = validatedData;

    // Create user profile document in /users collection
    const userDocRef = doc(firestoreDB, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    const userPayload: Partial<FirestoreUser> = {
      ...userProfileData,
      uid, // ensure uid is part of the payload
      createdAt: serverTimestamp() as unknown as string, // Firestore will convert this
    };
    
    if (userDocSnap.exists()) {
        // Update existing user document if necessary, e.g. name or photoURL
        await setDoc(userDocRef, {
            ...userProfileData,
            updatedAt: serverTimestamp() // Add an updatedAt field if desired
        }, { merge: true });
    } else {
        await setDoc(userDocRef, userPayload);
    }


    // Create/update role document in /roles collection
    const roleDocRef = doc(firestoreDB, 'roles', uid);
    const rolePayload: FirestoreRole = {
      uid,
      role,
      updatedAt: serverTimestamp() as unknown as string,
    };
    await setDoc(roleDocRef, rolePayload, { merge: true }); // Use merge to update if exists

    return { success: true, userId: uid };
  } catch (error) {
    console.error('Error creating user profile/role:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map((e) => e.message).join(', ') };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
