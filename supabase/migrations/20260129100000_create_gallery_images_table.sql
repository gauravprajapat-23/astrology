-- Create gallery_images table
create table if not exists gallery_images (
  id uuid default gen_random_uuid() primary key,
  title_en text not null,
  title_hi text not null,
  image_url text not null,
  description_en text,
  description_hi text,
  category text default 'general',
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table gallery_images enable row level security;

-- Create policies
create policy "Gallery images are viewable by everyone"
  on gallery_images for select
  using (true);

create policy "Only admins can insert gallery images"
  on gallery_images for insert
  using (exists (select 1 from auth.users where id = auth.uid() and email = 'admin@astrology.com'));

create policy "Only admins can update gallery images"
  on gallery_images for update
  using (exists (select 1 from auth.users where id = auth.uid() and email = 'admin@astrology.com'));

create policy "Only admins can delete gallery images"
  on gallery_images for delete
  using (exists (select 1 from auth.users where id = auth.uid() and email = 'admin@astrology.com'));

-- Create trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_gallery_images_updated_at
  before update on gallery_images
  for each row
  execute function update_updated_at_column();

-- Insert sample gallery images
insert into gallery_images (title_en, title_hi, image_url, category, sort_order) values
('Diya Lighting Ceremony', 'दीप जलाने का समारोह', 'https://images.pexels.com/photos/6157/top-view-photo-of-candles-beside-spring-flowers.jpg?auto=compress&cs=tinysrgb&w=800', 'ceremony', 1),
('Traditional Havan', 'पारंपरिक हवन', 'https://images.pexels.com/photos/4051566/pexels-photo-4051566.jpeg?auto=compress&cs=tinysrgb&w=800', 'havan', 2),
('Wedding Muhurat', 'विवाह मुहूर्त', 'https://images.pexels.com/photos/7978617/pexels-photo-7978617.jpeg?auto=compress&cs=tinysrgb&w=800', 'wedding', 3),
('Temple Puja', 'मंदिर पूजा', 'https://images.pexels.com/photos/3661263/pexels-photo-3661263.jpeg?auto=compress&cs=tinysrgb&w=800', 'puja', 4),
('Graha Shanti Puja', 'ग्रह शांति पूजा', 'https://images.pexels.com/photos/5623069/pexels-photo-5623069.jpeg?auto=compress&cs=tinysrgb&w=800', 'puja', 5),
('Satyanarayan Katha', 'सत्यनारायण कथा', 'https://images.pexels.com/photos/7978636/pexels-photo-7978636.jpeg?auto=compress&cs=tinysrgb&w=800', 'katha', 6);