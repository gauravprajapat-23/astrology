'use client';

import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with loading fallbacks to improve initial load performance
const Navigation = dynamic(() => import('@/components/Navigation'), { ssr: true });
const Carousel = dynamic(() => import('@/components/Carousel'), { ssr: true, loading: () => <div className="h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-r from-saffron-50 to-gold-50 dark:from-gray-900 dark:to-gray-800" /> });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: true, loading: () => <div className="h-screen bg-gradient-to-b from-saffron-50 via-gold-50 to-divine-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" /> });
const Services = dynamic(() => import('@/components/Services'), { ssr: true, loading: () => <div className="py-12 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" /> });
const BookingForm = dynamic(() => import('@/components/BookingForm'), { ssr: true, loading: () => <div className="py-20 bg-white dark:bg-gray-900" /> });
const About = dynamic(() => import('@/components/About'), { ssr: true, loading: () => <div className="py-20 bg-gradient-to-b from-saffron-50 to-white dark:from-gray-800 dark:to-gray-900" /> });
const Astrologers = dynamic(() => import('@/components/Astrologers'), { ssr: true, loading: () => <div className="py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" /> });
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: true, loading: () => <div className="py-20 bg-white dark:bg-gray-900" /> });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true, loading: () => <div className="py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" /> });
const VideoSection = dynamic(() => import('@/components/VideoSection'), { ssr: true, loading: () => <div className="py-16 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" /> });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });



export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Suspense fallback={<div className="h-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" />}> 
            <Navigation />
          </Suspense>
          <Suspense fallback={<div className="h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-r from-saffron-50 to-gold-50 dark:from-gray-900 dark:to-gray-800" />}> 
            <Carousel />
          </Suspense>
          <Suspense fallback={<div className="h-screen bg-gradient-to-b from-saffron-50 via-gold-50 to-divine-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />}> 
            <Hero />
          </Suspense>
          <Suspense fallback={<div className="py-12 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" />}> 
            <Services />
          </Suspense>
          <Suspense fallback={<div className="py-20 bg-white dark:bg-gray-900" />}> 
            <BookingForm />
          </Suspense>
          <Suspense fallback={<div className="py-20 bg-gradient-to-b from-saffron-50 to-white dark:from-gray-800 dark:to-gray-900" />}> 
            <About />
          </Suspense>
          <Suspense fallback={<div className="py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" />}> 
            <Astrologers />
          </Suspense>
          <Suspense fallback={<div className="py-20 bg-white dark:bg-gray-900" />}> 
            <Gallery />
          </Suspense>
          <Suspense fallback={<div className="py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" />}> 
            <Contact />
          </Suspense>
          <Suspense fallback={<div className="py-16 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800" />}> 
            <VideoSection />
          </Suspense>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
