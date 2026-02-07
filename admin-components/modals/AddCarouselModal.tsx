import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiImage, FiUpload } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { uploadAdminImage } from '@/lib/adminUpload';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface AddCarouselModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function AddCarouselModal({ onClose, onSuccess, onError }: AddCarouselModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
    image_url: '',
    link: '',
    sort_order: 0,
    is_active: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadAdminImage({ file, bucket: 'carousel-images' });
      setFormData({ ...formData, image_url: result.url });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      onError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      onError('Please upload an image');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('carousel_items')
        .insert([{
          title_en: formData.title_en,
          title_hi: formData.title_hi,
          description_en: formData.description_en,
          description_hi: formData.description_hi,
          image_url: formData.image_url,
          link: formData.link,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error adding carousel item:', error);
      onError(error.message || 'Failed to add carousel item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {t('Add Carousel Item', 'कैरोसेल आइटम जोड़ें')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title={t('Close', 'बंद करें')}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Title (English)', 'शीर्षक (अंग्रेजी)')}
                </label>
                <input
                  type="text"
                  placeholder={t('Enter English title', 'अंग्रेजी शीर्षक दर्ज करें')}
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Title (Hindi)', 'शीर्षक (हिंदी)')}
                </label>
                <input
                  type="text"
                  placeholder={t('Enter Hindi title', 'हिंदी शीर्षक दर्ज करें')}
                  value={formData.title_hi}
                  onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Description (English)', 'विवरण (अंग्रेजी)')}
                </label>
                <textarea
                  placeholder={t('Enter English description', 'अंग्रेजी विवरण दर्ज करें')}
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-24 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Description (Hindi)', 'विवरण (हिंदी)')}
                </label>
                <textarea
                  placeholder={t('Enter Hindi description', 'हिंदी विवरण दर्ज करें')}
                  value={formData.description_hi}
                  onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-24 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Link Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Link', 'लिंक')} <span className="text-gray-400 text-xs">({t('Optional', 'वैकल्पिक')})</span>
              </label>
              <input
                type="url"
                placeholder={t('Enter link URL', 'लिंक URL दर्ज करें')}
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Order Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Sort Order', 'क्रम')}
              </label>
              <input
                type="number"
                placeholder={t('Enter sort order (0 for first)', 'क्रम दर्ज करें (0 पहले के लिए)')}
                value={formData.sort_order || ''}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                min="0"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Upload Image', 'छवि अपलोड करें')} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-teal-500 dark:hover:border-teal-500 transition-colors bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {uploading ? (
                        <span className="text-teal-600 dark:text-teal-400">
                          {t('Uploading...', 'अपलोड हो रहा है...')}
                        </span>
                      ) : (
                        <>
                          <span className="font-semibold">{t('Click to upload', 'अपलोड करने के लिए क्लिक करें')}</span>
                          {' '}{t('or drag and drop', 'या खींचें और छोड़ें')}
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, WEBP {t('up to 10MB', '10MB तक')}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              
              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Preview', 'पूर्वावलोकन')}
                  </p>
                  <div className="relative group">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-green-200 dark:border-green-800"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                      <FiImage className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-800">
              <input
                type="checkbox"
                id="add-carousel-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded text-teal-500 focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="add-carousel-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer select-none">
                {t('Active Item (Show on homepage)', 'सक्रिय आइटम (होमपेज पर दिखाएं)')}
              </label>
            </div>
          </form>
        </div>

        {/* Fixed Footer with Submit Button */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || uploading || !formData.image_url}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('Adding...', 'जोड़ रहे हैं...')}</span>
              </>
            ) : (
              <>
                <FiUpload className="w-5 h-5" />
                <span>{t('Add Carousel Item', 'कैरोसेल आइटम जोड़ें')}</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
