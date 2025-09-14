'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FileData } from '@/lib/placeholder-data';

interface FilesContextType {
  files: FileData[];
  addFile: (file: FileData) => void;
  deleteFile: (fileId: string) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const item = window.localStorage.getItem('files');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('files', JSON.stringify(files));
    } catch (error) {
      console.error(error);
    }
  }, [files]);

  const addFile = (file: FileData) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  const deleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  return (
    <FilesContext.Provider value={{ files, addFile, deleteFile }}>
      {children}
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
