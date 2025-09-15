import { z } from 'zod';

export type FileData = {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'pdf' | 'docx' | 'txt';
  content?: string;
};

export const files: FileData[] = [];

export type SummaryData = {
  id: string;
  docId: string;
  docName: string;
  summary: string;
  date: string;
};

export const summaries: SummaryData[] = [];

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

export const AnalyzeDocumentOutputSchema = z.object({
  clauses: z.array(ClauseSchema).describe('Key clauses identified in the document.'),
  obligations: z.array(ObligationSchema).describe('Specific obligations for each party.'),
  risks: z.array(RiskSchema).describe('Potential risks and compliance red flags.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export type AnalysisData = {
  id: string;
  docId: string;
  docName: string;
  analysis: AnalyzeDocumentOutput;
  date: string;
};

export const analyses: AnalysisData[] = [];

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatSession = {
  docId: string;
  docName: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export const riskData = [
    { risk: 'low', count: 0, fill: 'var(--color-low)' },
    { risk: 'medium', count: 0, fill: 'var(--color-medium)' },
    { risk: 'high', count: 0, fill: 'var(--color-high)' },
];
  
export const clauseData = [];
