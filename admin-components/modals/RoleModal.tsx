import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { supabase, type StaffRole } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

type RoleModalMode = 'add' | 'edit';

interface RoleModalProps {
  mode: RoleModalMode;
  role?: StaffRole;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const availablePermissions = [
  'admin',
  'staff_management',
  'content_management',
  'testimonials',
  'gallery',
  'videos',
  'carousel',
  'settings',
  'bookings',
  'services',
];

const getInitialFormData = (mode: RoleModalMode, role?: StaffRole) => ({
  name_en: mode === 'edit' && role ? role.name_en : '',
  name_hi: mode === 'edit' && role ? role.name_hi : '',
  description_en: mode === 'edit' && role ? role.description_en || '' : '',
  description_hi: mode === 'edit' && role ? role.description_hi || '' : '',
  permissions: mode === 'edit' && role
    ? (Array.isArray(role.permissions) ? role.permissions : [])
    : ([] as string[]),
  is_active: mode === 'edit' && role ? role.is_active : true,
});

export default function RoleModal({ mode, role, onClose, onSuccess, onError }: RoleModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData(mode, role));

  useEffect(() => {
    setFormData(getInitialFormData(mode, role));
  }, [mode, role]);

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('staff_roles')
          .insert([{
            name_en: formData.name_en,
            name_hi: formData.name_hi,
            description_en: formData.description_en,
            description_hi: formData.description_hi,
            permissions: formData.permissions,
            is_active: formData.is_active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      } else {
        if (!role?.id) {
          throw new Error('Role not found');
        }
        const { error } = await supabase
          .from('staff_roles')
          .update({
            name_en: formData.name_en,
            name_hi: formData.name_hi,
            description_en: formData.description_en,
            description_hi: formData.description_hi,
            permissions: formData.permissions,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', role.id);

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} role:`, error);
      onError(error.message || `Failed to ${mode === 'add' ? 'add' : 'update'} role`);
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
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {mode === 'add'
              ? t('Add Staff Role', 'कर्मचारी भूमिका जोड़ें')
              : t('Edit Staff Role', 'कर्मचारी भूमिका संपादित करें')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={t('Close', 'बंद करें')}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('Role Name (English)', 'भूमिका नाम (अंग्रेजी)')}
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
              <input
                type="text"
                placeholder={t('Role Name (Hindi)', 'भूमिका नाम (हिंदी)')}
                value={formData.name_hi}
                onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
          
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('Description (English)', 'विवरण (अंग्रेजी)')}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder={t('Description (Hindi)', 'विवरण (हिंदी)')}
                value={formData.description_hi}
                onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('Permissions', 'अनुमतियाँ')}
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                {availablePermissions.map(permission => (
                  <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {permission.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          
            <div className="flex items-center space-x-3 px-4 py-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-800">
              <input
                type="checkbox"
                id={mode === 'add' ? 'add-role-active' : 'edit-role-active'}
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor={mode === 'add' ? 'add-role-active' : 'edit-role-active'} className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                {t('Active Role', 'सक्रिय भूमिका')}
              </label>
            </div>
          
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (mode === 'add' ? t('Adding...', 'जोड़ रहे हैं...') : t('Updating...', 'अपडेट कर रहे हैं...'))
                : (mode === 'add' ? t('Add Role', 'भूमिका जोड़ें') : t('Update Role', 'भूमिका अपडेट करें'))}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
