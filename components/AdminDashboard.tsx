'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiStar, FiSettings, FiUser, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    }
  }, [activeTab]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: t('Overview', 'अवलोकन'), icon: FiSettings },
    { id: 'services', label: t('Services', 'सेवाएं'), icon: FiSettings },
    { id: 'bookings', label: t('Bookings', 'बुकिंग'), icon: FiCalendar },
    { id: 'testimonials', label: t('Testimonials', 'प्रशंसापत्र'), icon: FiStar },
    { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), icon: FiUser },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-4">
            {t('Admin Panel', 'एडमिन पैनल')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('Manage your astrology services platform', 'अपनी ज्योतिष सेवाओं के प्लेटफॉर्म को प्रबंधित करें')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-saffron-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-saffron-50 dark:hover:bg-saffron-900/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Dashboard Overview', 'डैशबोर्ड अवलोकन')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <FiCalendar className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">24</h3>
                      <p className="text-blue-100">{t('Total Bookings', 'कुल बुकिंग')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <FiSettings className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">8</h3>
                      <p className="text-green-100">{t('Active Services', 'सक्रिय सेवाएं')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <FiStar className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">4</h3>
                      <p className="text-purple-100">{t('Testimonials', 'प्रशंसापत्र')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                      <FiUser className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">4</h3>
                      <p className="text-orange-100">{t('Astrologers', 'ज्योतिषी')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t('Manage Services', 'सेवाएं प्रबंधित करें')}
                    </h2>
                    <button className="flex items-center space-x-2 bg-saffron-500 text-white px-4 py-2 rounded-lg hover:bg-saffron-600 transition-colors">
                      <FiPlus className="w-4 h-4" />
                      <span>{t('Add Service', 'सेवा जोड़ें')}</span>
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-6 py-3">{t('Name', 'नाम')}</th>
                            <th className="px-6 py-3">{t('Category', 'श्रेणी')}</th>
                            <th className="px-6 py-3">{t('Price', 'मूल्य')}</th>
                            <th className="px-6 py-3">{t('Active', 'सक्रिय')}</th>
                            <th className="px-6 py-3">{t('Actions', 'क्रियाएं')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {language === 'en' ? service.name_en : service.name_hi}
                              </td>
                              <td className="px-6 py-4">{service.category}</td>
                              <td className="px-6 py-4">₹{service.base_price.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  service.is_active
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                  {service.is_active ? t('Yes', 'हाँ') : t('No', 'नहीं')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    <FiEdit className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                    <FiTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Manage Bookings', 'बुकिंग प्रबंधित करें')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('View and manage customer bookings.', 'ग्राहक बुकिंग देखें और प्रबंधित करें।')}
                  </p>
                  {/* TODO: Add booking management UI */}
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Manage Testimonials', 'प्रशंसापत्र प्रबंधित करें')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Add and manage customer testimonials.', 'ग्राहक प्रशंसापत्र जोड़ें और प्रबंधित करें।')}
                  </p>
                  {/* TODO: Add testimonial management UI */}
                </div>
              )}

              {activeTab === 'astrologers' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('Manage Astrologers', 'ज्योतिषी प्रबंधित करें')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Add and manage astrologer profiles.', 'ज्योतिषी प्रोफाइल जोड़ें और प्रबंधित करें।')}
                  </p>
                  {/* TODO: Add astrologer management UI */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}