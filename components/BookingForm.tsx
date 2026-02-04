import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft, FiLoader, FiCalendar, FiClock, FiMapPin, FiUser, FiMail, FiPhone, FiFileText, FiStar, FiZap, FiAlertCircle } from 'react-icons/fi';
import { GiLotusFlower } from 'react-icons/gi';
import { supabase, type Service } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { FaOm } from "react-icons/fa";

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

import Section from '@/components/Section';

export default function BookingForm({ variant = 'page' }: { variant?: 'landing' | 'page' }) {
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

  // validateStep is stable in this component; silence exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchServices();
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
      setBookingData(prev => ({ ...prev, serviceId: selectedService }));
      setTimeout(() => {
        localStorage.removeItem('selectedService');
      }, 1000);
      
      if (selectedService && step === 1) {
        setTimeout(() => {
          if (validateStep(1)) {
            setStep(2);
          }
        }, 500);
      }
    }
  }, [step]);

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
    { 
      title: t('Select Service', 'सेवा चुनें'), 
      icon: FiZap, 
      desc: t('Choose ritual', 'अनुष्ठान चुनें'),
      color: 'from-amber-500 to-orange-500'
    },
    { 
      title: t('Your Details', 'आपका विवरण'), 
      icon: FiUser, 
      desc: t('Contact info', 'संपर्क जानकारी'),
      color: 'from-rose-500 to-pink-500'
    },
    { 
      title: t('Schedule', 'अनुसूची'), 
      icon: FiCalendar, 
      desc: t('Date & location', 'तिथि और स्थान'),
      color: 'from-violet-500 to-purple-500'
    },
  ];

  // Success State - Compact
  if (submitted) {
    return (
      <Section id="booking" variant={variant} className={`${variant === 'page' ? 'min-h-screen' : ''} bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div className="absolute inset-0 bg-mandala bg-repeat"></div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-200 dark:border-green-800 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Success Icon - Compact */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
                  <FiCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={3} />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-3">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    {t('Booking Confirmed!', 'बुकिंग पुष्टि हो गई!')}
                  </span>
                </h3>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                  <FaOm className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                </div>

                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed max-w-lg mx-auto">
                  {t(
                    'Thank you for your trust. We will contact you shortly to confirm the details and provide further guidance for your sacred ritual.',
                    'आपके विश्वास के लिए धन्यवाद। हम आपके पवित्र अनुष्ठान के लिए विवरण की पुष्टि और आगे का मार्गदर्शन प्रदान करने के लिए शीघ्र ही आपसे संपर्क करेंगे।'
                  )}
                </p>

                {/* Booking Reference - Compact */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-4 mb-6 border-2 border-green-200 dark:border-green-800 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-5">
                    <GiLotusFlower className="absolute top-1 right-1 w-16 h-16 text-green-600" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-center space-x-1.5 mb-2">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('Booking Reference', 'बुकिंग संदर्भ')}
                      </p>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-wider">
                      #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                  </div>
                </motion.div>

                {/* Info Cards - Compact */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: FiMail, label: t('Email Sent', 'ईमेल भेजा') },
                    { icon: FiPhone, label: t('We\'ll Call', 'कॉल करेंगे') },
                    { icon: FiCalendar, label: t('Confirmed', 'पुष्टि') }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                    >
                      <item.icon className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1.5" />
                      <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('Book Another', 'एक और बुक करें')}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    {t('View Services', 'सेवाएं देखें')}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>
    );
  }

  // Main Booking Form - Compact
  return (
    <Section id="booking" variant={variant} className="bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 blur-xl opacity-30 rounded-full"></div>
              <div className="relative flex items-center justify-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/30 shadow-lg">
                <FaOm className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {t('Sacred Booking', 'पवित्र बुकिंग')}
                </span>
              </div>
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
              {t('Book Your Sacred Ritual', 'अपना पवित्र अनुष्ठान बुक करें')}
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t(
              'Begin your spiritual journey with our easy 3-step booking process',
              'हमारी आसान 3-चरण बुकिंग प्रक्रिया के साथ अपनी आध्यात्मिक यात्रा शुरू करें'
            )}
          </p>

          <div className="flex items-center justify-center space-x-3 mt-3">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <GiLotusFlower className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
        </motion.div>

        {/* Progress Steps - Compact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 sm:mb-10"
        >
          <div className="relative max-w-3xl mx-auto">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 -z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 mx-[15%]"></div>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 2) * 70}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-[15%] h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stepTitles.map((stepInfo, index) => {
                const StepIcon = stepInfo.icon;
                const stepNum = index + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;

                return (
                  <motion.div 
                    key={stepNum} 
                    className="flex flex-col items-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Step Circle - Compact */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-bold transition-all duration-300 mb-3 shadow-lg ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : isActive
                          ? `bg-gradient-to-br ${stepInfo.color} text-white scale-105`
                          : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <FiCheck className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                      ) : (
                        <>
                          <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                          <span className="text-[10px]">{stepNum}</span>
                        </>
                      )}
                      
                      {isActive && (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stepInfo.color} opacity-30 -z-10`}
                          />
                          <div className={`absolute -inset-1 bg-gradient-to-r ${stepInfo.color} rounded-2xl blur opacity-50`}></div>
                        </>
                      )}
                    </motion.div>

                    {/* Step Info - Compact */}
                    <div className="text-center">
                      <p className={`font-bold text-xs sm:text-sm mb-0.5 transition-colors ${
                        isActive || isCompleted
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stepInfo.title}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 hidden sm:block">
                        {stepInfo.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Form Container - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>

          {/* Form Steps Content - Compact */}
          <div className="p-5 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Service - Compact */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Header - Compact */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stepTitles[0].color} rounded-xl flex items-center justify-center shadow-lg mr-3`}>
                          <FiZap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {t('Select Your Service', 'अपनी सेवा चुनें')}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {t('Choose the ritual that resonates with your needs', 'अपनी आवश्यकताओं के अनुरूप अनुष्ठान चुनें')}
                          </p>
                        </div>
                      </div>
                      {bookingData.serviceId && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="hidden sm:block"
                        >
                          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                            <FiCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              {t('Selected', 'चयनित')}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Pre-selected Notice - Compact */}
                    {bookingData.serviceId && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-green-800 dark:text-green-300">
                            {t('Service Auto-Selected', 'सेवा स्वचालित रूप से चयनित')}
                          </p>
                          <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                            {t('You can change it below.', 'आप इसे नीचे बदल सकते हैं।')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Services Grid - Compact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <motion.label
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className={`relative block cursor-pointer group ${
                          bookingData.serviceId === service.id ? 'z-10' : ''
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
                        
                        <div className={`relative p-4 border-2 rounded-xl transition-all duration-300 ${
                          bookingData.serviceId === service.id
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-rose-900/30 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md'
                        }`}>
                          {bookingData.serviceId === service.id && (
                            <motion.div
                              layoutId="selectedService"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800 z-10"
                            >
                              <FiCheck className="w-5 h-5 text-white" strokeWidth={3} />
                            </motion.div>
                          )}

                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="text-3xl mb-2">{service.icon || '✨'}</div>
                              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                                {language === 'en' ? service.name_en : service.name_hi}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                            {language === 'en' ? service.description_en : service.description_hi}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <FiClock className="w-3.5 h-3.5" />
                              <span className="font-medium">{service.duration_minutes} {t('min', 'मिनट')}</span>
                            </div>
                            <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                              ₹{service.base_price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.label>
                    ))}
                  </div>

                  {errors.serviceId && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <FiAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">{errors.serviceId}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Personal Information - Compact */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stepTitles[1].color} rounded-xl flex items-center justify-center shadow-lg mr-3`}>
                        <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {t('Your Information', 'आपकी जानकारी')}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {t('Help us connect with you', 'हमें आपसे जुड़ने में मदद करें')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name - Compact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiUser className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400" />
                        {t('Full Name', 'पूरा नाम')} 
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={bookingData.customerName}
                          onChange={(e) => {
                            setBookingData({ ...bookingData, customerName: e.target.value });
                            setErrors({ ...errors, customerName: '' });
                          }}
                          className={`w-full px-4 py-3 pl-10 border-2 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 text-sm ${
                            errors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder={t('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
                        />
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.customerName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1.5 flex items-center"
                        >
                          <FiAlertCircle className="w-3.5 h-3.5 mr-1" />
                          {errors.customerName}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email - Compact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiMail className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400" />
                        {t('Email Address', 'ईमेल पता')} 
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={bookingData.customerEmail}
                          onChange={(e) => {
                            setBookingData({ ...bookingData, customerEmail: e.target.value });
                            setErrors({ ...errors, customerEmail: '' });
                          }}
                          className={`w-full px-4 py-3 pl-10 border-2 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 text-sm ${
                            errors.customerEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                        />
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.customerEmail && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1.5 flex items-center"
                        >
                          <FiAlertCircle className="w-3.5 h-3.5 mr-1" />
                          {errors.customerEmail}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Phone - Compact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiPhone className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400" />
                        {t('Phone Number', 'फ़ोन नंबर')} 
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={bookingData.customerPhone}
                          onChange={(e) => {
                            setBookingData({ ...bookingData, customerPhone: e.target.value });
                            setErrors({ ...errors, customerPhone: '' });
                          }}
                          className={`w-full px-4 py-3 pl-10 border-2 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 text-sm ${
                            errors.customerPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder={t('Enter your phone number', 'अपना फ़ोन नंबर दर्ज करें')}
                        />
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.customerPhone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1.5 flex items-center"
                        >
                          <FiAlertCircle className="w-3.5 h-3.5 mr-1" />
                          {errors.customerPhone}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Schedule Details - Compact */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stepTitles[2].color} rounded-xl flex items-center justify-center shadow-lg mr-3`}>
                        <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {t('Ritual Schedule', 'अनुष्ठान अनुसूची')}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {t('When and where shall we perform?', 'हम कब और कहाँ अनुष्ठान करें?')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Preferred Date - Compact */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                          <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-violet-600 dark:text-violet-400" />
                          {t('Preferred Date', 'पसंदीदा तिथि')} 
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="date"
                          value={bookingData.preferredDate}
                          onChange={(e) => {
                            setBookingData({ ...bookingData, preferredDate: e.target.value });
                            setErrors({ ...errors, preferredDate: '' });
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          title={t('Preferred Date', 'पसंदीदा तिथि')}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm ${
                            errors.preferredDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors.preferredDate && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1.5 flex items-center"
                          >
                            <FiAlertCircle className="w-3.5 h-3.5 mr-1" />
                            {errors.preferredDate}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Preferred Time - Compact */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                          <FiClock className="w-3.5 h-3.5 mr-1.5 text-violet-600 dark:text-violet-400" />
                          {t('Preferred Time', 'पसंदीदा समय')} 
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="time"
                          value={bookingData.preferredTime}
                          onChange={(e) => {
                            setBookingData({ ...bookingData, preferredTime: e.target.value });
                            setErrors({ ...errors, preferredTime: '' });
                          }}
                          title={t('Preferred Time', 'पसंदीदा समय')}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm ${
                            errors.preferredTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors.preferredTime && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1.5 flex items-center"
                          >
                            <FiAlertCircle className="w-3.5 h-3.5 mr-1" />
                            {errors.preferredTime}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* Location - Compact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiMapPin className="w-3.5 h-3.5 mr-1.5 text-violet-600 dark:text-violet-400" />
                        {t('Location/Address', 'स्थान/पता')} 
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          value={bookingData.location}
                          onChange={(e) => {
                            setBookingData({ ...bookingData, location: e.target.value });
                            setErrors({ ...errors, location: '' });
                          }}
                          rows={2}
                          className={`w-full px-4 py-3 pl-10 border-2 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none placeholder:text-gray-400 text-sm ${
                            errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder={t('Enter complete address', 'पूरा पता दर्ज करें')}
                        />
                        <FiMapPin className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.location && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1.5 flex items-center"
                        >
                          <FiAlertCircle className="w-3.5 h-3.5 mr-1" />
                          {errors.location}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Special Notes - Compact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300 flex items-center">
                        <FiFileText className="w-3.5 h-3.5 mr-1.5 text-violet-600 dark:text-violet-400" />
                        {t('Special Notes', 'विशेष नोट')} 
                        <span className="text-gray-400 ml-1.5 text-[10px] font-normal">
                          ({t('Optional', 'वैकल्पिक')})
                        </span>
                      </label>
                      <div className="relative">
                        <textarea
                          value={bookingData.specialNotes}
                          onChange={(e) => setBookingData({ ...bookingData, specialNotes: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none placeholder:text-gray-400 text-sm"
                          placeholder={t('Any special requirements', 'कोई विशेष आवश्यकताएं')}
                        />
                        <FiFileText className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>

                    {/* Price Summary Card - Compact */}
                    {selectedService && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative mt-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 p-4 sm:p-5 rounded-xl border-2 border-amber-200 dark:border-amber-800 shadow-md overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
                          <GiLotusFlower className="w-full h-full text-amber-600" />
                        </div>

                        <div className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1.5 font-semibold uppercase tracking-wide flex items-center">
                                <FiStar className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                                {t('Selected Service', 'चयनित सेवा')}
                              </p>
                              <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1">
                                {language === 'en' ? selectedService.name_en : selectedService.name_hi}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                                <FiClock className="w-3 h-3 mr-1" />
                                {selectedService.duration_minutes} {t('minutes', 'मिनट')}
                              </p>
                            </div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <span className="text-2xl sm:text-3xl">{selectedService.icon || '✨'}</span>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent mb-4"></div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center">
                              <FaOm className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-amber-600 dark:text-amber-400" />
                              {t('Investment', 'निवेश')}
                            </span>
                            <div className="text-right">
                              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                                ₹{selectedService.base_price.toLocaleString()}
                              </div>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                {t('Base price', 'आधार मूल्य')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons - Compact */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02, x: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={prevStep}
                  className="px-6 py-2.5 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg font-bold text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg group"
                >
                  <FiArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  <span>{t('Previous', 'पिछला')}</span>
                </motion.button>
              )}

              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className={`${step === 1 ? 'w-full' : 'ml-auto'} px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">{t('Continue', 'जारी रखें')}</span>
                  <FiArrowRight className="w-4 h-4 relative transform group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ml-auto px-6 py-2.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin w-4 h-4 relative" />
                      <span className="relative">{t('Confirming...', 'पुष्टि हो रही है...')}</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 relative" strokeWidth={3} />
                      <span className="relative">{t('Confirm Booking', 'बुकिंग पुष्टि करें')}</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trust Badges - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {[
            { icon: FiCheck, text: t('Secure', 'सुरक्षित'), color: 'from-green-500 to-emerald-600' },
            { icon: FiStar, text: t('Certified', 'प्रमाणित'), color: 'from-yellow-500 to-orange-600' },
            { icon: FiZap, text: t('Quick', 'त्वरित'), color: 'from-blue-500 to-cyan-600' },
          ].map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className={`w-7 h-7 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center`}>
                <badge.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}