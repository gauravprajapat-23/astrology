import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import ServiceDetailView from '@/components/ServiceDetailView';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: 'Service Details | Vedic Astrology Services',
    description: 'View detailed information about our Vedic astrology services.',
  };
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Navigation />
          <ServiceDetailView serviceId={params.id} />
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}