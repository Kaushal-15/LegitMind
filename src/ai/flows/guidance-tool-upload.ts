'use server';

/**
 * @fileOverview A tool to guide the user through the document upload process.
 *
 * - guidanceToolUpload - A function that guides the user through the document upload process.
 * - GuidanceToolUploadInput - The input type for the guidanceToolUpload function.
 * - GuidanceToolUploadOutput - The return type for the guidanceToolUpload function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuidanceToolUploadInputSchema = z.object({
  question: z.string().describe('The user question about the document upload process.'),
});
export type GuidanceToolUploadInput = z.infer<typeof GuidanceToolUploadInputSchema>;

const GuidanceToolUploadOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type GuidanceToolUploadOutput = z.infer<typeof GuidanceToolUploadOutputSchema>;

export async function guidanceToolUpload(input: GuidanceToolUploadInput): Promise<GuidanceToolUploadOutput> {
  return guidanceToolUploadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guidanceToolUploadPrompt',
  input: {schema: GuidanceToolUploadInputSchema},
  output: {schema: GuidanceToolUploadOutputSchema},
  prompt: `You are a helpful assistant guiding the user through a document upload process.

  The user has the following question: {{{question}}}

  Provide a concise and helpful answer to the user's question.
  The answer should be no more than two sentences.`,
});

const guidanceToolUploadFlow = ai.defineFlow(
  {
    name: 'guidanceToolUploadFlow',
    inputSchema: GuidanceToolUploadInputSchema,
    outputSchema: GuidanceToolUploadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
