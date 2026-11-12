'use client';

import React, { useState, useEffect } from 'react';
import {
  LandingWhyUsItem,
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
} from '@/lib/defaultLandingContent';
import {
  FaChartPie,
  FaBookBookmark,
  FaUserShield,
  FaAward,
  FaLightbulb,
} from 'react-icons/fa6';

export default function WhyChooseUsSection() {
  const [whyUsList, setWhyUsList] = useState<LandingWhyUsItem[]>(DEFAULT_LANDING_CONTENT.whyUs);

  useEffect(() => {
    try {
      const stored = getStoredLandingContent();
      if (stored?.whyUs && Array.isArray(stored.whyUs)) {
        setWhyUsList(stored.whyUs);
      }
    } catch {}

    fetch('/api/landing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.whyUs && Array.isArray(data.content.whyUs)) {
          setWhyUsList(data.content.whyUs);
        }
      })
      .catch(() => {});
  }, []);

  const getIcon = (idx: number) => {
    if (idx === 0) return <FaChartPie className="w-5 h-5 text-blue-600" />;
    if (idx === 1) return <FaBookBookmark className="w-5 h-5 text-emerald-600" />;
    if (idx === 2) return <FaUserShield className="w-5 h-5 text-amber-600" />;
    return <FaAward className="w-5 h-5 text-rose-600" />;
  };

  const getAccentGradient = (idx: number) => {
    if (idx === 0) return 'from-blue-500/10 to-indigo-500/10 border-blue-200';
    if (idx === 1) return 'from-emerald-500/10 to-teal-500/10 border-emerald-200';
    if (idx === 2) return 'from-amber-500/10 to-orange-500/10 border-amber-200';
    return 'from-rose-500/10 to-red-500/10 border-rose-200';
  };

  return (
    <section className="space-y-6" suppressHydrationWarning>
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black border border-blue-200">
          <FaLightbulb className="w-3 h-3 text-amber-500" />
          <span>আমাদের স্বাতন্ত্র্য ও বিশেষত্ব</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          কেন <span className="text-[#0F2C59]">শিক্ষানোভা</span> অভিভাবক ও শিক্ষার্থীদের প্রথম পছন্দ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          সনাতন পদ্ধতির বাইরে গিয়ে আধুনিক প্রযুক্তি ও ব্যক্তিগত যত্নের সমন্বয়ে আমরা নিশ্চিত করি প্রতিটি শিক্ষার্থীর শ্রেষ্ঠত্ব।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {whyUsList.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`bg-white rounded-3xl p-6 border ${getAccentGradient(
              idx
            )} shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 flex flex-col justify-between group hover:-translate-y-1`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                {getIcon(idx)}
              </div>
              <h3 className="text-base font-black text-slate-800 group-hover:text-brand-800 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-slate-600">
              <span>বৈশিষ্ট্য #{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

