import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us | Vedic Astrology Services',
  description: 'Learn about our Vedic astrology center and our mission to provide authentic spiritual services.',
};

export default function AboutPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <About />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}