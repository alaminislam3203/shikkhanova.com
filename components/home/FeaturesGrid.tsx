'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaLaptopCode,
  FaChalkboardUser,
  FaBookBookmark,
  FaUsersViewfinder,
  FaFileSignature,
  FaCommentSms,
  FaChartPie,
  FaWindowMaximize,
} from 'react-icons/fa6';

interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  href?: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'অফলাইন/অনলাইন প্রোগ্রাম',
    subtitle: 'সরাসরি ক্লাসরুম ও ডিজিটাল লাইভ ক্লাস',
    icon: FaLaptopCode,
    href: '/videos',
  },
  {
    id: 'srv-2',
    title: 'মেধাবী ও অভিজ্ঞ শিক্ষক',
    subtitle: 'বিষয়ভিত্তিক অভিজ্ঞ শিক্ষকমণ্ডলী দ্বারা পাঠদান',
    icon: FaChalkboardUser,
    href: '/about',
  },
  {
    id: 'srv-3',
    title: 'মানসম্মত স্টাডি ম্যাটেরিয়ালস',
    subtitle: 'অধ্যায়ভিত্তিক রঙিন হ্যান্ডনোট ও স্পেশাল শিট',
    icon: FaBookBookmark,
    href: '/pdfs',
  },
  {
    id: 'srv-4',
    title: 'কনসেপ্ট বেইজড ক্লাস',
    subtitle: 'মৌলিক বেসিক ক্লিয়ার ও প্রয়োগমূলক শিক্ষাদান',
    icon: FaUsersViewfinder,
    href: '/videos',
  },
  {
    id: 'srv-5',
    title: 'ইউনিক এক্সাম সিস্টেম',
    subtitle: 'সাপ্তাহিক, মাসিক ও বিশেষ মডেল টেস্ট পরীক্ষা',
    icon: FaFileSignature,
    href: '/results',
  },
  {
    id: 'srv-6',
    title: 'AUTO SMS রেজাল্ট',
    subtitle: 'পরীক্ষা শেষে অভিভাবকের ফোনে স্বয়ংক্রিয় রেজাল্ট SMS',
    icon: FaCommentSms,
    href: '/results',
  },
  {
    id: 'srv-7',
    title: 'এক্সাম এনালাইসিস রিপোর্ট',
    subtitle: 'মার্কশিট, জিপিএ ও সাবজেক্টভিত্তিক দুর্বলতা বিশ্লেষণ',
    icon: FaChartPie,
    href: '/results',
  },
  {
    id: 'srv-8',
    title: 'বেস্ট স্টুডেন্ট পোর্টাল',
    subtitle: 'রোল হাজিরা, ফলাফল ও ডিজিটাল রিসোর্স ম্যানেজমেন্ট',
    icon: FaWindowMaximize,
    href: '/login',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="relative py-8 sm:py-12 space-y-8 overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/40 via-white to-slate-50/50 p-4 sm:p-8 border border-red-100/60 shadow-xs">
      {/* Background Decorative Faint Shapes */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-red-100/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

      {/* Section Header (Matching Screenshot) */}
      <div className="text-center space-y-2 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3C] tracking-tight">
          অন্যান্য সব <span className="text-[#C8102E]">সেবা পরিক্রমা</span>
        </h2>

        {/* UCC Style Red Center Accent Line (━━━ ■ ━━━) */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <div className="w-9 h-[3px] bg-[#C8102E] rounded-full" />
          <div className="w-3 h-[6px] bg-[#C8102E] rounded-xs" />
          <div className="w-9 h-[3px] bg-[#C8102E] rounded-full" />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto pt-1 font-medium">
          শিক্ষার্থী ও অভিভাবকদের জন্য শিক্ষা নোভা একাডেমির আধুনিক ও প্রযুক্তিনির্ভর একাডেমিক সেবাসমূহ
        </p>
      </div>

      {/* 8-Card Grid (2 Rows x 4 Columns on Desktop, 2 Columns on Mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 relative z-10">
        {SERVICES.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="group h-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-red-100/70 shadow-[0_4px_20px_rgba(200,16,46,0.05)] hover:shadow-[0_10px_30px_rgba(200,16,46,0.12)] hover:border-[#C8102E]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer">
              {/* Center Squircle Red Icon Container */}
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FF334B] via-[#E11333] to-[#C8102E] text-white flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-[#0A1E3C] group-hover:text-[#C8102E] transition-colors leading-snug">
                {item.title}
              </h3>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="block h-full">
                {content}
              </Link>
            );
          }

          return (
            <div key={item.id} className="h-full">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
