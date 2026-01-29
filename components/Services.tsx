'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTag, FiArrowRight } from 'react-icons/fi';
import { GiLotusFlower, GiFire, GiRingBox, GiTempleGate, GiSun, GiDoor, GiPlanetCore } from 'react-icons/gi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

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

const categoryColors: Record<string, { gradient: string; badge: string; hover: string }> = {
  puja: {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    hover: 'group-hover:shadow-amber-500/20'
  },
  astrology: {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    hover: 'group-hover:shadow-violet-500/20'
  },
  vastu: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    hover: 'group-hover:shadow-emerald-500/20'
  },
  ceremony: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    hover: 'group-hover:shadow-rose-500/20'
  },
  default: {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    hover: 'group-hover:shadow-amber-500/20'
  }
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBooking = (serviceId: string) => {
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
      <section className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-96 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Decorative Top Element */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 blur-xl opacity-30 rounded-full"></div>
              <div className="relative flex items-center justify-center space-x-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/30 shadow-lg">
                <GiLotusFlower className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {t('Sacred Services', 'पवित्र सेवाएं')}
                </span>
                <GiLotusFlower className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
              {t('Our Sacred Services', 'हमारी पवित्र सेवाएं')}
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t(
              'Choose from our range of authentic Vedic rituals performed with devotion and precision',
              'भक्ति और सटीकता के साथ किए गए हमारे प्रामाणिक वैदिक अनुष्ठानों की श्रृंखला में से चुनें'
            )}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || GiLotusFlower;
            const colors = categoryColors[service.category.toLowerCase()] || categoryColors.default;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group h-full"
              >
                <div className={`relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl ${colors.hover} transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700`}>
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                  <div className="relative p-6 lg:p-7 flex flex-col h-full">
                    {/* Icon */}
                    <div className="mb-5">
                      <div className={`relative w-16 h-16 lg:w-18 lg:h-18 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                        <Icon className="w-8 h-8 lg:w-9 lg:h-9 text-white" />
                        
                        {/* Icon Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 ${colors.badge} text-xs font-bold rounded-full uppercase tracking-wide`}>
                        {service.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-amber-600 group-hover:to-rose-600 dark:group-hover:from-amber-400 dark:group-hover:to-rose-400 transition-all duration-300 line-clamp-2 min-h-[3.5rem]">
                      {language === 'en' ? service.name_en : service.name_hi}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-5 flex-grow leading-relaxed">
                      {language === 'en' ? service.description_en : service.description_hi}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <FiClock className="w-4 h-4" />
                          <span className="font-medium">{service.duration_minutes} {t('mins', 'मिनट')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiTag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            ₹{service.base_price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => scrollToBooking(service.id)}
                      className={`group/btn relative w-full py-3.5 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-bold text-sm lg:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <span>{t('Book Now', 'अभी बुक करें')}</span>
                        <FiArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </div>

                  {/* Bottom Corner Decoration */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 dark:opacity-5 transform translate-x-8 translate-y-8 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500">
                    <Icon className="w-full h-full text-gray-900 dark:text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6">
            {t("Can't find what you're looking for?", 'वह नहीं मिल रहा जो आप ढूंढ रहे हैं?')}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 border-2 border-amber-500 dark:border-amber-400 rounded-full font-bold text-base sm:text-lg hover:bg-amber-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span>{t('Contact Us for Custom Rituals', 'कस्टम अनुष्ठानों के लिए हमसे संपर्क करें')}</span>
              <FiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}