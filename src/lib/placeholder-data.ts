export type FileData = {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'pdf' | 'docx' | 'txt';
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
    { risk: 'low', count: 120, fill: 'var(--color-low)' },
    { risk: 'medium', count: 75, fill: 'var(--color-medium)' },
    { risk: 'high', count: 32, fill: 'var(--color-high)' },
];
  
export const clauseData = [
    { clause: 'Indemnity', count: 18 },
    { clause: 'Limitation of Liability', count: 15 },
    { clause: 'Confidentiality', count: 12 },
    { clause: 'Termination', count: 9 },
    { clause: 'Governing Law', count: 5 },
];
