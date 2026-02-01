'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlay, FiPause } from 'react-icons/fi';
import { GiLotusFlower } from 'react-icons/gi';
import { FaOm } from 'react-icons/fa6';
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
  const [direction, setDirection] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchCarouselItems();
  }, []);
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length, nextSlide]);

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


  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);
  const toggleAutoPlay = () => setIsAutoPlaying(!isAutoPlaying);

  if (loading) {
    return (
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] xl:h-[750px] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-mandala bg-repeat animate-pulse"></div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl"
        />

        {/* Loading Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          {/* Animated Om Symbol */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mb-8"
          >
            <FaOm className="w-24 h-24 md:w-32 md:h-32 text-gradient-to-r from-amber-500 to-rose-500" style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
              {t('Preparing Divine Experience', 'दिव्य अनुभव तैयार किया जा रहा है')}
            </h3>
            
            {/* Animated Loading Bar */}
            <div className="w-64 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Lotus Flower Decoration */}
            <div className="flex items-center justify-center space-x-3 pt-4">
              <GiLotusFlower className="w-6 h-6 text-amber-500 dark:text-amber-400 animate-pulse" />
              <GiLotusFlower className="w-8 h-8 text-orange-500 dark:text-orange-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <GiLotusFlower className="w-6 h-6 text-rose-500 dark:text-rose-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] xl:h-[750px] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div className="absolute inset-0 bg-mandala bg-repeat"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

        {/* Empty State Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          {/* Decorative Top */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 blur-2xl opacity-30 rounded-full"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl">
                <FaOm className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                {t('Welcome to Divine Rituals', 'दिव्य रिचुअल्स में आपका स्वागत है')}
              </span>
            </h2>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              {t(
                'Experience authentic Vedic rituals and astrology services guided by ancient wisdom',
                'प्राचीन ज्ञान द्वारा निर्देशित प्रामाणिक वैदिक अनुष्ठान और ज्योतिष सेवाओं का अनुभव करें'
              )}
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <GiLotusFlower className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div 
      className="relative h-[500px] md:h-[600px] lg:h-[700px] xl:h-[750px] overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Parallax Effect */}
          <motion.div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentItem.image_url})` }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            {/* Multi-layer Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
            
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-mandala bg-repeat"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-24">
                <div className="max-w-4xl">
                  {/* Decorative Top Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-block mb-6"
                  >
                    <div className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                      <GiLotusFlower className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        {t('Featured Experience', 'विशेष अनुभव')}
                      </span>
                    </div>
                  </motion.div>

                  {/* Title with Enhanced Animation */}
                  <motion.h2 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-6 md:mb-8 leading-tight"
                  >
                    <span className="relative inline-block">
                      {language === 'en' ? currentItem.title_en : currentItem.title_hi}
                      {/* Underline Decoration */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full origin-left"
                      />
                    </span>
                  </motion.h2>
                  
                  {/* Description with Stagger Effect */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-8 md:mb-10"
                  >
                    <p className="text-xl md:text-2xl lg:text-3xl text-gray-100 leading-relaxed font-light max-w-3xl">
                      {language === 'en' ? currentItem.description_en : currentItem.description_hi}
                    </p>
                    
                    {/* Decorative Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="mt-6 flex items-center space-x-4"
                    >
                      <div className="h-0.5 w-24 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                      <GiLotusFlower className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  </motion.div>

                  {/* CTA Button with Enhanced Styling */}
                  {currentItem.link && (
                    <motion.button
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = currentItem.link!}
                      className="group/btn relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl overflow-hidden shadow-2xl"
                    >
                      {/* Button Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Button Shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ['-200%', '200%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                      
                      <span className="relative z-10 flex items-center gap-3">
                        <FiPlay className="w-6 h-6" />
                        {t('Learn More', 'और जानें')}
                      </span>
                      
                      {/* Arrow Animation */}
                      <motion.div
                        className="relative z-10"
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.div>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-8 left-8 w-20 h-20 border-t-4 border-l-4 border-amber-400/50 rounded-tl-3xl"></div>
            <div className="absolute bottom-8 right-8 w-20 h-20 border-b-4 border-r-4 border-rose-400/50 rounded-br-3xl"></div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Arrows */}
      {items.length > 1 && (
        <>
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-6 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-amber-500 hover:to-rose-500 hover:border-transparent transition-all duration-300 shadow-2xl group/arrow"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-7 h-7 md:w-8 md:h-8 transform group-hover/arrow:-translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full blur-xl opacity-0 group-hover/arrow:opacity-50 transition-opacity duration-300"></div>
          </motion.button>
          
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-6 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-amber-500 hover:to-rose-500 hover:border-transparent transition-all duration-300 shadow-2xl group/arrow"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-7 h-7 md:w-8 md:h-8 transform group-hover/arrow:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full blur-xl opacity-0 group-hover/arrow:opacity-50 transition-opacity duration-300"></div>
          </motion.button>
        </>
      )}

      {/* Enhanced Pagination Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`relative h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-10 bg-gradient-to-r from-amber-500 to-rose-500' 
                  : 'w-2.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full shadow-lg"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Enhanced Auto-play Control */}
      {items.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 md:top-8 right-6 md:right-8 z-30"
        >
          <motion.button
            onClick={toggleAutoPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-full px-5 py-2.5 text-white text-sm font-medium border border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg group"
          >
            <div className="relative">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' 
                  : 'bg-gray-400'
              }`}></div>
              {isAutoPlaying && (
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></div>
              )}
            </div>
            
            {isAutoPlaying ? (
              <>
                <span className="hidden sm:inline">{t('Auto Playing', 'ऑटो चल रहा है')}</span>
                <FiPause className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{t('Paused', 'रोका गया')}</span>
                <FiPlay className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Progress Bar */}
      {items.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <motion.div
            key={currentIndex}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
}