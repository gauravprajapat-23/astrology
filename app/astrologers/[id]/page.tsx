import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import AstrologerProfileView from '@/components/AstrologerProfileView';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: 'Astrologer Profile | Vedic Astrology Services',
    description: 'View detailed profile of our expert Vedic astrologer.',
  };
}

export default function AstrologerProfilePage({ params }: { params: { id: string } }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <AstrologerProfileView astrologerId={params.id} />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}