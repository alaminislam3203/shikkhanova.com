'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import {
  FaQuoteLeft,
  FaPhone,
  FaLocationDot,
  FaEnvelope,
  FaCircleCheck,
  FaArrowLeft,
} from 'react-icons/fa6';

export default function ChairmanMessagePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-8">
      {/* Header Banner (Compact on Mobile) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden text-white p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-b-4 border-[#C8102E]"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <span className="inline-block bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-sm uppercase">
              আমাদের সম্পর্কে
            </span>
            <h1 className="text-lg sm:text-3xl md:text-4xl font-black tracking-tight leading-snug sm:leading-tight">
              চেয়ারম্যানের বার্তা
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-200">
              শিক্ষা নোভা একাডেমির প্রতিষ্ঠাতা ও পরিচালকের শুভেচ্ছা ও দিকনির্দেশনা
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-sm border border-white/15 transition self-start sm:self-auto"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>শিক্ষা নোভা সম্পর্কে</span>
          </Link>
        </div>
      </div>

      {/* Main Message Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Profile Column */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center space-y-4">
          <div className="w-40 h-48 sm:w-44 sm:h-52 mx-auto rounded-2xl bg-gradient-to-br from-[#0A1E3C] to-[#C8102E] p-1 shadow-lg">
            <div className="w-full h-full rounded-xl bg-white overflow-hidden">
              <img
                src="/chairman.png"
                alt="রবিউল ইসলাম - চেয়ারম্যান ও পরিচালক, শিক্ষা নোভা একাডেমি"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#0A1E3C]">রবিউল ইসলাম</h2>
            <p className="text-xs font-bold text-[#C8102E]">
              চেয়ারম্যান ও পরিচালক, শিক্ষা নোভা একাডেমি
            </p>
            <p className="text-[11px] text-slate-500">জুম্মাপাড়া, নীলফামারী সদর</p>
          </div>

          <div className="pt-3 border-t border-slate-200 text-left space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <FaPhone className="text-emerald-600 shrink-0" />
              <span className="font-bn-normal font-bold text-slate-800">০১৭১২৫৯২৫১৯</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-[#C8102E] shrink-0" />
              <span className="truncate">robiulnil101@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLocationDot className="text-[#0A1E3C] shrink-0" />
              <span>জুম্মাপাড়া, নীলফামারী সদর</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Logo size="sm" clickable={false} />
          </div>
        </div>

        {/* Right Letter Column */}
        <div className="lg:col-span-8 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C8102E] flex items-center justify-center text-lg">
            <FaQuoteLeft />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#0A1E3C]">
            প্রিয় শিক্ষার্থী ও সম্মানিত অভিভাবকবৃন্দ, আসসালামু আলাইকুম।
          </h3>

          <p>
            একজন শিক্ষার্থীর শিক্ষাজীবনের সবচেয়ে গুরুত্বপূর্ণ ভিত্তি গড়ে ওঠে ৫ম থেকে ১০ম শ্রেণির মধ্যে। এই সময়ে সঠিক দিকনির্দেশনা, মানসম্মত নোট এবং নিয়মিত মূল্যায়ন একজন সাধারণ শিক্ষার্থীকেও অসাধারণ সাফল্যের চূড়ায় পৌঁছে দিতে পারে। সেই লক্ষ্যকে সামনে রেখেই নীলফামারী সদরের জুম্মাপাড়ায় আমাদের প্রিয় প্রতিষ্ঠান{' '}
            <strong className="text-[#0A1E3C]">“শিক্ষা নোভা (ShikkhaNova)”</strong>-এর যাত্রা।
          </p>

          <p>
            আমাদের মূলমন্ত্র <strong className="text-[#C8102E]">“শিখবো, জিতবো”</strong>। আমরা বিশ্বাস করি, প্রতিটি শিক্ষার্থীর ভেতরেই অসীম সম্ভাবনা লুকিয়ে আছে। শুধু প্রয়োজন সঠিক যত্ন, অধ্যায়ভিত্তিক সুস্পষ্ট ধারণা এবং নিয়মিত অনুশীলনের মাধ্যমে আত্মবিশ্বাস তৈরি করা।
          </p>

          <p>
            সময়ের সাথে তাল মিলিয়ে আমরা আমাদের শিক্ষা ব্যবস্থাকে সম্পূর্ণ ডিজিটাল প্ল্যাটফর্মে রূপান্তর করেছি—যেখানে শিক্ষার্থীরা ঘরে বসেই অধ্যায়ভিত্তিক প্রিমিয়াম পিডিএফ হ্যান্ডনোট সংগ্রহ করতে পারছে, পরীক্ষার সাথে সাথে অনলাইনে রোল নম্বর দিয়ে অফিশিয়াল মার্কশিট দেখতে পারছে এবং ইউটিউব ভিডিও ক্লাসের মাধ্যমে যেকোনো অধ্যায় সহজেই রিভিশন দিতে পারছে।
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-[#C8102E] space-y-2 text-xs sm:text-sm">
            <p className="font-bold text-[#0A1E3C] flex items-center gap-1.5">
              <FaCircleCheck className="text-[#C8102E]" /> আমাদের অঙ্গীকার:
            </p>
            <p className="text-slate-600">
              প্রতিটি শিক্ষার্থীকে নিজের সন্তানের মতো যত্ন নিয়ে পাঠদান করা এবং অভিভাবকদের কাছে শতভাগ স্বচ্ছ জবাবদিহিতা নিশ্চিত করাই আমাদের প্রধান দায়িত্ব।
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#0A1E3C] text-base">রবিউল ইসলাম</p>
              <p className="text-xs text-slate-500">চেয়ারম্যান ও পরিচালক, শিক্ষা নোভা একাডেমি</p>
            </div>
            <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3.5 py-1.5 rounded-sm self-start sm:self-auto">
              “শিখবো, জিতবো”
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

