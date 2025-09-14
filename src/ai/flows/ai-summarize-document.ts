'use server';
/**
 * @fileOverview Summarizes documents using AI.
 *
 * - aiSummarizeDocument - A function that summarizes a document.
 * - AiSummarizeDocumentInput - The input type for the aiSummarizeDocument function.
 * - AiSummarizeDocumentOutput - The return type for the aiSummarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSummarizeDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to summarize.'),
});
export type AiSummarizeDocumentInput = z.infer<typeof AiSummarizeDocumentInputSchema>;

const AiSummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document.'),
});
export type AiSummarizeDocumentOutput = z.infer<typeof AiSummarizeDocumentOutputSchema>;

export async function aiSummarizeDocument(input: AiSummarizeDocumentInput): Promise<AiSummarizeDocumentOutput> {
  return aiSummarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSummarizeDocumentPrompt',
  input: {schema: AiSummarizeDocumentInputSchema},
  output: {schema: AiSummarizeDocumentOutputSchema},
  prompt: `Summarize the following document, focusing on the key points and main arguments:\n\n{{{documentText}}}`,
});

const aiSummarizeDocumentFlow = ai.defineFlow(
  {
    name: 'aiSummarizeDocumentFlow',
    inputSchema: AiSummarizeDocumentInputSchema,
    outputSchema: AiSummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
