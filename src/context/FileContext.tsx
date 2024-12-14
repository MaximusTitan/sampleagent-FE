// src/context/FileContext.tsx
'use client';

import React, { createContext, useState, useContext } from 'react';

type FileContextType = {
  files: File[];
  setFiles: (files: File[] | ((prevFiles: File[]) => File[])) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [files, setFilesState] = useState<File[]>([]);
  
    const setFiles = (update: File[] | ((prev: File[]) => File[])) => {
      if (typeof update === 'function') {
        setFilesState((prev) => update(prev));
      } else {
        setFilesState(update);
      }
    };
  
    return (
      <FileContext.Provider value={{ files, setFiles }}>
        {children}
      </FileContext.Provider>
    );
  };
  