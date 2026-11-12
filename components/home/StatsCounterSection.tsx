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
  FaUsers,
  FaTrophy,
  FaArrowTrendUp,
  FaCircleCheck,
} from 'react-icons/fa6';

interface CardStyleConfig {
  gradient: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;
  borderHover: string;
  glowColor: string;
  textGradient: string;
  barGradient: string;
  defaultDesc: string;
  defaultIcon: React.ComponentType<{ className?: string }>;
}

const CARD_STYLES: CardStyleConfig[] = [
  {
    gradient: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30',
    iconColor: 'text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
    badgeText: 'সক্রিয় ব্যাচ',
    badgeLabel: 'সক্রিয় শিক্ষার্থী',
    borderHover: 'group-hover:border-blue-400 dark:group-hover:border-blue-600',
    glowColor: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    textGradient: 'group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-300',
    barGradient: 'from-blue-600 via-indigo-600 to-blue-400',
    defaultDesc: 'দেশসেরা প্রতিষ্ঠানে ভর্তির সুযোগ',
    defaultIcon: FaUserGraduate,
  },
  {
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/30',
    iconColor: 'text-white',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
    badgeText: 'ধারাবাহিক সাফল্য',
    badgeLabel: 'বোর্ড ও বার্ষিক ফল',
    borderHover: 'group-hover:border-amber-400 dark:group-hover:border-amber-600',
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    textGradient: 'group-hover:from-amber-600 group-hover:to-orange-600 dark:group-hover:from-amber-400 dark:group-hover:to-orange-300',
    barGradient: 'from-amber-500 via-yellow-500 to-amber-400',
    defaultDesc: 'বিগত ৫ বছরের ঈর্ষণীয় ফলাফল',
    defaultIcon: FaAward,
  },
  {
    gradient: 'from-emerald-500 to-teal-700',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30',
    iconColor: 'text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    badgeText: 'আপডেটেড স্টাডি ম্যাট',
    badgeLabel: 'নোট ও শিট',
    borderHover: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-600',
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    textGradient: 'group-hover:from-emerald-600 group-hover:to-teal-600 dark:group-hover:from-emerald-400 dark:group-hover:to-teal-300',
    barGradient: 'from-emerald-500 via-teal-500 to-emerald-400',
    defaultDesc: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ রঙিন শিট',
    defaultIcon: FaBookOpen,
  },
  {
    gradient: 'from-[#C8102E] to-rose-600',
    iconBg: 'bg-gradient-to-br from-[#C8102E] to-rose-600 text-white shadow-rose-500/30',
    iconColor: 'text-white',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40',
    badgeText: 'রিয়েল-টাইম টেস্ট',
    badgeLabel: 'পরীক্ষা ও মূল্যায়ন',
    borderHover: 'group-hover:border-rose-400 dark:group-hover:border-rose-600',
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    textGradient: 'group-hover:from-[#C8102E] group-hover:to-rose-600 dark:group-hover:from-rose-400 dark:group-hover:to-red-300',
    barGradient: 'from-[#C8102E] via-red-500 to-rose-400',
    defaultDesc: 'মেধা যাচাই ও লাইভ র‍্যাঙ্কিং',
    defaultIcon: FaClock,
  },
];

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

  const getStatIconComponent = (item: LandingStatItem, idx: number) => {
    const iconName = item.icon?.toLowerCase() || '';
    if (iconName.includes('user') || iconName.includes('graduate')) return FaUserGraduate;
    if (iconName.includes('award') || iconName.includes('trophy')) return FaAward;
    if (iconName.includes('book')) return FaBookOpen;
    if (iconName.includes('clock') || iconName.includes('test')) return FaClock;

    const config = CARD_STYLES[idx % CARD_STYLES.length];
    return config.defaultIcon;
  };

  return (
    <section className="relative py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {stats.map((item, idx) => {
          const config = CARD_STYLES[idx % CARD_STYLES.length];
          const IconComp = getStatIconComponent(item, idx);

          return (
            <div
              key={item.id || idx}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${config.borderHover}`}
            >
              {/* Subtle Ambient Glow inside Card */}
              <div
                className={`absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${config.glowColor}`}
              />

              {/* Watermark Faint Background Icon */}
              <div className="absolute -right-4 -top-4 opacity-[0.04] dark:opacity-[0.06] group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 pointer-events-none text-slate-900 dark:text-white">
                <IconComp className="w-28 h-28" />
              </div>

              {/* Top Accent Strip with Hover Expansion */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.barGradient} opacity-70 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-300`}
              />

              {/* Card Top Row: Icon + Badge */}
              <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${config.iconBg}`}
                >
                  <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold border backdrop-blur-sm shadow-xs ${config.badgeBg}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>{config.badgeText}</span>
                </div>
              </div>

              {/* Card Content: Big Dynamic Value + Label */}
              <div className="relative z-10 space-y-1.5 mt-auto">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent bg-gradient-to-r ${config.textGradient}`}
                  >
                    {item.value}
                  </span>
                  <FaArrowTrendUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {item.label}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <FaCircleCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{config.defaultDesc}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
