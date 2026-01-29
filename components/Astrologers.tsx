'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiArrowRight } from 'react-icons/fi';
import { GiLotusFlower } from 'react-icons/gi';
import { supabase, type Astrologer } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Astrologers() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-96 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="astrologers" className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center space-x-2 px-5 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-700/30 shadow-lg">
              <FiStar className="w-4 h-4 text-violet-600 dark:text-violet-400 fill-current" />
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                {t('Expert Team', 'विशेषज्ञ टीम')}
              </span>
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              {t('Our Expert Astrologers', 'हमारे विशेषज्ञ ज्योतिषी')}
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t(
              'Meet our team of experienced Vedic astrologers and priests dedicated to serving your spiritual needs',
              'आपकी आध्यात्मिक आवश्यकताओं की सेवा करने के लिए समर्पित हमारे अनुभवी वैदिक ज्योतिषियों और पुजारियों की टीम से मिलें'
            )}
          </p>
        </motion.div>

        {/* Astrologers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {astrologers.map((astrologer, index) => (
            <motion.div
              key={astrologer.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500"></div>
                
                {/* Top Decorative Arc */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-b-[100%]"></div>

                <div className="relative p-6 lg:p-7 flex flex-col items-center text-center">
                  {/* Photo Container */}
                  <div className="relative mb-6 mt-8">
                    <div className="relative w-28 h-28 lg:w-32 lg:h-32">
                      {/* Photo Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-1 group-hover:scale-110 transition-transform duration-500">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-1">
                          {astrologer.photo_url ? (
                            <img
                              src={astrologer.photo_url}
                              alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                              className="w-full h-full object-cover rounded-full"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                              <GiLotusFlower className="w-12 h-12 lg:w-14 lg:h-14 text-violet-600 dark:text-violet-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Floating Star Badge */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 group-hover:scale-110 transition-transform duration-300">
                        <FiStar className="w-5 h-5 text-white fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-violet-600 group-hover:to-fuchsia-600 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400 transition-all duration-300">
                    {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                  </h3>

                  {/* Experience Badge */}
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                    <FiAward className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm font-bold text-violet-700 dark:text-violet-400">
                      {astrologer.experience_years} {t('Years', 'वर्ष')}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">
                    {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                  </p>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {astrologer.specializations.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-400 text-xs font-semibold rounded-full border border-violet-200 dark:border-violet-700/30"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* View Profile Button */}
                  <button className="group/btn relative w-full py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <span>{t('View Profile', 'प्रोफ़ाइल देखें')}</span>
                      <FiArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </div>
                  </button>
                </div>

                {/* Bottom Corner Decoration */}
                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5 dark:opacity-10">
                  <GiLotusFlower className="w-full h-full text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 font-light">
            {t('Want to consult with our astrologers?', 'हमारे ज्योतिषियों से परामर्श करना चाहते हैं?')}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 sm:px-10 py-4 bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-400 border-2 border-violet-500 dark:border-violet-400 rounded-full font-bold text-base sm:text-lg hover:bg-violet-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span>{t('Book a Consultation', 'परामर्श बुक करें')}</span>
              <FiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}