'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: any;
  permissions: string[];
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminName: string | null;
  adminSession: AdminSession | null;
  isDevelopmentMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in development mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDevelopmentMode(window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '[::1]');
    }
  }, []);
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check for existing session in localStorage
      const savedSession = localStorage.getItem('adminSession');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        setAdminSession(sessionData);
        setAdminName(sessionData.name);
        setIsAuthenticated(true);
        return;
      }

      // Check Supabase session
      if (typeof window !== 'undefined') {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verify user is staff member with admin permissions
          const { data: staffData, error: staffError } = await supabase
            .from('staff_members')
            .select(`
              id,
              first_name,
              last_name,
              email,
              is_active,
              role:staff_roles(name_en, name_hi, permissions)
            `)
            .eq('email', session.user.email)
            .single();

          if (!staffError && staffData && staffData.is_active) {
            const permissions = (staffData.role as any)?.permissions || [];
            if (permissions.includes('admin') || permissions.includes('staff_management')) {
              const sessionData: AdminSession = {
                userId: staffData.id,
                email: staffData.email,
                name: `${staffData.first_name} ${staffData.last_name}`,
                role: staffData.role,
                permissions: permissions
              };
              
              setAdminSession(sessionData);
              setAdminName(sessionData.name);
              setIsAuthenticated(true);
              localStorage.setItem('adminSession', JSON.stringify(sessionData));
              return;
            }
          }
        }
      }
      
      // Check development mode credentials
      if (isDevelopmentMode) {
        const devAuth = localStorage.getItem('adminAuth');
        const devName = localStorage.getItem('adminName');
        if (devAuth === 'true' && devName) {
          setAdminName(devName);
          setIsAuthenticated(true);
          setAdminSession({
            userId: 'dev-admin-1',
            email: 'admin@gmail.com',
            name: devName,
            role: { name_en: 'Administrator', permissions: ['admin', 'staff_management'] },
            permissions: ['admin', 'staff_management']
          });
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopmentMode]);
  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);



  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Verify user is staff member
        const { data: staffData, error: staffError } = await supabase
          .from('staff_members')
          .select(`
            id,
            first_name,
            last_name,
            email,
            is_active,
            role:staff_roles(name_en, name_hi, permissions)
          `)
          .eq('email', email)
          .single();

        if (staffError || !staffData) {
          throw new Error('User not found in staff database');
        }

        if (!staffData.is_active) {
          throw new Error('Account is deactivated');
        }

        // Check permissions
        const permissions = (staffData.role as any)?.permissions || [];
        if (!permissions.includes('admin') && !permissions.includes('staff_management')) {
          throw new Error('Insufficient permissions');
        }

        // Update last login
        await supabase
          .from('staff_members')
          .update({ last_login: new Date().toISOString() })
          .eq('id', staffData.id);

        // Store session
        const sessionData: AdminSession = {
          userId: staffData.id,
          email: staffData.email,
          name: `${staffData.first_name} ${staffData.last_name}`,
          role: staffData.role,
          permissions: permissions
        };

        setAdminSession(sessionData);
        setAdminName(sessionData.name);
        setIsAuthenticated(true);
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Fallback to development mode credentials
      if (isDevelopmentMode) {
        const validCredentials = [
          { email: 'admin', password: 'admin123' },
          { email: 'admin@gmail.com', password: 'admin123' }
        ];
        
        const isValid = validCredentials.some(cred => 
          (email === cred.email && password === cred.password)
        );
        
        if (isValid) {
          const sessionData: AdminSession = {
            userId: 'dev-admin-1',
            email: email.includes('@') ? email : 'admin@gmail.com',
            name: 'Admin User',
            role: { name_en: 'Administrator', permissions: ['admin', 'staff_management'] },
            permissions: ['admin', 'staff_management']
          };
          
          setAdminSession(sessionData);
          setAdminName('Admin User');
          setIsAuthenticated(true);
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminName', 'Admin User');
          localStorage.setItem('adminSession', JSON.stringify(sessionData));
          
          return true;
        }
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Logout from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setIsAuthenticated(false);
      setAdminName(null);
      setAdminSession(null);
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminSession');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      adminName, 
      adminSession,
      isDevelopmentMode, 
      login, 
      logout,
      checkAuth
    }}>
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
