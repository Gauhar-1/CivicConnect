'use server';

import { z } from 'zod';
import type { VolunteerSignup } from '@/types';

const volunteerSignupSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  interests: z.array(z.string()).min(1),
  availability: z.string().min(1),
  message: z.string().max(500).optional(),
});

type VolunteerSignupInput = z.infer<typeof volunteerSignupSchema>;

interface ActionResult {
  success: boolean;
  error?: string | null;
  data?: VolunteerSignup;
}

export async function volunteerSignupAction(input: VolunteerSignupInput): Promise<ActionResult> {
  try {
    const validatedData = volunteerSignupSchema.parse(input);

    // In a real application, you would save this data to a database.
    // For this prototype, we'll just simulate success.
    console.log('Volunteer Signup Data:', validatedData);

    const newSignup: VolunteerSignup = {
      id: `vol_${Date.now()}`,
      ...validatedData,
      submittedAt: new Date().toISOString(),
    };
    
    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, data: newSignup };
  } catch (error) {
    console.error('Error in volunteer signup action:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed: ' + error.errors.map(e => e.message).join(', ') };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred during signup.' };
  }
}
