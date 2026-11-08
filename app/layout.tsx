import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'শিক্ষানোভা (SikkhaNova) - শিখবো, জিতবো | শ্রেণি ৫-১০ শিক্ষা ব্যবস্থাপনা',
  description:
    'শিক্ষানোভা - জুম্মাপাড়া, নীলফামারী সদর। ৫ম থেকে ১০ম শ্রেণির রোল ভিত্তিক হাজিরা, কোচিং পরীক্ষার ফলাফল, প্রিমিয়াম পিডিএফ শিট এবং ইউটিউব ভিডিও ক্লাস প্ল্যাটফর্ম।',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-nova-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

