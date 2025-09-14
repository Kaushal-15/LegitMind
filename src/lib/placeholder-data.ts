export type FileData = {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'pdf' | 'docx' | 'txt';
};

export const files: FileData[] = [
  { id: '1', name: 'Partnership_Agreement_Final.docx', size: '1.2 MB', date: '2024-07-28', type: 'docx' },
  { id: '2', name: 'NDA_Client_ProjectX.pdf', size: '450 KB', date: '2024-07-25', type: 'pdf' },
  { id: '3', name: 'Meeting_Notes_Q3_Strategy.txt', size: '15 KB', date: '2024-07-22', type: 'txt' },
  { id: '4', name: 'Lease_Agreement_Office.pdf', size: '2.5 MB', date: '2024-07-20', type: 'pdf' },
  { id: '5', name: 'Employee_Handbook_2024.docx', size: '3.1 MB', date: '2024-07-15', type: 'docx' },
];

export type SummaryData = {
  id: string;
  docId: string;
  docName: string;
  summary: string;
  date: string;
};

export const summaries: SummaryData[] = [
  {
    id: '1',
    docId: '1',
    docName: 'Partnership_Agreement_Final.docx',
    summary: 'This document outlines a partnership agreement between two parties. Key sections include profit sharing ratios, defined roles and responsibilities, capital contributions, and dissolution terms. The agreement is set for a term of five years, with an option for renewal.',
    date: '2024-07-28',
  },
  {
    id: '2',
    docId: '2',
    docName: 'NDA_Client_ProjectX.pdf',
    summary: 'A Non-Disclosure Agreement for "ProjectX". It establishes confidentiality for all shared information, including trade secrets and proprietary data. The term of confidentiality extends for three years beyond the termination of the business relationship.',
    date: '2024-07-25',
  },
];
