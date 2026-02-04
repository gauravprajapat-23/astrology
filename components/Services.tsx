'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiTag, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GiLotusFlower, GiFire, GiRingBox, GiTempleGate, GiSun, GiDoor, GiPlanetCore } from 'react-icons/gi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Link from 'next/link';
import Section from '@/components/Section';

const iconMap: Record<string, any> = {
  lotus: GiLotusFlower,
  fire: GiFire,
  rings: GiRingBox,
  home: GiTempleGate,
  sun: GiSun,
  door: GiDoor,
  planet: GiPlanetCore,
  shiva: GiLotusFlower,
};

const categoryColors: Record<string, { gradient: string; badge: string; hover: string }> = {
  puja: {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    hover: 'group-hover:shadow-amber-500/20'
  },
  astrology: {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    hover: 'group-hover:shadow-violet-500/20'
  },
  vastu: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    hover: 'group-hover:shadow-emerald-500/20'
  },
  ceremony: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    hover: 'group-hover:shadow-rose-500/20'
  },
  default: {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    hover: 'group-hover:shadow-amber-500/20'
  }
};

const ITEMS_PER_PAGE = 8;

export default function Services({ variant = 'page' }: { variant?: 'landing' | 'page' }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentServices = services.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <section className="py-4 sm:py-16 lg:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-64 sm:w-96 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 sm:h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Section id="services" variant={variant} className="bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-56 sm:w-72 h-56 sm:h-72 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          {/* Decorative Top Element */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4 sm:mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 blur-xl opacity-30 rounded-full"></div>
              <div className="relative flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/30 shadow-lg">
                <GiLotusFlower className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {t('Sacred Services', 'पवित्र सेवाएं')}
                </span>
                <GiLotusFlower className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight px-4">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
              {t('Our Sacred Services', 'हमारी पवित्र सेवाएं')}
            </span>
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed px-4">
            {t(
              'Choose from our range of authentic Vedic rituals performed with devotion and precision',
              'भक्ति और सटीकता के साथ किए गए हमारे प्रामाणिक वैदिक अनुष्ठानों की श्रृंखला में से चुनें'
            )}
          </p>
        </motion.div>

        {/* Services Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            {currentServices.map((service, index) => {
              const Icon = iconMap[service.icon] || GiLotusFlower;
              const colors = categoryColors[service.category.toLowerCase()] || categoryColors.default;
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group h-full"
                >
                  <div className={`relative h-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl ${colors.hover} transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700`}>
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                    <div className="relative p-4 sm:p-5 lg:p-6 flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-3 sm:mb-4">
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${colors.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                          
                          {/* Icon Glow */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="mb-2 sm:mb-3">
                        <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 ${colors.badge} text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wide`}>
                          {service.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-amber-600 group-hover:to-rose-600 dark:group-hover:from-amber-400 dark:group-hover:to-rose-400 transition-all duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                        {language === 'en' ? service.name_en : service.name_hi}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 flex-grow leading-relaxed">
                        {language === 'en' ? service.description_en : service.description_hi}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 dark:text-gray-400">
                            <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="font-medium">{service.duration_minutes} {t('mins', 'मिनट')}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <FiTag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              ₹{service.base_price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 sm:space-y-2.5">
                        <button
                          onClick={() => {
                            localStorage.setItem('selectedService', service.id);
                            window.location.href = '/booking';
                          }}
                          className={`group/btn relative w-full py-2 sm:py-2.5 bg-gradient-to-r ${colors.gradient} text-white rounded-lg font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center justify-center space-x-1.5 sm:space-x-2">
                            <span>{t('Book Now', 'अभी बुक करें')}</span>
                            <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </div>
                        </button>
                        <Link 
                          href={`/services/${service.id}`}
                          className="block w-full py-2 sm:py-2.5 text-center border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs sm:text-sm hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 active:scale-[0.98] transition-all duration-300"
                        >
                          {t('View Details', 'विवरण देखें')}
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Corner Decoration - Hidden on small screens */}
                    <div className="hidden sm:block absolute bottom-0 right-0 w-20 lg:w-24 h-20 lg:h-24 opacity-10 dark:opacity-5 transform translate-x-8 translate-y-8 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500">
                      <Icon className="w-full h-full text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 sm:mt-12 lg:mt-16"
          >
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
            >
              <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('Previous', 'पिछला')}</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                
                // Show all pages on mobile if <= 5, otherwise show smart pagination
                if (totalPages <= 5) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${
                        currentPage === pageNumber
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }

                // Smart pagination for many pages
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${
                        currentPage === pageNumber
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="text-gray-400 dark:text-gray-600 px-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
            >
              <span className="hidden sm:inline">{t('Next', 'अगला')}</span>
              <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </motion.div>
        )}

        {/* Page Info - Mobile */}
        {totalPages > 1 && (
          <div className="text-center mt-4 sm:hidden">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {t(`Page ${currentPage} of ${totalPages}`, `पृष्ठ ${currentPage} / ${totalPages}`)}
            </span>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10 sm:mt-14 lg:mt-16"
        >
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 px-4">
            {t("Can't find what you're looking for?", 'वह नहीं मिल रहा जो आप ढूंढ रहे हैं?')}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 border-2 border-amber-500 dark:border-amber-400 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-amber-50 dark:hover:bg-gray-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span className="text-center">{t('Contact Us for Custom Rituals', 'कस्टम अनुष्ठानों के लिए हमसे संपर्क करें')}</span>
              <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </motion.div>
      </div>
    </Section>
  );
}