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

const AnalyzeDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to analyze.'),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const ClauseSchema = z.object({
    title: z.string().describe("A short, descriptive title for the clause."),
    description: z.string().describe("A one-sentence explanation of what the clause entails."),
});

const ObligationSchema = z.object({
    party: z.string().describe("The party responsible for the obligation (e.g., 'Tenant', 'Landlord', 'Company')."),
    description: z.string().describe("A clear and concise description of the obligation."),
    dueDate: z.string().optional().describe("The due date for the obligation, if specified (e.g., 'Within 30 days of signing')."),
});

const RiskSchema = z.object({
    level: z.enum(['Low', 'Medium', 'High']).describe("The severity level of the risk."),
    description: z.string().describe("A description of the potential risk and its implications."),
    mitigation: z.string().describe("A suggested action to mitigate or address the risk."),
});


const AnalyzeDocumentOutputSchema = z.object({
  clauses: z.array(ClauseSchema).describe('Key clauses identified in the document.'),
  obligations: z.array(ObligationSchema).describe('Specific obligations for each party.'),
  risks: z.array(RiskSchema).describe('Potential risks and compliance red flags.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

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
    const { output } = await prompt(input);
    return output!;
  }
);
