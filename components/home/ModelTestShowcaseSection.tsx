"use client";

import React from "react";
import Link from "next/link";
import { FaFire, FaArrowRight, FaCheck } from "react-icons/fa6";

export default function ModelTestShowcaseSection() {
  return (
    <section className="space-y-4 sm:space-y-6" suppressHydrationWarning>
      <div className="p-3.5 sm:p-8 lg:p-10 relative overflow-hidden bg-white/80 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header (Same layout on Mobile and Desktop, scaled down on mobile) */}
        <div className="flex flex-row items-center justify-between gap-2.5 sm:gap-6 pb-3 sm:pb-6 border-b border-slate-100">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-100/80 text-[#C8102E] text-[9px] sm:text-xs font-black border border-red-200">
              <FaFire className="w-2 h-2 sm:w-3 sm:h-3 text-red-600 animate-pulse" />
              <span>লাইভ মডেল টেস্ট ও কুইজ প্রস্তুতি</span>
            </div>
            <h2 className="text-xs sm:text-2xl lg:text-3xl font-black text-[#0A1E3C] tracking-tight leading-snug">
              আজই তোমার প্রস্তুতি যাচাই করো —{" "}
              <span className="text-[#C8102E]">অনলাইন MCQ টেস্ট</span>
            </h2>
            <p className="text-[9px] sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
              ৫ম থেকে ১০ম শ্রেণির প্রতিটি বিষয়ের অধ্যায়ভিত্তিক ফ্রি ও পেইড পরীক্ষা।
              তাৎক্ষণিক স্বয়ংক্রিয় ফলাফল, সমাধান, মেধা তালিকা ও স্পেশাল প্যাকেজ।
            </p>
          </div>

          <Link
            href="/quiz"
            className="inline-flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] hover:opacity-95 text-white font-black text-[10px] sm:text-sm rounded-lg sm:rounded-2xl shadow-sm sm:shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 shrink-0 whitespace-nowrap"
          >
            <span>সবগুলো টেস্ট দেখুন</span>
            <FaArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {/* Feature Highlights (Same 3-column row on Mobile and Desktop, scaled down on mobile) */}
        <div className="pt-3 sm:pt-6 grid grid-cols-3 gap-1.5 sm:gap-3 text-slate-700 font-bold">
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/60">
            <span className="w-4 h-4 sm:w-6 sm:h-6 rounded sm:rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-2 h-2 sm:w-3 sm:h-3" />
            </span>
            <span className="text-[8px] sm:text-xs leading-tight font-bold">
              তাৎক্ষণিক অটোমেটিক স্কোর ও গ্রেড
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/60">
            <span className="w-4 h-4 sm:w-6 sm:h-6 rounded sm:rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-2 h-2 sm:w-3 sm:h-3" />
            </span>
            <span className="text-[8px] sm:text-xs leading-tight font-bold">
              প্রতিটি প্রশ্নের বিস্তারিত সঠিক ব্যাখ্যা
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/60">
            <span className="w-4 h-4 sm:w-6 sm:h-6 rounded sm:rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-2 h-2 sm:w-3 sm:h-3" />
            </span>
            <span className="text-[8px] sm:text-xs leading-tight font-bold">
              মেধা তালিকা / লিডারবোর্ড মেডেল
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
