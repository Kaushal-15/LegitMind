'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FileData, SummaryData, ChatSession, ChatMessage, AnalysisData } from '@/lib/placeholder-data';
import type { AnalyzeDocumentOutput } from '@/lib/placeholder-data';

interface FilesContextType {
  files: FileData[];
  addFile: (file: FileData) => void;
  deleteFile: (fileId: string) => void;
  getFileContent: (fileId: string) => string | null;
  summaries: SummaryData[];
  addSummary: (summary: SummaryData) => void;
  getSummary: (docId: string) => SummaryData | undefined;
  analyses: AnalysisData[];
  addAnalysis: (analysis: AnalysisData) => void;
  getAnalysis: (docId: string) => AnalysisData | undefined;
  chats: ChatSession[];
  getChatSession: (docId: string) => ChatSession | undefined;
  addMessageToChat: (docId: string, docName: string, message: ChatMessage) => void;
  clearChat: (docId: string) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const filesItem = window.localStorage.getItem('files');
      if (filesItem) setFiles(JSON.parse(filesItem));
      
      const summariesItem = window.localStorage.getItem('summaries');
      if (summariesItem) setSummaries(JSON.parse(summariesItem));
      
      const analysesItem = window.localStorage.getItem('analyses');
      if (analysesItem) setAnalyses(JSON.parse(analysesItem));
      
      const chatsItem = window.localStorage.getItem('chats');
      if (chatsItem) setChats(JSON.parse(chatsItem));
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
            console.error("Failed to save files to localStorage", error);
        }
    }
  }, [files, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem('summaries', JSON.stringify(summaries));
        } catch (error) {
            console.error("Failed to save summaries to localStorage", error);
        }
    }
  }, [summaries, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem('analyses', JSON.stringify(analyses));
      } catch (error) {
        console.error("Failed to save analyses to localStorage", error);
      }
    }
  }, [analyses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem('chats', JSON.stringify(chats));
      } catch (error) {
        console.error("Could not save chats to localStorage", error);
      }
    }
  }, [chats, isLoaded]);

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
    setAnalyses((prevAnalyses) => prevAnalyses.filter((analysis) => analysis.docId !== fileId));
    setChats((prevChats) => prevChats.filter((chat) => chat.docId !== fileId));
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

  const getSummary = (docId: string): SummaryData | undefined => {
    return summaries.find(summary => summary.docId === docId);
  }
  
  const addAnalysis = (analysis: AnalysisData) => {
    setAnalyses((prevAnalyses) => [analysis, ...prevAnalyses.filter(a => a.docId !== analysis.docId)]);
  }

  const getAnalysis = (docId: string): AnalysisData | undefined => {
    return analyses.find(analysis => analysis.docId === docId);
  }

  const getChatSession = (docId: string): ChatSession | undefined => {
    return chats.find(chat => chat.docId === docId);
  }

  const addMessageToChat = (docId: string, docName: string, message: ChatMessage) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.docId === docId);
      if (chatIndex > -1) {
        const updatedChats = [...prevChats];
        const updatedChat = { ...updatedChats[chatIndex] };
        updatedChat.messages = [...updatedChat.messages, message];
        updatedChat.lastUpdated = new Date().toISOString();
        updatedChats[chatIndex] = updatedChat;
        return updatedChats;
      } else {
        const newChat: ChatSession = {
          docId,
          docName,
          messages: [message],
          lastUpdated: new Date().toISOString()
        };
        return [...prevChats, newChat];
      }
    });
  };

  const clearChat = (docId: string) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.docId === docId);
      if (chatIndex > -1) {
        const updatedChats = [...prevChats];
        updatedChats[chatIndex].messages = [];
        return updatedChats;
      }
      return prevChats;
    })
  }

  const contextValue: FilesContextType = {
    files,
    addFile,
    deleteFile,
    getFileContent,
    summaries,
    addSummary,
    getSummary,
    analyses,
    addAnalysis,
    getAnalysis,
    chats,
    getChatSession,
    addMessageToChat,
    clearChat
  };

  return (
    <FilesContext.Provider value={contextValue}>
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
