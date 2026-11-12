'use client';

import React, { useState, useEffect } from 'react';
import {
  LandingStatItem,
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
} from '@/lib/defaultLandingContent';
import {
  FaUserGraduate,
  FaAward,
  FaBookOpen,
  FaClock,
} from 'react-icons/fa6';

export default function StatsCounterSection() {
  const [stats, setStats] = useState<LandingStatItem[]>(DEFAULT_LANDING_CONTENT.stats);

  useEffect(() => {
    try {
      const stored = getStoredLandingContent();
      if (stored?.stats && Array.isArray(stored.stats)) {
        setStats(stored.stats);
      }
    } catch {}

    fetch('/api/landing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.stats && Array.isArray(data.content.stats)) {
          setStats(data.content.stats);
        }
      })
      .catch(() => {});
  }, []);

  const getStatIcon = (idx: number) => {
    if (idx === 0) return <FaUserGraduate className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" />;
    if (idx === 1) return <FaAward className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />;
    if (idx === 2) return <FaBookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />;
    return <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />;
  };

  return (
    <section className="relative">
      <div className="bg-gradient-to-r from-[#07172C] via-[#0F2C59] to-[#0A1E3C] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#C8102E]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/50">
          {stats.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`flex flex-col items-center text-center p-3 sm:p-4 group ${
                idx > 1 ? 'pt-4 sm:pt-4' : ''
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {getStatIcon(idx)}
              </div>
              <span className="text-2xl sm:text-4xl font-black text-white tracking-tight font-mono group-hover:text-amber-300 transition-colors">
                {item.value}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

