'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LandingDirectorInfo,
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
} from '@/lib/defaultLandingContent';
import {
  FaQuoteLeft,
  FaPhoneVolume,
  FaEnvelope,
  FaUserTie,
  FaCircleCheck,
} from 'react-icons/fa6';

export default function DirectorMessageSection() {
  const [director, setDirector] = useState<LandingDirectorInfo>(DEFAULT_LANDING_CONTENT.director);

  useEffect(() => {
    try {
      const stored = getStoredLandingContent();
      if (stored?.director) {
        setDirector(stored.director);
      }
    } catch {}

    // First try fetching landing content
    fetch('/api/landing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.director) {
          setDirector((prev) => ({
            ...prev,
            ...data.content.director,
          }));
        }
      })
      .catch(() => {});

    // Also fetch admin profile to get the live Cloudinary photo if uploaded
    fetch('/api/user/profile', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.image) {
          setDirector((prev) => ({
            ...prev,
            image: data.user.image,
            name: data.user.name || prev.name,
            phone: data.user.phone || prev.phone,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative">
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl overflow-hidden relative">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-nova-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Director Image & Badges (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              {/* Outer Decorative Ring */}
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl p-2 bg-gradient-to-tr from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] shadow-2xl transition-transform duration-300 group-hover:scale-102">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  {director.image ? (
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                      <FaUserTie className="w-16 h-16 text-slate-300 mb-2" />
                      <span className="text-xs font-bold text-slate-500">{director.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-2.5 right-6 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5">
                <FaCircleCheck className="w-3 h-3 text-emerald-200" />
                <span>প্রতিষ্ঠাতা ও পরিচালক</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                {director.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#C8102E]">
                {director.designation}
              </p>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <a
                href={`tel:${director.phone}`}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <FaPhoneVolume className="w-3 h-3 text-emerald-400" />
                <span className="font-mono">{director.phone}</span>
              </a>
              <a
                href={`mailto:${director.email}`}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                <FaEnvelope className="w-3 h-3 text-slate-500" />
                <span>ইমেইল করুন</span>
              </a>
            </div>
          </div>

          {/* Director Message & Quote (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5 lg:pl-6 lg:border-l border-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] text-xs font-black border border-red-200">
              <FaQuoteLeft className="w-2.5 h-2.5" />
              <span>পরিচালকের অনুপ্রেরণামূলক বার্তা</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              "{director.quote}"
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {director.message}
            </p>

            {/* Key Focus Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-black text-brand-700 uppercase">ব্যক্তিগত যত্ন</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  দুর্বল শিক্ষার্থীদের জন্য অতিরিক্ত রিভিশন ক্লাস ও নিবিড় তদারকি।
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-black text-emerald-700 uppercase">প্রযুক্তিগত উৎকর্ষ</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  ডিজিটাল পরীক্ষা, এসএমএস এলার্ট ও অধ্যায়ভিত্তিক স্মার্ট হ্যান্ডনোট।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
