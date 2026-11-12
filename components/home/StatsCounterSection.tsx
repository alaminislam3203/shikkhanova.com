'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  FaCircleCheck,
  FaArrowTrendUp,
  FaSparkles,
} from 'react-icons/fa6';

interface StatData {
  id: string;
  targetNumber: number;
  suffix: string;
  label: string;
  badgeText: string;
  description: string;
  icon: string;
}

interface CardLightConfig {
  iconBg: string;
  iconShadow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  topBarGradient: string;
  cardBg: string;
  borderHover: string;
  numberColor: string;
  suffixColor: string;
  defaultIcon: React.ComponentType<{ className?: string }>;
}

const LIGHT_CARD_CONFIGS: CardLightConfig[] = [
  {
    iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
    iconShadow: 'shadow-blue-500/25',
    badgeBg: 'bg-blue-50 text-blue-700',
    badgeBorder: 'border-blue-200/80',
    badgeText: 'সক্রিয় ব্যাচ',
    topBarGradient: 'from-blue-500 via-indigo-500 to-blue-400',
    cardBg: 'bg-gradient-to-b from-blue-50/30 via-white to-white',
    borderHover: 'hover:border-blue-300 hover:shadow-blue-500/10',
    numberColor: 'text-[#0A1E3C] group-hover:text-blue-600',
    suffixColor: 'text-blue-600',
    defaultIcon: FaUserGraduate,
  },
  {
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
    iconShadow: 'shadow-amber-500/25',
    badgeBg: 'bg-amber-50 text-amber-800',
    badgeBorder: 'border-amber-200/80',
    badgeText: 'ধারাবাহিক সাফল্য',
    topBarGradient: 'from-amber-400 via-orange-400 to-amber-300',
    cardBg: 'bg-gradient-to-b from-amber-50/30 via-white to-white',
    borderHover: 'hover:border-amber-300 hover:shadow-amber-500/10',
    numberColor: 'text-[#0A1E3C] group-hover:text-amber-600',
    suffixColor: 'text-amber-600',
    defaultIcon: FaAward,
  },
  {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    iconShadow: 'shadow-emerald-500/25',
    badgeBg: 'bg-emerald-50 text-emerald-800',
    badgeBorder: 'border-emerald-200/80',
    badgeText: 'আপডেটেড রিসোর্স',
    topBarGradient: 'from-emerald-500 via-teal-500 to-emerald-400',
    cardBg: 'bg-gradient-to-b from-emerald-50/30 via-white to-white',
    borderHover: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
    numberColor: 'text-[#0A1E3C] group-hover:text-emerald-600',
    suffixColor: 'text-emerald-600',
    defaultIcon: FaBookOpen,
  },
  {
    iconBg: 'bg-gradient-to-br from-[#C8102E] to-rose-600 text-white',
    iconShadow: 'shadow-rose-500/25',
    badgeBg: 'bg-rose-50 text-rose-800',
    badgeBorder: 'border-rose-200/80',
    badgeText: 'রিয়েল-টাইম টেস্ট',
    topBarGradient: 'from-[#C8102E] via-rose-500 to-red-400',
    cardBg: 'bg-gradient-to-b from-rose-50/30 via-white to-white',
    borderHover: 'hover:border-rose-300 hover:shadow-rose-500/10',
    numberColor: 'text-[#0A1E3C] group-hover:text-[#C8102E]',
    suffixColor: 'text-[#C8102E]',
    defaultIcon: FaClock,
  },
];

// Helper: Convert number to Bengali formatted string (e.g. 1500 -> ১,৫০০)
function toBengaliNumber(n: number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const formatted = Math.max(1, Math.round(n)).toLocaleString('en-US');
  return formatted.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)] || d);
}

// Helper: Parse Bengali/English string like "১,৫০০+" -> { num: 1500, suffix: '+' }
function parseStringNumber(val: string, fallback: number): { num: number; suffix: string } {
  if (!val) return { num: fallback, suffix: '+' };
  const bnToEn: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const enStr = val.replace(/[০-৯]/g, (d) => bnToEn[d] || d);
  const matched = enStr.match(/\d+/g);
  const num = matched ? parseInt(matched.join(''), 10) : fallback;
  const suffix = val.includes('%') ? '%' : '+';
  return { num: isNaN(num) ? fallback : num, suffix };
}

// Initial fallback stats matching DEFAULT_LANDING_CONTENT
const INITIAL_STATS: StatData[] = [
  {
    id: 'stat-students',
    targetNumber: 1500,
    suffix: '+',
    label: 'সফল শিক্ষার্থী',
    badgeText: 'সক্রিয় ব্যাচ',
    description: 'দেশসেরা প্রতিষ্ঠানে ভর্তির সুযোগ',
    icon: 'users',
  },
  {
    id: 'stat-gpa',
    targetNumber: 98,
    suffix: '%',
    label: 'জিপিএ-৫ ও পাশের হার',
    badgeText: 'ধারাবাহিক সাফল্য',
    description: 'বিগত ৫ বছরের ঈর্ষণীয় ফলাফল',
    icon: 'award',
  },
  {
    id: 'stat-sheets',
    targetNumber: 50,
    suffix: '+',
    label: 'এক্সক্লুসিভ শিট ও নোট',
    badgeText: 'আপডেটেড রিসোর্স',
    description: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ রঙিন শিট',
    icon: 'book',
  },
  {
    id: 'stat-quizzes',
    targetNumber: 100,
    suffix: '+',
    label: 'মডেল টেস্ট ও কুইজ',
    badgeText: 'রিয়েল-টাইম টেস্ট',
    description: 'মেধা যাচাই ও লাইভ র‍্যাঙ্কিং',
    icon: 'clock',
  },
];

export default function StatsCounterSection() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [statsData, setStatsData] = useState<StatData[]>(INITIAL_STATS);

  // Animated counting values per card (starts at 1)
  const [counts, setCounts] = useState<number[]>([1, 1, 1, 1]);
  const animationTriggeredRef = useRef<boolean>(false);

  // 1. Fetch Dynamic Real Data from Database API
  useEffect(() => {
    setMounted(true);

    // Initial check from localStorage / default content
    try {
      const stored = getStoredLandingContent();
      if (stored?.stats && Array.isArray(stored.stats) && stored.stats.length >= 4) {
        setStatsData((prev) =>
          prev.map((item, idx) => {
            const storedItem = stored.stats[idx];
            if (!storedItem) return item;
            const parsed = parseStringNumber(storedItem.value, item.targetNumber);
            return {
              ...item,
              targetNumber: parsed.num,
              suffix: parsed.suffix,
              label: storedItem.label || item.label,
            };
          })
        );
      }
    } catch {}

    // Fetch dynamic live stats from Database API (/api/stats)
    fetch('/api/stats', { cache: 'no-store' })
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && Array.isArray(resData.stats) && resData.stats.length > 0) {
          setStatsData(resData.stats);
        }
      })
      .catch(() => {
        // Fallback to /api/landing if /api/stats fails
        fetch('/api/landing', { cache: 'no-store' })
          .then((res) => res.json())
          .then((data) => {
            if (data?.content?.stats && Array.isArray(data.content.stats)) {
              const liveStats = data.content.stats as LandingStatItem[];
              setStatsData((prev) =>
                prev.map((item, idx) => {
                  const s = liveStats[idx];
                  if (!s) return item;
                  const parsed = parseStringNumber(s.value, item.targetNumber);
                  return {
                    ...item,
                    targetNumber: parsed.num,
                    suffix: parsed.suffix,
                    label: s.label || item.label,
                  };
                })
              );
            }
          })
          .catch(() => {});
      });
  }, []);

  // 2. Smooth Count-Up Animation from 1 to Target
  useEffect(() => {
    if (!mounted) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds smooth ease-out count
    let animationFrameId: number;

    const startValue = 1; // Count begins from 1 as requested

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const nextCounts = statsData.map((item) => {
        const target = item.targetNumber;
        const current = startValue + (target - startValue) * easeProgress;
        return Math.max(1, Math.round(current));
      });

      setCounts(nextCounts);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        // Final exact targets
        setCounts(statsData.map((item) => item.targetNumber));
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, statsData]);

  const getIconComponent = (item: StatData, idx: number) => {
    const iconName = item.icon?.toLowerCase() || '';
    if (iconName.includes('user') || iconName.includes('student')) return FaUserGraduate;
    if (iconName.includes('award') || iconName.includes('gpa') || iconName.includes('trophy')) return FaAward;
    if (iconName.includes('book') || iconName.includes('sheet') || iconName.includes('note')) return FaBookOpen;
    if (iconName.includes('clock') || iconName.includes('quiz') || iconName.includes('test')) return FaClock;

    const config = LIGHT_CARD_CONFIGS[idx % LIGHT_CARD_CONFIGS.length];
    return config.defaultIcon;
  };

  return (
    <section className="relative py-2 select-none" suppressHydrationWarning>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {statsData.map((item, idx) => {
          const config = LIGHT_CARD_CONFIGS[idx % LIGHT_CARD_CONFIGS.length];
          const IconComp = getIconComponent(item, idx);
          const currentCount = counts[idx] || 1;
          const displayCount = toBengaliNumber(currentCount);

          return (
            <div
              key={item.id || idx}
              suppressHydrationWarning
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl ${config.cardBg} border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${config.borderHover}`}
            >
              {/* Top Accent Strip with Hover Expansion */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.topBarGradient} opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-300`}
              />

              {/* Faint Background Watermark Icon */}
              <div className="absolute -right-3 -top-3 opacity-[0.035] group-hover:opacity-[0.07] group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 pointer-events-none text-slate-800">
                <IconComp className="w-28 h-28" />
              </div>

              {/* Card Top Row: 3D-styled Vibrant Icon + Light Theme Badge */}
              <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shadow-md ${config.iconShadow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${config.iconBg}`}
                >
                  <IconComp className="w-6 h-6" />
                </div>

                <div
                  suppressHydrationWarning
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border shadow-2xs ${config.badgeBg} ${config.badgeBorder}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span suppressHydrationWarning>{item.badgeText || config.badgeText}</span>
                </div>
              </div>

              {/* Card Middle: Counting Number with Live Suffix */}
              <div className="relative z-10 space-y-1.5 mt-auto">
                <div className="flex items-baseline gap-1.5">
                  <span
                    suppressHydrationWarning
                    className={`text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black font-mono tracking-tight transition-colors duration-200 ${config.numberColor}`}
                  >
                    {displayCount}
                  </span>
                  <span
                    suppressHydrationWarning
                    className={`text-2xl sm:text-3xl font-extrabold font-mono transition-transform duration-300 group-hover:scale-110 origin-left ${config.suffixColor}`}
                  >
                    {item.suffix}
                  </span>
                  <FaArrowTrendUp className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1" />
                </div>

                {/* Card Title Label */}
                <h3
                  suppressHydrationWarning
                  className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </h3>

                {/* Card Footnote / Dynamic Subtitle */}
                <p
                  suppressHydrationWarning
                  className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pt-2 border-t border-slate-100 mt-2"
                >
                  <FaCircleCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{item.description}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
