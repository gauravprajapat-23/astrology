import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiUser, FiMail } from 'react-icons/fi';
import { Astrologer } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import Image from 'next/image';

interface AstrologersTabProps {
  astrologers: Astrologer[];
  loading: boolean;
  onAddAstrologer: () => void;
  onEditAstrologer: (astrologer: Astrologer) => void;
  onDeleteAstrologer: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export default function AstrologersTab({
  astrologers,
  loading,
  onAddAstrologer,
  onEditAstrologer,
  onDeleteAstrologer,
  onToggleStatus,
}: AstrologersTabProps) {
  const { language, t } = useLanguage();

  const activeAstrologers = astrologers.filter(a => a.is_active);
  const inactiveAstrologers = astrologers.filter(a => !a.is_active);

  return (
    <motion.div
      key="astrologers"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {t('Manage Astrologers', 'ज्योतिषी प्रबंधित करें')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddAstrologer}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">{t('Add Astrologer', 'ज्योतिषी जोड़ें')}</span>
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner color="saffron" />
      ) : astrologers.length === 0 ? (
        <EmptyState
          icon={<FiUser className="w-16 h-16 text-gray-400" />}
          title={t('No Astrologers', 'कोई ज्योतिषी नहीं')}
          description={t('No astrologers have been added yet.', 'अभी तक कोई ज्योतिषी नहीं जोड़ा गया है।')}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Astrologers */}
          {activeAstrologers.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Active Astrologers', 'सक्रिय ज्योतिषी')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAstrologers.map((astrologer, index) => (
                  <motion.div
                    key={astrologer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  >
                    <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
                      {astrologer.photo_url ? (
                        <Image
                          src={astrologer.photo_url}
                          alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                          fill
                          className="w-full h-full object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiUser className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          {t('Active', 'सक्रिय')}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Experience', 'अनुभव')}: {astrologer.experience_years} {t('years', 'साल')}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                      </p>
                      {astrologer.specializations && astrologer.specializations.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                            {t('Specializations', 'विशेषज्ञता')}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {astrologer.specializations.slice(0, 3).map((spec, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                              >
                                {spec}
                              </span>
                            ))}
                            {astrologer.specializations.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium rounded-full">
                                +{astrologer.specializations.length - 3} {t('more', 'और')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditAstrologer(astrologer)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>{t('Edit', 'संपादित करें')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(astrologer.id, astrologer.is_active)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Deactivate', 'निष्क्रिय करें')}
                        >
                          <FiMail className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteAstrologer(astrologer.id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Delete', 'मिटाएं')}
                        >
                          <FiTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Astrologers */}
          {inactiveAstrologers.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Inactive Astrologers', 'निष्क्रिय ज्योतिषी')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveAstrologers.map((astrologer, index) => (
                  <motion.div
                    key={astrologer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-70 group"
                  >
                    <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
                      {astrologer.photo_url ? (
                        <Image
                          src={astrologer.photo_url}
                          alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                          fill
                          className="w-full h-full object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiUser className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleStatus(astrologer.id, astrologer.is_active)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <FiMail className="w-4 h-4" />
                          <span>{t('Activate', 'सक्रिय करें')}</span>
                        </motion.button>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                          {t('Inactive', 'निष्क्रिय')}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Experience', 'अनुभव')}: {astrologer.experience_years} {t('years', 'साल')}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {language === 'en' ? astrologer.bio_en : astrologer.bio_hi}
                      </p>
                      {astrologer.specializations && astrologer.specializations.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                            {t('Specializations', 'विशेषज्ञता')}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {astrologer.specializations.slice(0, 3).map((spec, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                              >
                                {spec}
                              </span>
                            ))}
                            {astrologer.specializations.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium rounded-full">
                                +{astrologer.specializations.length - 3} {t('more', 'और')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditAstrologer(astrologer)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>{t('Edit', 'संपादित करें')}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteAstrologer(astrologer.id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                          title={t('Delete', 'मिटाएं')}
                        >
                          <FiTrash className="w-4 h-4" />
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