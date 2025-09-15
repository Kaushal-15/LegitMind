'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FileData, SummaryData } from '@/lib/placeholder-data';

interface FilesContextType {
  files: FileData[];
  addFile: (file: FileData) => void;
  deleteFile: (fileId: string) => void;
  getFileContent: (fileId: string) => string | null;
  summaries: SummaryData[];
  addSummary: (summary: SummaryData) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const filesItem = window.localStorage.getItem('files');
      if (filesItem) {
        setFiles(JSON.parse(filesItem));
      }
      const summariesItem = window.localStorage.getItem('summaries');
      if (summariesItem) {
        setSummaries(JSON.parse(summariesItem));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem('files', JSON.stringify(files));
        } catch (error) {
            console.error(error);
        }
    }
  }, [files, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem('summaries', JSON.stringify(summaries));
        } catch (error) {
            console.error(error);
        }
    }
  }, [summaries, isLoaded]);

  const addFile = (file: FileData) => {
    setFiles((prevFiles) => [...prevFiles, file]);
     if (file.content) {
      try {
        window.localStorage.setItem(`file-content-${file.id}`, file.content);
      } catch (e) {
        console.error("Could not save file content to localStorage", e);
      }
    }
  };

  const deleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    setSummaries((prevSummaries) => prevSummaries.filter((summary) => summary.docId !== fileId));
    try {
      window.localStorage.removeItem(`file-content-${fileId}`);
    } catch(e) {
      console.error("Could not remove file content from localStorage", e);
    }
  };

  const getFileContent = (fileId: string): string | null => {
     if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(`file-content-${fileId}`);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const addSummary = (summary: SummaryData) => {
    setSummaries((prevSummaries) => [summary, ...prevSummaries.filter(s => s.docId !== summary.docId)]);
  }

  return (
    <FilesContext.Provider value={{ files, addFile, deleteFile, getFileContent, summaries, addSummary }}>
      {isLoaded ? children : null}
    </FilesContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
