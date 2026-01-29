'use client';

import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiHeart, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickLinks = [
    { label: t('Home', 'होम'), id: 'home' },
    { label: t('Services', 'सेवाएं'), id: 'services' },
    { label: t('About', 'हमारे बारे में'), id: 'about' },
    { label: t('Astrologers', 'ज्योतिषी'), id: 'astrologers' },
    { label: t('Contact', 'संपर्क करें'), id: 'contact' },
  ];

  const services = [
    t('Graha Shanti Puja', 'ग्रह शांति पूजा'),
    t('Marriage Muhurat', 'विवाह मुहूर्त'),
    t('Vastu Consultation', 'वास्तु परामर्श'),
    t('Havan Ceremony', 'हवन समारोह'),
    t('Astrology Services', 'ज्योतिष सेवाएं'),
  ];

  const socialLinks = [
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-red-600' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-rose-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">ॐ</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {t('Divine Rituals', 'दिव्य रिचुअल्स')}
                  </h3>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
                {t(
                  'Authentic Vedic rituals and astrology services for your spiritual well-being.',
                  'आपकी आध्यात्मिक भलाई के लिए प्रामाणिक वैदिक अनुष्ठान और ज्योतिष सेवाएं।'
                )}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href="tel:+919876543210" className="flex items-center space-x-3 text-sm text-gray-400 hover:text-amber-400 transition-colors group">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <span>+91 98765 43210</span>
                </a>
                
                <a href="mailto:info@divinerituals.com" className="flex items-center space-x-3 text-sm text-gray-400 hover:text-amber-400 transition-colors group">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <span>info@divinerituals.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-5 relative inline-block">
              {t('Quick Links', 'त्वरित लिंक')}
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.id)} 
                    className="text-sm sm:text-base text-gray-400 hover:text-amber-400 transition-colors hover:translate-x-1 inline-block transform duration-300 group"
                  >
                    <span className="inline-flex items-center">
                      <span className="w-0 group-hover:w-2 h-0.5 bg-amber-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-5 relative inline-block">
              {t('Services', 'सेवाएं')}
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            </h4>
            <ul className="space-y-3 text-sm sm:text-base text-gray-400">
              {services.map((service, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-5 relative inline-block">
              {t('Connect With Us', 'हमसे जुड़ें')}
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            </h4>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">
                {t('Subscribe to our newsletter', 'हमारे न्यूज़लेटर की सदस्यता लें')}
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('Your email', 'आपका ईमेल')}
                  className="flex-1 px-4 py-2.5 bg-gray-800 text-white text-sm rounded-l-lg border border-gray-700 focus:border-amber-500 focus:outline-none transition-colors"
                />
                <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-r-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg">
                  {t('Join', 'शामिल हों')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} {t('Divine Rituals. All rights reserved.', 'दिव्य रिचुअल्स। सर्वाधिकार सुरक्षित।')}
          </p>

          {/* Made with Love */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{t('Made with', 'के साथ बनाया')}</span>
            <FiHeart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span>{t('for spiritual seekers', 'आध्यात्मिक साधकों के लिए')}</span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <button className="text-gray-400 hover:text-amber-400 transition-colors">
              {t('Privacy Policy', 'गोपनीयता नीति')}
            </button>
            <span className="text-gray-700">•</span>
            <button className="text-gray-400 hover:text-amber-400 transition-colors">
              {t('Terms of Service', 'सेवा की शर्तें')}
            </button>
          </div>
        </div>

        {/* Decorative Bottom Element */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2 opacity-30">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>
            <div className="text-xl">ॐ</div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"></div>
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}