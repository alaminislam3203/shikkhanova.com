'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/common/Logo';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  FaYoutube,
  FaFacebook,
  FaPhone,
  FaLocationDot,
  FaFilePdf,
  FaRightToBracket,
  FaBars,
  FaXmark,
  FaArrowRightFromBracket,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  interface NavLinkItem {
    href: string;
    label: string;
    icon?: any;
    color?: string;
    badge?: string;
  }

  const navLinks: NavLinkItem[] = [
    { href: '/', label: 'হোম' },
    { href: '/attendance', label: 'রোল উপস্থিতি' },
    { href: '/results', label: 'কোচিং রেজাল্ট' },
    { href: '/pdfs', label: 'পিডিএফ শিট ও নোট', icon: FaFilePdf },
    { href: '/videos', label: 'ভিডিও ক্লাস', icon: FaYoutube, color: 'text-red-500' },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-900 text-white text-xs py-2 px-4 shadow-sm border-b border-brand-600/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
              <FaLocationDot className="text-nova-500" />
              জুম্মাপাড়া, নীলফামারী সদর
            </span>
            <span className="hidden md:inline text-brand-400">•</span>
            <a href="tel:01712592519" className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition">
              <FaPhone className="text-emerald-400" />
              ০১৭১২৫৯২৫১৯
            </a>
            <span className="hidden md:inline text-brand-400">•</span>
            <span className="text-slogan-600 font-bold bg-white/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <HiSparkles className="text-nova-400" />
              শিখবো, জিতবো
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com/ShikkhaNova"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white bg-blue-600/50 hover:bg-blue-600 px-2.5 py-0.5 rounded-full text-[11px] transition"
            >
              <FaFacebook /> Facebook
            </a>
            <a
              href="https://youtube.com/@ShikkhaNova"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white bg-red-600/60 hover:bg-red-600 px-2.5 py-0.5 rounded-full text-[11px] transition"
            >
              <FaYoutube /> @ShikkhaNova
            </a>
            <span className="text-[11px] text-brand-200 font-mono">sikkhanova.com</span>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo Component */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
                      active
                        ? 'text-brand-700 bg-brand-50 shadow-sm border border-brand-200/60 font-bold'
                        : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                    }`}
                  >
                    {Icon && (
                      <Icon className={`w-4 h-4 ${link.color || (active ? 'text-brand-700' : 'text-slate-500')}`} />
                    )}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] bg-nova-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Auth / Profile Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {session?.user ? (
                <div className="relative" ref={dropdownRef}>
                  
                  {/* Profile Trigger Button - Avatar Only */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`rounded-full p-0.5 transition-all focus:outline-none ${
                      dropdownOpen
                        ? 'ring-2 ring-brand-600 ring-offset-2 ring-offset-white'
                        : 'hover:ring-2 hover:ring-brand-500/50 hover:ring-offset-1'
                    }`}
                    aria-expanded={dropdownOpen}
                    aria-label="ইউজার মেনু"
                    title={session.user.name || 'প্রোফাইল মেনু'}
                  >
                    {/* User Avatar Only */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-black text-brand-700">
                          {session.user.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown Popup Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 sm:w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shrink-0 shadow-sm">
                          {session.user.image ? (
                            <img
                              src={session.user.image}
                              alt={session.user.name || 'User'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-black text-brand-700">
                              {session.user.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            {session.user.email}
                          </p>
                          <div className="mt-1">
                            <span
                              className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                session.user.role === 'ADMIN'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : session.user.role === 'TEACHER'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {session.user.role === 'ADMIN'
                                ? '👑 অ্যাডমিন (Admin)'
                                : session.user.role === 'TEACHER'
                                ? '👨‍🏫 শিক্ষক (Teacher)'
                                : '🎓 শিক্ষার্থী (Student)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="px-2 py-2 space-y-1">
                        
                        {/* Admin Panel Link (Only if ADMIN) */}
                        {session.user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 shadow-md transition"
                          >
                            <p className="leading-tight">অ্যাডমিন প্যানেল</p>
                            <p className="text-[10px] text-blue-200 font-normal mt-0.5">ম্যানেজমেন্ট ড্যাশবোর্ড</p>
                          </Link>
                        )}

                        {/* Profile Settings & Photo Upload */}
                        <Link
                          href="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 transition"
                        >
                          <p className="leading-tight">একাউন্ট</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">ছবি, তথ্য ও পাসওয়ার্ড পরিবর্তন</p>
                        </Link>

                        {/* Student Dashboard Shortcut */}
                        {session.user.role === 'STUDENT' && (
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-nova-600 hover:bg-nova-50/70 transition"
                          >
                            <p className="leading-tight">আমার ড্যাশবোর্ড</p>
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">সংগৃহীত শিট ও ফলাফল</p>
                          </Link>
                        )}

                      </div>

                      {/* Logout Action (Keeping Logout Icon) */}
                      <div className="px-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition text-left"
                        >
                          <div className="w-7 h-7 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
                            <FaArrowRightFromBracket className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="leading-tight">লগআউট</p>
                            <p className="text-[10px] text-rose-400 font-normal">অ্যাকাউন্ট থেকে প্রস্থান করুন</p>
                          </div>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3.5 py-2 rounded-xl border border-brand-200 transition"
                  >
                    <FaRightToBracket /> লগইন
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-nova-500 to-nova-600 hover:from-nova-600 hover:to-nova-700 px-3.5 py-2 rounded-xl shadow-md shadow-nova-500/20 transition"
                  >
                    রেজিস্ট্রেশন
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                {mobileOpen ? <FaXmark className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>

            </div>

          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                      active
                        ? 'text-brand-700 bg-brand-50 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {Icon && <Icon className={`w-4 h-4 ${link.color || 'text-slate-500'}`} />}
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] bg-nova-500 text-white px-2 py-0.5 rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {session?.user && (
                <div className="pt-3 mt-2 border-t border-slate-200 space-y-1.5">
                  <div className="px-4 py-2.5 bg-slate-50 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-500 bg-brand-50 flex items-center justify-center shrink-0">
                      {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-brand-700">
                          {session.user.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{session.user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{session.user.email}</p>
                    </div>
                  </div>

                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-700 hover:bg-brand-800"
                    >
                      অ্যাডমিন প্যানেল
                    </Link>
                  )}

                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100"
                  >
                  একাউন্ট
                  </Link>

                  {session.user.role === 'STUDENT' && (
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-bold text-nova-600 hover:bg-nova-50"
                    >
                      আমার ড্যাশবোর্ড ও শিটসমূহ
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <FaArrowRightFromBracket /> লগআউট করুন
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </header>
    </>
  );
}

