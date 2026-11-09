'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FaHouse,
  FaMagnifyingGlass,
  FaPlus,
  FaXmark,
  FaClockRotateLeft,
  FaUser,
  FaUserShield,
  FaFilePdf,
  FaAward,
  FaBell,
  FaPhone,
  FaGraduationCap,
  FaImage,
} from 'react-icons/fa6';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  // Close quick menu when navigating
  useEffect(() => {
    setQuickMenuOpen(false);
  }, [pathname]);

  // If in admin panel, do not render public mobile nav
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleOpenSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuickMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-mobile-search'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeActive = pathname === '/';
  const isHistoryActive = pathname.startsWith('/results');
  const isProfileActive =
    pathname === '/account' ||
    pathname === '/login' ||
    pathname === '/profile' ||
    pathname === '/register';

  const profileHref = session?.user
    ? session.user.role === 'ADMIN'
      ? '/admin'
      : '/account'
    : '/login';

  const quickActions = [
    {
      title: 'হ্যান্ডনোট ও শিট',
      desc: 'অধ্যায়ভিত্তিক PDF নোট',
      href: '/pdfs',
      icon: FaFilePdf,
      iconColor: 'text-[#C8102E] bg-red-50',
    },
    {
      title: 'পরীক্ষার রেজাল্ট',
      desc: 'মার্কশিট ও গ্রেড অনুসন্ধান',
      href: '/results',
      icon: FaAward,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'নোটিশ বোর্ড',
      desc: 'অফিশিয়াল জরুরি বিজ্ঞপ্তি',
      href: '/notices',
      icon: FaBell,
      iconColor: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'ফটো গ্যালারি',
      desc: 'ক্লাসরুম ও পুরষ্কারের ছবি',
      href: '/gallery',
      icon: FaImage,
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'একাডেমিক তথ্য',
      desc: '৫ম-১০ম কোর্স ও বৈশিষ্ট্য',
      href: '/about',
      icon: FaGraduationCap,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'জরুরি হেল্পলাইন',
      desc: '০১৭১২৫৯২৫১৯',
      href: 'tel:01712592519',
      icon: FaPhone,
      iconColor: 'text-rose-600 bg-rose-50',
      isExternal: true,
    },
  ];

  return (
    <>
      {/* Quick Action Modal Backdrop & Sheet */}
      {quickMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Dark Overlay */}
          <div
            onClick={() => setQuickMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Quick Action Drawer Content */}
          <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 px-5 pt-4 pb-24 max-w-md mx-auto w-full animate-in slide-in-from-bottom-8 duration-200">
            {/* Grab handle indicator */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-[#0A1E3C]">কুইক অ্যাকশন মেনু</h3>
                <p className="text-xs text-slate-500 font-medium">প্রয়োজনীয় সেবা এক ক্লিকেই খুঁজে নিন</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
                aria-label="বন্ধ করুন"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions 2x3 Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                const Component = action.isExternal ? 'a' : Link;
                return (
                  <Component
                    key={action.title}
                    href={action.href}
                    onClick={() => setQuickMenuOpen(false)}
                    className="p-3 rounded-2xl border border-slate-200/90 hover:border-[#C8102E]/40 hover:bg-red-50/30 transition-all flex items-center gap-3 active:scale-98 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.iconColor} transition-transform group-hover:scale-105`}
                    >
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] truncate">
                        {action.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </Component>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar matching reference image with Shikkha Nova UCC Theme */}
      <nav
        aria-label="মোবাইল নেভিগেশন"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pointer-events-none"
      >
        <div className="relative max-w-md mx-auto pointer-events-auto">
          {/* Subtle curved white halo behind center elevated button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-16 h-16 rounded-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.06)] -z-10" />

          {/* Elevated Floating Center Plus Button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20">
            <button
              type="button"
              onClick={() => setQuickMenuOpen((prev) => !prev)}
              aria-label="কুইক অ্যাকশন মেনু"
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-[#9B0D23] via-[#C8102E] to-[#E5254A] text-white flex items-center justify-center border-4 border-white shadow-[0_8px_20px_rgba(200,16,46,0.38)] active:scale-95 transition-all duration-200 ${
                quickMenuOpen ? 'rotate-45 bg-[#0A1E3C] shadow-slate-400' : 'hover:scale-105'
              }`}
            >
              <FaPlus className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Container with rounded-t-3xl and 5 Slots */}
          <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/90 rounded-t-[26px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+8px)]">
            <div className="grid grid-cols-5 items-end text-center">
              
              {/* 1. Home Slot */}
              <Link
                href="/"
                className={`flex flex-col items-center justify-center py-1 group transition-all duration-150 ${
                  isHomeActive ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`w-9 h-7 flex items-center justify-center transition-transform ${
                    isHomeActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  <FaHouse className={`w-5 h-5 ${isHomeActive ? 'text-[#C8102E]' : 'text-slate-500'}`} />
                </div>
                <span
                  className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                    isHomeActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                  }`}
                >
                  Home
                </span>
              </Link>

              {/* 2. Search Slot (Clicking opens animated search box below sticky navbar) */}
              <button
                type="button"
                data-mobile-search-btn="true"
                onClick={handleOpenSearch}
                className="flex flex-col items-center justify-center py-1 group transition-all duration-150 text-slate-500 hover:text-[#C8102E]"
                aria-label="সার্চ বক্স খুলুন"
              >
                <div className="w-9 h-7 flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95">
                  <FaMagnifyingGlass className="w-5 h-5 text-slate-500 group-hover:text-[#C8102E] transition-colors" />
                </div>
                <span className="text-[11px] font-medium tracking-tight mt-0.5 leading-tight text-slate-500 group-hover:text-[#C8102E]">
                  Search
                </span>
              </button>

              {/* 3. Center Slot (Space reserved for Elevated Floating + Button) */}
              <div className="flex flex-col items-center justify-end pointer-events-none">
                <div className="h-7 w-full" />
                <span className="text-[10px] font-semibold tracking-tight mt-0.5 leading-tight text-transparent select-none">
                  Quick
                </span>
              </div>

              {/* 4. History / Results Slot */}
              <Link
                href="/results"
                className={`flex flex-col items-center justify-center py-1 group transition-all duration-150 ${
                  isHistoryActive ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`w-9 h-7 flex items-center justify-center transition-transform ${
                    isHistoryActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  <FaClockRotateLeft
                    className={`w-5 h-5 ${isHistoryActive ? 'text-[#C8102E]' : 'text-slate-500'}`}
                  />
                </div>
                <span
                  className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                    isHistoryActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                  }`}
                >
                  History
                </span>
              </Link>

              {/* 5. Profile Slot */}
              <Link
                href={profileHref}
                className={`flex flex-col items-center justify-center py-1 group transition-all duration-150 ${
                  isProfileActive ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`w-9 h-7 flex items-center justify-center transition-transform ${
                    isProfileActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  {session?.user?.role === 'ADMIN' ? (
                    <FaUserShield
                      className={`w-5 h-5 ${isProfileActive ? 'text-[#C8102E]' : 'text-slate-500'}`}
                    />
                  ) : (
                    <FaUser
                      className={`w-5 h-5 ${isProfileActive ? 'text-[#C8102E]' : 'text-slate-500'}`}
                    />
                  )}
                </div>
                <span
                  className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                    isProfileActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                  }`}
                >
                  Profile
                </span>
              </Link>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
