-- Add videos and carousel tables
-- Migration: 20260129153000

-- Create videos table
create table if not exists public.videos (
    id uuid default gen_random_uuid() primary key,
    title_en text not null,
    title_hi text not null,
    description_en text,
    description_hi text,
    youtube_url text not null,
    thumbnail_url text,
    duration text,
    category text not null default 'General',
    is_featured boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create carousel_items table
create table if not exists public.carousel_items (
    id uuid default gen_random_uuid() primary key,
    title_en text not null,
    title_hi text not null,
    description_en text,
    description_hi text,
    image_url text not null,
    link text,
    is_active boolean default true,
    sort_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security)
alter table public.videos enable row level security;
alter table public.carousel_items enable row level security;

-- Create policies for public read access
create policy "Enable read access for all users" on public.videos
    for select using (true);

create policy "Enable read access for all users" on public.carousel_items
    for select using (true);

-- Create policies for admin access
create policy "Enable all access for admin users" on public.videos
    for all using (exists (
        select 1 from auth.users 
        where id = auth.uid() 
        and email = 'admin@divinerituals.com'
    ));

create policy "Enable all access for admin users" on public.carousel_items
    for all using (exists (
        select 1 from auth.users 
        where id = auth.uid() 
        and email = 'admin@divinerituals.com'
    ));

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Create triggers for updated_at
create trigger update_videos_updated_at 
    before update on public.videos 
    for each row 
    execute function update_updated_at_column();

create trigger update_carousel_items_updated_at 
    before update on public.carousel_items 
    for each row 
    execute function update_updated_at_column();

-- Insert sample data for videos
insert into public.videos (title_en, title_hi, description_en, description_hi, youtube_url, category, is_featured, duration) values
('Introduction to Vedic Astrology', 'वैदिक ज्योतिष का परिचय', 'Learn the basics of Vedic astrology and its significance in our lives', 'वैदिक ज्योतिष की मूल बातों और हमारे जीवन में इसके महत्व को सीखें', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Astrology', true, '15:30'),
('Graha Shanti Puja Ritual', 'ग्रह शांति पूजा अनुष्ठान', 'Complete guide to performing Graha Shanti Puja for planetary peace', 'ग्रह शांति पूजा करने के लिए पूर्ण मार्गदर्शन और ग्रहों की शांति के लिए', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rituals', true, '22:15'),
('Benefits of Havan Ceremony', 'हवन समारोह के लाभ', 'Discover the spiritual and health benefits of performing Havan ceremonies', 'हवन समारोह करने के आध्यात्मिक और स्वास्थ्य लाभों की खोज करें', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Havan', false, '18:45');

-- Insert sample data for carousel
insert into public.carousel_items (title_en, title_hi, description_en, description_hi, image_url, link, sort_order) values
('Authentic Vedic Rituals', 'प्रामाणिक वैदिक अनुष्ठान', 'Experience traditional Hindu rituals performed by expert astrologers', 'विशेषज्ञ ज्योतिषियों द्वारा किए गए पारंपरिक हिंदू अनुष्ठानों का अनुभव करें', 'https://images.pexels.com/photos/8844892/pexels-photo-8844892.jpeg?auto=compress&cs=tinysrgb&w=1200', '/services', 1),
('Divine Blessings Await', 'दिव्य आशीर्वाद आपके लिए हैं', 'Bring prosperity and peace to your life through sacred ceremonies', 'पवित्र समारोहों के माध्यम से अपने जीवन में समृद्धि और शांति लाएं', 'https://images.pexels.com/photos/6157/top-view-photo-of-candles-beside-spring-flowers.jpg?auto=compress&cs=tinysrgb&w=1200', '/booking', 2),
('Expert Astrological Guidance', 'विशेषज्ञ ज्योतिष मार्गदर्शन', 'Get personalized astrological consultations from experienced Vedic scholars', 'अनुभवी वैदिक विद्वानों से व्यक्तिगत ज्योतिष परामर्श प्राप्त करें', 'https://images.pexels.com/photos/4051566/pexels-photo-4051566.jpeg?auto=compress&cs=tinysrgb&w=1200', '/astrologers', 3);