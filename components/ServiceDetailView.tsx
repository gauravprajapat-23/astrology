'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTag, FiUsers, FiCalendar, FiArrowLeft, FiShare2, FiInfo, FiCheckCircle, FiStar } from 'react-icons/fi';
import { GiLotusFlower, GiFire, GiRingBox, GiTempleGate, GiSun, GiDoor, GiPlanetCore, GiLotus } from 'react-icons/gi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Link from 'next/link';

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

const categoryColors: Record<string, { 
  gradient: string; 
  badge: string; 
  bg: string;
  text: string;
}> = {
  puja: {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400'
  },
  astrology: {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-700 dark:text-violet-400'
  },
  vastu: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400'
  },
  ceremony: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-700 dark:text-rose-400'
  },
  default: {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400'
  }
};

export default function ServiceDetailView({ serviceId }: { serviceId: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  // fetchService is stable here; disable exhaustive-deps warning
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (!data) {
        setError('Service not found');
        return;
      }
      
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${language === 'en' ? service?.name_en : service?.name_hi} - Vedic Astrology Service`,
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

  const scrollToBooking = () => {
    localStorage.setItem('selectedService', serviceId);
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      setTimeout(() => {
        bookingElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
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

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12">
            <div className="text-red-500 text-6xl mb-6">
              <FiTag />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Service not found'}
            </h2>
            <Link 
              href="/#services"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
            >
              <FiArrowLeft />
              <span>Back to Services</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || GiLotusFlower;
  const colors = categoryColors[service.category.toLowerCase()] || categoryColors.default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-8 sm:py-12 lg:py-16">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            href="/#services"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Back to Services', 'सेवाओं पर वापस जाएं')}</span>
          </Link>
        </motion.div>

        {/* Service Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Header */}
          <div className={`relative p-8 ${colors.bg}`}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Icon className="w-full h-full" />
            </div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className={`relative w-24 h-24 ${colors.bg} rounded-2xl flex items-center justify-center shadow-lg border`}>
                <Icon className={`w-12 h-12 ${colors.text}`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-xl opacity-20`}></div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 ${colors.badge} text-xs font-bold rounded-full uppercase tracking-wide`}>
                    {service.category}
                  </span>
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                    <FiTag className="w-4 h-4" />
                    <span className="font-bold text-lg">₹{service.base_price.toLocaleString()}</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'en' ? service.name_en : service.name_hi}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4" />
                    <span>{service.duration_minutes} {t('minutes', 'मिनट')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiUsers className="w-4 h-4" />
                    <span>{t('Personal Session', 'व्यक्तिगत सत्र')}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-300 hover:bg-white/30 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <GiLotusFlower className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3" />
                {t('Service Description', 'सेवा विवरण')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {language === 'en' ? service.description_en : service.description_hi}
              </p>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiInfo className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3" />
                {t('What\'s Included', 'शामिल क्या है')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <FiCheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('Personalized Analysis', 'व्यक्तिगत विश्लेषण')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('Detailed astrological insights specific to your needs', 'आपकी आवश्यकताओं के अनुरूप विस्तृत ज्योतिषीय अंतर्दृष्टि')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <FiCheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('Expert Consultation', 'विशेषज्ञ परामर्श')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('Guidance from certified Vedic astrologers', 'प्रमाणित वैदिक ज्योतिषियों से मार्गदर्शन')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <FiCheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('Written Report', 'लिखित रिपोर्ट')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('Comprehensive analysis report for future reference', 'भविष्य के संदर्भ के लिए व्यापक विश्लेषण रिपोर्ट')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <FiCheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('Follow-up Support', 'अनुवर्ती समर्थन')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('Post-session guidance and clarifications', 'सत्र के बाद मार्गदर्शन और स्पष्टीकरण')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiStar className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3" />
                {t('Benefits', 'लाभ')}
              </h2>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('Gain clarity on life decisions and future planning', 'जीवन निर्णयों और भविष्य की योजना पर स्पष्टता प्राप्त करें')}
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('Understand planetary influences on your life', 'अपने जीवन पर ग्रहों के प्रभाव को समझें')}
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('Receive personalized remedies and solutions', 'व्यक्तिगत उपाय और समाधान प्राप्त करें')}
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('Enhance spiritual growth and self-awareness', 'आध्यात्मिक विकास और आत्म-जागरूकता को बढ़ाएं')}
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-8 text-white`}>
                <h3 className="text-2xl font-bold mb-4">
                  {t('Ready to Begin Your Journey?', 'अपनी यात्रा शुरू करने के लिए तैयार हैं?')}
                </h3>
                <p className="mb-6 opacity-90">
                  {t('Book your personalized Vedic astrology session today', 'आज ही अपना व्यक्तिगत वैदिक ज्योतिष सत्र बुक करें')}
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedService', service.id);
                    window.location.href = '/booking';
                  }}
                  className="group relative px-8 py-4 bg-white text-amber-700 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-5 h-5" />
                    <span>{t('Book Now', 'अभी बुक करें')}</span>
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