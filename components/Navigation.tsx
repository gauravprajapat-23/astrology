'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* -------------------- Navigation -------------------- */
  const navItems = useMemo(
    () => [
      { id: 'home', label: t('Home', 'होम'), href: '/' },
      { id: 'services', label: t('Services', 'सेवाएं'), href: '#services' },
      { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), href: '/#astrologers' },
      { id: 'booking', label: t('Book Now', 'बुक करें'), href: '#booking' },
      { id: 'about', label: t('About', 'हमारे बारे में'), href: '#about' },
      { id: 'gallery', label: t('Gallery', 'गैलरी'), href: '#gallery' },
      { id: 'contact', label: t('Contact', 'संपर्क करें'), href: '#contact' },
    ],
    [t]
  );

  const handleNavClick = useCallback((item: typeof navItems[0]) => {
    if (item.href.startsWith('#')) {
      document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = item.href;
    }
    setIsMobileMenuOpen(false);
  }, []);

  /* -------------------- Render -------------------- */
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 w-full max-w-screen
        ${isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'}
        pt-safe`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between overflow-hidden">
          
          {/* -------- Logo -------- */}
          <div
            onClick={() => (window.location.href = '/')}
            className="flex items-center gap-2 min-w-0 cursor-pointer flex-shrink-0"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center shrink-0">
              <span className="text-white text-lg">ॐ</span>
            </div>

            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-sm font-bold text-saffron-600 dark:text-saffron-400">
                {t('Divine Rituals', 'दिव्य रिचुअल्स')}
              </h1>
              <p className="hidden sm:block truncate text-xs text-gray-600 dark:text-gray-400">
                {t('Vedic Astrology Services', 'वैदिक ज्योतिष सेवाएं')}
              </p>
            </div>
          </div>

          {/* -------- Desktop Nav -------- */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300
                  hover:text-saffron-600 dark:hover:text-saffron-400 whitespace-nowrap py-1 px-1"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* -------- Actions -------- */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex h-9 px-3 rounded-full bg-saffron-100 dark:bg-saffron-900
                text-xs font-medium text-saffron-700 dark:text-saffron-300"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>

            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800
                flex items-center justify-center"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="md:hidden h-10 w-10 rounded-lg bg-saffron-100 dark:bg-saffron-900
                flex items-center justify-center"
              aria-label={isMobileMenuOpen ? t('Close menu', 'मेनू बंद करें') : t('Open menu', 'मेनू खोलें')}
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* -------- Mobile Overlay -------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* -------- Mobile Drawer -------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[90vw] bg-white dark:bg-gray-900 z-50"
          >
            <div className="p-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="w-full text-left rounded-lg px-4 py-3 text-base
                    hover:bg-saffron-50 dark:hover:bg-saffron-900/20"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
