'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTag } from 'react-icons/fi';
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
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-5 sm:h-6 lg:h-8 bg-gray-200 dark:bg-gray-700 rounded w-36 sm:w-48 lg:w-64 mx-auto mb-2 sm:mb-3 lg:mb-4"></div>
            <div className="h-2.5 sm:h-3 lg:h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64 lg:w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-mandala opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16 px-2 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-2 sm:mb-3 md:mb-4">
            {t('Our Sacred Services', 'हमारी पवित्र सेवाएं')}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto">
            {t(
              'Choose from our range of authentic Vedic rituals performed with devotion and precision',
              'भक्ति और सटीकता के साथ किए गए हमारे प्रामाणिक वैदिक अनुष्ठानों की श्रृंखला में से चुनें'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || GiLotusFlower;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-saffron-100 dark:border-saffron-900/30"
              >
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <div className="w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Icon className="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 text-white" />
                  </div>

                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-2">
                    {language === 'en' ? service.name_en : service.name_hi}
                  </h3>

                  <span className="inline-block px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 sm:py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400 text-[0.6rem] sm:text-xs md:text-sm font-medium rounded-full mb-2 sm:mb-3">
                    {service.category.toUpperCase()}
                  </span>

                  <p className="text-gray-600 dark:text-gray-400 text-[0.6rem] sm:text-xs md:text-sm line-clamp-3 mb-2 sm:mb-3">
                    {language === 'en' ? service.description_en : service.description_hi}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-[0.6rem] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      <FiClock className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                      <span>{service.duration_minutes} {t('mins', 'मिनट')}</span>
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      <FiTag className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                      <span className="font-semibold text-saffron-600 dark:text-saffron-400">
                        ₹{service.base_price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToBooking(service.id)}
                    className="w-full py-1.5 sm:py-2 md:py-2.5 lg:py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white text-[0.6rem] sm:text-xs md:text-sm lg:text-base rounded-lg font-semibold hover:from-saffron-600 hover:to-gold-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    {t('Book Now', 'अभी बुक करें')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
