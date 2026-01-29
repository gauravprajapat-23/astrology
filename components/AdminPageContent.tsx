'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import AdminLoginPanel from '@/components/AdminLoginPanel';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPageContent() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginPanel />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminDashboard />
    </div>
  );
}
