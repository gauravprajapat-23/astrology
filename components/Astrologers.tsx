'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar } from 'react-icons/fi';
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
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="astrologers" className="py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-mandala opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-4">
            {t('Our Expert Astrologers', 'हमारे विशेषज्ञ ज्योतिषी')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t(
              'Meet our team of experienced Vedic astrologers and priests dedicated to serving your spiritual needs',
              'आपकी आध्यात्मिक आवश्यकताओं की सेवा करने के लिए समर्पित हमारे अनुभवी वैदिक ज्योतिषियों और पुजारियों की टीम से मिलें'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {astrologers.map((astrologer, index) => (
            <motion.div
              key={astrologer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-saffron-100 dark:border-saffron-900/30"
            >
              <div className="p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {astrologer.photo_url ? (
                    <img
                      src={astrologer.photo_url}
                      alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FiStar className="w-10 h-10 text-white" />
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                  {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                </h3>

                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <FiAward className="w-4 h-4" />
                  <span>{astrologer.experience_years} {t('years experience', 'साल का अनुभव')}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 text-center">
                  {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                </p>

                <div className="flex flex-wrap gap-1 justify-center">
                  {astrologer.specializations.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400 text-xs font-medium rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}