'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FaTrophy,
  FaArrowLeft,
  FaMagnifyingGlass,
  FaRotateRight,
  FaArrowRight,
  FaCircleCheck,
  FaCalendarDays,
  FaGraduationCap,
} from 'react-icons/fa6';

export interface Performer {
  id: string;
  rank?: number;
  name: string;
  photoUrl: string;
  classGrade: number; // 5 - 10
  subject: string; // 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Bangla', 'General Science'
  period: 'weekly' | 'monthly';
  totalScore: number; // e.g. 88.0, 74.0, 60.0
  examScorePercent: number; // e.g. 80
  attendancePercent: number; // e.g. 100
  attentiveMin: number; // e.g. 120
  badgeTitle?: string;
  date?: string;
}

// Default Seed Data across subjects and periods
const INITIAL_PERFORMERS: Performer[] = [
  // Physics Weekly (Exactly mimicking the showcase screenshot)
  {
    id: 'p-1',
    name: 'NADIA SULTANA B.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88,
    examScorePercent: 80,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '১০ নভেম্বর ২০২৬',
  },
  {
    id: 'p-2',
    name: 'AISIKUR RAHMAN',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 74,
    examScorePercent: 80,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৯ নভেম্বর ২০২৬',
  },
  {
    id: 'p-3',
    name: 'MD. MONSURU...',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 60,
    examScorePercent: 80,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৯ নভেম্বর ২০২৬',
  },
  {
    id: 'p-4',
    name: 'Riya Chowdhury',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৮ নভেম্বর ২০২৬',
  },
  {
    id: 'p-5',
    name: 'Samiha Rahman',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৮ নভেম্বর ২০২৬',
  },
  {
    id: 'p-6',
    name: 'Nafisa Ahmed',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    classGrade: 9,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৭ নভেম্বর ২০২৬',
  },
  {
    id: 'p-7',
    name: 'Tania Sultana',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    classGrade: 9,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৭ নভেম্বর ২০২৬',
  },
  {
    id: 'p-8',
    name: 'Kazi Anika',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80',
    classGrade: 8,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৬ নভেম্বর ২০২৬',
  },
  {
    id: 'p-9',
    name: 'Rafiq Hasan',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    classGrade: 8,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৫ নভেম্বর ২০২৬',
  },
  {
    id: 'p-10',
    name: 'Maya Akhtar',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80',
    classGrade: 7,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88.6,
    examScorePercent: 70,
    attendancePercent: 100,
    attentiveMin: 120,
    date: '০৫ নভেম্বর ২০২৬',
  },

  // Mathematics Seed
  {
    id: 'm-1',
    name: 'ফারজানা আক্তার মীম',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Mathematics',
    period: 'weekly',
    totalScore: 98,
    examScorePercent: 95,
    attendancePercent: 100,
    attentiveMin: 140,
    date: '১০ নভেম্বর ২০২৬',
  },
  {
    id: 'm-2',
    name: 'তানভীর আহমেদ',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    classGrade: 9,
    subject: 'Mathematics',
    period: 'weekly',
    totalScore: 92,
    examScorePercent: 90,
    attendancePercent: 100,
    attentiveMin: 130,
    date: '০৯ নভেম্বর ২০২৬',
  },
  {
    id: 'm-3',
    name: 'রাকিবুল হাসান',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    classGrade: 8,
    subject: 'Mathematics',
    period: 'weekly',
    totalScore: 86,
    examScorePercent: 85,
    attendancePercent: 98,
    attentiveMin: 115,
    date: '০৮ নভেম্বর ২০২৬',
  },

  // Chemistry Seed
  {
    id: 'c-1',
    name: 'মেহেদী হাসান শুভ',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Chemistry',
    period: 'weekly',
    totalScore: 94,
    examScorePercent: 92,
    attendancePercent: 100,
    attentiveMin: 135,
    date: '১০ নভেম্বর ২০২৬',
  },
  {
    id: 'c-2',
    name: 'সুমাইয়া জাহান',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    classGrade: 9,
    subject: 'Chemistry',
    period: 'weekly',
    totalScore: 89,
    examScorePercent: 88,
    attendancePercent: 100,
    attentiveMin: 125,
    date: '০৯ নভেম্বর ২০২৬',
  },
  {
    id: 'c-3',
    name: 'আরিয়ান ইসলাম',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    classGrade: 9,
    subject: 'Chemistry',
    period: 'weekly',
    totalScore: 82,
    examScorePercent: 80,
    attendancePercent: 95,
    attentiveMin: 110,
    date: '০৮ নভেম্বর ২০২৬',
  },
];

const SUBJECT_OPTIONS = [
  { id: 'all', label: 'সকল বিষয়', en: 'ALL SUBJECTS' },
  { id: 'Physics', label: 'পদার্থবিজ্ঞান', en: 'PHYSICS' },
  { id: 'Mathematics', label: 'গণিত ও উচ্চতর গণিত', en: 'MATHEMATICS' },
  { id: 'Chemistry', label: 'রসায়ন', en: 'CHEMISTRY' },
  { id: 'Biology', label: 'জীববিজ্ঞান', en: 'BIOLOGY' },
  { id: 'English', label: 'ইংরেজি', en: 'ENGLISH' },
  { id: 'Bangla', label: 'বাংলা', en: 'BANGLA' },
  { id: 'General Science', label: 'সাধারণ বিজ্ঞান', en: 'GENERAL SCIENCE' },
];

export default function LeaderboardPage() {
  const { data: session } = useSession();

  // Filters State
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [performers, setPerformers] = useState<Performer[]>(INITIAL_PERFORMERS);

  // Load submissions from localStorage and merge dynamically
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sn_quiz_results');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mappedUserEntries: Performer[] = parsed.map((item: any, idx: number) => ({
            id: `user-${item.id || idx}`,
            name: item.name || 'শিক্ষার্থী',
            photoUrl:
              session?.user?.name === item.name && session?.user?.image
                ? session.user.image
                : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name || 'student')}`,
            classGrade: parseInt(item.classGrade) || 10,
            subject: item.subject?.includes('পদার্থ') ? 'Physics' : item.subject?.includes('গণিত') ? 'Mathematics' : 'Physics',
            period: 'weekly',
            totalScore: item.percentage || (item.score ? Math.round((item.score / (item.total || 10)) * 100) : 85),
            examScorePercent: item.percentage || 85,
            attendancePercent: 100,
            attentiveMin: 120,
            date: item.date || 'আজ',
          }));

          setPerformers((prev) => {
            const combined = [...mappedUserEntries, ...prev];
            return combined.filter(
              (v, i, a) => a.findIndex((t) => t.name === v.name && t.subject === v.subject) === i
            );
          });
        }
      }
    } catch {}
  }, [session]);

  // Dynamic Filtering Logic
  const filteredList = useMemo(() => {
    return performers
      .filter((item) => {
        // Subject filter
        const matchSub =
          selectedSubject === 'all' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
        // Class filter
        const matchClass =
          selectedClass === 'all' || item.classGrade.toString() === selectedClass;
        // Search filter
        const matchSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subject.toLowerCase().includes(searchQuery.toLowerCase());

        return matchSub && matchClass && matchSearch;
      })
      .sort((a, b) => {
        // Multiplier adjustment for period (Monthly scores slightly boosted for variety)
        const scoreA = period === 'monthly' ? a.totalScore * 1.05 : a.totalScore;
        const scoreB = period === 'monthly' ? b.totalScore * 1.05 : b.totalScore;
        return scoreB - scoreA;
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        // Monthly tweak display
        displayScore:
          period === 'monthly'
            ? Math.min(100, Math.round(item.totalScore * 1.05 * 10) / 10)
            : item.totalScore,
      }));
  }, [performers, selectedSubject, selectedClass, searchQuery, period]);

  // First 3 for the Top Podium (Rank 2 on Left, Rank 1 in Center, Rank 3 on Right)
  const rank1 = filteredList[0];
  const rank2 = filteredList[1];
  const rank3 = filteredList[2];

  // Ranks 4th to 10th
  const restRankers = filteredList.slice(3, 10);

  const currentSubjectMeta =
    SUBJECT_OPTIONS.find((s) => s.id === selectedSubject) || SUBJECT_OPTIONS[1];

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 12%, rgba(200, 16, 46, 0.22) 0%, rgba(10, 30, 60, 0.98) 45%, #050E1D 100%)',
      }}
      className="min-h-screen text-white -mt-6 sm:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none"
    >
      <div className="w-full space-y-8 sm:space-y-12">
        
        {/* ==================================================================== */}
        {/* TOP BAR: BACK BUTTON & TIME PERIOD TOGGLE (WEEKLY / MONTHLY)        */}
        {/* ==================================================================== */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition active:scale-95 shadow-sm"
              title="একাউন্টে ফিরে যান"
            >
              <FaArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Time Period Pill Toggle (Exact look from reference image) */}
          <div className="bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/15 flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setPeriod('weekly')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                period === 'weekly'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                period === 'monthly'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* DYNAMIC HEADER TITLE (Subject, TOP PERFORMERS, OF THE WEEK/MONTH)    */}
        {/* ==================================================================== */}
        <div className="text-center space-y-2">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#EF5350] drop-shadow-sm">
            {currentSubjectMeta.en}
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]">
            TOP PERFORMERS
          </h1>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-slate-300">
            OF THE {period === 'weekly' ? 'WEEK' : 'MONTH'}
          </p>
        </div>

        {/* ==================================================================== */}
        {/* DYNAMIC SUBJECT & CLASS CONTROLS                                    */}
        {/* ==================================================================== */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
          
          {/* Subject Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {SUBJECT_OPTIONS.map((sub) => {
              const active = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    active
                      ? 'bg-gradient-to-r from-[#C8102E] to-[#E5254A] text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* Class Filter & Live Search */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">সকল শ্রেণি (All)</option>
              <option value="10">১০ম শ্রেণি (SSC)</option>
              <option value="9">৯ম শ্রেণি</option>
              <option value="8">৮ম শ্রেণি</option>
              <option value="7">৭ম শ্রেণি</option>
              <option value="6">৬ষ্ঠ শ্রেণি</option>
              <option value="5">৫ম শ্রেণি</option>
            </select>

            <div className="relative flex-1 md:w-48">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম খুঁজুন..."
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* TOP 3 PODIUM: 2nd (Left) | 1st (Center, Elevated) | 3rd (Right)       */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end pt-4 sm:pt-6">
          
          {/* ─────────────────────────────────────────────────────────────
              2ND PLACE CARD (Silver) - Left
          ───────────────────────────────────────────────────────────── */}
          {rank2 && (
            <div
              style={{
                background: 'linear-gradient(155deg, rgba(200, 215, 235, 0.28) 0%, rgba(100, 116, 139, 0.38) 50%, rgba(15, 23, 42, 0.9) 100%)',
              }}
              className="rounded-3xl p-5 sm:p-6 border-2 border-slate-300/40 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[360px] group hover:border-slate-200 transition-all duration-300 md:order-1"
            >
              {/* Top Row: Score & Student Avatar */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase block">
                    SCORE
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                    {rank2.displayScore ?? rank2.totalScore}
                  </div>
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-slate-300 via-white to-slate-400 shadow-lg border border-white/60">
                  <img
                    src={rank2.photoUrl}
                    alt={rank2.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* 3 Metrics: Exam Score, Attendance, Attentive */}
              <div className="grid grid-cols-3 gap-1.5 py-4 border-t border-b border-white/10 text-center my-3">
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {rank2.examScorePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
                    EXAM SCORE
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {rank2.attendancePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
                    ATTENDANCE
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {rank2.attentiveMin}min
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
                    ATTENTIVE
                  </span>
                </div>
              </div>

              {/* 3D Trophy Cup & Name Row */}
              <div className="relative pt-2">
                {/* 3D Trophy Graphic */}
                <div className="absolute right-0 bottom-0 pointer-events-none opacity-90 drop-shadow-2xl">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Stylized Silver 2nd Trophy Cup */}
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                      <defs>
                        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="40%" stopColor="#CBD5E1" />
                          <stop offset="70%" stopColor="#94A3B8" />
                          <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                      </defs>
                      <path d="M 30 15 L 70 15 L 65 55 Q 50 70 35 55 Z" fill="url(#silverGrad)" />
                      <path d="M 28 22 Q 12 28 24 45 Q 32 50 33 42" fill="none" stroke="url(#silverGrad)" strokeWidth="4" strokeLinecap="round" />
                      <path d="M 72 22 Q 88 28 76 45 Q 68 50 67 42" fill="none" stroke="url(#silverGrad)" strokeWidth="4" strokeLinecap="round" />
                      <rect x="44" y="60" width="12" height="15" rx="3" fill="url(#silverGrad)" />
                      <path d="M 32 75 L 68 75 L 64 88 L 36 88 Z" fill="url(#silverGrad)" />
                    </svg>
                    <span className="absolute top-7 font-black text-xs sm:text-sm text-slate-800 tracking-tight">
                      2nd
                    </span>
                  </div>
                </div>

                <div className="pr-20 z-10 relative">
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight uppercase line-clamp-2">
                    {rank2.name}
                  </h3>
                  <span className="text-[10px] text-slate-300 font-semibold block mt-1">
                    শ্রেণি: {rank2.classGrade}ম
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              1ST PLACE CARD (Gold / Elevated) - Center
          ───────────────────────────────────────────────────────────── */}
          {rank1 && (
            <div
              style={{
                background: 'linear-gradient(155deg, rgba(245, 158, 11, 0.42) 0%, rgba(180, 83, 9, 0.55) 45%, rgba(67, 20, 7, 0.95) 100%)',
              }}
              className="rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-[0_20px_50px_rgba(245,158,11,0.35)] relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[420px] md:-translate-y-4 z-20 group hover:border-amber-200 transition-all duration-300 md:order-2"
            >
              {/* Crown Banner Ribbon */}
              <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 py-1 text-center shadow-md">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-950 flex items-center justify-center gap-1.5">
                  <FaTrophy className="w-3 h-3 text-slate-950" /> 1ST POSITION (CHAMPION)
                </span>
              </div>

              {/* Top Row: Score & Student Avatar */}
              <div className="flex items-start justify-between pt-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-200 uppercase block">
                    SCORE
                  </span>
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                    {rank1.displayScore ?? rank1.totalScore}
                  </div>
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-500 shadow-2xl border-2 border-white ring-4 ring-amber-400/40">
                  <img
                    src={rank1.photoUrl}
                    alt={rank1.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* 3 Metrics: Exam Score, Attendance, Attentive */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-white/15 text-center my-3 bg-black/20 rounded-2xl p-2">
                <div>
                  <div className="text-sm sm:text-base font-black text-amber-300">
                    {rank1.examScorePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 uppercase tracking-tight block">
                    EXAM SCORE
                  </span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-amber-300">
                    {rank1.attendancePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 uppercase tracking-tight block">
                    ATTENDANCE
                  </span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-amber-300">
                    {rank1.attentiveMin}min
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 uppercase tracking-tight block">
                    ATTENTIVE
                  </span>
                </div>
              </div>

              {/* 3D Trophy Cup & Name Row */}
              <div className="relative pt-2">
                {/* 3D Gold Trophy Graphic */}
                <div className="absolute right-0 bottom-0 pointer-events-none drop-shadow-2xl">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                      <defs>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFBEB" />
                          <stop offset="35%" stopColor="#FCD34D" />
                          <stop offset="65%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                      </defs>
                      <path d="M 28 15 L 72 15 L 66 58 Q 50 75 34 58 Z" fill="url(#goldGrad)" />
                      <path d="M 26 22 Q 8 28 22 47 Q 30 54 32 44" fill="none" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <path d="M 74 22 Q 92 28 78 47 Q 70 54 68 44" fill="none" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
                      <rect x="43" y="65" width="14" height="15" rx="3" fill="url(#goldGrad)" />
                      <path d="M 30 80 L 70 80 L 65 94 L 35 94 Z" fill="url(#goldGrad)" />
                    </svg>
                    <span className="absolute top-9 font-black text-sm sm:text-base text-amber-950 tracking-tight">
                      1st
                    </span>
                  </div>
                </div>

                <div className="pr-24 z-10 relative">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase line-clamp-2">
                    {rank1.name}
                  </h2>
                  <span className="text-xs text-amber-200 font-bold block mt-1">
                    শ্রেণি: {rank1.classGrade}ম
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              3RD PLACE CARD (Bronze) - Right
          ───────────────────────────────────────────────────────────── */}
          {rank3 && (
            <div
              style={{
                background: 'linear-gradient(155deg, rgba(190, 110, 85, 0.30) 0%, rgba(130, 65, 50, 0.40) 50%, rgba(20, 15, 25, 0.9) 100%)',
              }}
              className="rounded-3xl p-5 sm:p-6 border-2 border-amber-700/50 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[360px] group hover:border-amber-600 transition-all duration-300 md:order-3"
            >
              {/* Top Row: Score & Student Avatar */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-200/80 uppercase block">
                    SCORE
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                    {rank3.displayScore ?? rank3.totalScore}
                  </div>
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-600 via-orange-300 to-amber-800 shadow-lg border border-orange-200/40">
                  <img
                    src={rank3.photoUrl}
                    alt={rank3.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* 3 Metrics: Exam Score, Attendance, Attentive */}
              <div className="grid grid-cols-3 gap-1.5 py-4 border-t border-b border-white/10 text-center my-3">
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {rank3.examScorePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
                    EXAM SCORE
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {rank3.attendancePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
                    ATTENDANCE
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {rank3.attentiveMin}min
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
                    ATTENTIVE
                  </span>
                </div>
              </div>

              {/* 3D Trophy Cup & Name Row */}
              <div className="relative pt-2">
                {/* 3D Bronze Trophy Graphic */}
                <div className="absolute right-0 bottom-0 pointer-events-none opacity-90 drop-shadow-2xl">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                      <defs>
                        <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FED7AA" />
                          <stop offset="35%" stopColor="#FB923C" />
                          <stop offset="70%" stopColor="#C2410C" />
                          <stop offset="100%" stopColor="#7C2D12" />
                        </linearGradient>
                      </defs>
                      <path d="M 30 15 L 70 15 L 65 55 Q 50 70 35 55 Z" fill="url(#bronzeGrad)" />
                      <path d="M 28 22 Q 12 28 24 45 Q 32 50 33 42" fill="none" stroke="url(#bronzeGrad)" strokeWidth="4" strokeLinecap="round" />
                      <path d="M 72 22 Q 88 28 76 45 Q 68 50 67 42" fill="none" stroke="url(#bronzeGrad)" strokeWidth="4" strokeLinecap="round" />
                      <rect x="44" y="60" width="12" height="15" rx="3" fill="url(#bronzeGrad)" />
                      <path d="M 32 75 L 68 75 L 64 88 L 36 88 Z" fill="url(#bronzeGrad)" />
                    </svg>
                    <span className="absolute top-7 font-black text-xs sm:text-sm text-amber-950 tracking-tight">
                      3rd
                    </span>
                  </div>
                </div>

                <div className="pr-20 z-10 relative">
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight uppercase line-clamp-2">
                    {rank3.name}
                  </h3>
                  <span className="text-[10px] text-slate-300 font-semibold block mt-1">
                    শ্রেণি: {rank3.classGrade}ম
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ==================================================================== */}
        {/* RANKS 4TH TO 10TH: SLEEK DARK PILL ROWS (Exact reference layout)     */}
        {/* ==================================================================== */}
        <div className="space-y-3 pt-4 sm:pt-6">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <span>শীর্ষ র‍্যাঙ্কার্স (4th - 10th Place)</span>
            <span>সর্বমোট {filteredList.length} জন</span>
          </div>

          {restRankers.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-8 text-center text-slate-400 text-xs">
              এই ফিল্টারে অতিরিক্ত কোনো শিক্ষার্থী পাওয়া যায়নি।
            </div>
          ) : (
            restRankers.map((performer, idx) => {
              const currentRank = (performer.rank || idx + 4);
              return (
                <div
                  key={performer.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.82)',
                  }}
                  className="rounded-full sm:rounded-full border border-white/10 hover:border-amber-400/50 p-2.5 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 shadow-lg hover:shadow-2xl transition-all duration-200 group"
                >
                  {/* Left: Medal Coin + Avatar + Name */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    
                    {/* Metallic Silver Medal Coin */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-400/50 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-black text-slate-200 tracking-tight">
                          {currentRank}th
                        </span>
                      </div>
                    </div>

                    {/* Student Avatar */}
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-white/40 shrink-0 shadow-sm">
                      <img
                        src={performer.photoUrl}
                        alt={performer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Student Name */}
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-extrabold text-white truncate max-w-[140px] sm:max-w-[220px]">
                        {performer.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold sm:hidden">
                        {performer.classGrade}ম শ্রেণি • {performer.subject}
                      </p>
                    </div>

                  </div>

                  {/* Middle Stats (Exam Score, Attendance, Attentive) */}
                  <div className="hidden md:flex items-center justify-around flex-1 max-w-sm px-4">
                    <div className="text-center">
                      <span className="text-xs font-black text-white block">
                        {performer.examScorePercent}%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                        EXAM SCORE
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-xs font-black text-white block">
                        {performer.attendancePercent}%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                        ATTENDANCE
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-xs font-black text-white block">
                        {performer.attentiveMin}min
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                        ATTENTIVE
                      </span>
                    </div>
                  </div>

                  {/* Right: Big Score Number & Label */}
                  <div className="text-right shrink-0 pr-2 sm:pr-0">
                    <div className="text-base sm:text-xl font-black text-white tracking-tight">
                      {performer.displayScore ?? performer.totalScore}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block -mt-0.5">
                      SCORE
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* ==================================================================== */}
        {/* BOTTOM PARTICIPATION CALL TO ACTION CARD                            */}
        {/* ==================================================================== */}
        <div className="bg-gradient-to-r from-red-950/60 via-[#0A1E3C] to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-white">
              আপনিও কি টপ পারফরমার্সদের তালিকায় আসতে চান?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              শিক্ষা নোভার অনলাইন মডেল টেস্টে অংশগ্রহণ করুন এবং সেরা স্কোর নিয়ে লিডারবোর্ডে নিজের নাম যুক্ত করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/quiz"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8102E] to-[#E5254A] hover:from-[#A00D24] hover:to-[#C8102E] text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-2xl shadow-lg transition active:scale-95"
            >
              <FaTrophy className="w-4 h-4 text-amber-300" />
              <span>টেস্ট শুরু করুন</span>
            </Link>

            <Link
              href="/account"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl border border-white/15 transition active:scale-95"
            >
              <span>আমার একাউন্ট</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
