'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiMail, FiPhone, FiMessageSquare, FiSend, FiCheck, FiX } from 'react-icons/fi';
import { supabase, type Testimonial, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function TestimonialForm() {
  const { language, t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    service_used: '',
    rating: 5,
    review_en: '',
    review_hi: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name_en');
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = t('Name is required', 'नाम आवश्यक है');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('Email is required', 'ईमेल आवश्यक है');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('Invalid email format', 'अमान्य ईमेल प्रारूप');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('Phone is required', 'फोन आवश्यक है');
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = t('Invalid phone number', 'अमान्य फोन नंबर');
    }

    if (!formData.service_used) {
      newErrors.service_used = t('Please select a service', 'कृपया एक सेवा चुनें');
    }

    if (formData.rating < 1) {
      newErrors.rating = t('Rating is required', 'रेटिंग आवश्यक है');
    }

    const reviewText = language === 'en' ? formData.review_en : formData.review_hi;
    if (!reviewText.trim()) {
      newErrors.review = t('Review is required', 'समीक्षा आवश्यक है');
    } else if (reviewText.length < 10) {
      newErrors.review = t('Review must be at least 10 characters', 'समीक्षा कम से कम 10 अक्षरों की होनी चाहिए');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const testimonialData = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        service_used: formData.service_used,
        rating: formData.rating,
        review_en: formData.review_en,
        review_hi: formData.review_hi,
        ritual_name: services.find(s => s.id === formData.service_used)?.name_en || '',
        is_featured: false,
        status: 'pending',
        verified: false,
      };

      const { error } = await supabase
        .from('testimonials')
        .insert([testimonialData]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        service_used: '',
        rating: 5,
        review_en: '',
        review_hi: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setErrors({ submit: t('Failed to submit testimonial. Please try again.', 'प्रशंसापत्र सबमिट करने में विफल। कृपया पुनः प्रयास करें।') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "submit"}
            onClick={interactive ? () => setFormData({ ...formData, rating: star }) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
            disabled={!interactive}
          >
            <FiStar className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  if (submitSuccess) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Thank You!', 'धन्यवाद!')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {t(
                'Your testimonial has been submitted successfully. We appreciate your feedback!',
                'आपका प्रशंसापत्र सफलतापूर्वक सबमिट कर दिया गया है। हम आपकी प्रतिक्रिया की सराहना करते हैं!'
              )}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {t(
                'Our team will review your testimonial and publish it after verification.',
                'हमारी टीम आपके प्रशंसापत्र की समीक्षा करेगी और सत्यापन के बाद इसे प्रकाशित करेगी।'
              )}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-saffron-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t('Share Your Experience', 'अपना अनुभव साझा करें')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                {t(
                  'We value your feedback. Share your experience with our services and help others make informed decisions.',
                  'हम आपकी प्रतिक्रिया का मूल्य समझते हैं। हमारी सेवाओं के साथ अपना अनुभव साझा करें और दूसरों को सूचित निर्णय लेने में मदद करें।'
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Full Name', 'पूरा नाम')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => {
                        setFormData({ ...formData, customer_name: e.target.value });
                        if (errors.customer_name) setErrors({ ...errors, customer_name: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                        errors.customer_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
                    />
                  </div>
                  {errors.customer_name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {errors.customer_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Email Address', 'ईमेल पता')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Phone Number', 'फोन नंबर')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('Enter your phone number', 'अपना फोन नंबर दर्ज करें')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Service Used */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Service Used', 'उपयोग की गई सेवा')} *
                  </label>
                  <select
                    value={formData.service_used}
                    onChange={(e) => {
                      setFormData({ ...formData, service_used: e.target.value });
                      if (errors.service_used) setErrors({ ...errors, service_used: '' });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                      errors.service_used ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">{t('Select a service', 'एक सेवा चुनें')}</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {language === 'en' ? service.name_en : service.name_hi}
                      </option>
                    ))}
                  </select>
                  {errors.service_used && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {errors.service_used}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('Rate Your Experience', 'अपने अनुभव को रेट करें')} *
                </label>
                <div className="flex justify-center">
                  {renderStars(formData.rating, true)}
                </div>
                {errors.rating && (
                  <p className="mt-2 text-sm text-red-500 text-center flex items-center justify-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {errors.rating}
                  </p>
                )}
              </div>

              {/* Review */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Your Review', 'आपकी समीक्षा')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FiMessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={language === 'en' ? formData.review_en : formData.review_hi}
                    onChange={(e) => {
                      if (language === 'en') {
                        setFormData({ ...formData, review_en: e.target.value });
                      } else {
                        setFormData({ ...formData, review_hi: e.target.value });
                      }
                      if (errors.review) setErrors({ ...errors, review: '' });
                    }}
                    rows={5}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none ${
                      errors.review ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={
                      language === 'en' 
                        ? 'Share your detailed experience with our services...' 
                        : 'हमारी सेवाओं के साथ अपना विस्तृत अनुभव साझा करें...'
                    }
                  />
                </div>
                {errors.review && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {errors.review}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('Submitting...', 'सबमिट कर रहे हैं...')}</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>{t('Submit Testimonial', 'प्रशंसापत्र सबमिट करें')}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-center flex items-center justify-center"
                >
                  <FiX className="w-5 h-5 mr-2" />
                  {errors.submit}
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}