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

export const riskData = [
    { risk: 'low', count: 0, fill: 'var(--color-low)' },
    { risk: 'medium', count: 0, fill: 'var(--color-medium)' },
    { risk: 'high', count: 0, fill: 'var(--color-high)' },
];
  
export const clauseData = [];
