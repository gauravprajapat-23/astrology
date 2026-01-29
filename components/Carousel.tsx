'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

type CarouselItem = {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  image_url: string;
  link?: string;
  is_active: boolean;
};

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length, currentIndex]);

  const fetchCarouselItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (loading) {
    return (
      <div className="relative h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-r from-saffron-100 to-gold-100 dark:from-gray-800 dark:to-gray-900 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-saffron-600 dark:text-saffron-400 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-r from-saffron-50 to-gold-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="text-6xl mb-4">ॐ</div>
          <h2 className="text-2xl md:text-3xl font-bold text-saffron-600 dark:text-saffron-400 mb-2">
            {t('Welcome to Divine Rituals', 'दिव्य रिचुअल्स में आपका स्वागत है')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {t(
              'Experience authentic Vedic rituals and astrology services',
              'प्रामाणिक वैदिक अनुष्ठान और ज्योतिष सेवाओं का अनुभव करें'
            )}
          </p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div 
      className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentItem.image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="max-w-3xl">
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 md:mb-6 leading-tight"
                  >
                    {language === 'en' ? currentItem.title_en : currentItem.title_hi}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed"
                  >
                    {language === 'en' ? currentItem.description_en : currentItem.description_hi}
                  </motion.p>

                  {currentItem.link && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      onClick={() => window.location.href = currentItem.link!}
                      className="flex items-center gap-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:from-saffron-600 hover:to-gold-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <FiPlay className="w-5 h-5" />
                      {t('Learn More', 'और जानें')}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {items.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            {isAutoPlaying ? t('Auto', 'ऑटो') : t('Paused', 'रोका गया')}
          </div>
        </div>
      )}
    </div>
  );
}