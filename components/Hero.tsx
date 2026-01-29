'use client';

import { motion } from 'framer-motion';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-saffron-50 via-gold-50 to-divine-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="absolute inset-0 bg-mandala opacity-30"></div>

      <div className="absolute top-5 sm:top-10 left-3 sm:left-5 w-16 sm:w-20 h-16 sm:h-20 bg-saffron-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-5 sm:bottom-10 right-3 sm:right-5 w-20 sm:w-24 h-20 sm:h-24 bg-gold-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <div className="inline-block mb-3 sm:mb-4 md:mb-6">
            <div className="relative">
              <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 mx-auto bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center animate-glow">
                <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl">ॐ</span>
              </div>
              <div className="absolute -bottom-1 sm:-bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 scale-50 sm:scale-60 md:scale-75 lg:scale-100">
                <Diya />
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-heading font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-saffron-600 to-gold-600 dark:from-saffron-400 dark:to-gold-400 bg-clip-text text-transparent leading-tight">
            {t('Book Authentic Hindu Rituals', 'प्रामाणिक हिंदू अनुष्ठान बुक करें')}
          </h1>

          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-hindi font-semibold text-divine-700 dark:text-divine-300 mb-3 sm:mb-4 md:mb-6">
            {t('& Unlock Divine Blessings', '& दिव्य आशीर्वाद प्राप्त करें')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 dark:text-gray-300 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-12 leading-relaxed px-1 sm:px-0">
            {t(
              'Experience authentic Vedic rituals performed by experienced astrologers. Bring prosperity, peace, and divine blessings to your life.',
              'अनुभवी ज्योतिषियों द्वारा किए गए प्रामाणिक वैदिक अनुष्ठानों का अनुभव करें। अपने जीवन में समृद्धि, शांति और दिव्य आशीर्वाद लाएं।'
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full px-1 sm:px-0"
        >
          <button
            onClick={scrollToBooking}
            className="group w-full sm:w-auto px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2"
          >
            <FiCalendar className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
            <span className="text-xs sm:text-sm md:text-base lg:text-lg">{t('Book Your Ritual', 'अपना अनुष्ठान बुक करें')}</span>
          </button>

          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-white dark:bg-gray-800 text-saffron-600 dark:text-saffron-400 border-2 border-saffron-500 rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-saffron-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2"
          >
            <FiPhone className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
            <span className="text-xs sm:text-sm md:text-base lg:text-lg">{t('Contact Us', 'हमसे संपर्क करें')}</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto px-1 sm:px-0"
        >
          {[
            { number: '1000+', label: t('Rituals Performed', 'अनुष्ठान संपन्न'), labelHi: 'अनुष्ठान संपन्न' },
            { number: '500+', label: t('Happy Clients', 'खुश ग्राहक'), labelHi: 'खुश ग्राहक' },
            { number: '15+', label: t('Years Experience', 'वर्षों का अनुभव'), labelHi: 'वर्षों का अनुभव' },
            { number: '50+', label: t('Ritual Types', 'अनुष्ठान प्रकार'), labelHi: 'अनुष्ठान प्रकार' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-saffron-600 dark:text-saffron-400 mb-1 sm:mb-1.5 md:mb-2">
                {stat.number}
              </div>
              <div className="text-[0.6rem] sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-600 dark:text-gray-400 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 md:h-16 lg:h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </section>
  );
}

function Diya() {
  return (
    <div className="relative w-12 sm:w-16 md:w-20 h-16 sm:h-20 md:h-24">
      <svg viewBox="0 0 100 120" className="w-full h-full">
        <ellipse cx="50" cy="80" rx="40" ry="15" fill="#c2410c" />
        <ellipse cx="50" cy="80" rx="30" ry="10" fill="#ea580c" />
        <ellipse cx="50" cy="80" rx="20" ry="6" fill="#facc15" />
      </svg>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
        <div className="relative w-4 sm:w-5 md:w-6 h-8 sm:h-10 md:h-12">
          <div className="absolute inset-0 bg-gradient-to-t from-saffron-500 via-gold-400 to-gold-200 rounded-full animate-flame"
               style={{ filter: 'blur(2px)' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-saffron-600 via-gold-500 to-yellow-300 rounded-full animate-flame"
               style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-0 left-1/2 w-1.5 sm:w-2 h-2 bg-gradient-to-t from-transparent to-white rounded-full transform -translate-x-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}