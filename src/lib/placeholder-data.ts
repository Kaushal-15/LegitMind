import { AnalyzeDocumentOutput } from "@/ai/flows/analyze-document";

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
