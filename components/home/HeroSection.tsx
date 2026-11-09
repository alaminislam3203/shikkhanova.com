'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaUserCheck,
  FaAward,
  FaFilePdf,
  FaLocationDot,
  FaPhone,
  FaArrowRight,
} from 'react-icons/fa6';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi2';
import { TbCashBanknote } from 'react-icons/tb';
import Logo from '@/components/common/Logo';

export default function HeroSection() {
  return (
    <div className="space-y-4">
      {/* UCC Group Style Notice / Update Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2 sm:p-2.5 flex items-center gap-3 overflow-hidden">
        <span className="bg-[#C8102E] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5 shadow-xs uppercase tracking-wider">
          <HiSparkles className="w-3.5 h-3.5 text-amber-300" />
          নোটিশ বোর্ড
        </span>
        <div className="text-xs sm:text-sm font-semibold text-[#0A1E3C] truncate flex items-center gap-3">
          <span>🎓 ৫ম থেকে ১০ম শ্রেণির সকল বিষয়ের স্পেশাল হ্যান্ডনোট ও সাজেশন এখন ওয়েবসাইটে পাওয়া যাচ্ছে!</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <Link href="/pdfs" className="hidden md:inline-flex items-center gap-1 text-[#C8102E] font-bold hover:underline shrink-0">
            পিডিএফ শপ দেখুন <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <section
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden rounded-3xl text-white p-6 sm:p-12 lg:p-16 shadow-premium border-b-4 border-[#C8102E]"
      >
      
      {/* Decorative Glow Elements */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#C8102E]/25 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/15 shadow-sm">
              <FaLocationDot className="text-[#EF5350]" />
              জুম্মাপাড়া, নীলফামারী সদর
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#C8102E] text-white border border-red-400/40 shadow-sm">
              <HiSparkles className="text-amber-300" />
              "শিখবো, জিতবো"
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              ৫ম থেকে ১০ম শ্রেণি
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            শিক্ষানোভা <span className="text-[#EF5350]">SikkhaNova</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl">
            ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য রোল অনুযায়ী দৈনিক উপস্থিতি, কোচিং রেজাল্ট ও স্বয়ংক্রিয় মার্কশিট, বিকাশ/নগদে প্রিমিয়াম হ্যান্ডনোট এবং ইউটিউব ভিডিও ক্লাস।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/pdfs"
              className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A60D26] text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-nova transition transform hover:-translate-y-0.5"
            >
              <FaFilePdf className="w-4 h-4" /> পিডিএফ হ্যান্ডনোট
            </Link>

            <Link
              href="/results"
              className="inline-flex items-center gap-2 bg-white text-[#0A1E3C] hover:bg-slate-100 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md transition transform hover:-translate-y-0.5"
            >
              <FaAward className="w-4 h-4 text-[#C8102E]" /> রেজাল্ট খুঁজুন
            </Link>

            <Link
              href="/attendance"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-white/20 transition transform hover:-translate-y-0.5"
            >
              <FaUserCheck className="w-4 h-4 text-emerald-400" /> রোল উপস্থিতি দিন
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <HiShieldCheck className="w-4 h-4 text-emerald-400" /> নির্ভরযোগ্য কোচিং সিস্টেম
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <TbCashBanknote className="w-4 h-4 text-nova-400" /> বিকাশ ও নগদ TrxID ভেরিফিকেশন
            </span>
          </div>
        </div>

        {/* Right Column: 3D Floating Glass Showcase Logo Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl border-2 border-white/40 space-y-6 transform hover:scale-102 transition-transform duration-300">
            
            <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-4 border border-slate-100 flex items-center justify-center shadow-inner">
              <Logo size="lg" clickable={false} />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-50 text-brand-900 font-bold border border-brand-100">
                <span className="flex items-center gap-1.5">
                  <FaLocationDot className="text-nova-600" /> কেন্দ্র:
                </span>
                <span>জুম্মাপাড়া, নীলফামারী সদর</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-100">
                <span className="flex items-center gap-1.5">
                  <FaPhone className="text-emerald-600" /> হেল্পলাইন:
                </span>
                <span className="font-bn-normal font-bold">০১৭১২৫৯২৫১৯</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 text-rose-900 font-bold border border-rose-100">
                <span className="flex items-center gap-1.5">
                  <HiSparkles className="text-slogan-600" /> স্লোগান:
                </span>
                <span className="font-black text-slogan-600">"শিখবো, জিতবো"</span>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0A1E3C] hover:bg-[#C8102E] text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
            >
              <span>স্টুডেন্ট ও টিচার পোর্টাল</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>

          </div>
        </div>

      </div>

      </section>
    </div>
  );
}

