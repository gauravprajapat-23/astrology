'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import { supabase, type GalleryImage } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Gallery() {
  const { language, t } = useLanguage();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    const nextIndex = (selectedIndex + 1) % galleryImages.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex = (selectedIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-48 mx-auto"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center space-x-2 px-5 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/30 shadow-lg">
              <FiMaximize2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t('Photo Gallery', 'फोटो गैलरी')}
              </span>
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
              {t('Gallery', 'गैलरी')}
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t(
              'Glimpses of sacred rituals and ceremonies we have performed',
              'हमारे द्वारा किए गए पवित्र अनुष्ठानों और समारोहों की झलकियां'
            )}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.03 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              {/* Image */}
              <img
                src={image.image_url}
                alt={language === 'en' ? image.title_en : image.title_hi}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-white text-sm sm:text-base lg:text-lg font-bold mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {language === 'en' ? image.title_en : image.title_hi}
                  </h3>
                  {image.description_en && (
                    <p className="text-white/80 text-xs sm:text-sm line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {language === 'en' ? image.description_en : image.description_hi}
                    </p>
                  )}
                </div>
              </div>

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-0 group-hover:scale-100">
                <FiMaximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              </div>

              {/* Border Animation */}
              <div className="absolute inset-0 border-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  className="absolute left-4 z-20 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
                  aria-label="Previous"
                >
                  <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-4 z-20 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
                  aria-label="Next"
                >
                  <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full"
            >
              {/* Main Image */}
              <img
                src={selectedImage.image_url}
                alt={language === 'en' ? selectedImage.title_en : selectedImage.title_hi}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Image Info */}
              <div className="mt-6 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {language === 'en' ? selectedImage.title_en : selectedImage.title_hi}
                </h3>
                {selectedImage.description_en && (
                  <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                    {language === 'en' ? selectedImage.description_en : selectedImage.description_hi}
                  </p>
                )}
                <div className="mt-4 text-gray-400 text-sm">
                  {selectedIndex + 1} / {galleryImages.length}
                </div>
              </div>
            </motion.div>

            {/* Keyboard Hint */}
            <div className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">←</kbd>
                  <span>Previous</span>
                </span>
                <span className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">→</kbd>
                  <span>Next</span>
                </span>
                <span className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd>
                  <span>Close</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}