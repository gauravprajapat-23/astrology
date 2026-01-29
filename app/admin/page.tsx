import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthContext';
import AdminPageContent from '@/components/AdminPageContent';

export const metadata = {
  title: 'Admin Panel | Vedic Astrology Services',
  description: 'Admin panel for managing services, bookings, testimonials, and astrologers.',
};

export default function AdminPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <AdminPageContent />
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}