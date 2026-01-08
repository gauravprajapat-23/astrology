import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Admin Panel | Vedic Astrology Services',
  description: 'Admin panel for managing services, bookings, testimonials, and astrologers.',
};

export default function AdminPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <AdminDashboard />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}