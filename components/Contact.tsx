'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const whatsappNumber = '919876543210';
  const whatsappMessage = t(
    'Hello, I would like to inquire about your ritual services.',
    'नमस्ते, मैं आपकी अनुष्ठान सेवाओं के बारे में पूछताछ करना चाहता हूं।'
  );

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-saffron-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8 md:mb-12 px-2 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-2 sm:mb-3 md:mb-4">
            {t('Contact Us', 'हमसे संपर्क करें')}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto">
            {t(
              'Get in touch for any queries or to book your ritual',
              'किसी भी प्रश्न के लिए या अपने अनुष्ठान को बुक करने के लिए संपर्क करें'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 md:p-5 lg:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                    {t('Phone', 'फ़ोन')}
                  </h3>
                  <a href="tel:+919876543210" className="text-gray-600 dark:text-gray-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 md:p-5 lg:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                    {t('Email', 'ईमेल')}
                  </h3>
                  <a href="mailto:info@divinerituals.com" className="text-gray-600 dark:text-gray-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
                    info@divinerituals.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 md:p-5 lg:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                    {t('Address', 'पता')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(
                      '123 Temple Street, Sacred City, India - 110001',
                      '123 मंदिर मार्ग, पवित्र नगर, भारत - 110001'
                    )}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 sm:space-x-2 md:space-x-3 w-full p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FaWhatsapp className="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                  {t('Chat on WhatsApp', 'WhatsApp पर चैट करें')}
                </span>
              </a>
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 rounded-2xl overflow-hidden shadow-xl h-32 sm:h-48 md:h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2441774321877!2d77.2090212!3d28.6129578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 sm:mt-8 md:mt-0"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
                {t('Send us a message', 'हमें एक संदेश भेजें')}
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FiSend className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('Message Sent!', 'संदेश भेज दिया गया!')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('We will get back to you soon.', 'हम जल्द ही आपसे संपर्क करेंगे।')}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      {t('Name', 'नाम')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      {t('Email', 'ईमेल')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      {t('Phone', 'फ़ोन')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('Enter your phone number', 'अपना फ़ोन नंबर दर्ज करें')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      {t('Message', 'संदेश')} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('Enter your message', 'अपना संदेश दर्ज करें')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-saffron-500 to-gold-500 text-white rounded-lg font-semibold text-xs sm:text-sm md:text-base lg:text-lg hover:from-saffron-600 hover:to-gold-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-1.5 sm:space-x-2"
                  >
                    <FiSend className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg">{t('Send Message', 'संदेश भेजें')}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
