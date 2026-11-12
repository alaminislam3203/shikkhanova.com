'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toBengaliClass } from '@/lib/defaultQuizData';
import {
  FaGraduationCap,
  FaBolt,
  FaGem,
  FaCheck,
  FaArrowRight,
  FaGift,
} from 'react-icons/fa6';

export default function ModelTestShowcaseSection() {
  const [selectedClass, setSelectedClass] = useState<number>(6);

  const classBadges = [
    { grade: 5, tag: 'বৃত্তি ও ফাইনাল' },
    { grade: 6, tag: 'নতুন কারিকুলাম' },
    { grade: 7, tag: 'অধ্যায়ভিত্তিক' },
    { grade: 8, tag: 'জুনিয়র স্পেশাল' },
    { grade: 9, tag: 'বিজ্ঞান/মানবিক/ব্যবসায়' },
    { grade: 10, tag: 'এসএসসি ক্র্যাশ ব্যাচ' },
  ];

  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-br from-white via-red-50/20 to-white rounded-3xl p-6 sm:p-10 border border-red-100 shadow-md relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 text-[#C8102E] text-xs font-black border border-red-200">
              <FaBolt className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>ইন্টারেক্টিভ কুইজ ও প্রস্তুতি</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#0A1E3C] tracking-tight">
              আজই তোমার প্রস্তুতি যাচাই করো — <span className="text-[#C8102E]">অনলাইন মডেল টেস্ট</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির প্রতিটি অধ্যায়ের গুরুত্বপূর্ণ MCQ পরীক্ষা। তাৎক্ষণিক স্বয়ংক্রিয় ফলাফল, গ্রেড শিট, ব্যাখ্যাসহ সমাধান ও লাইভ লিডারবোর্ড র‍্যাঙ্কিং।
            </p>
          </div>

          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            <span>সবগুলো টেস্ট দেখুন</span>
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Class Selector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          {classBadges.map((c) => (
            <Link
              key={c.grade}
              href={`/quiz`}
              className="group bg-white hover:bg-gradient-to-b hover:from-white hover:to-red-50/60 p-4 rounded-2xl border border-slate-200/90 hover:border-red-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-center relative overflow-hidden"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-[#C8102E] transition-colors">
                  {c.tag}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  {toBengaliClass(c.grade)} শ্রেণি
                </h3>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <FaGift className="w-2.5 h-2.5" /> ১০০% ফ্রি
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-black text-[#C8102E] group-hover:translate-x-0.5 transition-transform">
                <span>টেস্ট দিন</span>
                <FaArrowRight className="w-2.5 h-2.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Highlights Banner inside Showcase */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-bold">
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>তাৎক্ষণিক অটোমেটিক স্কোর ও গ্রেড</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>প্রতিটি প্রশ্নের বিস্তারিত সঠিক ব্যাখ্যা</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>মেধা তালিকা / লিডারবোর্ড মেডেল</span>
          </div>
        </div>
      </div>
    </section>
  );
}

