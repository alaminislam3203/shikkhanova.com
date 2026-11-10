'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import {
  FaFacebook,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
  FaArrowRight,
  FaCircleCheck,
  FaClock,
  FaAward,
  FaFilePdf,
  FaChevronRight,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [contactInput, setContactInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactInput.trim()) {
      setSubscribed(true);
      setContactInput('');
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-700 pt-14 pb-28 lg:pb-12 border-t border-slate-200 relative overflow-hidden mt-auto">
      {/* Top Multi-Color Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A1E3C] via-[#C8102E] to-[#E02447]" />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Pre-Footer Action Banner (Premium Executive Card) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0A1E3C] via-[#0F284E] to-[#1E0B16] text-white p-6 sm:p-8 shadow-xl border border-slate-200/20 relative overflow-hidden">
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C8102E]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#C8102E] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <HiSparkles className="w-3.5 h-3.5 text-amber-300" />
                ২৪/৭ শিক্ষার্থী ও অভিভাবক সাপোর্ট
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ভর্তি, শিট বা রেজাল্ট সংক্রান্ত কোনো জিজ্ঞাসা আছে?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
                আমাদের একাডেমি টিম আপনার সহায়তায় সার্বক্ষণিক প্রস্তুত। সরাসরি কল করুন বা হোয়াটসঅ্যাপে লিখুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="tel:01712592519"
                className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A50D26] text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-900/30 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <FaPhone className="w-3.5 h-3.5 text-white" />
                <span className="font-bn-normal">০১৭১২৫৯২৫১৯</span>
              </a>
              <a
                href="https://wa.me/8801712592519"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-900/20 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <FaWhatsapp className="text-white text-base" />
                <span>হোয়াটসঅ্যাপ মেসেজ</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns on White Card Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pt-2">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center">
              <Logo size="md" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য নীলফামারীর নির্ভরযোগ্য ডিজিটাল শিক্ষা একাডেমি। আধুনিক ডিজিটাল রেজাল্ট অনুসন্ধান, অধ্যায়ভিত্তিক প্রিমিয়াম শিট ও গুণগত পাঠদান।
            </p>

            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-[#C8102E] border border-red-100 text-xs font-bold shadow-2xs">
              <FaAward className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>সফলতার স্লোগান: <strong>"শিখবো, জিতবো"</strong></span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <span className="text-xs font-bold text-slate-500">যুক্ত থাকুন:</span>
              <a
                href="https://facebook.com/ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition border border-blue-100 shadow-2xs"
                title="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-50 hover:bg-[#FF0000] text-[#FF0000] hover:text-white flex items-center justify-center transition border border-red-100 shadow-2xs"
                title="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801712592519"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-[#25D366] text-emerald-600 hover:text-white flex items-center justify-center transition border border-emerald-100 shadow-2xs"
                title="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a
                href="tel:01712592519"
                className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-[#C8102E] text-[#C8102E] hover:text-white flex items-center justify-center transition border border-rose-100 shadow-2xs"
                title="Call"
              >
                <FaPhone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-[#0A1E3C] uppercase tracking-wider pb-2 border-b-2 border-red-500/20 inline-block">
              গুরুত্বপূর্ণ লিংক
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/" className="hover:text-[#C8102E] transition-colors flex items-center gap-1.5 group">
                  <FaChevronRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  <span>হোম পেইজ</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C8102E] transition-colors flex items-center gap-1.5 group">
                  <FaChevronRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  <span>আমাদের সম্পর্কে</span>
                </Link>
              </li>
              <li>
                <Link href="/chairman-message" className="hover:text-[#C8102E] transition-colors flex items-center gap-1.5 group">
                  <FaChevronRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  <span>চেয়ারম্যানের বার্তা</span>
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-[#C8102E] transition-colors flex items-center gap-1.5 group">
                  <FaChevronRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  <span>নোটিশ বোর্ড</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#C8102E] transition-colors flex items-center gap-1.5 group">
                  <FaChevronRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  <span>ফটো গ্যালারি</span>
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-[#C8102E] transition-colors flex items-center gap-1.5 group">
                  <FaChevronRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  <span>ভিডিও ক্লাস</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-[#0A1E3C] uppercase tracking-wider pb-2 border-b-2 border-red-500/20 inline-block">
              একাডেমিক সেবা
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/quiz" className="hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-[#C8102E]" />
                  <span>অনলাইন কুইজ ও মডেল টেস্ট</span>
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-[#C8102E]" />
                  <span>কোচিং পরীক্ষার ফলাফল ও মার্কশিট</span>
                </Link>
              </li>
              <li>
                <Link href="/pdfs" className="hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-[#C8102E]" />
                  <span>অধ্যায়ভিত্তিক শিট ও রঙিন হ্যান্ডনোট</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-[#C8102E]" />
                  <span>৫ম থেকে ১০ম শ্রেণির ব্যাচসমূহ</span>
                </Link>
              </li>
              <li>
                <Link href="/pdfs" className="hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-[#C8102E]" />
                  <span>মডেল টেস্ট ও স্পেশাল সাজেশন</span>
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-[#C8102E]" />
                  <span>শিক্ষার্থী ও শিক্ষক ড্যাশবোর্ড</span>
                </Link>
              </li>
            </ul>

            {/* Address & Hours Snippet */}
            <div className="pt-2 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0 border border-red-100 mt-0.5">
                  <FaLocationDot className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug text-slate-600">
                  জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী।
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <FaClock className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600">খোলা: সকাল ৮:০০ - রাত ১০:০০</span>
              </div>
            </div>
          </div>

          {/* Col 4: Payments & Updates (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-[#0A1E3C] uppercase tracking-wider pb-2 border-b-2 border-red-500/20 inline-block">
              পেমেন্ট ও আপডেট
            </h4>

            {/* bKash & Nagad Payment Card */}
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm space-y-2">
              <p className="text-[11px] font-bold text-slate-600">ফি পাঠানোর পার্সোনাল নম্বর:</p>
              <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <img src="/assets/images/bkash.png" alt="bKash" className="h-4 w-auto object-contain" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <img src="/assets/images/nagad.png" alt="Nagad" className="h-4 w-auto object-contain" />
                  </div>
                </div>
                <span className="font-bn-normal font-black text-[#C8102E] text-xs sm:text-sm tracking-wider">
                  ০১৭১২৫৯২৫১৯
                </span>
              </div>
            </div>

            {/* Subscribe Form */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <p className="text-xs text-slate-500 leading-snug">
                নতুন শিট, ফলাফল ও নোটিশ সরাসরি পেতে যুক্ত হোন:
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="মোবাইল বা ইমেইল লিখুন"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition shadow-2xs"
                />
                <button
                  type="submit"
                  className="bg-[#C8102E] hover:bg-[#A50D26] active:scale-95 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center shrink-0"
                  aria-label="যুক্ত হোন"
                >
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold animate-in fade-in">
                  <FaCircleCheck className="w-3.5 h-3.5" />
                  <span>ধন্যবাদ! আমরা আপনাকে দ্রুত আপডেট পাঠাব।</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Slogan Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-[#0A1E3C] font-bold">শিক্ষানোভা (SikkhaNova)</strong> একাডেমি — সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">অফিসিয়াল স্লোগান:</span>
            <span className="text-[#C8102E] font-black bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              "শিখবো, জিতবো"
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500">জুম্মাপাড়া, নীলফামারী সদর</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
