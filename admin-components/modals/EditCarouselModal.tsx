import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiImage, FiUpload } from 'react-icons/fi';
import { supabase, type CarouselItem } from '@/lib/supabase';
import { uploadAdminImage } from '@/lib/adminUpload';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface EditCarouselModalProps {
  item: CarouselItem;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EditCarouselModal({ item, onClose, onSuccess, onError }: EditCarouselModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title_en: item.title_en,
    title_hi: item.title_hi,
    description_en: item.description_en || '',
    description_hi: item.description_hi || '',
    image_url: item.image_url,
    link: item.link || '',
    sort_order: item.sort_order || 0,
    is_active: item.is_active,
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
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('carousel_items')
        .update({
          title_en: formData.title_en,
          title_hi: formData.title_hi,
          description_en: formData.description_en,
          description_hi: formData.description_hi,
          image_url: formData.image_url,
          link: formData.link,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error updating carousel item:', error);
      onError(error.message || 'Failed to update carousel item');
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
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl"
      >
        <div className="p-6 flex justify-between items-center mb-0">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {t('Edit Carousel Item', 'कैरोसेल आइटम संपादित करें')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={t('Close', 'बंद करें')}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow px-6 pb-2">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('Title (English)', 'शीर्षक (अंग्रेजी)')}
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="text"
              placeholder={t('Title (Hindi)', 'शीर्षक (हिंदी)')}
              value={formData.title_hi}
              onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
            />
          </div>
          

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-20 resize-none"
            />
            <textarea
              placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
              value={formData.description_hi}
              onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-20 resize-none"
            />
          </div>
          
          <input
            type="url"
            placeholder={t('Link (Optional)', 'लिंक (वैकल्पिक)')}
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          
          <input
            type="number"
            placeholder={t('Sort Order', 'क्रम')}
            value={formData.sort_order || ''}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            min="0"
          />
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Upload Image', 'छवि अपलोड करें')}
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-teal-500 transition-colors">
                <div className="flex flex-col items-center">
                  <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {uploading ? t('Uploading...', 'अपलोड हो रहा है...') : t('Choose New Image', 'नई छवि चुनें')}
                  </span>
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
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-800">
            <input
              type="checkbox"
              id="edit-carousel-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="edit-carousel-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Item', 'सक्रिय आइटम')}
            </label>
          </div>
          </form>
        </div>
        
        <div className="p-6 pt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Updating...', 'अपडेट कर रहे हैं...') : t('Update Carousel Item', 'कैरोसेल आइटम अपडेट करें')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
