'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaGraduationCap,
  FaUserCheck,
  FaAward,
  FaFilePdf,
  FaYoutube,
  FaFacebook,
  FaPhone,
  FaLocationDot,
  FaArrowRight,
  FaBookOpen,
  FaStar,
  FaCircleCheck,
  FaClock,
} from 'react-icons/fa6';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi2';
import { TbCashBanknote, TbFileDownload } from 'react-icons/tb';

export default function HomePage() {
  const classes = [
    { grade: 5, bn: '৫ম শ্রেণি', name: 'Class 5', rolls: 'রোল ১-৫০', color: 'from-blue-600 to-indigo-600' },
    { grade: 6, bn: '৬ষ্ঠ শ্রেণি', name: 'Class 6', rolls: 'রোল ১-৫০', color: 'from-indigo-600 to-brand-700' },
    { grade: 7, bn: '৭ম শ্রেণি', name: 'Class 7', rolls: 'রোল ১-৫০', color: 'from-brand-700 to-brand-800' },
    { grade: 8, bn: '৮ম শ্রেণি', name: 'Class 8', rolls: 'রোল ১-৫০', color: 'from-nova-500 to-amber-600' },
    { grade: 9, bn: '৯ম শ্রেণি', name: 'Class 9', rolls: 'রোল ১-৫০', color: 'from-amber-600 to-orange-700' },
    { grade: 10, bn: '১০ম শ্রেণি', name: 'Class 10', rolls: 'রোল ১-৫০', color: 'from-slogan-600 to-rose-700' },
  ];

  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white p-6 sm:p-12 lg:p-16 shadow-premium border border-brand-700/50">
        
        {/* Glow & Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-nova-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-slogan-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-nova-300 border border-white/15">
              <FaLocationDot className="text-nova-400" />
              জুম্মাপাড়া, নীলফামারী সদর
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-slogan-600/30 text-rose-200 border border-slogan-500/40">
              <HiSparkles className="text-nova-300" />
              স্লোগান: "শিখবো, জিতবো"
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <FaCircleCheck className="w-3 h-3" /> শ্রেণি ৫ থেকে ১০
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            শিক্ষানোভা <span className="text-nova-400">SikkhaNova</span>
          </h1>

          <p className="text-base sm:text-xl text-blue-100 font-normal leading-relaxed max-w-2xl">
            ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের রোল ভিত্তিক হাজিরা, কোচিং পরীক্ষার ফলাফল, অধ্যায়ভিত্তিক প্রিমিয়াম পিডিএফ শিট এবং ইউটিউব ভিডিও ক্লাস নিয়ে সম্পূর্ণ ডিজিটাল শিক্ষা সমাধান।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/attendance"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-nova-500 to-nova-600 hover:from-nova-600 hover:to-nova-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-nova transition transform hover:-translate-y-0.5"
            >
              <FaUserCheck className="w-4 h-4" /> রোল উপস্থিতি দিন
            </Link>
            
            <Link
              href="/results"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-white/20 transition transform hover:-translate-y-0.5"
            >
              <FaAward className="w-4 h-4 text-nova-300" /> রেজাল্ট খুঁজুন
            </Link>

            <Link
              href="/pdfs"
              className="inline-flex items-center gap-2 bg-slogan-600 hover:bg-slogan-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow transition transform hover:-translate-y-0.5"
            >
              <FaFilePdf className="w-4 h-4" /> পিডিএফ হ্যান্ডনোট
            </Link>
          </div>

        </div>

      </section>

      {/* Class 5 to 10 Navigation Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaBookOpen className="text-brand-700" /> শ্রেণি নির্বাচন (Classes 5 - 10)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">আপনার শ্রেণি নির্বাচন করে সরাসরি রোল উপস্থিতি, ফলাফল বা ভিডিও ক্লাস দেখুন</p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            রোল নম্বর অনুযায়ী সাজানো
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {classes.map((c) => (
            <Link
              key={c.grade}
              href={`/attendance?classGrade=${c.grade}`}
              className="group bg-white hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 p-5 rounded-2xl text-center shadow-sm hover:shadow-brand transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-3xl font-black text-brand-700 group-hover:text-nova-600 transition-colors inline-block">
                  {c.bn.split(' ')[0]}
                </span>
                <h3 className="text-sm font-bold text-slate-800">{c.name}</h3>
                <p className="text-[11px] font-medium text-slate-400">{c.rolls}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-brand-700 group-hover:text-nova-600">
                <span>হাজিরা দিন</span>
                <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Attendance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-xl shadow-inner">
              <FaUserCheck />
            </div>
            <h3 className="text-lg font-bold text-slate-800">রোল ভিত্তিক উপস্থিতি</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ক্লাস ৫, ৬, ৭, ৮, ৯ ও ১০ম শ্রেণির প্রতিটি শিক্ষার্থীর রোল নম্বর অনুযায়ী দ্রুত উপস্থিত (Present), অনুপস্থিত (Absent) বা বিলম্ব (Late) মার্ক করুন।
            </p>
          </div>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 pt-2"
          >
            হাজিরা প্যানেলে যান <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 2: Coaching Results */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-nova-600 flex items-center justify-center text-xl shadow-inner">
              <FaAward />
            </div>
            <h3 className="text-lg font-bold text-slate-800">কোচিং রেজাল্ট ও মার্কশিট</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              উইকলি, মান্থলি ও মডেল টেস্টের ফলাফল প্রকাশ। রোল নম্বর ও শ্রেণি সিলেক্ট করলেই স্বয়ংক্রিয় জিপিএ গ্রেড ও প্রিন্টযোগ্য মার্কশিট।
            </p>
          </div>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-xs font-bold text-nova-600 hover:text-nova-700 pt-2"
          >
            ফলাফল অনুসন্ধান করুন <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 3: PDF Notes with bKash/Nagad */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-slogan-600 flex items-center justify-center text-xl shadow-inner">
              <FaFilePdf />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">পিডিএফ হ্যান্ডনোট</h3>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">TrxID পেমেন্ট</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              স্পেশাল লেকচার শিট ও বোর্ড সাজেশন। বিকাশ ও নগদে ফি পাঠিয়ে TrxID সাবমিট করলেই অ্যাডমিন অ্যাপ্রুভ করে পিডিএফ আনলক করবেন।
            </p>
          </div>
          <Link
            href="/pdfs"
            className="inline-flex items-center gap-2 text-xs font-bold text-slogan-600 hover:text-slogan-700 pt-2"
          >
            পিডিএফ নোট দেখুন <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 4: YouTube Lessons */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shadow-inner">
              <FaYoutube />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">ইউটিউব ক্লাস</h3>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">@ShikkhaNova</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              শিক্ষানোভার অফিসিয়াল ইউটিউব চ্যানেল থেকে বিষয়ভিত্তিক অভিজ্ঞ শিক্ষকদের রেকর্ডেড ক্লাস ও প্রশ্নের সমাধান সরাসরি ব্রাউজ করুন।
            </p>
          </div>
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 pt-2"
          >
            ভিডিও ক্লাস দেখুন <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </section>

      {/* Manual PDF Payment Banner (bKash & Nagad) */}
      <section className="bg-gradient-to-r from-brand-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="bg-nova-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            বিকাশ ও নগদ ম্যানুয়াল পেমেন্ট
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            পিডিএফ শিট পেতে বিকাশ বা নগদে ফি পাঠান
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            পার্সোনাল নম্বর: <strong className="font-mono text-white text-base">01712592519</strong> এ সেন্ড মানি করুন। তারপর পিডিএফ পেজে গিয়ে আপনার TrxID দিয়ে সাবমিট করুন। অ্যাডমিন ভেরিফাই করে ডাউনলোড লিংক ওপেন করে দিবে।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] font-bold text-bkash bg-white px-2 py-0.5 rounded-full">bKash Personal</span>
            <p className="text-base font-black font-mono">01712592519</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] font-bold text-nagad bg-white px-2 py-0.5 rounded-full">Nagad Personal</span>
            <p className="text-base font-black font-mono">01712592519</p>
          </div>
          <Link
            href="/pdfs"
            className="inline-flex items-center justify-center gap-2 bg-nova-500 hover:bg-nova-600 text-white font-bold px-6 py-4 rounded-2xl text-sm shadow transition"
          >
            <TbFileDownload className="w-5 h-5" /> শিট কিনতে যান
          </Link>
        </div>
      </section>

      {/* Social & Contact Bar */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-xl flex-shrink-0">
            <FaLocationDot />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">অফিসের ঠিকানা</h4>
            <p className="text-xs text-slate-500">জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
            <FaPhone />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">হেল্পলাইন ও যোগাযোগ</h4>
            <p className="text-xs font-mono text-slate-500">01712592519 (কল ও হোয়াটসঅ্যাপ)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
            <FaFacebook />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">ফেসবুক পেজ</h4>
            <a
              href="https://facebook.com/ShikkhaNova"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              facebook.com/ShikkhaNova
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
