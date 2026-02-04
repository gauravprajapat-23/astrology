import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Our Services | Vedic Astrology Services',
  description: 'Explore our comprehensive range of authentic Vedic astrology services and rituals.',
};

export default function ServicesPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <Services />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}