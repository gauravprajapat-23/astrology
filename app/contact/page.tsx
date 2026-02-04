import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us | Vedic Astrology Services',
  description: 'Get in touch with our Vedic astrology experts for consultations and services.',
};

export default function ContactPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <Contact />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}