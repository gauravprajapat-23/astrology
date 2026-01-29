'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft, FiLoader, FiCalendar, FiClock, FiMapPin, FiUser, FiMail, FiPhone, FiFileText, FiStar, FiZap } from 'react-icons/fi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';

type BookingData = {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  specialNotes: string;
};

export default function BookingForm() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    specialNotes: '',
  });

  useEffect(() => {
    fetchServices();
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
      setBookingData(prev => ({ ...prev, serviceId: selectedService }));
      localStorage.removeItem('selectedService');
    }
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').eq('is_active', true);
    setServices(data || []);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!bookingData.serviceId) newErrors.serviceId = t('Please select a service', 'कृपया एक सेवा चुनें');
    }

    if (currentStep === 2) {
      if (!bookingData.customerName) newErrors.customerName = t('Name is required', 'नाम आवश्यक है');
      if (!bookingData.customerEmail) {
        newErrors.customerEmail = t('Email is required', 'ईमेल आवश्यक है');
      } else if (!/\S+@\S+\.\S+/.test(bookingData.customerEmail)) {
        newErrors.customerEmail = t('Invalid email format', 'अमान्य ईमेल प्रारूप');
      }
      if (!bookingData.customerPhone) {
        newErrors.customerPhone = t('Phone is required', 'फ़ोन आवश्यक है');
      } else if (!/^\d{10}$/.test(bookingData.customerPhone.replace(/\D/g, ''))) {
        newErrors.customerPhone = t('Invalid phone number', 'अमान्य फ़ोन नंबर');
      }
    }

    if (currentStep === 3) {
      if (!bookingData.preferredDate) newErrors.preferredDate = t('Date is required', 'तिथि आवश्यक है');
      if (!bookingData.preferredTime) newErrors.preferredTime = t('Time is required', 'समय आवश्यक है');
      if (!bookingData.location) newErrors.location = t('Location is required', 'स्थान आवश्यक है');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const selectedService = services.find(s => s.id === bookingData.serviceId);
      const { error } = await supabase.from('bookings').insert({
        service_id: bookingData.serviceId,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        preferred_date: bookingData.preferredDate,
        preferred_time: bookingData.preferredTime,
        location: bookingData.location,
        special_notes: bookingData.specialNotes,
        total_amount: selectedService?.base_price || 0,
        status: 'pending',
        payment_status: 'pending',
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(t('Failed to submit booking. Please try again.', 'बुकिंग सबमिट करने में विफल। कृपया पुनः प्रयास करें।'));
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === bookingData.serviceId);

  const stepTitles = [
    { title: t('Select Service', 'सेवा चुनें'), icon: FiZap },
    { title: t('Your Information', 'आपकी जानकारी'), icon: FiUser },
    { title: t('Ritual Details', 'अनुष्ठान विवरण'), icon: FiCalendar },
  ];

  if (submitted) {
    return (
      <section className="py-12 sm:py-16 md:py-20 min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/10 dark:to-amber-900/10 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-orange-200 dark:border-orange-800"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.3, type: "spring", duration: 1 }}
              className="w-28 h-28 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <FiCheck className="w-16 h-16 text-white" strokeWidth={3} />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                {t('Booking Confirmed!', 'बुकिंग पुष्टि हो गई!')}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t(
                  'Thank you for your booking. We will contact you shortly to confirm the details.',
                  'आपकी बुकिंग के लिए धन्यवाद। विवरण की पुष्टि करने के लिए हम शीघ्र ही आपसे संपर्क करेंगे।'
                )}
              </p>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('Booking Reference', 'बुकिंग संदर्भ')}
                  </p>
                </div>
                <p className="text-2xl font-bold text-saffron-600 dark:text-saffron-400">
                  #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setBookingData({
                    serviceId: '',
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    preferredDate: '',
                    preferredTime: '',
                    location: '',
                    specialNotes: '',
                  });
                }}
                className="px-8 py-4 bg-gradient-to-r from-saffron-500 via-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
              >
                {t('Book Another Ritual', 'एक और अनुष्ठान बुक करें')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-12 sm:py-16 md:py-20 min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/10 dark:to-amber-900/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-saffron-500 via-orange-500 to-amber-500 rounded-2xl shadow-xl mb-6"
          >
            <FiCalendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 dark:from-saffron-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-4">
            {t('Book Your Ritual', 'अपना अनुष्ठान बुक करें')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('Complete the form below to book your sacred ritual', 'अपने पवित्र अनुष्ठान को बुक करने के लिए नीचे दिया गया फॉर्म भरें')}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-saffron-500 via-orange-500 to-amber-500 rounded-full"
              />
            </div>

            {stepTitles.map((stepInfo, index) => {
              const StepIcon = stepInfo.icon;
              const stepNum = index + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;

              return (
                <div key={stepNum} className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                        : isActive
                        ? 'bg-gradient-to-br from-saffron-500 via-orange-500 to-amber-500 text-white shadow-xl scale-110'
                        : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-6 h-6" strokeWidth={3} />
                    ) : (
                      <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full bg-saffron-500/30 -z-10"
                      />
                    )}
                  </motion.div>
                  <p className={`mt-2 text-xs sm:text-sm font-medium text-center hidden sm:block ${
                    isActive || isCompleted
                      ? 'text-saffron-600 dark:text-saffron-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {stepInfo.title}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-orange-200 dark:border-orange-800"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <FiZap className="w-7 h-7 mr-3 text-saffron-500" />
                    {t('Select Your Service', 'अपनी सेवा चुनें')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 ml-10">
                    {t('Choose the sacred ritual you wish to book', 'वह पवित्र अनुष्ठान चुनें जिसे आप बुक करना चाहते हैं')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {services.map((service, index) => (
                    <motion.label
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative block p-5 sm:p-6 border-3 rounded-2xl cursor-pointer transition-all group ${
                        bookingData.serviceId === service.id
                          ? 'border-saffron-500 bg-gradient-to-br from-saffron-50 to-orange-50 dark:from-saffron-900/30 dark:to-orange-900/30 shadow-xl'
                          : 'border-gray-200 dark:border-gray-700 hover:border-saffron-300 hover:shadow-lg bg-white dark:bg-gray-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={bookingData.serviceId === service.id}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, serviceId: e.target.value });
                          setErrors({ ...errors, serviceId: '' });
                        }}
                        className="sr-only"
                      />
                      
                      {/* Selected indicator */}
                      {bookingData.serviceId === service.id && (
                        <motion.div
                          layoutId="selectedService"
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <FiCheck className="w-5 h-5 text-white" strokeWidth={3} />
                        </motion.div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="text-3xl mb-2">{service.icon || '✨'}</div>
                          <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                            {language === 'en' ? service.name_en : service.name_hi}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiClock className="w-4 h-4" />
                          <span>{service.duration_minutes} {t('min', 'मिनट')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-2xl font-bold bg-gradient-to-r from-saffron-600 to-orange-600 bg-clip-text text-transparent">
                            ₹{service.base_price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {language === 'en' ? service.description_en : service.description_hi}
                        </p>
                      </div>
                    </motion.label>
                  ))}
                </div>
                {errors.serviceId && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-4 flex items-center"
                  >
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2">!</span>
                    {errors.serviceId}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <FiUser className="w-7 h-7 mr-3 text-saffron-500" />
                    {t('Your Information', 'आपकी जानकारी')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 ml-10">
                    {t('Please provide your contact details', 'कृपया अपना संपर्क विवरण प्रदान करें')}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-saffron-500" />
                      {t('Full Name', 'पूरा नाम')} <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bookingData.customerName}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, customerName: e.target.value });
                          setErrors({ ...errors, customerName: '' });
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 border-2 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                          errors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
                      />
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.customerName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 text-xs">!</span>
                        {errors.customerName}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiMail className="w-4 h-4 mr-2 text-saffron-500" />
                      {t('Email Address', 'ईमेल पता')} <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={bookingData.customerEmail}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, customerEmail: e.target.value });
                          setErrors({ ...errors, customerEmail: '' });
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 border-2 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                          errors.customerEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.customerEmail && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 text-xs">!</span>
                        {errors.customerEmail}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiPhone className="w-4 h-4 mr-2 text-saffron-500" />
                      {t('Phone Number', 'फ़ोन नंबर')} <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={bookingData.customerPhone}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, customerPhone: e.target.value });
                          setErrors({ ...errors, customerPhone: '' });
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 border-2 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                          errors.customerPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('Enter your phone number', 'अपना फ़ोन नंबर दर्ज करें')}
                      />
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.customerPhone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 text-xs">!</span>
                        {errors.customerPhone}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Ritual Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <FiCalendar className="w-7 h-7 mr-3 text-saffron-500" />
                    {t('Ritual Details', 'अनुष्ठान विवरण')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 ml-10">
                    {t('When and where should we perform the ritual?', 'हमें अनुष्ठान कब और कहाँ करना चाहिए?')}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preferred Date */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-saffron-500" />
                        {t('Preferred Date', 'पसंदीदा तिथि')} <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        value={bookingData.preferredDate}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, preferredDate: e.target.value });
                          setErrors({ ...errors, preferredDate: '' });
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                          errors.preferredDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.preferredDate && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 text-xs">!</span>
                          {errors.preferredDate}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Preferred Time */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiClock className="w-4 h-4 mr-2 text-saffron-500" />
                        {t('Preferred Time', 'पसंदीदा समय')} <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="time"
                        value={bookingData.preferredTime}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, preferredTime: e.target.value });
                          setErrors({ ...errors, preferredTime: '' });
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                          errors.preferredTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.preferredTime && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 text-xs">!</span>
                          {errors.preferredTime}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiMapPin className="w-4 h-4 mr-2 text-saffron-500" />
                      {t('Location/Address', 'स्थान/पता')} <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={bookingData.location}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, location: e.target.value });
                          setErrors({ ...errors, location: '' });
                        }}
                        rows={3}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 border-2 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none ${
                          errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('Enter the location where ritual will be performed', 'वह स्थान दर्ज करें जहां अनुष्ठान किया जाएगा')}
                      />
                      <FiMapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.location && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 text-xs">!</span>
                        {errors.location}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Special Notes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiFileText className="w-4 h-4 mr-2 text-saffron-500" />
                      {t('Special Notes', 'विशेष नोट')} <span className="text-gray-400 ml-1 text-xs">({t('Optional', 'वैकल्पिक')})</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={bookingData.specialNotes}
                        onChange={(e) => setBookingData({ ...bookingData, specialNotes: e.target.value })}
                        rows={3}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-saffron-500/20 focus:border-saffron-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none"
                        placeholder={t('Any special requirements or notes', 'कोई विशेष आवश्यकताएं या नोट्स')}
                      />
                      <FiFileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>

                  {/* Price Summary */}
                  {selectedService && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-saffron-50 via-orange-50 to-amber-50 dark:from-saffron-900/30 dark:via-orange-900/30 dark:to-amber-900/30 p-6 rounded-2xl border-2 border-saffron-200 dark:border-saffron-800 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('Selected Service', 'चयनित सेवा')}</p>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">
                            {language === 'en' ? selectedService.name_en : selectedService.name_hi}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{selectedService.icon || '✨'}</span>
                        </div>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-saffron-300 to-transparent mb-4"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiStar className="w-5 h-5 mr-2 text-yellow-500" />
                          {t('Total Amount', 'कुल राशि')}
                        </span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                          ₹{selectedService.base_price.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-10">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-saffron-500 text-saffron-600 dark:text-saffron-400 rounded-xl font-semibold hover:bg-saffron-50 dark:hover:bg-saffron-900/20 transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>{t('Previous', 'पिछला')}</span>
              </motion.button>
            )}

            {step < 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="ml-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-saffron-500 via-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
              >
                <span>{t('Next Step', 'अगला कदम')}</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin w-5 h-5" />
                    <span>{t('Submitting...', 'सबमिट हो रहा है...')}</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>{t('Confirm Booking', 'बुकिंग की पुष्टि करें')}</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <FiCheck className="w-5 h-5 text-white" />
            </div>
            <span>{t('Secure Booking', 'सुरक्षित बुकिंग')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <FiStar className="w-5 h-5 text-white" />
            </div>
            <span>{t('Expert Astrologers', 'विशेषज्ञ ज्योतिषी')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <FiZap className="w-5 h-5 text-white" />
            </div>
            <span>{t('Instant Confirmation', 'तत्काल पुष्टि')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}