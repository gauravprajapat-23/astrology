-- Create staff management system tables
-- Migration: 20260129120000

-- Create staff_roles table
CREATE TABLE IF NOT EXISTS staff_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en text NOT NULL,
    name_hi text NOT NULL,
    description_en text,
    description_hi text,
    permissions jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create staff_members table
CREATE TABLE IF NOT EXISTS staff_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    role_id uuid REFERENCES staff_roles(id),
    password_hash text,
    avatar_url text,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key text UNIQUE NOT NULL,
    setting_value jsonb,
    setting_type text DEFAULT 'string',
    description_en text,
    description_hi text,
    category text DEFAULT 'general',
    is_public boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for staff roles
CREATE POLICY "Enable read access for authenticated users" ON staff_roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for admin users" ON staff_roles
    FOR ALL USING (exists (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND (email = 'admin@divinerituals.com' OR email = 'admin@astrology.com')
    ));

-- Create policies for staff members
CREATE POLICY "Enable read access for authenticated users" ON staff_members
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for admin users" ON staff_members
    FOR ALL USING (exists (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND (email = 'admin@divinerituals.com' OR email = 'admin@astrology.com')
    ));

-- Create policies for site settings
CREATE POLICY "Enable read access for public settings" ON site_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Enable read/write access for authenticated users" ON site_settings
    FOR ALL USING (exists (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND (email = 'admin@divinerituals.com' OR email = 'admin@astrology.com')
    ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_staff_roles_updated_at 
    BEFORE UPDATE ON staff_roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_members_updated_at 
    BEFORE UPDATE ON staff_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin role if not exists
INSERT INTO staff_roles (name_en, name_hi, description_en, description_hi, permissions, is_active) 
VALUES 
    ('Administrator', 'प्रबंधक', 'Full administrative access to all features', 'सभी सुविधाओं तक पूर्ण प्रशासनिक पहुंच', 
     '["admin", "staff_management", "site_settings", "content_management", "analytics", "testimonials", "gallery", "bookings", "appointments", "customer_service"]', 
     true),
    ('Editor', 'संपादक', 'Access to content management and testimonials', 'सामग्री प्रबंधन और प्रशंसापत्रों तक पहुंच', 
     '["content_management", "testimonials", "gallery", "customer_service"]', 
     true),
    ('Support Staff', 'सहायता कर्मचारी', 'Access to customer service and bookings', 'ग्राहक सेवा और बुकिंग तक पहुंच', 
     '["bookings", "customer_service"]', 
     true)
ON CONFLICT (name_en) DO NOTHING;

-- Insert default site settings if not exists
INSERT INTO site_settings (setting_key, setting_value, setting_type, description_en, description_hi, category, is_public) 
VALUES 
    ('site_name', '{"en": "Divine Rituals", "hi": "दिवाइन रिटुअल्स"}', 'json', 'Website name', 'वेबसाइट का नाम', 'general', true),
    ('site_description', '{"en": "Authentic Vedic Rituals & Astrology Services", "hi": "प्रामाणिक वैदिक अनुष्ठान और ज्योतिष सेवाएं"}', 'json', 'Website description', 'वेबसाइट विवरण', 'general', true),
    ('contact_email', 'info@divinerituals.com', 'string', 'Contact email address', 'संपर्क ईमेल पता', 'contact', true),
    ('contact_phone', '+1234567890', 'string', 'Contact phone number', 'संपर्क फ़ोन नंबर', 'contact', true),
    ('maintenance_mode', false, 'boolean', 'Enable maintenance mode', 'रखरखाव मोड सक्षम करें', 'system', false),
    ('enable_testimonials', true, 'boolean', 'Enable testimonials section', 'प्रशंसापत्र अनुभाग सक्षम करें', 'content', true),
    ('enable_bookings', true, 'boolean', 'Enable booking system', 'बुकिंग प्रणाली सक्षम करें', 'system', true)
ON CONFLICT (setting_key) DO NOTHING;