import { createClient, SupabaseClient } from '@supabase/supabase-js';

const createSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDMyODQwMDAsImV4cCI6MTk1ODg2MDAwMH0.placeholder';

  return createClient(supabaseUrl, supabaseAnonKey);
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance && typeof window !== 'undefined') {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
};

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabase();
    if (client && prop in client) {
      return (client as any)[prop];
    }
    return undefined;
  }
});

export type Service = {
  id: string;
  name_en: string;
  name_hi: string;
  description_en: string;
  description_hi: string;
  duration_minutes: number;
  base_price: number;
  icon: string;
  category: string;
  is_active: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date: string;
  preferred_time: string;
  location: string;
  special_notes: string;
  status: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  customer_photo: string;
  rating: number;
  review_en: string;
  review_hi: string;
  ritual_name: string;
  is_featured: boolean;
  created_at: string;
};

export type Astrologer = {
  id: string;
  name_en: string;
  name_hi: string;
  bio_en: string;
  bio_hi: string;
  photo_url: string;
  experience_years: number;
  specializations: string[];
  is_active: boolean;
  created_at: string;
};

export type Video = {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CarouselItem = {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  image_url: string;
  link: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
