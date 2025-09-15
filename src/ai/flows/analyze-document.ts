'use server';
/**
 * @fileOverview Analyzes documents for legal clauses, obligations, and risks.
 *
 * - analyzeDocument - A function that analyzes a document.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { AnalyzeDocumentOutputSchema } from '@/lib/placeholder-data';
import type { AnalyzeDocumentOutput } from '@/lib/placeholder-data';


const AnalyzeDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to analyze.'),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

export async function analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: AnalyzeDocumentInputSchema },
  output: { schema: AnalyzeDocumentOutputSchema },
  prompt: `You are an expert legal AI. Analyze the following document and extract the following information:
- Key Clauses: Identify the most important clauses. For each, provide a short title and a one-sentence description.
- Obligations: Detail the specific obligations of each party involved.
- Risks: Identify any potential risks, red flags, or liabilities, categorizing their severity (Low, Medium, High) and suggesting mitigation strategies.

Analyze this document:
---
{{{documentText}}}
---
`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async input => {
    const maxRetries = 3;
    const delayMs = 1000;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const { output } = await prompt(input);
            return output!;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for analyzeDocumentFlow:`, error);
            if (i === maxRetries - 1) {
                // If this is the last retry, re-throw the error
                throw new Error("The AI model is currently overloaded. Please try again later.");
            }
            // Wait for a short delay before retrying
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    // This should not be reached, but as a fallback:
    throw new Error("Failed to get a response from the AI model after multiple retries.");
  }
);
