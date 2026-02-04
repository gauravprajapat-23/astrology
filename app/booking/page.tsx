import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import CommonBookingForm from '@/components/CommonBookingForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Book Consultation | Vedic Astrology Services',
  description: 'Book your personalized Vedic astrology consultation with our expert astrologers.',
};

export default function BookingPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <CommonBookingForm />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}