'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If in Admin Panel: No Public Navbar, No Public Footer, Full-width screen
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-800 antialiased">
        {children}
      </div>
    );
  }

  // Regular Website Layout: Sticky Navbar, Container, Premium Footer
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-nova-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
