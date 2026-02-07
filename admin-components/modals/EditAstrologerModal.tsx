import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiStar, FiUpload } from 'react-icons/fi';
import { supabase, type Astrologer } from '@/lib/supabase';
import { uploadAdminImage } from '@/lib/adminUpload';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface EditAstrologerModalProps {
  astrologer: Astrologer;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EditAstrologerModal({ astrologer, onClose, onSuccess, onError }: EditAstrologerModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name_en: astrologer.name_en,
    name_hi: astrologer.name_hi,
    bio_en: astrologer.bio_en || '',
    bio_hi: astrologer.bio_hi || '',
    photo_url: astrologer.photo_url || '',
    experience_years: astrologer.experience_years || 0,
    specializations: Array.isArray(astrologer.specializations) ? astrologer.specializations : [],
    is_active: astrologer.is_active,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadAdminImage({ file, bucket: 'astrologer-photos' });
      setFormData({ ...formData, photo_url: result.url });
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
      const finalPhotoUrl = formData.photo_url;

      const { error } = await supabase
        .from('astrologers')
        .update({
          name_en: formData.name_en,
          name_hi: formData.name_hi,
          bio_en: formData.bio_en,
          bio_hi: formData.bio_hi,
          photo_url: finalPhotoUrl,
          experience_years: formData.experience_years,
          specializations: formData.specializations,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', astrologer.id);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error updating astrologer:', error);
      onError(error.message || 'Failed to update astrologer');
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            {t('Edit Astrologer', 'ज्योतिषी संपादित करें')}
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
              placeholder={t('Name (English)', 'नाम (अंग्रेजी)')}
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="text"
              placeholder={t('Name (Hindi)', 'नाम (हिंदी)')}
              value={formData.name_hi}
              onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Specializations', 'विशेषज्ञता')}
            </label>
            <input
              type="text"
              placeholder={t('Enter specializations (comma separated)', 'विशेषज्ञता दर्ज करें (अल्पविराम से अलग)')}
              value={formData.specializations.join(', ')}
              onChange={(e) => setFormData({ ...formData, specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            <div className="flex flex-wrap gap-1">
              {formData.specializations.map((spec, index) => (
                <span key={index} className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs font-medium rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          <input
            type="number"
            placeholder={t('Experience (Years)', 'अनुभव (वर्ष)')}
            value={formData.experience_years || ''}
            onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            min="0"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              placeholder={t('Bio (English)', 'जीवनी (अंग्रेजी)')}
              value={formData.bio_en}
              onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all h-20 resize-none"
            />
            <textarea
              placeholder={t('Bio (Hindi)', 'जीवनी (हिंदी)')}
              value={formData.bio_hi}
              onChange={(e) => setFormData({ ...formData, bio_hi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all h-20 resize-none"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Upload Photo', 'फोटो अपलोड करें')}
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-pink-500 transition-colors">
                <div className="flex flex-col items-center">
                  <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {uploading ? t('Uploading...', 'अपलोड हो रहा है...') : t('Choose Photo', 'फोटो चुनें')}
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
            {formData.photo_url && (
              <div className="mt-2">
                <img 
                  src={formData.photo_url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
            <input
              type="checkbox"
              id="edit-astrologer-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-pink-500 focus:ring-pink-500"
            />
            <label htmlFor="edit-astrologer-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Astrologer', 'सक्रिय ज्योतिषी')}
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
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Updating...', 'अपडेट कर रहे हैं...') : t('Update Astrologer', 'ज्योतिषी अपडेट करें')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
