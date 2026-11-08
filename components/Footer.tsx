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
  FaWhatsapp,
  FaGlobe,
  FaArrowRight,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #04122E 0%, #02091A 50%, #01050F 100%)',
      }}
      className="text-slate-300 pt-16 pb-10 border-t border-slate-800/80 mt-auto relative overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Helpline & WhatsApp Callout Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(8, 44, 109, 0.7) 0%, rgba(4, 26, 66, 0.85) 100%)',
          }}
          className="rounded-3xl p-6 sm:p-8 border border-brand-500/30 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left"
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-nova-300 bg-black/40 px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                <HiSparkles className="text-nova-400" />
                ২৪/৭ শিক্ষার্থী ও অভিভাবক সহায়তা
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                সকাল ৮:০০ - রাত ১০:০০
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              যেকোনো প্রশ্ন বা ভর্তির তথ্যের জন্য সরাসরি কথা বলুন
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90">
              জুম্মাপাড়া, নীলফামারী সদর • সরাসরি কল করুন অথবা হোয়াটসঅ্যাপে মেসেজ দিন
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:01712592519"
              className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-brand-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition transform hover:-translate-y-0.5"
            >
              <FaPhone className="text-emerald-600 w-3.5 h-3.5" />
              <span>০১৭১২৫৯২৫১৯</span>
            </a>
            <a
              href="https://wa.me/8801712592519"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition transform hover:-translate-y-0.5"
            >
              <FaWhatsapp className="text-white text-base" />
              <span>হোয়াটসঅ্যাপ মেসেজ</span>
            </a>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pt-4">
          
          {/* Col 1: Brand & Logo (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-2.5 inline-flex items-center shadow-md border border-white/20">
              <Logo size="md" />
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য নির্ভরযোগ্য ডিজিটাল শিক্ষা প্ল্যাটফর্ম। প্রতিদিনের রোল ভিত্তিক হাজিরা, নির্ভুল ফলাফল ও মার্কশিট, এক্সক্লুসিভ হ্যান্ডনোট ও ইউটিউব ভিডিও সমাধান।
            </p>

            <div className="flex items-center gap-2.5 pt-2">
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

          {/* Col 2: Navigation & Features - Clean text links (No Icons) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              নেভিগেশন ও ফিচার
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-nova-400 transition-colors inline-block"
                >
                  হোমপেজ
                </Link>
              </li>
              <li>
                <Link
                  href="/attendance"
                  className="hover:text-nova-400 transition-colors inline-block"
                >
                  রোল উপস্থিতি (৫ম - ১০ম শ্রেণি)
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="hover:text-nova-400 transition-colors inline-block"
                >
                  কোচিং রেজাল্ট ও মার্কশিট
                </Link>
              </li>
              <li>
                <Link
                  href="/pdfs"
                  className="hover:text-nova-400 transition-colors inline-block"
                >
                  পিডিএফ শিট ও নোট
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="hover:text-nova-400 transition-colors inline-block"
                >
                  ইউটিউব ভিডিও ক্লাস
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-nova-400 transition-colors inline-block"
                >
                  শিক্ষার্থী ও অ্যাডমিন লগইন
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Numbers - Clean text header (No Icon) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              ফি পেমেন্ট
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              পিডিএফ হ্যান্ডনোট কিনতে নিচের পার্সোনাল নম্বরে সেন্ড মানি করে TrxID দিন:
            </p>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-2.5 text-xs shadow-inner">
              <div className="flex items-center justify-between gap-2">
                <div className="bg-white px-2 py-1 rounded-lg shadow-sm flex items-center">
                  <img src="/assets/images/bkash.png" alt="bKash" className="h-4 w-auto object-contain" />
                </div>
                <p className="text-white font-mono font-bold text-xs tracking-wider">01712592519</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="bg-white px-2 py-1 rounded-lg shadow-sm flex items-center">
                  <img src="/assets/images/nagad.png" alt="Nagad" className="h-4 w-auto object-contain" />
                </div>
                <p className="text-white font-mono font-bold text-xs tracking-wider">01712592519</p>
              </div>
            </div>
          </div>

          {/* Col 4: Center Address & Contact Info with React Icons */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              যোগাযোগের ঠিকানা
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-nova-500/20 text-nova-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FaLocationDot className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug text-slate-300">জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী।</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FaPhone className="w-3.5 h-3.5" />
                </div>
                <a href="tel:01712592519" className="hover:text-white transition font-mono font-bold text-slate-200">
                  01712592519
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FaEnvelope className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:robiulnil101@gmail.com" className="hover:text-white transition font-mono text-slate-200">
                  robiulnil101@gmail.com
                </a>
              </div>

              <div className="pt-1">
                <a
                  href="https://sikkhanova.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-900/60 hover:bg-brand-900 text-blue-200 hover:text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-brand-700/60 transition shadow-sm"
                >
                  <FaGlobe className="text-nova-400 w-3.5 h-3.5" />
                  <span>sikkhanova.com</span>
                </a>
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
            <span className="text-slogan-500 font-black bg-slogan-500/10 px-2.5 py-0.5 rounded-full border border-slogan-500/20">
              "শিখবো, জিতবো"
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-500">জুম্মাপাড়া, নীলফামারী সদর</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
