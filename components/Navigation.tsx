'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('Home', 'होम'), href: '/' },
    { id: 'services', label: t('Services', 'सेवाएं'), href: '#services' },
    { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), href: '/astrologers' },
    { id: 'booking', label: t('Book Now', 'बुक करें'), href: '#booking' },
    { id: 'about', label: t('About', 'हमारे बारे में'), href: '#about' },
    { id: 'gallery', label: t('Gallery', 'गैलरी'), href: '#gallery' },
    { id: 'contact', label: t('Contact', 'संपर्क करें'), href: '#contact' },
    { id: 'admin', label: t('Admin', 'एडमिन'), href: '/admin' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.href.startsWith('#')) {
      const element = document.getElementById(item.href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = item.href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center animate-glow">
              <span className="text-white text-2xl">ॐ</span>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-saffron-600 dark:text-saffron-400">
                {t('Divine Rituals', 'दिव्य रिचुअल्स')}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('Vedic Astrology Services', 'वैदिक ज्योतिष सेवाएं')}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="text-gray-700 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300 text-sm font-medium hover:bg-saffron-200 dark:hover:bg-saffron-800 transition-colors"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
