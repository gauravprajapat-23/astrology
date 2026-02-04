'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiShield, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { supabase, type StaffRole } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

export default function AdminSignupPanel() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCreationToken: '',
    roleId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string | string[]>('');

  const defaultRoles: StaffRole[] = [
    {
      id: 'default-admin',
      name_en: 'Administrator',
      name_hi: 'प्रबंधक',
      description_en: 'Full administrative access',
      description_hi: 'पूर्ण प्रशासनिक पहुंच',
      permissions: ['admin', 'staff_management', 'site_settings', 'content_management'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'default-editor',
      name_en: 'Editor',
      name_hi: 'संपादक',
      description_en: 'Content management access',
      description_hi: 'सामग्री प्रबंधन पहुंच',
      permissions: ['content_management', 'testimonials'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/admin/roles');
        if (!res.ok) throw new Error('Failed to fetch roles from server');
        const rolesData = (await res.json()) as StaffRole[];

        if (!rolesData || rolesData.length === 0) {
          setRoles(defaultRoles);
          if (!formData.roleId) {
            setFormData(prev => ({ ...prev, roleId: defaultRoles[0].id }));
            setSelectedRolePermissions(defaultRoles[0].permissions);
          }
        } else {
          setRoles(rolesData);
          if (!formData.roleId) {
            const adminRole = rolesData.find(r => r.name_en === 'Administrator' || r.name_en === 'Admin');
            setFormData(prev => ({ ...prev, roleId: adminRole ? adminRole.id : rolesData[0].id }));
            setSelectedRolePermissions(adminRole ? adminRole.permissions : rolesData[0].permissions);
          }
        }
      } catch (err) {
        console.error('Failed to fetch roles', err);
        setRoles(defaultRoles);
        if (!formData.roleId) {
          setFormData(prev => ({ ...prev, roleId: defaultRoles[0].id }));
          setSelectedRolePermissions(defaultRoles[0].permissions);
        }
      }
    };
    fetchRoles();
  }, [formData.roleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, roleId: value }));
    const role = roles.find(r => r.id === value);
    setSelectedRolePermissions(role ? role.permissions : '');
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter both first and last name');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter an email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare headers with admin creation token if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Include admin creation token if provided in form
      if (formData.adminCreationToken) {
        headers['X-Admin-Creation-Token'] = formData.adminCreationToken;
      }
      
      // Call the API endpoint to create the admin user
      const roleToSend = formData.roleId && !formData.roleId.startsWith('default-') ? formData.roleId : undefined;
      const response = await fetch('/api/admin/signup', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role_id: roleToSend
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('An account with this email already exists');
        } else if (response.status === 401) {
          setError('Unauthorized: Invalid admin creation token');
        } else if (response.status === 500) {
          setError('Server configuration error. Please check environment variables.');
        } else {
          setError(result.error || 'Failed to create account');
        }
        setIsLoading(false);
        return;
      }

      // Success case
      setSuccess('Admin account created successfully! You can now log in.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminCreationToken: '',
        roleId: '',
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-saffron-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-saffron-500 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <FiShield className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-saffron-600 to-orange-600 dark:from-saffron-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
              {t('Create Admin Account', 'एडमिन खाता बनाएं')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('Secure administration access', 'सुरक्षित प्रशासनिक पहुंच')}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-6"
            >
              <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{success}</p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && !success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6"
            >
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('First Name', 'पहला नाम')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('First name', 'पहला नाम')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                    autoComplete="given-name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Last Name', 'अंतिम नाम')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t('Last name', 'अंतिम नाम')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Email Address', 'ईमेल पता')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Role', 'भूमिका')} *
              </label>
              <div>
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleRoleChange}
                  className="w-full pl-3 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name_en}</option>
                  ))}
                </select>
                {selectedRolePermissions && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{typeof selectedRolePermissions === 'string' ? selectedRolePermissions : JSON.stringify(selectedRolePermissions)}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Password', 'पासवर्ड')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('Enter your password', 'अपना पासवर्ड दर्ज करें')}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Confirm Password', 'पासवर्ड की पुष्टि करें')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('Confirm your password', 'अपना पासवर्ड की पुष्टि करें')}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Admin Creation Token Field */}
            <div>
              <label htmlFor="adminCreationToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Admin Creation Token', 'एडमिन निर्माण टोकन')} 
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="adminCreationToken"
                  name="adminCreationToken"
                  type="password"
                  value={formData.adminCreationToken}
                  onChange={handleChange}
                  placeholder={t('Enter admin creation token (if required)', 'एडमिन निर्माण टोकन दर्ज करें (यदि आवश्यक हो)')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t('Creating Account...', 'खाता बना रहे हैं...')}</span>
                </>
              ) : (
                <>
                  <FiShield className="w-5 h-5" />
                  <span>{t('Create Admin Account', 'एडमिन खाता बनाएं')}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('Already have an account?', 'क्या आपके पास पहले से एक खाता है?')}{' '}
              <button
                onClick={() => router.push('/admin')}
                className="text-saffron-600 dark:text-saffron-400 font-medium hover:underline"
              >
                {t('Sign in here', 'यहाँ साइन इन करें')}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('© 2024 Divine Rituals. All rights reserved.', '© 2024 दिवाइन रिटुअल्स। सर्वाधिकार सुरक्षित।')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              {t('Secure Staff Portal v2.0', 'सुरक्षित कर्मचारी पोर्टल v2.0')}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}