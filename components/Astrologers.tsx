'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiStar, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GiLotusFlower } from 'react-icons/gi';
import { supabase, type Astrologer } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;

export default function Astrologers() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      const { data, error } = await supabase
        .from('astrologers')
        .select('*')
        .eq('is_active', true)
        .order('experience_years', { ascending: false });

      if (error) throw error;
      setAstrologers(data || []);
    } catch (error) {
      console.error('Error fetching astrologers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(astrologers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAstrologers = astrologers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('astrologers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-900">
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
    <section id="astrologers" className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4 sm:mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-xl opacity-30 rounded-full"></div>
              <div className="relative flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-700/30 shadow-lg">
                <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400 fill-current" />
                <span className="text-xs sm:text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  {t('Expert Team', 'विशेषज्ञ टीम')}
                </span>
                <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400 fill-current" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight px-4">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              {t('Our Expert Astrologers', 'हमारे विशेषज्ञ ज्योतिषी')}
            </span>
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed px-4">
            {t(
              'Meet our team of experienced Vedic astrologers and priests dedicated to serving your spiritual needs',
              'आपकी आध्यात्मिक आवश्यकताओं की सेवा करने के लिए समर्पित हमारे अनुभवी वैदिक ज्योतिषियों और पुजारियों की टीम से मिलें'
            )}
          </p>
        </motion.div>

        {/* Astrologers Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            {currentAstrologers.map((astrologer, index) => (
              <motion.div
                key={astrologer.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group h-full"
              >
                <div className="relative h-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl group-hover:shadow-violet-500/20 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500"></div>
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                  <div className="relative p-4 sm:p-5 lg:p-6 flex flex-col h-full">
                    {/* Photo Container - Compact */}
                    <div className="mb-3 sm:mb-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                        {/* Photo Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-0.5 sm:p-1 group-hover:scale-110 transition-transform duration-500">
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-0.5 sm:p-1">
                            {astrologer.photo_url ? (
                              <img
                                src={astrologer.photo_url}
                                alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                                className="w-full h-full object-cover rounded-full"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                <GiLotusFlower className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600 dark:text-violet-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Floating Star Badge */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-110 transition-transform duration-300">
                          <FiStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-current" />
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-violet-600 group-hover:to-fuchsia-600 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400 transition-all duration-300 line-clamp-1">
                      {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                    </h3>

                    {/* Experience Badge */}
                    <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-3 sm:mb-4 mx-auto">
                      <FiAward className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-600 dark:text-violet-400" />
                      <span className="text-xs sm:text-sm font-bold text-violet-700 dark:text-violet-400">
                        {astrologer.experience_years} {t('Years', 'वर्ष')}
                      </span>
                    </div>

                    {/* Bio - Compact */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed text-center flex-grow">
                      {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                    </p>

                    {/* Specializations - Compact */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-3 sm:mb-4">
                      {astrologer.specializations.slice(0, 2).map((spec, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-400 text-[10px] sm:text-xs font-semibold rounded-full border border-violet-200 dark:border-violet-700/30"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons - Compact */}
                    <div className="space-y-2">
                      <Link 
                        href={`/astrologers/${astrologer.id}`}
                        className="group/btn relative w-full py-2 sm:py-2.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-lg font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden block text-center"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-1.5 sm:space-x-2">
                          <span>{t('View Profile', 'प्रोफ़ाइल देखें')}</span>
                          <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.setItem('selectedAstrologer', astrologer.id);
                          window.location.href = '/booking';
                        }}
                        className="w-full py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs sm:text-sm hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 active:scale-[0.98] transition-all duration-300"
                      >
                        {t('Book Consultation', 'परामर्श बुक करें')}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Corner Decoration - Hidden on small screens */}
                  <div className="hidden sm:block absolute bottom-0 right-0 w-16 lg:w-20 h-16 lg:h-20 opacity-10 dark:opacity-5 transform translate-x-6 translate-y-6 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500">
                    <GiLotusFlower className="w-full h-full text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
              </motion.div>
            ))}
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
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
            >
              <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('Previous', 'पिछला')}</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                
                if (totalPages <= 5) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${
                        currentPage === pageNumber
                          ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }

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
                          ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
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
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300"
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
            {t('Want to consult with our astrologers?', 'हमारे ज्योतिषियों से परामर्श करना चाहते हैं?')}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-400 border-2 border-violet-500 dark:border-violet-400 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-violet-50 dark:hover:bg-gray-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span>{t('Book a Consultation', 'परामर्श बुक करें')}</span>
              <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}