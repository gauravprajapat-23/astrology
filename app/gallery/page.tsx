import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Gallery | Vedic Astrology Services',
  description: 'View our gallery of Vedic rituals, ceremonies, and spiritual events.',
};

export default function GalleryPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <Gallery />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}