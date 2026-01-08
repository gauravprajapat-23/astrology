import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Astrologers from '@/components/Astrologers';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Our Astrologers | Vedic Astrology Services',
  description: 'Meet our expert team of Vedic astrologers and priests dedicated to your spiritual journey.',
};

export default function AstrologersPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <Astrologers />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}