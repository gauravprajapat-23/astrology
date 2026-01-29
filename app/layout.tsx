import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Sans_Devanagari } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Divine Rituals - Authentic Hindu Puja & Astrology Services',
  description: 'Book authentic Hindu rituals, poojas, havan, and muhurat consultations with experienced Vedic astrologers. Get divine blessings for prosperity, health, and happiness.',
  keywords: ['hindu rituals', 'puja booking', 'astrologer', 'vedic astrology', 'graha shanti', 'havan', 'muhurat', 'vastu puja'],
  openGraph: {
    title: 'Divine Rituals - Book Authentic Hindu Puja Services',
    description: 'Professional Vedic astrology and Hindu ritual services for all occasions',
    images: [
      {
        url: 'https://images.pexels.com/photos/8844892/pexels-photo-8844892.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divine Rituals - Authentic Hindu Puja Services',
    description: 'Book Hindu rituals and consultations with experienced Vedic astrologers',
    images: [
      {
        url: 'https://images.pexels.com/photos/8844892/pexels-photo-8844892.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${notoSansDevanagari.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
