'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiMaximize, FiYoutube } from 'react-icons/fi';
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
  const [isPlaying, setIsPlaying] = useState(false);
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

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  const featuredVideos = videos.filter(v => v.is_featured);
  const regularVideos = videos.filter(v => !v.is_featured);
  const displayVideos = [...featuredVideos, ...regularVideos].slice(0, 6);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-4">
            {t('Our Videos', 'हमारे वीडियो')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t(
              'Watch our collection of spiritual videos and learn more about Vedic rituals',
              'हमारे आध्यात्मिक वीडियो का संग्रह देखें और वैदिक अनुष्ठानों के बारे में और जानें'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayVideos.map((video, index) => {
            const videoId = getYouTubeVideoId(video.youtube_url);
            const thumbnail = video.thumbnail_url || (videoId ? getYouTubeThumbnail(videoId) : '');
            
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-saffron-100 dark:border-saffron-900/30"
              >
                <div className="relative">
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt={language === 'en' ? video.title_en : video.title_hi}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  
                  {/* Play Button Overlay */}
                  <div 
                    onClick={() => openVideoModal(video)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <FiPlay className="w-8 h-8 text-saffron-600 ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}

                  {/* Featured Badge */}
                  {video.is_featured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FiYoutube className="w-3 h-3" />
                      {t('Featured', 'विशेष')}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                    {language === 'en' ? video.title_en : video.title_hi}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {language === 'en' ? video.description_en : video.description_hi}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400 text-xs font-medium rounded-full">
                      {video.category}
                    </span>
                    
                    <button
                      onClick={() => openVideoModal(video)}
                      className="text-saffron-600 dark:text-saffron-400 hover:text-saffron-700 dark:hover:text-saffron-300 text-sm font-medium flex items-center gap-1"
                    >
                      <FiPlay className="w-4 h-4" />
                      {t('Watch', 'देखें')}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {videos.length > 6 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-lg font-semibold hover:from-saffron-600 hover:to-gold-600 transition-all">
              {t('View All Videos', 'सभी वीडियो देखें')}
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-video">
              {isPlaying && (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.youtube_url)}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={language === 'en' ? selectedVideo.title_en : selectedVideo.title_hi}
                />
              )}
            </div>

            <div className="p-6 bg-gray-900">
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'en' ? selectedVideo.title_en : selectedVideo.title_hi}
              </h3>
              <p className="text-gray-300 text-sm">
                {language === 'en' ? selectedVideo.description_en : selectedVideo.description_hi}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="inline-block px-2 py-1 bg-saffron-500 text-white text-xs font-medium rounded-full">
                  {selectedVideo.category}
                </span>
                {selectedVideo.duration && (
                  <span className="text-gray-400 text-sm">{selectedVideo.duration}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}