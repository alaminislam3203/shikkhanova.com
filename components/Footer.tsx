'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import {
  FaFacebook,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaHeart,
  FaGraduationCap,
  FaFilePdf,
  FaAward,
  FaUserCheck,
  FaWhatsapp,
  FaArrowRight,
  FaShieldHalved,
} from 'react-icons/fa6';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi2';
import { TbCashBanknote } from 'react-icons/tb';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-brand-950 to-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800/80 mt-auto relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Helpline & WhatsApp Callout Banner */}
        <div className="bg-gradient-to-r from-brand-800/80 via-brand-700/80 to-indigo-900/80 rounded-3xl p-6 sm:p-8 border border-brand-500/30 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-nova-300 bg-black/30 px-3 py-1 rounded-full uppercase tracking-wider">
              <HiSparkles className="text-nova-400" />
              ২৪/৭ শিক্ষার্থী ও অভিভাবক সহায়তা
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              যেকোনো প্রশ্ন বা ভর্তির তথ্যের জন্য সরাসরি কথা বলুন
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              জুম্মাপাড়া, নীলফামারী সদর | সকাল ৮:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত কল বা হোয়াটসঅ্যাপ করুন
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:01712592519"
              className="inline-flex items-center gap-2 bg-white text-brand-900 hover:bg-blue-50 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:-translate-y-0.5"
            >
              <FaPhone className="text-emerald-600" />
              <span>০১৭১২৫৯২৫১৯</span>
            </a>
            <a
              href="https://wa.me/8801712592519"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:-translate-y-0.5"
            >
              <FaWhatsapp className="text-white text-base" />
              <span>হোয়াটসঅ্যাপ মেসেজ</span>
            </a>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pt-4">
          
          {/* Col 1: Brand & Logo (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl p-2.5 inline-flex items-center shadow-md border border-white/20">
              <Logo size="md" />
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য নির্ভরযোগ্য ডিজিটাল শিক্ষা প্ল্যাটফর্ম। প্রতিদিনের রোল ভিত্তিক হাজিরা, নির্ভুল ফলাফল ও মার্কশিট, এক্সক্লুসিভ পিডিএফ শিট ও ইউটিউব ভিডিও সমাধান।
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400">যুক্ত থাকুন:</span>
              <a
                href="https://facebook.com/ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Facebook Page"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="YouTube Channel @ShikkhaNova"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
              <a
                href="tel:01712592519"
                className="w-9 h-9 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white flex items-center justify-center hover:scale-110 transition shadow"
                title="Call 01712592519"
              >
                <FaPhone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <FaGraduationCap className="text-nova-500" /> নেভিগেশন ও ফিচার
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/attendance" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaUserCheck className="text-brand-400 w-3.5 h-3.5" /> রোল উপস্থিতি (Class 5 - 10)
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaAward className="text-nova-400 w-3.5 h-3.5" /> কোচিং রেজাল্ট ও মার্কশিট
                </Link>
              </li>
              <li>
                <Link href="/pdfs" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaFilePdf className="text-slogan-500 w-3.5 h-3.5" /> পিডিএফ হ্যান্ডনোট ও সাজেশন
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaYoutube className="text-red-500 w-3.5 h-3.5" /> ইউটিউব ভিডিও ক্লাস
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaShieldHalved className="text-slate-400 w-3.5 h-3.5" /> শিক্ষার্থী ও অ্যাডমিন পোর্টাল
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Numbers (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <TbCashBanknote className="text-emerald-400" /> ফি পেমেন্ট
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              পিডিএফ হ্যান্ডনোট কিনতে নিচের পার্সোনাল নম্বরে সেন্ড মানি করে TrxID সাবমিট করুন:
            </p>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-2 text-xs font-mono">
              <div>
                <span className="text-[10px] font-bold text-bkash bg-pink-950/60 px-1.5 py-0.5 rounded">bKash Personal</span>
                <p className="text-white font-bold mt-0.5 text-xs">01712592519</p>
              </div>
              <div className="pt-1.5 border-t border-slate-700/60">
                <span className="text-[10px] font-bold text-nagad bg-orange-950/60 px-1.5 py-0.5 rounded">Nagad Personal</span>
                <p className="text-white font-bold mt-0.5 text-xs">01712592519</p>
              </div>
            </div>
          </div>

          {/* Col 4: Center Address & Contact (2.5 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <FaLocationDot className="text-nova-500" /> যোগাযোগের ঠিকানা
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <FaLocationDot className="text-nova-500 mt-1 flex-shrink-0" />
                <span className="leading-snug">জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী।</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhone className="text-emerald-400 flex-shrink-0" />
                <a href="tel:01712592519" className="hover:text-white transition font-mono font-bold">01712592519</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <a href="mailto:robiulnil101@gmail.com" className="hover:text-white transition font-mono">robiulnil101@gmail.com</a>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 bg-brand-900/80 text-brand-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-brand-700">
                  🌐 sikkhanova.com
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Slogan Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-200 font-bold">শিক্ষানোভা (SikkhaNova)</strong> — সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>অফিসিয়াল স্লোগান:</span>
            <span className="text-slogan-500 font-black bg-slogan-500/10 px-2 py-0.5 rounded-full border border-slogan-500/20">
              "শিখবো, জিতবো"
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">জুম্মাপাড়া, নীলফামারী সদর</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
