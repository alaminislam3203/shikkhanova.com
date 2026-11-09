import type { Metadata } from 'next';
import { Noto_Sans_Bengali, Poppins } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import AppLayout from '@/components/common/AppLayout';
import { Toaster } from 'react-hot-toast';

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-bn',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://shikkhanova.com'),
  title: 'শিক্ষানোভা (SikkhaNova) - শিখবো, জিতবো | শ্রেণি ৫-১০ শিক্ষা ব্যবস্থাপনা',
  description:
    'শিক্ষানোভা - জুম্মাপাড়া, নীলফামারী সদর। ৫ম থেকে ১০ম শ্রেণির রোল ভিত্তিক হাজিরা, কোচিং পরীক্ষার ফলাফল, প্রিমিয়াম পিডিএফ শিট এবং ইউটিউব ভিডিও ক্লাস প্ল্যাটফর্ম।',
  icons: {
    icon: '/assets/icon.png',
    apple: '/assets/icon.png',
  },
  openGraph: {
    title: 'শিক্ষানোভা (SikkhaNova) - শিখবো, জিতবো',
    description:
      '৫ম থেকে ১০ম শ্রেণির রোল ভিত্তিক হাজিরা, কোচিং পরীক্ষার ফলাফল, প্রিমিয়াম হ্যান্ডনোট ও ভিডিও ক্লাস। জুম্মাপাড়া, নীলফামারী সদর। হেল্পলাইন: ০১৭১২৫৯২৫১৯',
    url: 'https://sikkhanova.com',
    siteName: 'শিক্ষানোভা (SikkhaNova)',
    images: [
      {
        url: '/logo.png',
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
    <html lang="bn" className={`scroll-smooth ${notoSansBengali.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-[#F4F6F9] text-[#1E293B] antialiased selection:bg-[#C8102E] selection:text-white">
        <AuthProvider>
          <Toaster position="center" />
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
