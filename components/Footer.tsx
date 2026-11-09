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
    <footer className="bg-[#061224] text-slate-300 pt-16 pb-10 border-t-4 border-[#C8102E] mt-auto relative overflow-hidden">
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#C8102E]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Pre-Footer Action Banner (UCC Group Style) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#2A0B1E] border border-[#C8102E]/40 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#C8102E] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <HiSparkles className="w-3.5 h-3.5 text-amber-300" />
              ২৪/৭ শিক্ষার্থী ও অভিভাবক সহায়তা
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ভর্তি, শিট বা রেজাল্ট সংক্রান্ত কোনো প্রশ্ন আছে?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              আমাদের টিম আপনাকে সাহায্য করার জন্য সবসময় প্রস্তুত। সরাসরি কল করুন অথবা হোয়াটসঅ্যাপে লিখুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:01712592519"
              className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A60D26] text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <FaPhone className="w-3.5 h-3.5 text-white" />
              <span className="font-bn-normal">০১৭১২৫৯২৫১৯</span>
            </a>
            <a
              href="https://wa.me/8801712592519"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <FaWhatsapp className="text-white text-base" />
              <span>হোয়াটসঅ্যাপে মেসেজ</span>
            </a>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pt-2">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-2.5 inline-flex items-center shadow-md border border-white/20">
              <Logo size="md" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য নীলফামারীর নির্ভরযোগ্য ডিজিটাল শিক্ষা প্ল্যাটফর্ম। প্রতিদিনের রোল ভিত্তিক হাজিরা, নির্ভুল ফলাফল, এক্সক্লুসিভ হ্যান্ডনোট ও ভিডিও সমাধান।
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400">যুক্ত থাকুন:</span>
              <a
                href="https://facebook.com/ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition border border-blue-500/30 shadow-sm"
                title="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition border border-red-500/30 shadow-sm"
                title="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801712592519"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition border border-emerald-500/30 shadow-sm"
                title="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a
                href="tel:01712592519"
                className="w-9 h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 flex items-center justify-center transition border border-amber-500/30 shadow-sm"
                title="Call"
              >
                <FaPhone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              পেইজসমূহ
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors inline-block">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors inline-block">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-amber-400 transition-colors inline-block">
                  নোটিশ বোর্ড
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors inline-block">
                  ফটো গ্যালারি
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-amber-400 transition-colors inline-block">
                 ফলাফল
                </Link>
              </li>
              <li>
                <Link href="/pdfs" className="hover:text-amber-400 transition-colors inline-block">
                শিট ও নোট
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-amber-400 transition-colors inline-block">
                  ভিডিও ক্লাস
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-amber-400 transition-colors inline-block">
                  আমার প্রোফাইল
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Center Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              ঠিকানা ও যোগাযোগ
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 mt-0.5">
                  <FaLocationDot className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug text-slate-300">
                  জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী।
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <FaPhone className="w-3.5 h-3.5" />
                </div>
                <a href="tel:01712592519" className="hover:text-amber-400 font-bn-normal font-bold text-slate-200 transition">
                  ০১৭১২৫৯২৫১৯
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <FaEnvelope className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:robiulnil101@gmail.com" className="hover:text-amber-400 font-mono text-slate-200 transition truncate">
                  robiulnil101@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <FaClock className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300">সকাল ৮:০০ - রাত ১০:০০</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter / Stay Updated & Payment Badges (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              আপডেট ও ফি পেমেন্ট
            </h4>
            <p className="text-xs text-slate-400 leading-snug">
              নতুন সাজেশন, হ্যান্ডনোট ও মডেল টেস্টের আপডেট সরাসরি পেতে আপনার মোবাইল বা ইমেইল দিন:
            </p>

            {/* Subscribe Form (Golden/Amber Button like Reference Image) */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="মোবাইল বা ইমেইল লিখুন"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <span>যুক্ত হোন</span>
                <FaArrowRight className="w-3 h-3" />
              </button>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-in fade-in">
                  <FaCircleCheck className="w-3.5 h-3.5" />
                  <span>ধন্যবাদ! আমরা আপনাকে দ্রুত আপডেট পাঠাব।</span>
                </div>
              )}
            </form>

            {/* bKash & Nagad Payment Badges */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 mb-1.5">ফি পাঠানোর পার্সোনাল নম্বর:</p>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-2">
                  <div className="bg-white px-1.5 py-0.5 rounded shadow-xs">
                    <img src="/assets/images/bkash.png" alt="bKash" className="h-3.5 w-auto object-contain" />
                  </div>
                  <div className="bg-white px-1.5 py-0.5 rounded shadow-xs">
                    <img src="/assets/images/nagad.png" alt="Nagad" className="h-3.5 w-auto object-contain" />
                  </div>
                </div>
                <span className="font-bn-normal font-bold text-amber-400 text-xs tracking-wider">
                  ০১৭১২৫৯২৫১৯
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Slogan Bar */}
        <div className="pt-8 border-t border-slate-800/90 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-white font-bold">শিক্ষানোভা (SikkhaNova)</strong> একাডেমি — সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 font-medium">অফিসিয়াল স্লোগান:</span>
            <span className="text-amber-400 font-black bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              "শিখবো, জিতবো"
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">জুম্মাপাড়া, নীলফামারী সদর</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
