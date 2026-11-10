'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import {
  FaGraduationCap,
  FaBullseye,
  FaEye,
  FaCircleCheck,
  FaLocationDot,
  FaPhone,
  FaArrowRight,
  FaAward,
  FaBookOpen,
  FaChalkboardUser,
} from 'react-icons/fa6';

export default function AboutPage() {
  const highlights = [
    {
      title: 'অভিজ্ঞ ও যত্নশীল শিক্ষক মণ্ডলী',
      desc: '৫ম থেকে ১০ম শ্রেণির প্রতিটি বিষয়ের জন্য রয়েছেন অভিজ্ঞ ও নিবেদিতপ্রাণ বিষয়ভিত্তিক শিক্ষক।',
      icon: FaChalkboardUser,
    },
    {
      title: 'অধ্যায়ভিত্তিক প্রিমিয়াম হ্যান্ডনোট ও শিট',
      desc: 'বোর্ড পরীক্ষা ও স্কুল পরীক্ষার জন্য শতভাগ কমন উপযোগী রঙিন হ্যান্ডনোট এবং সাজেশন।',
      icon: FaBookOpen,
    },
    {
      title: 'নিয়মিত পরীক্ষা ও ডিজিটাল মার্কশিট',
      desc: 'সাপ্তাহিক ও মাসিক মূল্যায়ন পরীক্ষার ফলাফল সরাসরি ওয়েবসাইটে রোল নম্বর দিয়ে দেখার সুবিধা।',
      icon: FaAward,
    },
    {
      title: 'স্মার্ট ডিজিটাল মনিটরিং',
      desc: 'প্রতিদিনের ক্লাস উপস্থিতি, ফলাফল ট্র্যাকিং এবং ইউটিউব ভিডিও ক্লাসের মাধ্যমে পূর্ণাঙ্গ প্রস্তুতি।',
      icon: FaGraduationCap,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero Banner (Compact on Mobile) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden text-white p-4 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-b-4 border-[#C8102E]"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-8">
          <div className="space-y-2 sm:space-y-3.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-sm uppercase tracking-wider">
              আমাদের সম্পর্কে
            </span>
            <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
              শিক্ষা নোভা সম্পর্কে
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-200 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              “শিখবো, জিতবো” স্লোগানকে ধারণ করে নীলফামারী সদরের জুম্মাপাড়ায় ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের মেধা বিকাশ ও সেরা ফলাফল নিশ্চিত করার একটি আধুনিক একাডেমিক প্রতিষ্ঠান।
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg shrink-0 flex flex-row lg:flex-col items-center justify-between gap-3">
            <Logo size="sm" clickable={false} />
            <Link
              href="/chairman-message"
              className="inline-flex items-center justify-center gap-1.5 bg-[#C8102E] hover:bg-[#A50D26] text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm transition whitespace-nowrap"
            >
              <span>চেয়ারম্যানের বার্তা পড়ুন</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 border-t-4 border-t-[#0A1E3C] shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0A1E3C] flex items-center justify-center text-xl">
            <FaBullseye />
          </div>
          <h2 className="text-xl font-bold text-[#0A1E3C]">আমাদের লক্ষ্য (Our Mission)</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের মুখস্থবিদ্যার পরিবর্তে প্রতিটি বিষয়ের মৌলিক ধারণা (Basic Concept) স্পষ্ট করা, নিয়মিত পরীক্ষার মাধ্যমে ভীতি দূর করা এবং বোর্ড ও স্কুল পরীক্ষায় সর্বোচ্চ ফলাফল অর্জনে সহায়তা করা।
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 border-t-4 border-t-[#C8102E] shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-[#C8102E] flex items-center justify-center text-xl">
            <FaEye />
          </div>
          <h2 className="text-xl font-bold text-[#0A1E3C]">আমাদের রূপকল্প (Our Vision)</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            নীলফামারী জেলার প্রতিটি শিক্ষার্থীর কাছে মানসম্মত হ্যান্ডনোট, ডিজিটাল রেজাল্ট ও আধুনিক শিক্ষা সেবা পৌঁছে দিয়ে একটি আদর্শ ও প্রযুক্তিনির্ভর একাডেমিক প্ল্যাটফর্ম হিসেবে নিজেদের প্রতিষ্ঠিত করা।
          </p>
        </div>
      </div>

      {/* Why Choose Shikkha Nova */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#C8102E] uppercase">কেন শিক্ষা নোভা সেরা?</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A1E3C]">
            আমাদের বিশেষত্ব ও একাডেমিক সুবিধাসমূহ
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0A1E3C] text-white flex items-center justify-center text-lg shrink-0">
                  <Icon />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0A1E3C]">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-700 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <FaLocationDot className="text-[#C8102E]" /> জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaPhone className="text-emerald-600" /> হেল্পলাইন:{' '}
              <strong className="font-bn-normal">০১৭১২৫৯২৫১৯</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pdfs"
              className="bg-[#C8102E] hover:bg-[#A50D26] text-white font-bold px-4 py-2 rounded-sm transition"
            >
              পিডিএফ হ্যান্ডনোট দেখুন
            </Link>
            <Link
              href="/results"
              className="bg-[#0A1E3C] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-sm transition"
            >
              রেজাল্ট খুঁজুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

