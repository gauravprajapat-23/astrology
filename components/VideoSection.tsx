'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiX, FiYoutube, FiClock } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

type Video = {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-64 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  const featuredVideos = videos.filter(v => v.is_featured);
  const regularVideos = videos.filter(v => !v.is_featured);
  const displayVideos = [...featuredVideos, ...regularVideos].slice(0, 6);

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-rose-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"></div>

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
            <div className="flex items-center space-x-2 px-5 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-rose-200 dark:border-rose-700/30 shadow-lg">
              <FiYoutube className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                {t('Video Gallery', 'वीडियो गैलरी')}
              </span>
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 dark:from-rose-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              {t('Our Videos', 'हमारे वीडियो')}
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t(
              'Watch our collection of spiritual videos and learn more about Vedic rituals',
              'हमारे आध्यात्मिक वीडियो का संग्रह देखें और वैदिक अनुष्ठानों के बारे में और जानें'
            )}
          </p>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayVideos.map((video, index) => {
            const videoId = getYouTubeVideoId(video.youtube_url);
            const thumbnail = video.thumbnail_url || (videoId ? getYouTubeThumbnail(videoId) : '');
            
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group h-full"
              >
                <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {thumbnail && (
                      <div className="relative w-full h-full">
                        <Image
                          src={thumbnail}
                          alt={language === 'en' ? video.title_en : video.title_hi}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          priority={false}
                        />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Play Button */}
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 flex items-center justify-center group/play"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-0 group-hover/play:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover/play:scale-110 transition-all duration-300 shadow-2xl border-4 border-white/50">
                          <FiPlay className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 ml-1" />
                        </div>
                      </div>
                    </button>

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/20">
                        <FiClock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {video.is_featured && (
                      <div className="absolute top-3 left-3 flex items-center space-x-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                        <FiYoutube className="w-3 h-3" />
                        <span>{t('Featured', 'विशेष')}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative p-5 lg:p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-full uppercase tracking-wide">
                        {video.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-rose-600 group-hover:to-pink-600 dark:group-hover:from-rose-400 dark:group-hover:to-pink-400 transition-all duration-300 line-clamp-2 min-h-[3.5rem]">
                      {language === 'en' ? video.title_en : video.title_hi}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {language === 'en' ? video.description_en : video.description_hi}
                    </p>

                    {/* Watch Button */}
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="group/btn relative w-full py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <FiPlay className="w-4 h-4" />
                        <span>{t('Watch Now', 'अभी देखें')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        {videos.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 sm:mt-16"
          >
            <button className="px-8 py-4 bg-white dark:bg-gray-800 text-rose-700 dark:text-rose-400 border-2 border-rose-500 dark:border-rose-400 rounded-full font-bold text-base sm:text-lg hover:bg-rose-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              {t('View All Videos', 'सभी वीडियो देखें')}
            </button>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 border-2 border-white/20"
                aria-label="Close video"
              >
                <FiX className="w-6 h-6" />
              </button>

              {/* Video Player */}
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.youtube_url)}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={language === 'en' ? selectedVideo.title_en : selectedVideo.title_hi}
                />
              </div>

              {/* Video Info */}
              <div className="p-6 sm:p-8 bg-gray-900 border-t border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {language === 'en' ? selectedVideo.title_en : selectedVideo.title_hi}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      {language === 'en' ? selectedVideo.description_en : selectedVideo.description_hi}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-block px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                    {selectedVideo.category}
                  </span>
                  {selectedVideo.duration && (
                    <span className="flex items-center space-x-1 text-gray-400 text-sm">
                      <FiClock className="w-4 h-4" />
                      <span>{selectedVideo.duration}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}