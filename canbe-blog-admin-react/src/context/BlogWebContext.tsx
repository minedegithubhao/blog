import React, { createContext, useContext } from 'react';

interface BlogWebContextType {
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}

const BlogWebContext = createContext<BlogWebContextType | undefined>(undefined);

export const BlogWebProvider: React.FC<{ 
  selectedKey: string; 
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
}> = ({ selectedKey, setSelectedKey, children }) => {
  return (
    <BlogWebContext.Provider value={{ selectedKey, setSelectedKey }}>
      {children}
    </BlogWebContext.Provider>
  );
};

export const useBlogWebContext = () => {
  const context = useContext(BlogWebContext);
  if (context === undefined) {
    throw new Error('useBlogWebContext must be used within a BlogWebProvider');
  }
  return context;
};