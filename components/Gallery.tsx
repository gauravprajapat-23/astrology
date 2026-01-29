'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const galleryImages = [
  {
    url: 'https://images.pexels.com/photos/6157/top-view-photo-of-candles-beside-spring-flowers.jpg?auto=compress&cs=tinysrgb&w=800',
    title: 'Diya Lighting Ceremony',
    titleHi: 'दीप जलाने का समारोह',
  },
  {
    url: 'https://images.pexels.com/photos/4051566/pexels-photo-4051566.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Traditional Havan',
    titleHi: 'पारंपरिक हवन',
  },
  {
    url: 'https://images.pexels.com/photos/7978617/pexels-photo-7978617.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Wedding Muhurat',
    titleHi: 'विवाह मुहूर्त',
  },
  {
    url: 'https://images.pexels.com/photos/3661263/pexels-photo-3661263.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Temple Puja',
    titleHi: 'मंदिर पूजा',
  },
  {
    url: 'https://images.pexels.com/photos/5623069/pexels-photo-5623069.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Graha Shanti Puja',
    titleHi: 'ग्रह शांति पूजा',
  },
  {
    url: 'https://images.pexels.com/photos/7978636/pexels-photo-7978636.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Satyanarayan Katha',
    titleHi: 'सत्यनारायण कथा',
  },
];

export default function Gallery() {
  const { language, t } = useLanguage();

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-3 sm:mb-4">
            {t('Gallery', 'गैलरी')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            {t(
              'Glimpses of sacred rituals and ceremonies we have performed',
              'हमारे द्वारा किए गए पवित्र अनुष्ठानों और समारोहों की झलकियां'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square"
            >
              <img
                src={image.url}
                alt={language === 'en' ? image.title : image.titleHi}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
                    {language === 'en' ? image.title : image.titleHi}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
