'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      // Update active section based on scroll position
      const sections = ['home', 'services', 'astrologers', 'booking', 'about', 'gallery', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  /* -------------------- Navigation -------------------- */
  const navItems = useMemo(
    () => [
      { id: 'home', label: t('Home', 'होम'), href: '#home' },
      { id: 'services', label: t('Services', 'सेवाएं'), href: '#services' },
      { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), href: '#astrologers' },
      { id: 'about', label: t('About', 'हमारे बारे में'), href: '#about' },
      { id: 'gallery', label: t('Gallery', 'गैलरी'), href: '#gallery' },
      { id: 'contact', label: t('Contact', 'संपर्क'), href: '#contact' },
    ],
    [t]
  );

  const handleNavClick = useCallback((item: typeof navItems[0]) => {
    const targetId = item.href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(targetId);
    }
    setIsMobileMenuOpen(false);
  }, []);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  /* -------------------- Render -------------------- */
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* -------- Logo -------- */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              {/* Om Symbol with Glow */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-white text-xl sm:text-2xl font-bold">ॐ</span>
                </div>
              </div>

              {/* Brand Text */}
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-serif font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                  {t('Divine Rituals', 'दिव्य रिचुअल्स')}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
                  {t('Vedic Astrology Services', 'वैदिक ज्योतिष सेवाएं')}
                </p>
              </div>
            </motion.div>

            {/* -------- Desktop Navigation -------- */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-rose-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* -------- Actions -------- */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Book Now Button - Desktop */}
              <button
                onClick={scrollToBooking}
                className="hidden sm:block px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-sm font-bold rounded-full hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('Book Now', 'बुक करें')}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-sm font-bold text-amber-700 dark:text-amber-400 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 shadow-md hover:shadow-lg border border-amber-200 dark:border-amber-700/30"
                aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              >
                {language === 'en' ? 'हिं' : 'EN'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiSun className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMoon className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                    >
                      <FiX className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                    >
                      <FiMenu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          />
        )}
      </motion.nav>

      {/* -------- Mobile Menu Overlay -------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto lg:hidden"
            >
              {/* Mobile Menu Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">ॐ</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                        {t('Divine Rituals', 'दिव्य रिचुअल्स')}
                      </h2>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t('Vedic Astrology', 'वैदिक ज्योतिष')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* Book Now Button - Mobile */}
                <button
                  onClick={scrollToBooking}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold rounded-xl hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transition-all duration-300 shadow-lg"
                >
                  {t('Book Now', 'अभी बुक करें')}
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="p-4">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavClick(item)}
                      className={`w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-amber-500/10 to-rose-500/10 text-amber-600 dark:text-amber-400 border-l-4 border-amber-500'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {activeSection === item.id && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900/50">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('Contact us for any queries', 'किसी भी प्रश्न के लिए हमसे संपर्क करें')}
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <a href="tel:+919876543210" className="text-sm text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                    +91 98765 43210
                  </a>
                  <span className="text-gray-400">•</span>
                  <a href="mailto:info@divinerituals.com" className="text-sm text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                    Email Us
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}