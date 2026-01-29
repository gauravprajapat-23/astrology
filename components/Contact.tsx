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

  const contactInfo = [
    {
      icon: FiPhone,
      title: t('Phone', 'फ़ोन'),
      content: '+91 98765 43210',
      href: 'tel:+919876543210',
      gradient: 'from-saffron-500 to-orange-500',
    },
    {
      icon: FiMail,
      title: t('Email', 'ईमेल'),
      content: 'info@divinerituals.com',
      href: 'mailto:info@divinerituals.com',
      gradient: 'from-gold-500 to-yellow-500',
    },
    {
      icon: FiMapPin,
      title: t('Address', 'पता'),
      content: t(
        '123 Temple Street, Sacred City, India - 110001',
        '123 मंदिर मार्ग, पवित्र नगर, भारत - 110001'
      ),
      gradient: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-white via-saffron-50/30 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-saffron-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-saffron-500/10 to-gold-500/10 dark:from-saffron-500/20 dark:to-gold-500/20 text-saffron-600 dark:text-saffron-400 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase">
              {t('Get In Touch', 'संपर्क में रहें')}
            </span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-saffron-600 via-gold-600 to-orange-600 dark:from-saffron-400 dark:via-gold-400 dark:to-orange-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            {t('Contact Us', 'हमसे संपर्क करें')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t(
              'Get in touch for any queries or to book your ritual',
              'किसी भी प्रश्न के लिए या अपने अनुष्ठान को बुक करने के लिए संपर्क करें'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4 sm:space-y-5">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 sm:p-6 overflow-hidden">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative flex items-start space-x-4">
                      <div className={`w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors duration-300 break-words"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp Button */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center space-x-3 w-full p-5 sm:p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaWhatsapp className="relative w-7 sm:w-8 h-7 sm:h-8 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative font-bold text-base sm:text-lg md:text-xl">
                {t('Chat on WhatsApp', 'WhatsApp पर चैट करें')}
              </span>
            </motion.a>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl overflow-hidden shadow-xl h-48 sm:h-56 md:h-64 lg:h-72"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2441774321877!2d77.2090212!3d28.6129578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 overflow-hidden">
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-saffron-500/10 to-gold-500/10 dark:from-saffron-500/20 dark:to-gold-500/20 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-gold-500/10 dark:from-orange-500/20 dark:to-gold-500/20 rounded-tr-full"></div>

              <div className="relative">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('Send us a message', 'हमें एक संदेश भेजें')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                  {t('Fill out the form below and we\'ll get back to you shortly', 'नीचे फॉर्म भरें और हम जल्द ही आपसे संपर्क करेंगे')}
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12 sm:py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <FiSend className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
                    </motion.div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('Message Sent!', 'संदेश भेज दिया गया!')}
                    </h4>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {t('We will get back to you soon.', 'हम जल्द ही आपसे संपर्क करेंगे।')}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('Name', 'नाम')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                        placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('Email', 'ईमेल')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                        placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('Phone', 'फ़ोन')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                        placeholder={t('Enter your phone number', 'अपना फ़ोन नंबर दर्ज करें')}
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('Message', 'संदेश')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 resize-none"
                        placeholder={t('Enter your message', 'अपना संदेश दर्ज करें')}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="group relative w-full py-4 sm:py-5 bg-gradient-to-r from-saffron-500 via-gold-500 to-orange-500 text-white rounded-xl font-bold text-base sm:text-lg hover:from-saffron-600 hover:via-gold-600 hover:to-orange-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-saffron-600 via-gold-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <FiSend className="relative w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="relative">{t('Send Message', 'संदेश भेजें')}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}