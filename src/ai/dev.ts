import { config } from 'dotenv';
config();

// Since googleAI plugin is removed, ensure this flow doesn't strictly depend on Gemini-specific features
// or that you have another model provider configured.
import '@/ai/flows/summarize-candidate-manifesto.ts';
