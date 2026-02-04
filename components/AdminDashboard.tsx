'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiCalendar, FiStar, FiSettings, FiUser, FiLogOut, FiVideo, FiImage, FiSliders, FiBarChart2, FiDatabase, FiCode } from 'react-icons/fi';
import { supabase, type Service, type Booking, type Testimonial, type Astrologer, type Video, type CarouselItem, type GalleryImage, type StaffMember, type StaffRole, type SiteSetting } from '@/lib/supabase';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import ServicesTab from '@/admin-components/services/ServicesTab';
import AddServiceModal from '@/admin-components/modals/AddServiceModal';
import EditServiceModal from '@/admin-components/modals/EditServiceModal';
import AddStaffModal from '@/admin-components/modals/AddStaffModal';
import EditStaffModal from '@/admin-components/modals/EditStaffModal';
import AddRoleModal from '@/admin-components/modals/AddRoleModal';
import EditRoleModal from '@/admin-components/modals/EditRoleModal';
import AddGalleryModal from '@/admin-components/modals/AddGalleryModal';
import EditGalleryModal from '@/admin-components/modals/EditGalleryModal';
import AddVideoModal from '@/admin-components/modals/AddVideoModal';
import EditVideoModal from '@/admin-components/modals/EditVideoModal';
import AddCarouselModal from '@/admin-components/modals/AddCarouselModal';
import EditCarouselModal from '@/admin-components/modals/EditCarouselModal';
import AddAstrologerModal from '@/admin-components/modals/AddAstrologerModal';
import EditAstrologerModal from '@/admin-components/modals/EditAstrologerModal';
import AddSettingsModal from '@/admin-components/modals/AddSettingsModal';
import OverviewTab from '@/admin-components/overview/OverviewTab';
import ToastNotification from '@/admin-components/shared/ToastNotification';
import TestimonialsTab from '@/admin-components/testimonials/TestimonialsTab';
import RolesTab from '@/admin-components/roles/RolesTab';
import StaffTab from '@/admin-components/staff/StaffTab';
import GalleryTab from '@/admin-components/gallery/GalleryTab';
import BookingsTab from '@/admin-components/bookings/BookingsTab';
import VideosTab from '@/admin-components/videos/VideosTab';
import CarouselTab from '@/admin-components/carousel/CarouselTab';
import SettingsTab from '@/admin-components/settings/SettingsTab';
import AstrologersTab from '@/admin-components/astrologers/AstrologersTab';
import BackupTab from '@/admin-components/backup/BackupTab';
import SQLBackupTab from '@/admin-components/backup/SQLBackupTab';


export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const { logout, adminName } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State Management
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // State for other modals
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showEditVideoModal, setShowEditVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showAddCarouselModal, setShowAddCarouselModal] = useState(false);
  const [showEditCarouselModal, setShowEditCarouselModal] = useState(false);
  const [editingCarouselItem, setEditingCarouselItem] = useState<CarouselItem | null>(null);
  const [showAddAstrologerModal, setShowAddAstrologerModal] = useState(false);
  const [showEditAstrologerModal, setShowEditAstrologerModal] = useState(false);
  const [editingAstrologer, setEditingAstrologer] = useState<Astrologer | null>(null);
  const [showAddSettingsModal, setShowAddSettingsModal] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Functions
  const fetchServices = async () => {
    setLoading(true);
    try {
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for services');
        setServices([
          {
            id: '1',
            name_en: 'Wedding Ceremony',
            name_hi: 'विवाह समारोह',
            description_en: 'Traditional wedding ceremony',
            description_hi: 'पारंपरिक विवाह समारोह',
            duration_minutes: 120,
            base_price: 15000,
            icon: '💍',
            category: 'Rituals',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      showError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for bookings');
        setBookings([
          {
            id: '1',
            service_id: '1',
            customer_name: 'Rajesh Kumar',
            customer_email: 'rajesh@example.com',
            customer_phone: '+91-9876543210',
            preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            preferred_time: '10:00',
            location: 'Delhi, India',
            special_notes: 'Please arrive early for preparations',
            status: 'pending',
            total_amount: 15000,
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
              astrologer_id: null,
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for testimonials');
        setTestimonials([
          {
            id: '1',
            customer_name: 'Priya Sharma',
            customer_photo: '',
            rating: 5,
            review_en: 'Excellent service! The ceremony was conducted beautifully.',
            review_hi: 'उत्कृष्ट सेवा! समारोह सुंदरता से आयोजित किया गया।',
            ritual_name: 'Wedding Ceremony',
            is_featured: true,
            email: 'priya@example.com',
            phone: '+91-9876543211',
            service_used: 'Wedding Ceremony',
            status: 'approved',
            verified: true,
            response: 'Thank you for your kind words!',
            created_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      showError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for astrologers');
        setAstrologers([
          {
            id: '1',
            name_en: 'Pandit Rajesh Sharma',
            name_hi: 'पंडित राजेश शर्मा',
            bio_en: '20 years of experience in Vedic astrology',
            bio_hi: 'वैदिक ज्योतिष में 20 वर्ष का अनुभव',
            photo_url: '',
            experience_years: 20,
            specializations: ['Vedic Astrology', 'Horoscope Analysis'],
            is_active: true,
            created_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('astrologers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAstrologers(data || []);
    } catch (error) {
      console.error('Error fetching astrologers:', error);
      showError('Failed to fetch astrologers');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for videos');
        setVideos([
          {
            id: '1',
            title_en: 'Introduction to Vedic Rituals',
            title_hi: 'वैदिक अनुष्ठान का परिचय',
            description_en: 'Learn about traditional Vedic rituals',
            description_hi: 'पारंपरिक वैदिक अनुष्ठान के बारे में जानें',
            youtube_url: 'https://www.youtube.com/watch?v=example',
            thumbnail_url: 'https://img.youtube.com/vi/example/maxresdefault.jpg',
            duration: '15:30',
            category: 'Education',
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      showError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarouselItems = async () => {
    setLoading(true);
    try {
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for carousel items');
        setCarouselItems([
          {
            id: '1',
            title_en: 'Authentic Vedic Rituals',
            title_hi: 'प्रामाणिक वैदिक अनुष्ठान',
            description_en: 'Experience traditional ceremonies',
            description_hi: 'पारंपरिक समारोहों का अनुभव करें',
            image_url: 'https://images.pexels.com/photos/4051566/pexels-photo-4051566.jpeg?auto=compress&cs=tinysrgb&w=800',
            link: '/services',
            is_active: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setCarouselItems(data || []);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      showError('Failed to fetch carousel items');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffRoles = async () => {
    setLoading(true);
    try {
      console.log('Fetching staff roles...');
      
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      console.log('Supabase URL for roles:', supabaseUrl);
      
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for staff roles');
        // Mock data for development
        setStaffRoles([
          {
            id: '00000000-0000-0000-0000-000000000001',
            name_en: 'Administrator',
            name_hi: 'प्रशासक',
            description_en: 'Full system access',
            description_hi: 'पूर्ण सिस्टम पहुंच',
            permissions: ['admin', 'staff_management'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name_en: 'Content Manager',
            name_hi: 'सामग्री प्रबंधक',
            description_en: 'Manage content and testimonials',
            description_hi: 'सामग्री और प्रशंसापत्र प्रबंधित करें',
            permissions: ['content_management', 'testimonials', 'gallery'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      // Try fetching roles data
      const { data, error } = await supabase
        .from('staff_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Staff roles data:', data);
      console.log('Staff roles error:', error);
      
      if (error) {
        // Check if it's an RLS policy issue
        if (error.message?.includes('infinite recursion') || error.message?.includes('RLS')) {
          console.log('RLS Policy Issue Detected in staff_roles, using mock data...');
          setStaffRoles([
            {
              id: '00000000-0000-0000-0000-000000000001',
              name_en: 'Administrator',
              name_hi: 'प्रशासक',
              description_en: 'Full system access',
              description_hi: 'पूर्ण सिस्टम पहुंच',
              permissions: ['admin', 'staff_management'],
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '00000000-0000-0000-0000-000000000002',
              name_en: 'Content Manager',
              name_hi: 'सामग्री प्रबंधक',
              description_en: 'Manage content and testimonials',
              description_hi: 'सामग्री और प्रशंसापत्र प्रबंधित करें',
              permissions: ['content_management', 'testimonials', 'gallery'],
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
          return;
        }
        throw error;
      }
      
      setStaffRoles(data || []);
    } catch (error) {
      console.error('Error fetching staff roles:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        name: (error as Error).name
      });
      showError('Failed to fetch staff roles: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      console.log('Fetching staff members...');
      
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      console.log('Supabase URL:', supabaseUrl);
      
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for staff members');
        // Mock data for development
        setStaffMembers([
          {
            id: '00000000-0000-0000-0000-000000000001',
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@astrology.com',
            phone: '+91-9876543210',
            role_id: '00000000-0000-0000-0000-000000000001',
            password_hash: 'hashed_password',
            avatar_url: '',
            is_active: true,
            last_login: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: {
              id: '00000000-0000-0000-0000-000000000001',
              name_en: 'Administrator',
              name_hi: 'प्रशासक',
              description_en: 'Full system access',
              description_hi: 'पूर्ण सिस्टम पहुंच',
              permissions: ['admin', 'staff_management'],
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        ]);
        return;
      }
      
      // Attempt to fetch real staff members from Supabase
      try {
        const { data, error } = await supabase
          .from('staff_members')
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            role_id,
            avatar_url,
            is_active,
            last_login,
            created_at,
            updated_at,
            role:staff_roles(id, name_en, name_hi, description_en, description_hi, permissions, is_active)
          `)
          .order('created_at', { ascending: false });

        console.log('Staff members data:', data);
        console.log('Staff members error:', error);

        if (error) {
          console.warn('Failed to fetch staff_members (possible RLS). Attempting server-side fallback.', error.message || error);
          // Try server-side staff-list endpoint (requires SUPABASE_SERVICE_ROLE_KEY)
          try {
            const res = await fetch('/api/admin/staff-list');
            if (res.ok) {
              const json = await res.json();
              if (Array.isArray(json.staff)) {
                setStaffMembers(json.staff as StaffMember[]);
                return;
              }
            } else {
              const txt = await res.text();
              console.warn('Server staff-list lookup failed', res.status, txt);
            }
          } catch (e) {
            console.warn('Server staff-list fallback failed', e);
          }

          // Final fallback: use a single mock admin so UI remains usable
          setStaffMembers([
            {
              id: '00000000-0000-0000-0000-000000000001',
              first_name: 'Admin',
              last_name: 'User',
              email: 'admin@astrology.com',
              phone: '+91-9876543210',
            password_hash: 'hashed_password',
              role_id: '00000000-0000-0000-000000000001',
              avatar_url: '',
              is_active: true,
              last_login: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              role: {
                id: '00000000-0000-0000-0000-000000000001',
                name_en: 'Administrator',
                name_hi: 'प्रशासक',
                description_en: 'Full system access',
                description_hi: 'पूर्ण सिस्टम पहुंच',
                permissions: ['admin', 'staff_management'],
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ]);
          return;
        }

        // Normalize joined role (returned as array) to `role` object
        setStaffMembers((data || []).map((member: any) => {
          const role = Array.isArray(member.role) ? member.role[0] : member.role;
          return { ...member, role, role_id: member.role_id || (role?.id ?? null) } as StaffMember;
        }));
      } catch (err) {
        console.error('Error fetching staff members:', err);
        showError('Failed to fetch staff members: ' + ((err as Error).message || err));
        // Fallback to mock data to keep UI usable
        setStaffMembers([
          {
            id: '00000000-0000-0000-0000-000000000001',
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@astrology.com',
            phone: '+91-9876543210',
            role_id: '00000000-0000-0000-0000-000000000001',
            password_hash: 'hashed_password',
            avatar_url: '',
            is_active: true,
            last_login: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: {
              id: '00000000-0000-0000-0000-000000000001',
              name_en: 'Administrator',
              name_hi: 'प्रशासक',
              description_en: 'Full system access',
              description_hi: 'पूर्ण सिस्टम पहुंच',
              permissions: ['admin', 'staff_management'],
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        name: (error as Error).name,
        stack: (error as Error).stack
      });
      showError('Failed to fetch staff members: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteSettings = async () => {
    setLoading(true);
    try {
      console.log('Fetching site settings...');
      
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      console.log('Supabase URL for settings:', supabaseUrl);
      
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for site settings');
        // Mock data for development
        setSiteSettings([
          {
            id: '00000000-0000-0000-0000-000000000001',
            setting_key: 'site_name',
            setting_value: { en: 'Divine Rituals', hi: 'दिवाइन रिटुअल्स' },
            setting_type: 'json',
            description_en: 'Website name',
            description_hi: 'वेबसाइट का नाम',
            category: 'general',
            is_public: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            setting_key: 'maintenance_mode',
            setting_value: false,
            setting_type: 'boolean',
            description_en: 'Enable maintenance mode',
            description_hi: 'रखरखाव मोड सक्षम करें',
            category: 'system',
            is_public: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '00000000-0000-0000-0000-000000000003',
            setting_key: 'contact_email',
            setting_value: 'info@divinerituals.com',
            setting_type: 'string',
            description_en: 'Contact email address',
            description_hi: 'संपर्क ईमेल पता',
            category: 'contact',
            is_public: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      // Try fetching settings data
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });
      
      console.log('Site settings data:', data);
      console.log('Site settings error:', error);
      
      if (error) {
        // Check if it's an RLS policy issue
        if (error.message?.includes('infinite recursion') || error.message?.includes('RLS')) {
          console.log('RLS Policy Issue Detected in site_settings, using mock data...');
          setSiteSettings([
            {
              id: '1',
              setting_key: 'site_name',
              setting_value: { en: 'Divine Rituals', hi: 'दिवाइन रिटुअल्स' },
              setting_type: 'json',
              description_en: 'Website name',
              description_hi: 'वेबसाइट का नाम',
              category: 'general',
              is_public: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              setting_key: 'maintenance_mode',
              setting_value: false,
              setting_type: 'boolean',
              description_en: 'Enable maintenance mode',
              description_hi: 'रखरखाव मोड सक्षम करें',
              category: 'system',
              is_public: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '3',
              setting_key: 'contact_email',
              setting_value: 'info@divinerituals.com',
              setting_type: 'string',
              description_en: 'Contact email address',
              description_hi: 'संपर्क ईमेल पता',
              category: 'contact',
              is_public: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
          return;
        }
        throw error;
      }
      
      setSiteSettings(data || []);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        name: (error as Error).name
      });
      showError('Failed to fetch site settings: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      console.log('Fetching gallery images...');
      
      // Check if we're using placeholder credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (supabaseUrl.includes('placeholder')) {
        console.log('Using mock data for gallery images');
        // Mock data for development
        setGalleryImages([
          {
            id: '00000000-0000-0000-0000-000000000001',
            title_en: 'Diya Lighting Ceremony',
            title_hi: 'दीप जलाने का समारोह',
            image_url: 'https://images.pexels.com/photos/6157/top-view-photo-of-candles-beside-spring-flowers.jpg?auto=compress&cs=tinysrgb&w=800',
            description_en: 'Traditional diya lighting ceremony',
            description_hi: 'पारंपरिक दीप जलाने का समारोह',
            category: 'ceremony',
            sort_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });
      
      console.log('Gallery images data:', data);
      console.log('Gallery images error:', error);
      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      showError('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };


  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchServices(),
        fetchBookings(),
        fetchTestimonials(),
        fetchAstrologers(),
        fetchVideos(),
        fetchCarouselItems(),
        fetchStaffRoles(),
        fetchStaffMembers(),
        fetchSiteSettings(),
        fetchGalleryImages(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data based on active tab
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const tabFetchMap: { [key: string]: () => Promise<void> } = {
      services: fetchServices,
      bookings: fetchBookings,
      testimonials: fetchTestimonials,
      astrologers: fetchAstrologers,
      videos: fetchVideos,
      carousel: fetchCarouselItems,
      staff: fetchStaffMembers,
      roles: fetchStaffRoles,
      gallery: fetchGalleryImages,
      settings: fetchSiteSettings,
      backup: async () => {}, // No data fetching needed for backup tab
      sqlbackup: async () => {}, // No data fetching needed for SQL backup tab
      overview: fetchAllData,
    };

    const fetchFunction = tabFetchMap[activeTab];
    if (fetchFunction) {
      fetchFunction();
    }
  }, [activeTab]);

  // Helper Functions
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  // Service Handlers
  const handleAddService = () => {
    setShowAddServiceModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowEditServiceModal(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      showSuccess('Service deleted successfully!');
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      showError('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServiceStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      showSuccess('Service status updated!');
      await fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      showError('Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdded = () => {
    setShowAddServiceModal(false);
    showSuccess('Service added successfully!');
    fetchServices();
  };

  const handleServiceUpdated = () => {
    setShowEditServiceModal(false);
    setEditingService(null);
    showSuccess('Service updated successfully!');
    fetchServices();
  };

  // Staff Handlers
  const handleStaffAdded = () => {
    setShowAddStaffModal(false);
    showSuccess('Staff member added successfully!');
    fetchStaffMembers();
  };

  const handleStaffUpdated = () => {
    setShowEditStaffModal(false);
    setEditingStaff(null);
    showSuccess('Staff member updated successfully!');
    fetchStaffMembers();
  };

  const handleStaffDeleted = async (id: string) => {
    setLoading(true);
    try {
      // Delete from staff_members table
      const { error: staffError } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (staffError) throw staffError;

      // Delete from auth users
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) console.warn('Failed to delete auth user:', authError);

      showSuccess('Staff member deleted successfully!');
      fetchStaffMembers();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      showError('Failed to delete staff member');
    } finally {
      setLoading(false);
    }
  };

  // Role Handlers
  const handleRoleAdded = () => {
    setShowAddRoleModal(false);
    showSuccess('Role added successfully!');
    fetchStaffRoles();
  };

  const handleRoleUpdated = () => {
    setShowEditRoleModal(false);
    setEditingRole(null);
    showSuccess('Role updated successfully!');
    fetchStaffRoles();
  };

  const handleRoleDeleted = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('staff_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Role deleted successfully!');
      fetchStaffRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      showError('Failed to delete role');
    } finally {
      setLoading(false);
    }
  };

  // Gallery Handlers
  const handleImageAdded = () => {
    setShowAddImageModal(false);
    showSuccess('Image added successfully!');
    fetchGalleryImages();
  };

  const handleImageUpdated = () => {
    setShowEditImageModal(false);
    setEditingImage(null);
    showSuccess('Image updated successfully!');
    fetchGalleryImages();
  };

  const handleImageDeleted = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Image deleted successfully!');
      fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageStatusToggled = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Image status updated!');
      fetchGalleryImages();
    } catch (error) {
      console.error('Error updating image status:', error);
      showError('Failed to update image status');
    } finally {
      setLoading(false);
    }
  };

  // Video Handlers
  const handleVideoAdded = () => {
    setShowAddVideoModal(false);
    showSuccess('Video added successfully!');
    fetchVideos();
  };

  const handleVideoUpdated = () => {
    setShowEditVideoModal(false);
    setEditingVideo(null);
    showSuccess('Video updated successfully!');
    fetchVideos();
  };

  const handleVideoDeleted = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Video deleted successfully!');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      showError('Failed to delete video');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoStatusToggled = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Video status updated!');
      fetchVideos();
    } catch (error) {
      console.error('Error updating video status:', error);
      showError('Failed to update video status');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoFeaturedToggled = async (id: string) => {
    setLoading(true);
    try {
      const video = videos.find(v => v.id === id);
      if (!video) return;

      const { error } = await supabase
        .from('videos')
        .update({ is_featured: !video.is_featured })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Video featured status updated!');
      fetchVideos();
    } catch (error) {
      console.error('Error updating video featured status:', error);
      showError('Failed to update video featured status');
    } finally {
      setLoading(false);
    }
  };

  // Carousel Handlers
  const handleCarouselItemAdded = () => {
    setShowAddCarouselModal(false);
    showSuccess('Carousel item added successfully!');
    fetchCarouselItems();
  };

  const handleCarouselItemUpdated = () => {
    setShowEditCarouselModal(false);
    setEditingCarouselItem(null);
    showSuccess('Carousel item updated successfully!');
    fetchCarouselItems();
  };

  const handleCarouselItemDeleted = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Carousel item deleted successfully!');
      fetchCarouselItems();
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      showError('Failed to delete carousel item');
    } finally {
      setLoading(false);
    }
  };

  const handleCarouselItemStatusToggled = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_items')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Carousel item status updated!');
      fetchCarouselItems();
    } catch (error) {
      console.error('Error updating carousel item status:', error);
      showError('Failed to update carousel item status');
    } finally {
      setLoading(false);
    }
  };

  // Astrologer Handlers
  const handleAstrologerAdded = () => {
    setShowAddAstrologerModal(false);
    showSuccess('Astrologer added successfully!');
    fetchAstrologers();
  };

  const handleAstrologerUpdated = () => {
    setShowEditAstrologerModal(false);
    setEditingAstrologer(null);
    showSuccess('Astrologer updated successfully!');
    fetchAstrologers();
  };

  const handleAstrologerDeleted = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('astrologers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Astrologer deleted successfully!');
      fetchAstrologers();
    } catch (error) {
      console.error('Error deleting astrologer:', error);
      showError('Failed to delete astrologer');
    } finally {
      setLoading(false);
    }
  };

  const handleAstrologerStatusToggled = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('astrologers')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Astrologer status updated!');
      fetchAstrologers();
    } catch (error) {
      console.error('Error updating astrologer status:', error);
      showError('Failed to update astrologer status');
    } finally {
      setLoading(false);
    }
  };

  // Settings Handler
  const handleSettingsAdded = () => {
    setShowAddSettingsModal(false);
    showSuccess('Setting added successfully!');
    fetchSiteSettings();
  };

  // Menu Items
  const menuItems = [
    { id: 'overview', label: t('Overview', 'अवलोकन'), icon: FiBarChart2, color: 'from-purple-500 to-indigo-600' },
    { id: 'services', label: t('Services', 'सेवाएं'), icon: FiSettings, color: 'from-blue-500 to-cyan-600' },
    { id: 'bookings', label: t('Bookings', 'बुकिंग'), icon: FiCalendar, color: 'from-green-500 to-emerald-600' },
    { id: 'testimonials', label: t('Testimonials', 'प्रशंसापत्र'), icon: FiStar, color: 'from-yellow-500 to-orange-600' },
    { id: 'astrologers', label: t('Astrologers', 'ज्योतिषी'), icon: FiUser, color: 'from-pink-500 to-rose-600' },
    { id: 'videos', label: t('Videos', 'वीडियो'), icon: FiVideo, color: 'from-red-500 to-pink-600' },
    { id: 'carousel', label: t('Carousel', 'कैरोसेल'), icon: FiImage, color: 'from-teal-500 to-cyan-600' },
    { id: 'gallery', label: t('Gallery', 'गैलरी'), icon: FiImage, color: 'from-indigo-500 to-purple-600' },
    { id: 'staff', label: t('Staff', 'कर्मचारी'), icon: FiUsers, color: 'from-emerald-500 to-green-600' },
    { id: 'roles', label: t('Roles', 'भूमिकाएं'), icon: FiUser, color: 'from-cyan-500 to-blue-600' },
    { id: 'settings', label: t('Settings', 'सेटिंग्स'), icon: FiSliders, color: 'from-gray-500 to-gray-600' },
    { id: 'backup', label: t('Backup', 'बैकअप'), icon: FiDatabase, color: 'from-blue-500 to-cyan-600' },
    { id: 'sqlbackup', label: t('SQL Backup', 'SQL बैकअप'), icon: FiCode, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 dark:from-saffron-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-2">
                {t('Admin Dashboard', 'एडमिन डैशबोर्ड')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('Welcome back', 'स्वागत है')},{' '}
                <span className="font-semibold text-saffron-600 dark:text-saffron-400">{adminName || 'Admin'}</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">{t('Logout', 'लॉगआउट')}</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 sticky top-6">
              <nav className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group relative overflow-hidden flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                        activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-saffron-50 hover:to-orange-50 dark:hover:from-saffron-900/20 dark:hover:to-orange-900/20'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                          activeTab === item.id ? 'animate-pulse' : ''
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl p-8"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <OverviewTab
                    services={services}
                    bookings={bookings}
                    testimonials={testimonials}
                    astrologers={astrologers}
                    videos={videos}
                    carouselItems={carouselItems}
                  />
                )}

                {activeTab === 'services' && (
                  <ServicesTab
                    services={services}
                    loading={loading}
                    onAddService={handleAddService}
                    onEditService={handleEditService}
                    onDeleteService={handleDeleteService}
                    onToggleStatus={handleToggleServiceStatus}
                  />
                )}

                {activeTab === 'testimonials' && (
                  <TestimonialsTab
                    testimonials={testimonials}
                    loading={loading}
                    onApprove={(id) => console.log('Approve testimonial', id)}
                    onReject={(id) => console.log('Reject testimonial', id)}
                    onDelete={(id) => console.log('Delete testimonial', id)}
                    onFeature={(id) => console.log('Feature testimonial', id)}
                  />
                )}

                {activeTab === 'roles' && (
                  <RolesTab
                    roles={staffRoles}
                    loading={loading}
                    onAddRole={() => setShowAddRoleModal(true)}
                    onEditRole={(role) => {
                      setEditingRole(role);
                      setShowEditRoleModal(true);
                    }}
                    onDeleteRole={handleRoleDeleted}
                  />
                )}

                {activeTab === 'staff' && (
                  <StaffTab
                    staff={staffMembers}
                    roles={staffRoles}
                    loading={loading}
                    onAddStaff={() => setShowAddStaffModal(true)}
                    onEditStaff={(staff) => {
                      setEditingStaff(staff);
                      setShowEditStaffModal(true);
                    }}
                    onDeleteStaff={handleStaffDeleted}
                  />
                )}

                {activeTab === 'gallery' && (
                  <GalleryTab
                    images={galleryImages}
                    loading={loading}
                    onAddImage={() => setShowAddImageModal(true)}
                    onEditImage={(image) => {
                      setEditingImage(image);
                      setShowEditImageModal(true);
                    }}
                    onDeleteImage={handleImageDeleted}
                    onToggleStatus={handleImageStatusToggled}
                  />
                )}

                {activeTab === 'bookings' && (
                  <BookingsTab
                    bookings={bookings}
                    loading={loading}
                    onApprove={(id) => console.log('Approve booking', id)}
                    onReject={(id) => console.log('Reject booking', id)}
                    onDelete={(id) => console.log('Delete booking', id)}
                    onViewDetails={(booking) => console.log('View booking details', booking)}
                  />
                )}

                {activeTab === 'videos' && (
                  <VideosTab
                    videos={videos}
                    loading={loading}
                    onAddVideo={() => setShowAddVideoModal(true)}
                    onEditVideo={(video) => {
                      setEditingVideo(video);
                      setShowEditVideoModal(true);
                    }}
                    onDeleteVideo={handleVideoDeleted}
                    onToggleStatus={handleVideoStatusToggled}
                    onToggleFeature={handleVideoFeaturedToggled}
                  />
                )}

                {activeTab === 'carousel' && (
                  <CarouselTab
                    carouselItems={carouselItems}
                    loading={loading}
                    onAddItem={() => setShowAddCarouselModal(true)}
                    onEditItem={(item) => {
                      setEditingCarouselItem(item);
                      setShowEditCarouselModal(true);
                    }}
                    onDeleteItem={handleCarouselItemDeleted}
                    onToggleStatus={handleCarouselItemStatusToggled}
                    onReorder={(items) => console.log('Reorder carousel items', items)}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab
                    settings={siteSettings}
                    loading={loading}
                    onSaveSettings={(settings) => console.log('Save settings', settings)}
                  />
                )}

                {activeTab === 'astrologers' && (
                  <AstrologersTab
                    astrologers={astrologers}
                    loading={loading}
                    onAddAstrologer={() => setShowAddAstrologerModal(true)}
                    onEditAstrologer={(astrologer) => {
                      setEditingAstrologer(astrologer);
                      setShowEditAstrologerModal(true);
                    }}
                    onDeleteAstrologer={handleAstrologerDeleted}
                    onToggleStatus={handleAstrologerStatusToggled}
                  />
                )}

                {activeTab === 'backup' && (
                  <BackupTab />
                )}

                {activeTab === 'sqlbackup' && (
                  <SQLBackupTab />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        {showAddServiceModal && (
          <AddServiceModal
            onClose={() => setShowAddServiceModal(false)}
            onSuccess={handleServiceAdded}
            onError={showError}
          />
        )}

        {showEditServiceModal && editingService && (
          <EditServiceModal
            service={editingService}
            onClose={() => {
              setShowEditServiceModal(false);
              setEditingService(null);
            }}
            onSuccess={handleServiceUpdated}
            onError={showError}
          />
        )}

        {/* Staff Modals */}
        {showAddStaffModal && (
          <AddStaffModal
            roles={staffRoles}
            onClose={() => setShowAddStaffModal(false)}
            onSuccess={handleStaffAdded}
            onError={showError}
          />
        )}

        {showEditStaffModal && editingStaff && (
          <EditStaffModal
            staff={editingStaff}
            roles={staffRoles}
            onClose={() => {
              setShowEditStaffModal(false);
              setEditingStaff(null);
            }}
            onSuccess={handleStaffUpdated}
            onError={showError}
          />
        )}

        {/* Role Modals */}
        {showAddRoleModal && (
          <AddRoleModal
            onClose={() => setShowAddRoleModal(false)}
            onSuccess={handleRoleAdded}
            onError={showError}
          />
        )}

        {showEditRoleModal && editingRole && (
          <EditRoleModal
            role={editingRole}
            onClose={() => {
              setShowEditRoleModal(false);
              setEditingRole(null);
            }}
            onSuccess={handleRoleUpdated}
            onError={showError}
          />
        )}

        {/* Gallery Modals */}
        {showAddImageModal && (
          <AddGalleryModal
            onClose={() => setShowAddImageModal(false)}
            onSuccess={handleImageAdded}
            onError={showError}
          />
        )}

        {showEditImageModal && editingImage && (
          <EditGalleryModal
            image={editingImage}
            onClose={() => {
              setShowEditImageModal(false);
              setEditingImage(null);
            }}
            onSuccess={handleImageUpdated}
            onError={showError}
          />
        )}

        {/* Video Modals */}
        {showAddVideoModal && (
          <AddVideoModal
            onClose={() => setShowAddVideoModal(false)}
            onSuccess={handleVideoAdded}
            onError={showError}
          />
        )}

        {showEditVideoModal && editingVideo && (
          <EditVideoModal
            video={editingVideo}
            onClose={() => {
              setShowEditVideoModal(false);
              setEditingVideo(null);
            }}
            onSuccess={handleVideoUpdated}
            onError={showError}
          />
        )}

        {/* Carousel Modals */}
        {showAddCarouselModal && (
          <AddCarouselModal
            onClose={() => setShowAddCarouselModal(false)}
            onSuccess={handleCarouselItemAdded}
            onError={showError}
          />
        )}

        {showEditCarouselModal && editingCarouselItem && (
          <EditCarouselModal
            item={editingCarouselItem}
            onClose={() => {
              setShowEditCarouselModal(false);
              setEditingCarouselItem(null);
            }}
            onSuccess={handleCarouselItemUpdated}
            onError={showError}
          />
        )}

        {/* Astrologer Modals */}
        {showAddAstrologerModal && (
          <AddAstrologerModal
            onClose={() => setShowAddAstrologerModal(false)}
            onSuccess={handleAstrologerAdded}
            onError={showError}
          />
        )}

        {showEditAstrologerModal && editingAstrologer && (
          <EditAstrologerModal
            astrologer={editingAstrologer}
            onClose={() => {
              setShowEditAstrologerModal(false);
              setEditingAstrologer(null);
            }}
            onSuccess={handleAstrologerUpdated}
            onError={showError}
          />
        )}

        {/* Settings Modal */}
        {showAddSettingsModal && (
          <AddSettingsModal
            onClose={() => setShowAddSettingsModal(false)}
            onSuccess={handleSettingsAdded}
            onError={showError}
          />
        )}

        {/* Toast Notifications */}
        {successMessage && (
          <ToastNotification
            message={successMessage} 
            type="success" 
            onClose={() => setSuccessMessage('')} 
          />
        )}
        {errorMessage && (
          <ToastNotification 
            message={errorMessage} 
            type="error" 
            onClose={() => setErrorMessage('')} 
          />
        )}
      </div>
    </section>
  );
}
