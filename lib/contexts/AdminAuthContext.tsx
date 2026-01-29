'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminName: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const savedName = localStorage.getItem('adminName');
    if (savedAuth === 'true' && savedName) {
      setIsAuthenticated(true);
      setAdminName(savedName);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Demo credentials for local development
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setAdminName(username);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminName', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminName(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminName');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminName, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
