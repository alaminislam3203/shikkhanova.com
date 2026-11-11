'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { confirmSignOut } from '@/lib/logout';
import {
  FaHouse,
  FaMagnifyingGlass,
  FaAward,
  FaFilePdf,
  FaUser,
  FaUserShield,
  FaBars,
  FaXmark,
  FaShieldHalved,
  FaBookOpen,
  FaGraduationCap,
  FaHashtag,
  FaPhone,
  FaArrowRightFromBracket,
  FaBullhorn,
  FaImages,
  FaVideo,
  FaChevronRight,
  FaGear,
  FaUserCheck,
  FaGem,
  FaGift,
  FaTrophy,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when full-height menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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

  return (
    <>
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

              {/* 5. মেনু / প্রোফাইল (Menu / Profile) Slot */}
              {session?.user ? (
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="অ্যাকাউন্ট মেনু খুলুন"
                  className={`flex flex-col items-center justify-center py-1 group transition-all duration-150 ${
                    isMenuOpen || isProfileActive ? 'text-[#C8102E]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`w-9 h-7 flex items-center justify-center transition-transform ${
                      isMenuOpen || isProfileActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    {/* User Avatar with Bottom-Right Menu Hamburger Badge */}
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full overflow-hidden ring-[2.5px] ring-slate-400/90 bg-slate-800 flex items-center justify-center shadow-xs">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session?.user?.name || 'User'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[11px] font-black text-white">
                            {session?.user?.name ? session.user.name.charAt(0) : '🎓'}
                          </span>
                        )}
                      </div>
                      {/* Dark Circular Badge with Hamburger Menu Icon */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#475569] text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                        <FaBars className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                      isMenuOpen || isProfileActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-600'
                    }`}
                  >
                    মেনু
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`flex flex-col items-center justify-center py-1 group transition-all duration-150 ${
                    isProfileActive ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <div
                    className={`w-9 h-7 flex items-center justify-center transition-transform ${
                      isProfileActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    <FaUser
                      className={`w-5 h-5 ${
                        isProfileActive ? 'text-[#C8102E]' : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                      isProfileActive ? 'font-black text-[#C8102E]' : 'font-medium text-slate-500'
                    }`}
                  >
                    লগইন
                  </span>
                </Link>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          SIDE DRAWER USER ACCOUNT MENU (Mobile Only)
      ───────────────────────────────────────────────────────────── */}
      {session?.user && (
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-visibility duration-300 ${
            isMenuOpen ? 'visible' : 'invisible pointer-events-none delay-300'
          }`}
          aria-hidden={!isMenuOpen}
        >
          {/* Backdrop Overlay with blur */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 ease-out ${
              isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Side Menu Drawer (Smooth Slide-In From Right) */}
          <aside
            className={`fixed top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-[360px] bg-slate-100 shadow-2xl flex flex-col z-[51] transition-transform duration-300 ease-out transform border-l border-slate-200/90 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="dialog"
            aria-label="অ্যাকাউন্ট মেনু"
          >
            {/* 1. Header Bar with Title & Close Button */}
            <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0A1E3C] to-[#C8102E] text-white flex items-center justify-center shadow-xs">
                  <FaBars className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#0A1E3C] leading-tight">অ্যাকাউন্ট মেনু</h2>
                  <p className="text-[10px] text-slate-500 font-medium">শিক্ষানোভা একাডেমি পোর্টাল</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="মেনু বন্ধ করুন"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-700 flex items-center justify-center transition"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 pb-12">
              
              {/* User Profile Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
                }}
                className="rounded-2xl p-4 text-white shadow-md border-b-2 border-[#C8102E] relative overflow-hidden"
              >
                <div className="flex items-center gap-3.5">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/30 bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session?.user?.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-white">
                        {session?.user?.name ? session.user.name.charAt(0) : '🎓'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-black text-white truncate max-w-[180px]">
                        {session?.user?.name}
                      </h3>
                      <span className="bg-[#C8102E] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {session?.user?.role === 'ADMIN' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-200 truncate">{session?.user?.email}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      {session?.user?.classGrade && (
                        <span className="bg-white/10 px-2 py-0.5 rounded font-bold border border-white/10">
                          শ্রেণি {session?.user?.classGrade}
                        </span>
                      )}
                      {session?.user?.rollNumber && (
                        <span className="bg-white/10 px-2 py-0.5 rounded font-bold border border-white/10">
                          রোল {session?.user?.rollNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Link Button */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <Link
                    href="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-xs font-bold text-white border border-white/15 flex items-center justify-center gap-1.5 transition"
                  >
                    <FaGear className="w-3.5 h-3.5 text-nova-400" />
                    <span>প্রোফাইল সেটিংস</span>
                  </Link>

                  {session?.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition active:scale-98"
                    >
                      <FaUserShield className="w-3.5 h-3.5" />
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition active:scale-98"
                    >
                      <FaUserShield className="w-3.5 h-3.5" />
                      <span>অ্যাডমিন</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Group 1: Academic Links */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-1">
                <div className="px-2 py-1 text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaBookOpen className="text-brand-600" />
                  <span>একাডেমিক কার্যক্রম ও শিটসমূহ</span>
                </div>

                <Link
                  href="/my-notes"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C8102E] flex items-center justify-center shrink-0">
                      <FaFilePdf className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        সংগৃহীত পিডিএফ শিট ও নোট
                      </p>
                      <p className="text-[10px] text-slate-400">অনুমোদিত শিট ও ডাউনলোড লিঙ্ক</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/results"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <FaAward className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        রেজাল্ট ও মার্কশিট
                      </p>
                      <p className="text-[10px] text-slate-400">রোল নম্বর দিয়ে গ্রেড ও নম্বরপত্র</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/attendance"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <FaUserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                          দৈনিক রোল হাজিরা (অ্যাডমিন)
                        </p>
                        <p className="text-[10px] text-slate-400">তারিখ অনুযায়ী ক্লাসে উপস্থিতি গ্রহণ</p>
                      </div>
                    </div>
                    <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}

                <Link
                  href="/quiz"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FaGem className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        কুইজ ও মডেল টেস্ট
                      </p>
                      <p className="text-[10px] text-slate-400">ফ্রি ও পেইড স্পেশাল মডেল টেস্ট</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/leaderboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <FaTrophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        কুইজ লিডারবোর্ড (মেধাতালিকা)
                      </p>
                      <p className="text-[10px] text-slate-400">সেরা ফলাফল ও মেডেল তালিকা</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/pdfs"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0">
                      <HiSparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        নতুন হ্যান্ডনোট ও সাজেশন শপ
                      </p>
                      <p className="text-[10px] text-slate-400">বিকাশ/নগদ পেমেন্টে নোট কিনুন</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Group 2: Account Settings */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-1">
                <div className="px-2 py-1 text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaGear className="text-brand-600" />
                  <span>অ্যাকাউন্ট ও প্রোফাইল</span>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0">
                      <FaUser className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        আমার শিক্ষার্থী প্রোফাইল
                      </p>
                      <p className="text-[10px] text-slate-400">ব্যক্তিগত ও একাডেমিক পরিচিতি</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <FaGear className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        ছবি ও তথ্য পরিবর্তন
                      </p>
                      <p className="text-[10px] text-slate-400">নাম, মোবাইল নম্বর, শ্রেণি ও রোল এডিট</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/password"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <FaShieldHalved className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                        পাসওয়ার্ড ও নিরাপত্তা
                      </p>
                      <p className="text-[10px] text-slate-400">অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করুন</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Group 3: Coaching Notices & Media */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-1">
                <div className="px-2 py-1 text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaBullhorn className="text-brand-600" />
                  <span>অন্যান্য পেজ ও তথ্য</span>
                </div>

                <Link
                  href="/notices"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <FaBullhorn className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                      জরুরি নোটিশবোর্ড
                    </span>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/gallery"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <FaImages className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                      ফটো গ্যালারি
                    </span>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/videos"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <FaVideo className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] transition">
                      ভিডিও ক্লাস ও গাইডলাইন
                    </span>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Helpline Box */}
              <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FaPhone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-950">কোচিং হেল্পলাইন</p>
                    <p className="text-[11px] font-bold text-emerald-700">০১৭১২৫৯২৫১৯</p>
                  </div>
                </div>
                <a
                  href="tel:01712592519"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
                >
                  কল করুন
                </a>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  confirmSignOut();
                }}
                className="w-full p-3.5 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-98 border border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaArrowRightFromBracket className="w-4 h-4" />
                <span>লগআউট করুন</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
