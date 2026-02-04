'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { supabase, type Testimonial } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

import Section from '@/components/Section';

export default function About({ variant = 'page' }: { variant?: 'landing' | 'page' }) {
  const { language, t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    setTestimonials(data || []);
  };

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const stats = [
    {
      icon: FiTrendingUp,
      number: '15+',
      label: t('Years Experience', 'वर्षों का अनुभव'),
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
    },
    {
      icon: FiUsers,
      number: '1000+',
      label: t('Happy Clients', 'खुश ग्राहक'),
      gradient: 'from-rose-500 to-pink-500',
      bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20'
    },
    {
      icon: FiAward,
      number: '50+',
      label: t('Ritual Types', 'अनुष्ठान प्रकार'),
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20'
    },
    {
      icon: FiStar,
      number: '100%',
      label: t('Satisfaction', 'संतुष्टि'),
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
    },
  ];

  return (
    <Section id="about" variant={variant} className="bg-gradient-to-b from-amber-50/50 via-white to-rose-50/30 dark:from-gray-800/50 dark:via-gray-900 dark:to-slate-900/50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 sm:mb-28 lg:mb-32">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/8844892/pexels-photo-8844892.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pandit Ji"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-400 rounded-tl-2xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-rose-400 rounded-br-2xl"></div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 border-4 border-amber-500"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-1">
                    15+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    {t('Years', 'वर्ष')}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200 dark:border-amber-700/30">
                <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  {t('Master Astrologer', 'मास्टर ज्योतिषी')}
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                {t('About Our Astrologer', 'हमारे ज्योतिषी के बारे में')}
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-4 sm:space-y-5 text-gray-700 dark:text-gray-300">
              <p className="text-base sm:text-lg leading-relaxed">
                {t(
                  'With over 15 years of experience in Vedic astrology and Hindu rituals, Pandit Shri Ramesh Sharma has guided thousands of devotees towards spiritual enlightenment and worldly success.',
                  'वैदिक ज्योतिष और हिंदू अनुष्ठानों में 15 से अधिक वर्षों के अनुभव के साथ, पंडित श्री रमेश शर्मा ने हजारों भक्तों को आध्यात्मिक ज्ञान और सांसारिक सफलता की ओर मार्गदर्शन किया है।'
                )}
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                {t(
                  'Trained in ancient Vedic scriptures and traditional rituals, our services combine authentic practices with modern convenience. Every ritual is performed with utmost devotion and adherence to sacred traditions.',
                  'प्राचीन वैदिक शास्त्रों और पारंपरिक अनुष्ठानों में प्रशिक्षित, हमारी सेवाएं प्रामाणिक प्रथाओं को आधुनिक सुविधा के साथ जोड़ती हैं। प्रत्येक अनुष्ठान परम भक्ति और पवित्र परंपराओं के पालन के साथ किया जाता है।'
                )}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl transform group-hover:scale-105 transition-transform duration-300`}></div>
                  <div className="relative p-5 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          {/* Section Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center space-x-2 px-5 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/30 shadow-lg">
              <FiStar className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t('Testimonials', 'प्रशंसापत्र')}
              </span>
            </div>
          </motion.div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
              {t('What Our Clients Say', 'हमारे ग्राहक क्या कहते हैं')}
            </span>
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-light">
            {t('Real experiences from real people', 'वास्तविक लोगों के वास्तविक अनुभव')}
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        {testimonials.length > 0 && (
          <div className="relative max-w-5xl mx-auto">
            <div className="relative">
              {/* Main Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-14 overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-rose-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-full blur-3xl"></div>

                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 text-8xl sm:text-9xl text-amber-500/10 dark:text-amber-400/10 font-serif leading-none">
                      &quot;
                    </div>

                    <div className="relative">
                      {/* Stars */}
                      <div className="flex justify-center mb-6 sm:mb-8">
                        {[...Array(testimonials[currentIndex]?.rating || 5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1, type: "spring" }}
                          >
                            <FiStar className="w-6 sm:w-7 h-6 sm:h-7 text-amber-500 fill-current mx-1" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Review Text */}
                      <blockquote className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 text-center mb-8 sm:mb-10 italic leading-relaxed font-light">
                        {language === 'en' ? testimonials[currentIndex]?.review_en : testimonials[currentIndex]?.review_hi}
                      </blockquote>

                      {/* Customer Info */}
                      <div className="text-center">
                        <div className="inline-block">
                          <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1">
                            {testimonials[currentIndex]?.customer_name}
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-sm sm:text-base text-amber-600 dark:text-amber-400">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            <span>{testimonials[currentIndex]?.ritual_name}</span>
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 lg:-translate-x-16 w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-gradient-to-br hover:from-amber-500 hover:to-rose-500 hover:text-white transition-all duration-300 group border-2 border-amber-200 dark:border-amber-700/30"
                aria-label="Previous testimonial"
              >
                <FiChevronLeft className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 transform group-hover:-translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 lg:translate-x-16 w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-gradient-to-br hover:from-amber-500 hover:to-rose-500 hover:text-white transition-all duration-300 group border-2 border-amber-200 dark:border-amber-700/30"
                aria-label="Next testimonial"
              >
                <FiChevronRight className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 sm:mt-10 space-x-2 sm:space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`relative h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-12 sm:w-16 bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'w-2 sm:w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  {index === currentIndex && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}