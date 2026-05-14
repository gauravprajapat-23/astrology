'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, FiArrowRight, FiArrowLeft, FiLoader, FiCalendar, 
  FiClock, FiMapPin, FiUser, FiMail, FiPhone, FiFileText, 
  FiStar, FiZap, FiX, FiUserCheck, FiBookOpen 
} from 'react-icons/fi';
import { GiLotusFlower, GiVortex } from 'react-icons/gi';
import { supabase, type Service, type Astrologer } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Link from 'next/link';

type BookingType = 'service' | 'astrologer';

type BookingData = {
  bookingType: BookingType;
  serviceId: string;
  astrologerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  specialNotes: string;
};

export default function CommonBookingForm() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<Service | Astrologer | null>(null);

  const [bookingData, setBookingData] = useState<BookingData>({
    bookingType: 'service',
    serviceId: '',
    astrologerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    specialNotes: '',
  });

  // Use the same dummy data as Services and Astrologers components
  const DUMMY_SERVICES: Service[] = [
    {
      id: '1',
      name_en: 'Rudrabhishek Puja',
      name_hi: 'रुद्राभिषेक पूजा',
      description_en: 'Sacred ritual bath to Lord Shiva with milk, honey, and holy water for spiritual purification and blessings.',
      description_hi: 'आध्यात्मिक शुद्धि और आशीर्वाद के लिए दूध, शहद और पवित्र जल के साथ भगवान शिव को पवित्र अनुष्ठान स्नान।',
      duration_minutes: 90,
      base_price: 2500,
      icon: 'shiva',
      category: 'puja',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name_en: 'Ganesh Puja',
      name_hi: 'गणेश पूजा',
      description_en: 'Worship of Lord Ganesha to remove obstacles and bring prosperity to new beginnings.',
      description_hi: 'बाधाओं को दूर करने और नई शुरुआत में समृद्धि लाने के लिए भगवान गणेश की पूजा।',
      duration_minutes: 60,
      base_price: 1500,
      icon: 'lotus',
      category: 'puja',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name_en: 'Navagraha Puja',
      name_hi: 'नवग्रह पूजा',
      description_en: 'Ritual worship of nine celestial bodies to harmonize planetary influences in your life.',
      description_hi: 'अपने जीवन में ग्रहों के प्रभावों को सामंजस्यपूर्ण बनाने के लिए नौ खगोलीय निकायों की अनुष्ठान पूजा।',
      duration_minutes: 120,
      base_price: 3500,
      icon: 'planet',
      category: 'astrology',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name_en: 'Marriage Matching',
      name_hi: 'विवाह मिलान',
      description_en: 'Comprehensive Kundali matching for marital compatibility using ancient Vedic astrology principles.',
      description_hi: 'प्राचीन वैदिक ज्योतिष सिद्धांतों का उपयोग करके वैवाहिक संगतता के लिए व्यापक कुंडली मिलान।',
      duration_minutes: 45,
      base_price: 1800,
      icon: 'rings',
      category: 'astrology',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  const DUMMY_ASTROLOGERS: Astrologer[] = [
    {
      id: '1',
      name_en: 'Dr. Rajesh Sharma',
      name_hi: 'डॉ. राजेश शर्मा',
      bio_en: 'Expert in Vedic astrology and Kundali matching with over 20 years of experience.',
      bio_hi: '20 वर्ष से अधिक के अनुभव के साथ वैदिक ज्योतिष और कुंडली मिलान में विशेषज्ञ।',
      photo_url: '',
      experience_years: 20,
      specializations: ['Kundali', 'Vastu', 'Marriage Matching'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name_en: 'Pandit Vikram Joshi',
      name_hi: 'पंडित विक्रम जोशी',
      bio_en: 'Specialist in Rudrabhishek and ancient Vedic rituals with deep spiritual knowledge.',
      bio_hi: 'गहन आध्यात्मिक ज्ञान के साथ रुद्राभिषेक और प्राचीन वैदिक अनुष्ठानों में विशेषज्ञ।',
      photo_url: '',
      experience_years: 15,
      specializations: ['Puja', 'Rituals', 'Spiritual Healing'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name_en: 'Acharya Meena Patel',
      name_hi: 'आचार्य मीना पटेल',
      bio_en: 'Renowned for accurate predictions and remedies in dosha nivaran.',
      bio_hi: 'दोष निवारण में सटीक भविष्यवाणियों और उपचारों के लिए प्रसिद्ध।',
      photo_url: '',
      experience_years: 18,
      specializations: ['Dosha Nivaran', 'Gemstones', 'Horoscope'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name_en: 'Guruji Anil Kumar',
      name_hi: 'गुरुजी अनिल कुमार',
      bio_en: 'Master of Vastu Shastra and planetary gemology consultations.',
      bio_hi: 'वास्तु शास्त्र और ग्रह रत्न विद्या परामर्श के मास्टर।',
      photo_url: '',
      experience_years: 25,
      specializations: ['Vastu', 'Gemology', 'Career Guidance'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  // Initialize with dummy data
  const [services, setServices] = useState<Service[]>(DUMMY_SERVICES);
  const [astrologers, setAstrologers] = useState<Astrologer[]>(DUMMY_ASTROLOGERS);

  const isSelectedItem = (item: Service | Astrologer | null): item is Service | Astrologer => {
    return item !== null;
  };

  const getItemId = (item: Service | Astrologer | null): string | null => {
    return isSelectedItem(item) ? item.id : null;
  };

  useEffect(() => {
    // No data fetching needed - using static data
    checkPreselectedItems();
  }, []);



  const checkPreselectedItems = () => {
    // Check for pre-selected service
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
      setBookingData(prev => ({ ...prev, bookingType: 'service', serviceId: selectedService }));
      const service = services.find(s => s.id === selectedService);
      if (service) setSelectedItem(service);
      localStorage.removeItem('selectedService');
    }

    // Check for pre-selected astrologer
    const selectedAstrologer = localStorage.getItem('selectedAstrologer');
    if (selectedAstrologer) {
      setBookingData(prev => ({ ...prev, bookingType: 'astrologer', astrologerId: selectedAstrologer }));
      const astrologer = astrologers.find(a => a.id === selectedAstrologer);
      if (astrologer) setSelectedItem(astrologer);
      localStorage.removeItem('selectedAstrologer');
    }
  };

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingData(prev => ({
      ...prev,
      bookingType: type,
      serviceId: type === 'service' ? prev.serviceId : '',
      astrologerId: type === 'astrologer' ? prev.astrologerId : '',
    }));
    setSelectedItem(null);
    setStep(2);
  };

  const handleItemSelect = (item: Service | Astrologer) => {
    if ('base_price' in item) {
      // It's a service
      setBookingData(prev => ({ ...prev, serviceId: item.id, astrologerId: '' }));
    } else {
      // It's an astrologer
      setBookingData(prev => ({ ...prev, astrologerId: item.id, serviceId: '' }));
    }
    setSelectedItem(item);
    setStep(3);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (bookingData.bookingType === 'service' && !bookingData.serviceId) {
        newErrors.serviceId = t('Please select a service', 'कृपया एक सेवा चुनें');
      }
      if (bookingData.bookingType === 'astrologer' && !bookingData.astrologerId) {
        newErrors.astrologerId = t('Please select an astrologer', 'कृपया एक ज्योतिषी चुनें');
      }
    }

    if (currentStep === 3) {
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

    if (currentStep === 4) {
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
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const bookingPayload = {
        service_id: bookingData.serviceId || null,
        astrologer_id: bookingData.astrologerId || null,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        preferred_date: bookingData.preferredDate,
        preferred_time: bookingData.preferredTime,
        location: bookingData.location,
        special_notes: bookingData.specialNotes,
        status: 'pending',
        total_amount: selectedItem ? ('base_price' in selectedItem ? selectedItem.base_price : 1500) : 0,
        payment_status: 'pending',
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingPayload]);

      if (error) throw error;
      
      setSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: t('Failed to submit booking', 'बुकिंग सबमिट करने में विफल') });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Booking Confirmed!', 'बुकिंग की पुष्टि!')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('Thank you for your booking. We will contact you shortly to confirm your appointment.', 'आपकी बुकिंग के लिए धन्यवाद। हम आपकी अपॉइंटमेंट की पुष्टि के लिए जल्द ही आपसे संपर्क करेंगे।')}
            </p>
            <div className="space-y-4">
              <Link 
                href="/"
                className="inline-block w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
              >
                {t('Back to Home', 'होम पर वापस जाएं')}
              </Link>
              <Link 
                href="/#contact"
                className="inline-block w-full py-3 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-xl font-bold hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('Contact Us', 'हमसे संपर्क करें')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 py-8 sm:py-12 lg:py-16">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        <div className="absolute inset-0 bg-mandala bg-repeat"></div>
      </div>
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl my-6">
            <FiBookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Book Your Consultation', 'अपना परामर्श बुक करें')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('Schedule a personalized session with our expert Vedic astrologers', 'हमारे विशेषज्ञ वैदिक ज्योतिषियों के साथ एक व्यक्तिगत सत्र निर्धारित करें')}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= num 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step > num ? <FiCheck className="w-5 h-5" /> : num}
                </div>
                <span className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                  {num === 1 && t('Type', 'प्रकार')}
                  {num === 2 && t('Select', 'चुनें')}
                  {num === 3 && t('Details', 'विवरण')}
                  {num === 4 && t('Schedule', 'अनुसूची')}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Booking Type Selection */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {t('What would you like to book?', 'आप क्या बुक करना चाहेंगे?')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleBookingTypeChange('service')}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    bookingData.bookingType === 'service'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                  }`}
                >
                  <div className="text-center">
                    <GiLotusFlower className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('Service', 'सेवा')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('Book a specific Vedic service or ritual', 'एक विशिष्ट वैदिक सेवा या अनुष्ठान बुक करें')}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => handleBookingTypeChange('astrologer')}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    bookingData.bookingType === 'astrologer'
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                  }`}
                >
                  <div className="text-center">
                    <GiVortex className="w-12 h-12 text-violet-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('Astrologer', 'ज्योतिषी')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('Book a consultation with a specific astrologer', 'एक विशिष्ट ज्योतिषी के साथ परामर्श बुक करें')}
                    </p>
                  </div>
                </button>
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={nextStep}
                  disabled={!bookingData.bookingType}
                  className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('Continue', 'जारी रखें')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Item Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookingData.bookingType === 'service' 
                    ? t('Select a Service', 'एक सेवा चुनें')
                    : t('Select an Astrologer', 'एक ज्योतिषी चुनें')
                  }
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={t('Go back', 'वापस जाएं')}
                  aria-label={t('Go back', 'वापस जाएं')}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {bookingData.bookingType === 'service' ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleItemSelect(service)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        getItemId(selectedItem) === service.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                      }`}
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? service.name_en : service.name_hi}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ₹{service.base_price} • {service.duration_minutes} {t('mins', 'मिनट')}
                      </p>
                    </div>
                  ))
                ) : (
                  astrologers.map((astrologer) => (
                    <div
                      key={astrologer.id}
                      onClick={() => handleItemSelect(astrologer)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        getItemId(selectedItem) === astrologer.id
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {astrologer.photo_url ? (
                          <img
                            src={astrologer.photo_url}
                            alt={language === 'en' ? astrologer.name_en : astrologer.name_hi}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                            <GiLotusFlower className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {language === 'en' ? astrologer.name_en : astrologer.name_hi}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {astrologer.experience_years} {t('Years Exp', 'वर्ष अनुभव')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('Back', 'वापस')}
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedItem}
                  className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('Continue', 'जारी रखें')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Steps 3-4: Customer Details and Scheduling */}
          {(step === 3 || step === 4) && (
            <motion.div
              key="step3-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Selected Item Preview */}
              {selectedItem && (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {bookingData.bookingType === 'service' 
                          ? (language === 'en' ? (selectedItem as Service).name_en : (selectedItem as Service).name_hi)
                          : (language === 'en' ? (selectedItem as Astrologer).name_en : (selectedItem as Astrologer).name_hi)
                        }
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {bookingData.bookingType === 'service' 
                          ? `₹${(selectedItem as Service).base_price} • ${(selectedItem as Service).duration_minutes} ${t('mins', 'मिनट')}`
                          : `${(selectedItem as Astrologer).experience_years} ${t('Years Experience', 'वर्ष अनुभव')}`
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium"
                    >
                      {t('Change', 'बदलें')}
                    </button>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {step === 3 ? t('Your Details', 'आपका विवरण') : t('Schedule Appointment', 'अपॉइंटमेंट निर्धारित करें')}
              </h2>

              <div className="space-y-6">
                {/* Step 3: Customer Details */}
                {step === 3 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Full Name', 'पूरा नाम')} *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={bookingData.customerName}
                            onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder={t('Enter your full name', 'अपना पूरा नाम दर्ज करें')}
                          />
                        </div>
                        {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Email Address', 'ईमेल पता')} *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={bookingData.customerEmail}
                            onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                          />
                        </div>
                        {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Phone Number', 'फ़ोन नंबर')} *
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={bookingData.customerPhone}
                            onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder={t('Enter your phone number', 'अपना फ़ोन नंबर दर्ज करें')}
                          />
                        </div>
                        {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Location', 'स्थान')} *
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={bookingData.location}
                            onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder={t('Enter your location', 'अपना स्थान दर्ज करें')}
                          />
                        </div>
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Special Notes', 'विशेष नोट्स')}
                      </label>
                      <div className="relative">
                        <FiFileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          value={bookingData.specialNotes}
                          onChange={(e) => setBookingData(prev => ({ ...prev, specialNotes: e.target.value }))}
                          rows={4}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder={t('Any special requirements or questions...', 'कोई विशेष आवश्यकता या प्रश्न...')}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Scheduling */}
                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Preferred Date', 'पसंदीदा तिथि')} *
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={bookingData.preferredDate}
                          onChange={(e) => setBookingData(prev => ({ ...prev, preferredDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Preferred Time', 'पसंदीदा समय')} *
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          value={bookingData.preferredTime}
                          onChange={(e) => setBookingData(prev => ({ ...prev, preferredTime: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('Back', 'वापस')}
                </button>
                {step === 4 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        <span>{t('Submitting...', 'सबमिट किया जा रहा है...')}</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        <span>{t('Confirm Booking', 'बुकिंग की पुष्टि करें')}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
                  >
                    {t('Continue', 'जारी रखें')}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}