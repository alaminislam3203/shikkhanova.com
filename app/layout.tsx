import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import AppLayout from '@/components/common/AppLayout';
import { Toaster } from 'react-hot-toast';

const hindSiliguri = localFont({
  src: [
    {
      path: './fonts/Hind_Siliguri/HindSiliguri-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Hind_Siliguri/HindSiliguri-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Hind_Siliguri/HindSiliguri-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Hind_Siliguri/HindSiliguri-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Hind_Siliguri/HindSiliguri-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const exo2 = localFont({
  src: [
    {
      path: './fonts/exo_2/Exo2-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/exo_2/Exo2-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-exo2',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://shikkhanova.com'),
  title: 'শিক্ষানোভা (SikkhaNova) - শিখবো, জিতবো | শ্রেণি ৫-১০ শিক্ষা ব্যবস্থাপনা',
  description:
    'শিক্ষানোভা - জুম্মাপাড়া, নীলফামারী সদর। ৫ম থেকে ১০ম শ্রেণির রোল ভিত্তিক হাজিরা, কোচিং পরীক্ষার ফলাফল, প্রিমিয়াম পিডিএফ শিট এবং ইউটিউব ভিডিও ক্লাস প্ল্যাটফর্ম।',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'শিক্ষানোভা (SikkhaNova) - শিখবো, জিতবো',
    description:
      '৫ম থেকে ১০ম শ্রেণির রোল ভিত্তিক হাজিরা, কোচিং পরীক্ষার ফলাফল, প্রিমিয়াম হ্যান্ডনোট ও ভিডিও ক্লাস। জুম্মাপাড়া, নীলফামারী সদর। হেল্পলাইন: ০১৭১২৫৯২৫১৯',
    url: 'https://sikkhanova.com',
    siteName: 'শিক্ষানোভা (SikkhaNova)',
    images: [
      {
        url: '/logo.svg',
        width: 800,
        height: 600,
        alt: 'শিক্ষানোভা (SikkhaNova)',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`scroll-smooth ${exo2.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen bg-[#F4F6F9] text-[#1E293B] font-sans antialiased selection:bg-[#C8102E] selection:text-white">
        <AuthProvider>
          <Toaster position="center" />
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
