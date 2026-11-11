'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { confirmSignOut } from '@/lib/logout';
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
  FaMagnifyingGlass,
  FaChevronDown,
  FaBell,
  FaTrophy,
  FaAward,
  FaGear,
  FaCartShopping,
  FaRegHeart,
  FaRegCommentDots,
  FaUser,
  FaGlobe,
  FaShieldHalved,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

const INSTANT_SITE_INDEX = [
  {
    id: 'page-home',
    title: 'হোম পেইজ (শিক্ষানোভা একাডেমি)',
    subtitle: '৫ম থেকে ১০ম শ্রেণির ডিজিটাল শিক্ষা ব্যবস্থাপনা • নীলফামারী সদর',
    categoryLabel: 'পেইজ',
    href: '/',
    keywords: 'home হোম শিক্ষানোভা একাডেমি স্লোগান শিখবো জিতবো',
  },
  {
    id: 'page-about',
    title: 'শিক্ষা নোভা সম্পর্কে (আমাদের সম্পর্কে)',
    subtitle: 'লক্ষ্য, রূপকল্প ও একাডেমিক বৈশিষ্ট্যসমূহ • জুম্মাপাড়া, নীলফামারী সদর',
    categoryLabel: 'আমাদের সম্পর্কে',
    href: '/about',
    keywords: 'about আমাদের সম্পর্কে শিক্ষা নোভা সম্পর্কে লক্ষ্য উদ্দেশ্য',
  },
  {
    id: 'page-chairman',
    title: 'চেয়ারম্যানের বার্তা (রবিউল ইসলাম)',
    subtitle: 'শিক্ষা নোভা একাডেমির চেয়ারম্যান ও পরিচালকের শুভেচ্ছা বার্তা',
    categoryLabel: 'আমাদের সম্পর্কে',
    href: '/chairman-message',
    keywords: 'chairman director message চেয়ারম্যানের বার্তা পরিচালকের বার্তা রবিউল ইসলাম',
  },
  {
    id: 'page-notices',
    title: 'অফিশিয়াল নোটিশ বোর্ড',
    subtitle: 'পরীক্ষার রুটিন, ভর্তি বিজ্ঞপ্তি ও একাডেমিক নোটিশসমূহ',
    categoryLabel: 'নোটিশ',
    href: '/notices',
    keywords: 'notice নোটিশ বিজ্ঞপ্তি রুটিন পরীক্ষা ভর্তি',
  },
  {
    id: 'page-gallery',
    title: 'ফটো গ্যালারি (শিক্ষা নোভা একাডেমি)',
    subtitle: 'ক্লাসরুম পাঠদান, পরীক্ষা ও পুরস্কার বিতরণী অনুষ্ঠানের ছবিসমূহ',
    categoryLabel: 'গ্যালারি',
    href: '/gallery',
    keywords: 'photo gallery ফটো গ্যালারি ছবি ক্লাসরুম পুরস্কার',
  },
  {
    id: 'page-pdfs',
    title: 'প্রিমিয়াম পিডিএফ শিট ও হ্যান্ডনোট শপ',
    subtitle: 'অধ্যায়ভিত্তিক রঙিন হ্যান্ডনোট, সাজেশন ও ফ্রি শিট ডাউনলোড',
    categoryLabel: 'হ্যান্ডনোট',
    href: '/pdfs',
    badge: 'PDF Shop',
    keywords: 'pdf note sheet হ্যান্ডনোট শিট সাজেশন গণিত বিজ্ঞান ইংরেজি পদার্থ রসায়ন জীববিজ্ঞান আইসিটি',
  },
  {
    id: 'page-quiz',
    title: 'অনলাইন কুইজ ও মডেল টেস্ট (MCQ Model Test)',
    subtitle: '৫ম-১০ম শ্রেণির ফ্রি ও প্রিমিয়াম মডেল টেস্ট, ইনস্ট্যান্ট রেজাল্ট ও লিডারবোর্ড',
    categoryLabel: 'মডেল টেস্ট',
    href: '/quiz',
    badge: 'MCQ Test',
    keywords: 'quiz mcq model test কুইজ মডেল টেস্ট পরীক্ষা mcq প্রশ্ন উত্তর ফ্রি প্রিমিয়াম',
  },
  {
    id: 'page-leaderboard',
    title: '🏆 মেধা তালিকা ও লিডারবোর্ড (Quiz Leaderboard)',
    subtitle: 'সেরা শিক্ষার্থীদের র‍্যাঙ্কিং, গোল্ড/সিলভার মেডেল ও প্রাপ্ত স্কোর',
    categoryLabel: 'লিডারবোর্ড',
    href: '/leaderboard',
    badge: 'Top Rank',
    keywords: 'leaderboard লিডারবোর্ড মেধা তালিকা র‍্যাঙ্কিং মেডেল রেজাল্ট বোর্ড কুইজ সেরা',
  },
  {
    id: 'page-results',
    title: 'কোচিং পরীক্ষার রেজাল্ট ও মার্কশিট',
    subtitle: 'শ্রেণি ও রোল নম্বর দিয়ে অফিশিয়াল গ্রেডশিট ও জিপিএ অনুসন্ধান',
    categoryLabel: 'রেজাল্ট',
    href: '/results',
    badge: 'GPA 5.00',
    keywords: 'result marksheet gpa ফলাফল রেজাল্ট মার্কশিট গ্রেডশিট পরীক্ষা রোল',
  },
  {
    id: 'page-videos',
    title: 'ইউটিউব ভিডিও ক্লাস (@ShikkhaNova)',
    subtitle: 'গণিত, বিজ্ঞান, ইংরেজি ও আইসিটি বিষয়ের অধ্যায়ভিত্তিক ভিডিও লেকচার',
    categoryLabel: 'ভিডিও ক্লাস',
    href: '/videos',
    keywords: 'video youtube class ভিডিও ক্লাস লেকচার ইউটিউব সমাধান',
  },
  {
    id: 'cls-5',
    title: '৫ম শ্রেণি — হাজিরা, শিট ও রেজাল্ট',
    subtitle: '৫ম শ্রেণির সকল হ্যান্ডনোট, উপস্থিতি ও ফলাফল',
    categoryLabel: '৫ম শ্রেণি',
    href: '/pdfs',
    keywords: '5 class 5 ৫ ৫ম শ্রেণি প্রাথমিক গণিত বিজ্ঞান',
  },
  {
    id: 'cls-6',
    title: '৬ষ্ঠ শ্রেণি — হাজিরা, শিট ও রেজাল্ট',
    subtitle: '৬ষ্ঠ শ্রেণির সকল হ্যান্ডনোট, উপস্থিতি ও ফলাফল',
    categoryLabel: '৬ষ্ঠ শ্রেণি',
    href: '/pdfs',
    keywords: '6 class 6 ৬ ৬ষ্ঠ শ্রেণি গণিত বিজ্ঞান ইংরেজি আইসিটি',
  },
  {
    id: 'cls-7',
    title: '৭ম শ্রেণি (Class 7) — হাজিরা, শিট ও রেজাল্ট',
    subtitle: '৭ম শ্রেণির সকল হ্যান্ডনোট, উপস্থিতি ও ফলাফল',
    categoryLabel: '৭ম শ্রেণি',
    href: '/pdfs',
    keywords: '7 class 7 ৭ ৭ম শ্রেণি গণিত বিজ্ঞান ইংরেজি',
  },
  {
    id: 'cls-8',
    title: '৮ম শ্রেণি (Class 8) — হাজিরা, শিট ও রেজাল্ট',
    subtitle: '৮ম শ্রেণির সকল হ্যান্ডনোট, উপস্থিতি ও ফলাফল',
    categoryLabel: '৮ম শ্রেণি',
    href: '/pdfs',
    keywords: '8 class 8 ৮ ৮ম শ্রেণি গণিত বিজ্ঞান ইংরেজি জ্যামিতি',
  },
  {
    id: 'cls-9',
    title: '৯ম শ্রেণি (Class 9) — হাজিরা, শিট ও রেজাল্ট',
    subtitle: '৯ম শ্রেণির পদার্থ, রসায়ন, গণিত ও জীববিজ্ঞান হ্যান্ডনোট',
    categoryLabel: '৯ম শ্রেণি',
    href: '/pdfs',
    keywords: '9 class 9 ৯ ৯ম শ্রেণি পদার্থ রসায়ন জীববিজ্ঞান উচ্চতর গণিত',
  },
  {
    id: 'cls-10',
    title: '১০ম শ্রেণি (Class 10 / SSC) — ফাইনাল সাজেশন ও শিট',
    subtitle: 'এসএসসি ও ১০ম শ্রেণির সকল বিষয়ের স্পেশাল সাজেশন ও মডেল টেস্ট',
    categoryLabel: '১০ম শ্রেণি',
    href: '/pdfs',
    keywords: '10 class 10 ssc ১০ ১০ম শ্রেণি এসএসসি সাজেশন মডেল টেস্ট',
  },
  {
    id: 'page-account',
    title: 'আমার একাউন্ট ও প্রোফাইল তথ্য',
    subtitle: 'প্রোফাইল ছবি, নাম, মোবাইল নম্বর ও শ্রেণি-রোল আপডেট',
    categoryLabel: 'একাউন্ট',
    href: '/account',
    keywords: 'account profile settings photo একাউন্ট প্রোফাইল ছবি তথ্য',
  },
  {
    id: 'page-password',
    title: 'পাসওয়ার্ড পরিবর্তন ও নিরাপত্তা',
    subtitle: 'নিরাপত্তা নিশ্চিতকরণ ও নতুন পাসওয়ার্ড আপডেট',
    categoryLabel: 'পাসওয়ার্ড',
    href: '/password',
    keywords: 'password security পাসওয়ার্ড সিকিউরিটি নিরাপত্তা পরিবর্তন',
  },
  {
    id: 'page-my-notes',
    title: 'আমার সংগৃহীত পিডিএফ হ্যান্ডনোট',
    subtitle: 'ক্রয়কৃত শিট ডাউনলোড ও হিস্ট্রি',
    categoryLabel: 'হ্যান্ডনোট',
    href: '/my-notes',
    keywords: 'my notes pdf download সংগৃহীত শিট হ্যান্ডনোট ডাউনলোড',
  },
];

interface NavLinkItem {
  href: string;
  label: string;
  icon?: any;
  color?: string;
  badge?: string;
  children?: { href: string; label: string }[];
}

const navLinks: NavLinkItem[] = [
  {
    href: '/about',
    label: 'আমাদের সম্পর্কে',
    children: [
      { href: '/about', label: 'শিক্ষা নোভা সম্পর্কে' },
      { href: '/chairman-message', label: 'চেয়ারম্যানের বার্তা' },
    ],
  },
  { href: '/quiz', label: 'মডেল টেস্ট', badge: 'MCQ' },
  { href: '/notices', label: 'নোটিশ' },
  { href: '/results', label: 'রেজাল্ট' },
  { href: '/pdfs', label: 'শিট ও নোট' },
  { href: '/gallery', label: 'ফটো গ্যালারি' },
  { href: '/videos', label: 'ভিডিও ক্লাস', icon: FaYoutube, color: 'text-red-500' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  // Instant 0ms Global Website Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [dbSearchItems, setDbSearchItems] = useState<any[]>([]);
  const dbFetchedRef = useRef(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Lock scroll & handle ESC key for the right slide-over drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  // Listen for mobile bottom nav search trigger event
  useEffect(() => {
    const handleOpenSearch = () => {
      ensureDbIndexLoaded();
      setMobileOpen(false);
      setMobileSearchOpen((prev) => {
        const next = !prev;
        if (next) {
          setTimeout(() => {
            mobileSearchInputRef.current?.focus();
          }, 150);
        }
        return next;
      });
    };

    window.addEventListener('open-mobile-search', handleOpenSearch);
    return () => {
      window.removeEventListener('open-mobile-search', handleOpenSearch);
    };
  }, []);

  // Close dropdown & search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest?.('[data-mobile-search-btn="true"]')) {
          setMobileSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setDrawerOpen(false);
    setAboutMenuOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Preload DB search items silently in the background once when search opens
  const ensureDbIndexLoaded = () => {
    if (dbFetchedRef.current) return;
    dbFetchedRef.current = true;

    try {
      const cached = sessionStorage.getItem('sn_search_db_cache');
      if (cached) {
        setDbSearchItems(JSON.parse(cached));
      }
    } catch {}

    fetch('/api/search')
      .then((r) => r.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setDbSearchItems(data.results);
          try {
            sessionStorage.setItem('sn_search_db_cache', JSON.stringify(data.results));
          } catch {}
        }
      })
      .catch(() => {});
  };

  // 0ms Instant Synchronous Search Filtering (Zero Loading Delay)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const combined = [...dbSearchItems, ...INSTANT_SITE_INDEX];

    if (!q) {
      return combined.slice(0, 6);
    }

    return combined
      .filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.categoryLabel?.toLowerCase().includes(q) ||
          item.keywords?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, dbSearchItems]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      setSearchOpen(false);
      router.push(searchResults[0].href);
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      setMobileSearchOpen(false);
      router.push(searchResults[0].href);
    }
  };

  return (
    <>
      {/* Top Header Bar - Style Deep Academic Navy & Crimson Red Accent (Hidden on Mobile) */}
      <div className="hidden sm:block bg-[#0A1E3C] text-white text-xs py-2 px-4 shadow-sm border-b-2 border-[#C8102E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-100">
              <FaLocationDot className="text-[#EF5350]" />
              জুম্মাপাড়া, নীলফামারী সদর
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <a href="tel:01712592519" className="inline-flex items-center gap-1.5 text-white hover:text-red-300 transition font-bn-normal font-bold">
              <FaPhone className="text-emerald-400" />
              <span>হেল্পলাইন: ০১৭১২৫৯২৫১৯</span>
            </a>
          
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

            {/* Desktop Navigation Links + Global Search Box */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isChildActive = link.children?.some((c) => pathname === c.href);
                const active = pathname === link.href || Boolean(isChildActive);

                if (link.children) {
                  return (
                    <div
                      key={link.href}
                      ref={aboutDropdownRef}
                      onMouseEnter={() => setAboutMenuOpen(true)}
                      onMouseLeave={() => setAboutMenuOpen(false)}
                      className="relative"
                    >
                      <button
                        type="button"
                        onClick={() => setAboutMenuOpen((prev) => !prev)}
                        className={`px-3 py-2 rounded-sm text-sm font-semibold transition-all flex items-center gap-1.5 relative whitespace-nowrap ${
                          active
                            ? 'bg-[#C8102E] text-white shadow-sm font-bold'
                            : 'text-[#0A1E3C] hover:text-[#C8102E] hover:bg-red-50/50'
                        }`}
                      >
                        <span>{link.label}</span>
                        <FaChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            aboutMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {aboutMenuOpen && (
                        <div className="absolute left-0 top-full pt-1.5 w-52 z-50">
                          <div className="bg-white rounded-md shadow-xl border border-slate-200/90 py-2 overflow-hidden">
                            {link.children.map((sub) => {
                              const subActive = pathname === sub.href;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setAboutMenuOpen(false)}
                                  className={`block px-4 py-2.5 text-sm font-semibold transition ${
                                    subActive
                                      ? 'bg-[#C8102E] text-white font-bold'
                                      : 'text-slate-700 hover:text-[#C8102E] hover:bg-red-50/60'
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-sm text-sm font-semibold transition-all flex items-center gap-1.5 relative whitespace-nowrap ${
                      active
                        ? 'bg-[#C8102E] text-white shadow-sm font-bold'
                        : 'text-[#0A1E3C] hover:text-[#C8102E] hover:bg-red-50/50'
                    }`}
                  >
                    {Icon && (
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : (link.color || 'text-slate-500')}`} />
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

              {/* Global Website Search Box on Right Side of Video Class (rounded-sm, 0ms instant) */}
              <div className="relative ml-2" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <FaMagnifyingGlass className="absolute left-3 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => {
                      setSearchOpen(true);
                      ensureDbIndexLoaded();
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                      ensureDbIndexLoaded();
                    }}
                    placeholder="নোট, রেজাল্ট, ক্লাস খুঁজুন..."
                    className="w-48 xl:w-56 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 focus:border-brand-600 rounded-sm pl-8 pr-7 py-1.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </form>

                {/* Instant 0ms Global Search Results Dropdown */}
                {searchOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-sm shadow-2xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>
                        {searchQuery.trim()
                          ? `"${searchQuery}" এর সার্চ ফলাফল`
                          : 'দ্রুত এক্সপ্লোর করুন'}
                      </span>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        কোনো ফলাফল পাওয়া যায়নি। অন্য কি-ওয়ার্ড দিয়ে চেষ্টা করুন।
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setSearchOpen(false)}
                            className="px-3.5 py-2.5 hover:bg-brand-50/60 flex items-start justify-between gap-3 transition block"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-slate-100 text-brand-700 border border-slate-200">
                                  {item.categoryLabel}
                                </span>
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {item.title}
                                </p>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            </div>

                            {item.badge && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side: Auth / Profile Dropdown & Mobile Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Mobile Notice Bell Icon (Notice replaces user profile on mobile per design) */}
              <Link
                href="/notices"
                className="relative lg:hidden p-2 text-slate-700 hover:text-[#C8102E] hover:bg-red-50/60 rounded-xl transition flex items-center justify-center"
                aria-label="অফিশিয়াল নোটিশ বোর্ড"
                title="নোটিশ বোর্ড"
              >
                <FaBell className="w-5 h-5 text-[#0A1E3C]" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8102E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8102E]"></span>
                </span>
              </Link>

              {session?.user ? (
                <div className="relative">
                  {/* Profile Trigger Button - Avatar Only */}
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className={`rounded-full p-0.5 transition-all focus:outline-none ${
                      drawerOpen
                        ? 'ring-2 ring-brand-600 ring-offset-2 ring-offset-white'
                        : 'hover:ring-2 hover:ring-brand-500/50 hover:ring-offset-1'
                    }`}
                    aria-expanded={drawerOpen}
                    aria-label="আমার অ্যাকাউন্ট"
                    title={session.user.name || 'আমার অ্যাকাউন্ট'}
                  >
                    {/* User Avatar */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-black text-brand-700">
                          {session.user.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-brand-200 transition"
                  >
                    <FaRightToBracket /> লগইন
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-nova-500 to-nova-600 hover:from-nova-600 hover:to-nova-700 px-3.5 py-2 rounded-xl shadow-md shadow-nova-500/20 transition"
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
                const isChildActive = link.children?.some((c) => pathname === c.href);
                const active = pathname === link.href || Boolean(isChildActive);

                if (link.children) {
                  return (
                    <div key={link.href} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setMobileAboutOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-sm text-sm font-semibold ${
                          active
                            ? 'bg-[#C8102E] text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{link.label}</span>
                        <FaChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            mobileAboutOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {mobileAboutOpen && (
                        <div className="pl-4 space-y-1 border-l-2 border-red-200 ml-4">
                          {link.children.map((sub) => {
                            const subActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3.5 py-2 rounded-sm text-xs font-semibold ${
                                  subActive
                                    ? 'bg-[#C8102E] text-white font-bold'
                                    : 'text-slate-600 hover:bg-red-50 hover:text-[#C8102E]'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-sm text-sm font-semibold ${
                      active
                        ? 'bg-[#C8102E] text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {Icon && <Icon className={`w-4 h-4 ${active ? 'text-white' : (link.color || 'text-slate-500')}`} />}
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
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setDrawerOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-3 transition"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-500 bg-brand-50 flex items-center justify-center shrink-0">
                      {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-brand-700">
                          {session.user.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate uppercase">{session.user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{session.user.email}</p>
                    </div>
                    <span className="text-xs text-brand-600 font-bold shrink-0">আমার অ্যাকাউন্ট →</span>
                  </button>

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

                  <Link
                    href="/leaderboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                  >
                    <span>🏆 লিডারবোর্ড (মেধাতালিকা)</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Rank
                    </span>
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
                      confirmSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                  >
                    <FaArrowRightFromBracket /> লগআউট করুন
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Animated Search Box (Opened directly beneath sticky navbar) */}
          {mobileSearchOpen && (
            <div
              ref={mobileSearchContainerRef}
              className="lg:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-md px-3 py-3 pb-4 shadow-xl transition-all duration-300 animate-in slide-in-from-top-3 fade-in"
            >
              <form onSubmit={handleMobileSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <FaMagnifyingGlass className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    ref={mobileSearchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ক্লাস, বিষয়, শিট, রেজাল্ট খুঁজুন..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-sm font-semibold rounded-xl border border-slate-200 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-all shadow-inner"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                      aria-label="ক্লিয়ার করুন"
                    >
                      <FaXmark className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMobileSearchOpen(false)}
                      className="absolute right-2.5 p-1 text-slate-400 hover:text-[#C8102E] rounded-full"
                      aria-label="সার্চ বন্ধ করুন"
                    >
                      <FaXmark className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Instant Search Results Dropdown */}
              <div className="mt-2.5 max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
                <div className="px-3 py-1.5 bg-slate-100/90 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                  <span>{searchQuery ? 'অনুসন্ধানের ফলাফল' : 'জনপ্রিয় অনুসন্ধান'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">ট্যাপ করে প্রবেশ করুন</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    কোনো তথ্য পাওয়া যায়নি
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-2.5 hover:bg-red-50/80 flex items-start justify-between gap-2.5 transition active:bg-red-100/60"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white text-[#C8102E] border border-red-200 shrink-0 shadow-2xs">
                            {item.categoryLabel}
                          </span>
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {item.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Right Side Slide-over Drawer for User Account (Matching Design) */}
      <div
        className={`fixed inset-0 z-[100] transition-visibility duration-300 ${
          drawerOpen ? 'visible' : 'invisible pointer-events-none delay-300'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop Overlay with blur */}
        <div
          onClick={() => setDrawerOpen(false)}
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ease-out ${
            drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Slide-in Sidebar Panel */}
        <aside
          className={`fixed top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-[360px] bg-white shadow-2xl flex flex-col z-[101] transition-transform duration-300 ease-out transform ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-label="আমার অ্যাকাউন্ট মেনু"
        >
          {/* 1. Header: Close + Title */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-1 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              aria-label="মেনু বন্ধ করুন"
            >
              <FaXmark className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
              আমার অ্যাকাউন্ট
            </h2>
          </div>

          {/* 2. Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* User Profile Section */}
            {session?.user && (
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 shadow-xs">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-slate-700">
                      {session.user.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate uppercase tracking-tight">
                    {session.user.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                    {session.user.email}
                  </p>
                  {session.user.role && (
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                        session.user.role === 'ADMIN'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : session.user.role === 'TEACHER'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {session.user.role === 'ADMIN'
                        ? '👑 অ্যাডমিন'
                        : session.user.role === 'TEACHER'
                        ? '👨‍🏫 শিক্ষক'
                        : '🎓 শিক্ষার্থী'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Menu List */}
            <nav className="space-y-1.5">
              {/* Admin Panel (if admin) */}
              {session?.user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50/70 hover:bg-brand-100/70 transition"
                >
                  <FaShieldHalved className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>অ্যাডমিন প্যানেল</span>
                </Link>
              )}

              {/* Dashboard */}
              <Link
                href="/account"
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition"
              >
                <FaUser className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>ড্যাশবোর্ড</span>
              </Link>

              {/* Account Settings */}
              <Link
                href="/account"
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition"
              >
                <FaGear className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>অ্যাকাউন্ট সেটিংস</span>
              </Link>

              {/* My Orders / Notes */}
              <Link
                href="/my-notes"
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition"
              >
                <FaCartShopping className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>আমার অর্ডার</span>
              </Link>

              {/* Saved Address / Profile */}
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition"
              >
                <FaLocationDot className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>সংরক্ষিত ঠিকানা</span>
              </Link>

              {/* Leaderboard */}
              <Link
                href="/leaderboard"
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <FaTrophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>কুইজ লিডারবোর্ড</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Top
                </span>
              </Link>

              {/* Review */}
              <Link
                href="/about"
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition"
              >
                <FaRegCommentDots className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                <span>রিভিউ</span>
              </Link>

              {/* Wishlist (with Soon badge) */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed select-none">
                <div className="flex items-center gap-3.5">
                  <FaRegHeart className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>উইশলিস্ট</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Soon
                </span>
              </div>
            </nav>

            {/* 3. Logout Action (in Red with Hot Toast Confirmation) */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  confirmSignOut();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition text-left cursor-pointer"
              >
                <FaArrowRightFromBracket className="w-4 h-4 text-red-500 shrink-0" />
                <span>লগ আউট</span>
              </button>
            </div>
          </div>

          {/* 4. Footer: Language */}
          <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-between text-sm font-medium text-slate-700 bg-slate-50/50 mt-auto">
            <span>Language</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <FaGlobe className="w-4 h-4 text-slate-600" />
              <span>বাংলা</span>
              <FaChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

