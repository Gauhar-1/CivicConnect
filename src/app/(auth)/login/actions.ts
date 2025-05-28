
'use server';

import type { User } from '@/types';
import { z } from 'zod';

// IMPORTANT: In a real application, NEVER store passwords in plaintext.
// Always hash passwords securely (e.g., using bcrypt or Argon2).
const mockUsers = [
  { id: 'user-admin', email: 'admin@example.com', password: 'password', role: 'ADMIN' as const, name: 'Admin User' },
  { id: 'user-candidate', email: 'candidate@example.com', password: 'password', role: 'CANDIDATE' as const, name: 'Candidate Test' },
  { id: 'user-volunteer', email: 'volunteer@example.com', password: 'password', role: 'VOLUNTEER' as const, name: 'Volunteer Test' },
  { id: 'user-voter', email: 'voter@example.com', password: 'password', role: 'VOTER' as const, name: 'Voter Test' },
];

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

interface ActionResult {
  success: boolean;
  user?: User | null;
  error?: string | null;
}

export async function loginAction(credentials: LoginCredentials): Promise<ActionResult> {
  try {
    const validatedCredentials = loginSchema.parse(credentials);

    const foundUser = mockUsers.find(
      (u) => u.email === validatedCredentials.email && u.password === validatedCredentials.password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser; // Exclude password from returned user object
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Invalid email or password.' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map((e) => e.message).join(', ') };
    }
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
