import React, { createContext, useContext, useState } from 'react';

const PathContext = createContext({ currentPath: 'path1', setCurrentPath: () => {} });

export function PathProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(
    () => localStorage.getItem('bouillon_path') || 'path1'
  );

  const setPath = (path) => {
    localStorage.setItem('bouillon_path', path);
    setCurrentPath(path);
  };

  return (
    <PathContext.Provider value={{ currentPath, setCurrentPath: setPath }}>
      {children}
    </PathContext.Provider>
  );
}

export function useCurrentPath() {
  return useContext(PathContext);
}
