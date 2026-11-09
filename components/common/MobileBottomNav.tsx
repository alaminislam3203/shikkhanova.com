'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FaHouse,
  FaMagnifyingGlass,
  FaAward,
  FaFilePdf,
  FaUser,
  FaUserShield,
} from 'react-icons/fa6';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If in admin panel, do not render public mobile nav
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleOpenSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-mobile-search'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeActive = pathname === '/';
  const isResultActive = pathname.startsWith('/results');
  const isNotesActive = pathname.startsWith('/pdfs');
  const isProfileActive =
    pathname === '/account' ||
    pathname === '/login' ||
    pathname === '/profile' ||
    pathname === '/register' ||
    pathname.startsWith('/admin');

  const profileHref = session?.user
    ? session.user.role === 'ADMIN'
      ? '/admin'
      : '/account'
    : '/login';

  const profileLabel = session?.user
    ? session.user.role === 'ADMIN'
      ? 'অ্যাডমিন'
      : 'প্রোফাইল'
    : 'লগইন';

  return (
    <nav
      aria-label="মোবাইল নেভিগেশন"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pointer-events-none"
    >
      <div className="relative max-w-md mx-auto pointer-events-auto">
        {/* Subtle curved white halo behind center elevated button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-16 h-16 rounded-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.06)] -z-10" />

        {/* Center Elevated Floating Results Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20">
          <Link
            href="/results"
            aria-label="কোচিং পরীক্ষার রেজাল্ট ও মার্কশিট"
            className={`w-14 h-14 rounded-full bg-gradient-to-tr from-[#9B0D23] via-[#C8102E] to-[#E5254A] text-white flex items-center justify-center border-4 border-white shadow-[0_8px_20px_rgba(200,16,46,0.38)] active:scale-95 hover:scale-105 transition-all duration-200 ${
              isResultActive ? 'ring-2 ring-[#C8102E] ring-offset-2' : ''
            }`}
          >
            <FaAward className="w-6 h-6 drop-shadow-xs" />
          </Link>
        </div>

        {/* Nav Container with rounded-t-3xl and 5 Slots in Bangla */}
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/90 rounded-t-[26px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+8px)]">
          <div className="grid grid-cols-5 items-end text-center">
            
            {/* 1. হোম (Home) Slot */}
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
                <FaHouse
                  className={`w-5 h-5 ${isHomeActive ? 'text-[#C8102E]' : 'text-slate-500'}`}
                />
              </div>
              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                  isHomeActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                }`}
              >
                হোম
              </span>
            </Link>

            {/* 2. সার্চ (Search) Slot */}
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
                সার্চ
              </span>
            </button>

            {/* 3. রেজাল্ট (Results) Slot - Elevated in Center */}
            <Link
              href="/results"
              className={`flex flex-col items-center justify-end group transition-all duration-150 ${
                isResultActive ? 'text-[#C8102E]' : 'text-slate-600 hover:text-[#C8102E]'
              }`}
            >
              <div className="h-7 w-full pointer-events-none" />
              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                  isResultActive ? 'font-black text-[#C8102E]' : 'font-bold text-slate-600'
                }`}
              >
                রেজাল্ট
              </span>
            </Link>

            {/* 4. নোটস (Notes / PDFs) Slot */}
            <Link
              href="/pdfs"
              className={`flex flex-col items-center justify-center py-1 group transition-all duration-150 ${
                isNotesActive ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-9 h-7 flex items-center justify-center transition-transform ${
                  isNotesActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                <FaFilePdf
                  className={`w-5 h-5 ${
                    isNotesActive
                      ? 'text-[#C8102E]'
                      : 'text-slate-500 group-hover:text-[#C8102E]'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                  isNotesActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                }`}
              >
                নোটস
              </span>
            </Link>

            {/* 5. প্রোফাইল (Profile) Slot */}
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
                    className={`w-5 h-5 ${
                      isProfileActive ? 'text-[#C8102E]' : 'text-slate-500'
                    }`}
                  />
                ) : (
                  <FaUser
                    className={`w-5 h-5 ${
                      isProfileActive ? 'text-[#C8102E]' : 'text-slate-500'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                  isProfileActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                }`}
              >
                {profileLabel}
              </span>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}
