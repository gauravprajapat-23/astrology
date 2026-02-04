'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiBook, FiCalendar, FiMail, FiPhone, FiMapPin, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { GiLotusFlower, GiVortex } from 'react-icons/gi';
import { supabase, type Astrologer } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Link from 'next/link';

export default function AstrologerProfileView({ astrologerId }: { astrologerId: string }) {
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchAstrologer();
  }, [astrologerId]);

  const fetchAstrologer = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('astrologers')
        .select('*')
        .eq('id', astrologerId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (!data) {
        setError('Astrologer not found');
        return;
      }
      
      setAstrologer(data);
    } catch (error) {
      console.error('Error fetching astrologer:', error);
      setError('Failed to load astrologer profile');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${language === 'en' ? astrologer?.name_en : astrologer?.name_hi} - Vedic Astrologer`,
          url: url,
        });
      } catch (error) {
        console.log('Sharing failed', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !astrologer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12">
            <div className="text-red-500 text-6xl mb-6">
              <FiStar />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Astrologer not found'}
            </h2>
            <Link 
              href="/astrologers"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors"
            >
              <FiArrowLeft />
              <span>Back to Astrologers</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-8 sm:py-12 lg:py-16">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            href="/astrologers"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-700/30 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Back to Astrologers', 'ज्योतिषियों पर वापस जाएं')}</span>
          </Link>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Header with Background */}
          <div className="relative h-48 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
                    {astrologer.photo_url ? (
                      <img
                        src={astrologer.photo_url}
                        alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                        <GiLotusFlower className="w-16 h-16 text-violet-600 dark:text-violet-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                    <FiStar className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                  </h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <FiAward className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-100 font-semibold">
                      {astrologer.experience_years} {t('Years of Experience', 'वर्षों का अनुभव')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <GiLotusFlower className="w-6 h-6 text-violet-600 dark:text-violet-400 mr-3" />
                {t('About', 'के बारे में')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
              </p>
            </motion.div>

            {/* Specializations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <GiVortex className="w-6 h-6 text-violet-600 dark:text-violet-400 mr-3" />
                {t('Specializations', 'विशेषज्ञता')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {astrologer.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-400 font-semibold rounded-full text-sm border border-violet-200 dark:border-violet-700/30"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiBook className="w-6 h-6 text-violet-600 dark:text-violet-400 mr-3" />
                {t('Get in Touch', 'संपर्क करें')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <FiMail className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Email', 'ईमेल')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">contact@vedicastro.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <FiPhone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Phone', 'फ़ोन')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg sm:col-span-2">
                  <FiMapPin className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Location', 'स्थान')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t('Vedic Astrology Center, Delhi', 'वैदिक ज्योतिष केंद्र, दिल्ली')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {t('Ready for a Consultation?', 'परामर्श के लिए तैयार हैं?')}
                </h3>
                <p className="mb-6 opacity-90">
                  {t('Book a session with our expert astrologer today', 'आज ही हमारे विशेषज्ञ ज्योतिषी के साथ एक सत्र बुक करें')}
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedAstrologer', astrologer.id);
                    window.location.href = '/booking';
                  }}
                  className="group relative px-8 py-4 bg-white text-violet-700 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-5 h-5" />
                    <span>{t('Book Consultation', 'परामर्श बुक करें')}</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}