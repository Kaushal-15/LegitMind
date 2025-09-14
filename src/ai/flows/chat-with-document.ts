'use server';
/**
 * @fileOverview A flow for chatting with a document.
 *
 * - chatWithDocument - A function that answers questions based on a document's context.
 * - ChatWithDocumentInput - The input type for the chatWithDocument function.
 * - ChatWithDocumentOutput - The return type for the chatWithDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatWithDocumentInputSchema = z.object({
  documentContext: z.string().describe('The text content of the document to chat with.'),
  question: z.string().describe('The user question about the document.'),
});
export type ChatWithDocumentInput = z.infer<typeof ChatWithDocumentInputSchema>;

const ChatWithDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question, in the same language as the question.'),
});
export type ChatWithDocumentOutput = z.infer<typeof ChatWithDocumentOutputSchema>;

export async function chatWithDocument(input: ChatWithDocumentInput): Promise<ChatWithDocumentOutput> {
  return chatWithDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithDocumentPrompt',
  input: { schema: ChatWithDocumentInputSchema },
  output: { schema: ChatWithDocumentOutputSchema },
  prompt: `You are a helpful legal assistant. Your task is to answer questions based on the provided document context.

  IMPORTANT: You must identify the language of the user's question (e.g., English, Hindi, Tamil, etc.) and provide your answer in that same language.

  Document Context:
  ---
  {{{documentContext}}}
  ---

  User's Question:
  "{{{question}}}"

  Based on the document, provide a clear and concise answer to the user's question.
  `,
});

const chatWithDocumentFlow = ai.defineFlow(
  {
    name: 'chatWithDocumentFlow',
    inputSchema: ChatWithDocumentInputSchema,
    outputSchema: ChatWithDocumentOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
