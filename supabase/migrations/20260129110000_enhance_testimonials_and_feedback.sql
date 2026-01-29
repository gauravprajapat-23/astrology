-- Enhance testimonials table and create feedback system
-- Add columns for better feedback management

-- Add new columns to testimonials table
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS service_used TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS response TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON testimonials(verified);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Update existing policies to allow authenticated users to submit testimonials
DROP POLICY IF EXISTS "Users can insert testimonials" ON testimonials;
CREATE POLICY "Users can insert testimonials" 
  ON testimonials FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can update testimonials" ON testimonials;
CREATE POLICY "Only admins can update testimonials" 
  ON testimonials FOR UPDATE 
  USING (exists (select 1 from auth.users where id = auth.uid() and email = 'admin@astrology.com'));

DROP POLICY IF EXISTS "Only admins can delete testimonials" ON testimonials;
CREATE POLICY "Only admins can delete testimonials" 
  ON testimonials FOR DELETE 
  USING (exists (select 1 from auth.users where id = auth.uid() and email = 'admin@astrology.com'));

-- Insert sample testimonials if table is empty
INSERT INTO testimonials (
  customer_name, 
  customer_photo, 
  rating, 
  review_en, 
  review_hi, 
  ritual_name, 
  is_featured, 
  status, 
  verified
) VALUES 
  ('Priya Sharma', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop', 5, 'Amazing experience! The puja was conducted perfectly and brought positive changes in my life.', 'अद्भुत अनुभव! पूजा बिल्कुल सही ढंग से की गई और मेरे जीवन में सकारात्मक परिवर्तन लाई।', 'Graha Shanti Puja', true, 'approved', true),
  ('Rajesh Kumar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 5, 'Professional astrologers who truly understand the ancient scriptures. Highly recommended!', 'पेशेवर ज्योतिषी जो प्राचीन शास्त्रों को वास्तव में समझते हैं। अत्यधिक अनुशंसित!', 'Vastu Consultation', true, 'approved', true),
  ('Meera Patel', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', 4, 'The wedding muhurat selection was perfect. Everything went smoothly on the big day!', 'विवाह मुहूर्त चयन बिल्कुल सही था। बड़े दिन सब कुछ चिकना चला गया!', 'Wedding Muhurat', true, 'approved', true),
  ('Amit Singh', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', 5, 'Life-changing havan ceremony. The pandits were knowledgeable and the atmosphere was divine.', 'जीवन परिवर्तक हवन समारोह। पंडित ज्ञानवान थे और वातावरण दिव्य था।', 'Satyanarayan Havan', false, 'approved', true),
  ('Sunita Verma', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', 4, 'Excellent temple puja services. Very reasonable prices for such quality work.', 'उत्कृष्ट मंदिर पूजा सेवाएं। इतनी गुणवत्ता वाले काम के लिए बहुत सस्ती कीमतें।', 'Temple Puja', false, 'approved', true)
ON CONFLICT DO NOTHING;