import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai'; // Re-added Google AI plugin

export const ai = genkit({
  plugins: [googleAI()], // Re-added Google AI plugin instance
  model: 'googleai/gemini-1.5-flash-latest', // Set a default model
});
