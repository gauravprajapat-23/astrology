import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiVideo, FiPlay, FiEye, FiStar } from 'react-icons/fi';
import { Video } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

interface VideosTabProps {
  videos: Video[];
  loading: boolean;
  onAddVideo: () => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onToggleFeature: (id: string) => void;
}

export default function VideosTab({
  videos,
  loading,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onToggleStatus,
  onToggleFeature,
}: VideosTabProps) {
  const { language, t } = useLanguage();

  const activeVideos = videos.filter(v => v.is_active);
  const inactiveVideos = videos.filter(v => !v.is_active);

  return (
    <motion.div
      key="videos"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header - Compact */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Videos', 'वीडियो प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddVideo}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm font-medium"
        >
          <FiPlus className="w-4 h-4" />
          <span>{t('Add Video', 'वीडियो जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={<FiVideo className="w-12 h-12 text-gray-400" />}
          title={t('No Videos', 'कोई वीडियो नहीं')}
          description={t('No videos have been added yet.', 'अभी तक कोई वीडियो नहीं जोड़ा गया है।')}
        />
      ) : (
        <div className="space-y-6">
          {/* Active Videos - Compact */}
          {activeVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                {t('Active Videos', 'सक्रिय वीडियो')}
                <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                  {activeVideos.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-lg transition-all"
                  >
                    {/* Thumbnail - Compact */}
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={language === 'en' ? video.title_en : video.title_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiVideo className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white"
                        >
                          <FiPlay className="w-5 h-5" />
                        </motion.button>
                      </div>
                      {/* Status Badges - Compact */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {video.is_featured && (
                          <span className="px-1.5 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded">
                            {t('Featured', 'विशेष')}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                          {t('Active', 'सक्रिय')}
                        </span>
                      </div>
                    </div>

                    {/* Content - Compact */}
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {language === 'en' ? video.title_en : video.title_hi}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                        {language === 'en' ? video.description_en : video.description_hi}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-3">
                        <span className="font-medium">{video.duration}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{video.category}</span>
                      </div>

                      {/* Action Buttons - Compact */}
                      <div className="flex gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onEditVideo(video)}
                          className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1.5 rounded text-xs font-medium hover:shadow-md transition-all"
                        >
                          <FiEdit className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('Edit', 'संपादित')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleFeature(video.id)}
                          className="p-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded hover:shadow-md transition-all"
                          title={video.is_featured ? t('Unfeature', 'विशेष हटाएं') : t('Feature', 'विशेष बनाएं')}
                        >
                          <FiStar className={`w-3 h-3 ${video.is_featured ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(video.id, video.is_active)}
                          className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded hover:shadow-md transition-all"
                          title={t('Deactivate', 'निष्क्रिय करें')}
                        >
                          <FiEye className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteVideo(video.id)}
                          className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded hover:shadow-md transition-all"
                          title={t('Delete', 'मिटाएं')}
                        >
                          <FiTrash className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Videos - Compact */}
          {inactiveVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                {t('Inactive Videos', 'निष्क्रिय वीडियो')}
                <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                  {inactiveVideos.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {inactiveVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-70 group hover:opacity-100 hover:shadow-lg transition-all"
                  >
                    {/* Thumbnail - Compact */}
                    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={language === 'en' ? video.title_en : video.title_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiVideo className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      {/* Activate Overlay */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onToggleStatus(video.id, video.is_active)}
                          className="flex items-center space-x-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>{t('Activate', 'सक्रिय करें')}</span>
                        </motion.button>
                      </div>
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                          {t('Inactive', 'निष्क्रिय')}
                        </span>
                      </div>
                    </div>

                    {/* Content - Compact */}
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {language === 'en' ? video.title_en : video.title_hi}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                        {language === 'en' ? video.description_en : video.description_hi}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-3">
                        <span className="font-medium">{video.duration}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{video.category}</span>
                      </div>

                      {/* Action Buttons - Compact */}
                      <div className="flex gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onEditVideo(video)}
                          className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1.5 rounded text-xs font-medium hover:shadow-md transition-all"
                        >
                          <FiEdit className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('Edit', 'संपादित')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteVideo(video.id)}
                          className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded hover:shadow-md transition-all"
                          title={t('Delete', 'मिटाएं')}
                        >
                          <FiTrash className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}