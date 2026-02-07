import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiUpload } from 'react-icons/fi';
import { supabase, type StaffMember, type StaffRole } from '@/lib/supabase';
import { uploadAdminImage } from '@/lib/adminUpload';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface EditStaffModalProps {
  staff: StaffMember;
  roles: StaffRole[];
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EditStaffModal({ staff, roles, onClose, onSuccess, onError }: EditStaffModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: staff.first_name,
    last_name: staff.last_name,
    email: staff.email,
    phone: staff.phone || '',
    role_id: staff.role_id || '',
    avatar_url: staff.avatar_url || '',
    is_active: staff.is_active,
    new_password: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadAdminImage({ file, bucket: 'staff-avatars' });
      setFormData({ ...formData, avatar_url: result.url });
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
      const finalAvatarUrl = formData.avatar_url;
      
      // Prepare update data
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        role_id: formData.role_id,
        avatar_url: finalAvatarUrl,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      // Update password if provided
      if (formData.new_password) {
        const { error: passwordError } = await supabase.rpc('update_staff_password', {
          staff_id: staff.id,
          new_password: formData.new_password
        });
        
        if (passwordError) throw passwordError;
      }

      // Validate role_id is a proper UUID format
      if (formData.role_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.role_id)) {
        throw new Error('Invalid role ID format');
      }
      
      // Update staff member data
      const { error } = await supabase
        .from('staff_members')
        .update(updateData)
        .eq('id', staff.id);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error('Error updating staff member:', error);
      onError(error.message || 'Failed to update staff member');
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {t('Edit Staff Member', 'कर्मचारी संपादित करें')}
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
              placeholder={t('First Name', 'पहला नाम')}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="text"
              placeholder={t('Last Name', 'अंतिम नाम')}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <input
            type="email"
            placeholder={t('Email Address', 'ईमेल पता')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          />
          
          <input
            type="tel"
            placeholder={t('Phone Number', 'फोन नंबर')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          
          <select
            value={formData.role_id}
            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          >
            <option value="">{t('Select Role', 'भूमिका चुनें')}</option>
            {roles
              .filter(role => role.is_active)
              .map(role => (
                <option key={role.id} value={role.id}>
                  {t(role.name_en, role.name_hi)}
                </option>
              ))}
          </select>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Upload Avatar', 'अवतार अपलोड करें')}
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                <div className="flex flex-col items-center">
                  <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {uploading ? t('Uploading...', 'अपलोड हो रहा है...') : t('Choose Avatar', 'अवतार चुनें')}
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
            {formData.avatar_url && (
              <div className="mt-2">
                <img 
                  src={formData.avatar_url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
            <input
              type="checkbox"
              id="edit-staff-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="edit-staff-active" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              {t('Active Staff Member', 'सक्रिय कर्मचारी')}
            </label>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Change Password (Optional)', 'पासवर्ड बदलें (वैकल्पिक)')}
            </label>
            <input
              type="password"
              placeholder={t('Enter new password to change', 'बदलने के लिए नया पासवर्ड दर्ज करें')}
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('Leave blank to keep current password', 'वर्तमान पासवर्ड रखने के लिए रिक्त छोड़ें')}
            </p>
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
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Updating...', 'अपडेट कर रहे हैं...') : t('Update Staff Member', 'कर्मचारी अपडेट करें')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
