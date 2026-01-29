'use client';

import { motion } from 'framer-motion';
import { FiCalendar, FiPhone, FiStar } from 'react-icons/fi';
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.15]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent dark:via-black/30"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-5 sm:left-10 lg:left-20 w-32 sm:w-40 lg:w-56 h-32 sm:h-40 lg:h-56 bg-gradient-to-br from-amber-400/30 to-orange-500/30 dark:from-amber-500/20 dark:to-orange-600/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-1/4 right-10 sm:right-16 lg:right-32 w-40 sm:w-48 lg:w-64 h-40 sm:h-48 lg:h-64 bg-gradient-to-br from-rose-400/30 to-pink-500/30 dark:from-rose-500/20 dark:to-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-36 sm:w-44 lg:w-60 h-36 sm:h-44 lg:h-60 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 dark:from-yellow-500/20 dark:to-amber-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="absolute top-8 left-8 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-amber-500/20 dark:text-amber-400/10 animate-spin-slow" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3"/>
        </svg>
        <svg className="absolute bottom-12 right-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 text-rose-500/20 dark:text-rose-400/10 animate-spin-slow" style={{ animationDirection: 'reverse' }} viewBox="0 0 100 100">
          <path d="M50,10 L50,90 M10,50 L90,50 M25,25 L75,75 M75,25 L25,75" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 text-center">
        {/* Sacred Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="relative inline-block">
            {/* Outer Glow Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -m-8 sm:-m-10 lg:-m-12"
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-400/30 dark:border-amber-500/20"></div>
            </motion.div>
            
            {/* Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -m-4 sm:-m-5 lg:-m-6"
            >
              <div className="w-full h-full rounded-full border border-rose-400/30 dark:border-rose-500/20"></div>
            </motion.div>

            {/* Om Symbol Container */}
            <div className="relative w-24 sm:w-28 md:w-32 lg:w-40 h-24 sm:h-28 md:h-32 lg:h-40 mx-auto">
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 30px rgba(251, 191, 36, 0.3)',
                    '0 0 60px rgba(251, 191, 36, 0.5)',
                    '0 0 30px rgba(251, 191, 36, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <span className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">ॐ</span>
              </motion.div>
              
              {/* Diya at bottom */}
              <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2">
                <Diya />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent drop-shadow-sm">
              {t('Book Authentic Hindu Rituals', 'प्रामाणिक हिंदू अनुष्ठान बुक करें')}
            </span>
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
            {t('& Unlock Divine Blessings', '& दिव्य आशीर्वाद प्राप्त करें')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14 leading-relaxed font-light">
            {t(
              'Experience authentic Vedic rituals performed by experienced astrologers. Bring prosperity, peace, and divine blessings to your life.',
              'अनुभवी ज्योतिषियों द्वारा किए गए प्रामाणिक वैदिक अनुष्ठानों का अनुभव करें। अपने जीवन में समृद्धि, शांति और दिव्य आशीर्वाद लाएं।'
            )}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6 justify-center items-center mb-12 sm:mb-16 lg:mb-20"
        >
          <button
            onClick={scrollToBooking}
            className="group relative w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-full font-semibold text-base sm:text-lg lg:text-xl shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <FiCalendar className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>{t('Book Your Ritual', 'अपना अनुष्ठान बुक करें')}</span>
            </div>
          </button>

          <button
            onClick={scrollToContact}
            className="group relative w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-700 dark:text-amber-400 border-2 border-amber-500 dark:border-amber-400 rounded-full font-semibold text-base sm:text-lg lg:text-xl hover:bg-amber-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <FiPhone className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>{t('Contact Us', 'हमसे संपर्क करें')}</span>
            </div>
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto"
        >
          {[
            { number: '1000+', label: t('Rituals Performed', 'अनुष्ठान संपन्न'), icon: '🕉️' },
            { number: '500+', label: t('Happy Clients', 'खुश ग्राहक'), icon: '😊' },
            { number: '15+', label: t('Years Experience', 'वर्षों का अनुभव'), icon: '⭐' },
            { number: '50+', label: t('Ritual Types', 'अनुष्ठान प्रकार'), icon: '🔥' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-rose-500/10 dark:from-amber-500/5 dark:to-rose-500/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-5 sm:p-6 lg:p-8 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-3xl mb-2 sm:mb-3">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium leading-snug">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 lg:h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        
        @keyframes flame {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.1) translateY(-2px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-flame {
          animation: flame 1.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

function Diya() {
  return (
    <div className="relative w-14 sm:w-16 lg:w-20 h-20 sm:h-24 lg:h-28">
      {/* Diya Base */}
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
        <ellipse cx="50" cy="85" rx="45" ry="18" fill="#92400e" />
        <ellipse cx="50" cy="85" rx="35" ry="12" fill="#b45309" />
        <ellipse cx="50" cy="85" rx="25" ry="8" fill="#f59e0b" />
        <ellipse cx="50" cy="85" rx="15" ry="5" fill="#fbbf24" />
      </svg>
      
      {/* Flame */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
        <div className="relative w-5 sm:w-6 lg:w-8 h-10 sm:h-12 lg:h-16">
          {/* Outer glow */}
          <div className="absolute inset-0 -m-2 bg-gradient-to-t from-transparent via-orange-400/30 to-yellow-400/30 rounded-full blur-lg animate-flame"></div>
          
          {/* Main flame */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-300 rounded-full animate-flame" style={{ clipPath: 'polygon(50% 0%, 20% 50%, 30% 100%, 50% 85%, 70% 100%, 80% 50%)' }}></div>
          
          {/* Inner bright flame */}
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400 via-yellow-200 to-white rounded-full animate-flame" style={{ animationDelay: '0.3s', clipPath: 'polygon(50% 10%, 35% 50%, 40% 80%, 50% 70%, 60% 80%, 65% 50%)' }}></div>
          
          {/* Top sparkle */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1 animate-pulse shadow-lg shadow-yellow-300"></div>
        </div>
      </div>
    </div>
  );
}