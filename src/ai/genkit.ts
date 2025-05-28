import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai'; // Removed Google AI plugin

export const ai = genkit({
  plugins: [/* googleAI() */], // Removed Google AI plugin instance
  // model: 'googleai/gemini-2.0-flash', // Consider setting a new default model or leaving it undefined
});

