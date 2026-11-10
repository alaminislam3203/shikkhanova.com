'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FaArrowLeft,
  FaMagnifyingGlass,
  FaRotateRight,
  FaTrophy,
} from 'react-icons/fa6';

export interface Performer {
  id: string;
  rank?: number;
  name: string;
  photoUrl: string;
  classGrade: number;
  subject: string;
  period: 'weekly' | 'monthly';
  totalScore: number;
  examScorePercent: number;
  attendancePercent: number;
  attentiveMin: number;
  date?: string;
  displayScore?: number;
}

// Fallback initial data exactly matching reference screenshot
const INITIAL_PERFORMERS: Performer[] = [
  // Physics Weekly (Top 3 & 4-10 in reference)
  {
    id: 'p-1',
    name: 'NADIA SULTANA B...',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    classGrade: 10,
    subject: 'Physics',
    period: 'weekly',
    totalScore: 88,
    examScorePercent: 80,
    attendancePercent: 100,
    attentiveMin: 120,
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
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch dynamic performers from DB API
  const fetchPerformers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/leaderboard?subject=${encodeURIComponent(selectedSubject)}&classGrade=${encodeURIComponent(
          selectedClass
        )}&period=${period}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.performers) && data.performers.length > 0) {
        setPerformers(data.performers);
      }
    } catch (err) {
      console.warn('Could not load live leaderboard from API, falling back to local seed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformers();
  }, [selectedSubject, selectedClass, period]);

  // Merge localStorage user submissions if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sn_quiz_results');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: Performer[] = parsed.map((item: any, idx: number) => ({
            id: `user-${item.id || idx}`,
            name: item.name || (session?.user?.name ?? 'শিক্ষার্থী'),
            photoUrl:
              session?.user?.image ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name || 'student')}`,
            classGrade: parseInt(item.classGrade) || 10,
            subject: item.subject?.includes('পদার্থ')
              ? 'Physics'
              : item.subject?.includes('গণিত')
              ? 'Mathematics'
              : 'Physics',
            period: 'weekly',
            totalScore: item.percentage || (item.score ? Math.round((item.score / (item.total || 10)) * 100) : 85),
            examScorePercent: item.percentage || 80,
            attendancePercent: 100,
            attentiveMin: 120,
          }));

          setPerformers((prev) => {
            const combined = [...mapped, ...prev];
            return combined.filter(
              (v, i, a) => a.findIndex((t) => t.name === v.name && t.subject === v.subject) === i
            );
          });
        }
      }
    } catch {}
  }, [session]);

  // Filter & Rank Logic
  const filteredList = useMemo(() => {
    return performers
      .filter((item) => {
        const matchSub =
          selectedSubject === 'all' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
        const matchClass =
          selectedClass === 'all' || item.classGrade.toString() === selectedClass;
        const matchSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subject.toLowerCase().includes(searchQuery.toLowerCase());

        return matchSub && matchClass && matchSearch;
      })
      .sort((a, b) => {
        const scoreA = period === 'monthly' ? a.totalScore * 1.05 : a.totalScore;
        const scoreB = period === 'monthly' ? b.totalScore * 1.05 : b.totalScore;
        return scoreB - scoreA;
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        displayScore:
          period === 'monthly'
            ? Math.min(100, Math.round(item.totalScore * 1.05 * 10) / 10)
            : item.totalScore,
      }));
  }, [performers, selectedSubject, selectedClass, searchQuery, period]);

  // Top 3 Podium
  const rank1 = filteredList[0];
  const rank2 = filteredList[1];
  const rank3 = filteredList[2];

  // 4th to 10th Place
  const restRankers = filteredList.slice(3, 10);

  const currentSubjectMeta =
    SUBJECT_OPTIONS.find((s) => s.id === selectedSubject) || SUBJECT_OPTIONS[1];

  return (
    <div
      style={{
        background:
          'radial-gradient(circle 900px at 50% -120px, #4d1810 0%, #220c08 40%, #0d0c0e 75%, #08080a 100%)',
      }}
      className="min-h-screen text-white -mt-6 sm:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 select-none"
    >
      <div className="w-full space-y-6 sm:space-y-10 max-w-[1240px] mx-auto">
        
        {/* ==================================================================== */}
        {/* TOP BAR: BACK BUTTON (LEFT) & WEEKLY / MONTHLY TOGGLE (RIGHT)        */}
        {/* ==================================================================== */}
        <header className="flex items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition active:scale-95 shadow-sm"
              title="একাউন্টে ফিরে যান"
            >
              <FaArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Time Period Pill Toggle (Exact match with reference image) */}
          <div className="bg-[#181514] border border-white/15 p-1 rounded-full flex items-center shadow-lg">
            <button
              type="button"
              onClick={() => setPeriod('weekly')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                period === 'weekly'
                  ? 'bg-[#EACB63] text-stone-950 shadow-md font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              WEEKLY
            </button>
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                period === 'monthly'
                  ? 'bg-[#EACB63] text-stone-950 shadow-md font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              MONTHLY
            </button>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* HERO TITLE (SUBJECT, TOP PERFORMERS, OF THE WEEK/MONTH)              */}
        {/* ==================================================================== */}
        <div className="text-center space-y-1 sm:space-y-2 pt-2">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#EF4444] drop-shadow-sm">
            {currentSubjectMeta.en}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F7B648] drop-shadow-[0_4px_24px_rgba(247,182,72,0.4)]">
            TOP PERFORMERS
          </h1>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-stone-300">
            OF THE {period === 'weekly' ? 'WEEK' : 'MONTH'}
          </p>
        </div>

        {/* ==================================================================== */}
        {/* DYNAMIC SUBJECT & CLASS CONTROLS (TABS & FILTERS)                   */}
        {/* ==================================================================== */}
        <div className="bg-[#141416]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
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
              <option value="5">৫ম শ্রেণি</option>
              <option value="6">৬ষ্ঠ শ্রেণি</option>
              <option value="7">৭ম শ্রেণি</option>
              <option value="8">৮ম শ্রেণি</option>
              <option value="9">৯ম শ্রেণি</option>
              <option value="10">১০ম শ্রেণি</option>
            </select>

            <div className="relative flex-1 md:w-44">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম খুঁজুন..."
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={fetchPerformers}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              title="তথ্য রিফ্রেশ করুন"
            >
              <FaRotateRight className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* TOP 3 PODIUM: 2nd (Left) | 1st (Center, Elevated) | 3rd (Right)       */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end pt-4 sm:pt-8">
          
          {/* ─────────────────────────────────────────────────────────────
              2ND PLACE CARD (Metallic Silver) - Left
          ───────────────────────────────────────────────────────────── */}
          {rank2 && (
            <div
              style={{
                background:
                  'linear-gradient(155deg, #71737f 0%, #4f515c 50%, #272830 100%)',
              }}
              className="rounded-3xl p-5 sm:p-6 border border-slate-300/30 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[380px] group transition-all duration-300 md:order-1"
            >
              {/* Top Row: Score & Student Avatar */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase block">
                    SCORE
                  </span>
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
                    {rank2.displayScore ?? rank2.totalScore}
                  </div>
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-slate-200 via-white to-slate-400 shadow-xl border border-white/70">
                  <img
                    src={rank2.photoUrl}
                    alt={rank2.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* 3 Metrics: Exam Score, Attendance, Attentive */}
              <div className="grid grid-cols-3 gap-1.5 py-4 text-center my-2">
                <div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {rank2.examScorePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tight block">
                    EXAM SCORE
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {rank2.attendancePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tight block">
                    ATTENDANCE
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {rank2.attentiveMin}min
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tight block">
                    ATTENTIVE
                  </span>
                </div>
              </div>

              {/* 3D Trophy Cup & Name Row */}
              <div className="relative pt-2 flex items-end justify-between">
                <div className="z-10 max-w-[65%]">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase line-clamp-2 drop-shadow">
                    {rank2.name}
                  </h3>
                </div>

                {/* Stylized Silver 2nd Trophy Cup */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 -mr-3 -mb-3 pointer-events-none drop-shadow-2xl flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor="#CBD5E1" />
                        <stop offset="70%" stopColor="#94A3B8" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>
                    <path d="M 30 15 L 70 15 L 65 55 Q 50 70 35 55 Z" fill="url(#silverGrad)" />
                    <path d="M 28 22 Q 12 28 24 45 Q 32 50 33 42" fill="none" stroke="url(#silverGrad)" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 72 22 Q 88 28 76 45 Q 68 50 67 42" fill="none" stroke="url(#silverGrad)" strokeWidth="4.5" strokeLinecap="round" />
                    <rect x="44" y="60" width="12" height="15" rx="3" fill="url(#silverGrad)" />
                    <path d="M 32 75 L 68 75 L 64 88 L 36 88 Z" fill="url(#silverGrad)" />
                  </svg>
                  <span className="absolute top-9 font-black text-xs sm:text-sm text-slate-800 tracking-tight">
                    2nd
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              1ST PLACE CARD (Warm Copper-Gold / Champion) - Center
          ───────────────────────────────────────────────────────────── */}
          {rank1 && (
            <div
              style={{
                background:
                  'linear-gradient(155deg, #a3592f 0%, #823e1b 50%, #441a09 100%)',
              }}
              className="rounded-3xl p-6 sm:p-7 border border-amber-400/50 shadow-[0_20px_50px_rgba(163,89,47,0.45)] relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[420px] md:-translate-y-6 z-20 group transition-all duration-300 md:order-2"
            >
              {/* Top Row: Score & Student Avatar */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-200/90 uppercase block">
                    SCORE
                  </span>
                  <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">
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
              <div className="grid grid-cols-3 gap-2 py-4 text-center my-2">
                <div>
                  <div className="text-base sm:text-xl font-black text-white">
                    {rank1.examScorePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-amber-100 uppercase tracking-tight block">
                    EXAM SCORE
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-white">
                    {rank1.attendancePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-amber-100 uppercase tracking-tight block">
                    ATTENDANCE
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-white">
                    {rank1.attentiveMin}min
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-amber-100 uppercase tracking-tight block">
                    ATTENTIVE
                  </span>
                </div>
              </div>

              {/* 3D Trophy Cup & Name Row */}
              <div className="relative pt-2 flex items-end justify-between">
                <div className="z-10 max-w-[65%]">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase line-clamp-2 drop-shadow-md">
                    {rank1.name}
                  </h2>
                </div>

                {/* Stylized Gold 1st Trophy Cup */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 -mr-3 -mb-3 pointer-events-none drop-shadow-2xl flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
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
                  <span className="absolute top-10 font-black text-sm sm:text-base text-amber-950 tracking-tight">
                    1st
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              3RD PLACE CARD (Rose Bronze) - Right
          ───────────────────────────────────────────────────────────── */}
          {rank3 && (
            <div
              style={{
                background:
                  'linear-gradient(155deg, #744e4e 0%, #543636 50%, #301e1e 100%)',
              }}
              className="rounded-3xl p-5 sm:p-6 border border-amber-800/40 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[380px] group transition-all duration-300 md:order-3"
            >
              {/* Top Row: Score & Student Avatar */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-orange-200/80 uppercase block">
                    SCORE
                  </span>
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
                    {rank3.displayScore ?? rank3.totalScore}
                  </div>
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-600 via-orange-300 to-amber-800 shadow-xl border border-orange-200/40">
                  <img
                    src={rank3.photoUrl}
                    alt={rank3.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* 3 Metrics: Exam Score, Attendance, Attentive */}
              <div className="grid grid-cols-3 gap-1.5 py-4 text-center my-2">
                <div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {rank3.examScorePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tight block">
                    EXAM SCORE
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {rank3.attendancePercent}%
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tight block">
                    ATTENDANCE
                  </span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {rank3.attentiveMin}min
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-tight block">
                    ATTENTIVE
                  </span>
                </div>
              </div>

              {/* 3D Trophy Cup & Name Row */}
              <div className="relative pt-2 flex items-end justify-between">
                <div className="z-10 max-w-[65%]">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase line-clamp-2 drop-shadow">
                    {rank3.name}
                  </h3>
                </div>

                {/* Stylized Bronze 3rd Trophy Cup */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 -mr-3 -mb-3 pointer-events-none drop-shadow-2xl flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FED7AA" />
                        <stop offset="35%" stopColor="#FB923C" />
                        <stop offset="70%" stopColor="#C2410C" />
                        <stop offset="100%" stopColor="#7C2D12" />
                      </linearGradient>
                    </defs>
                    <path d="M 30 15 L 70 15 L 65 55 Q 50 70 35 55 Z" fill="url(#bronzeGrad)" />
                    <path d="M 28 22 Q 12 28 24 45 Q 32 50 33 42" fill="none" stroke="url(#bronzeGrad)" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 72 22 Q 88 28 76 45 Q 68 50 67 42" fill="none" stroke="url(#bronzeGrad)" strokeWidth="4.5" strokeLinecap="round" />
                    <rect x="44" y="60" width="12" height="15" rx="3" fill="url(#bronzeGrad)" />
                    <path d="M 32 75 L 68 75 L 64 88 L 36 88 Z" fill="url(#bronzeGrad)" />
                  </svg>
                  <span className="absolute top-9 font-black text-xs sm:text-sm text-amber-950 tracking-tight">
                    3rd
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
          {restRankers.length === 0 ? (
            <div className="bg-[#141416] rounded-2xl p-8 text-center text-slate-400 text-xs">
              এই ফিল্টারে অতিরিক্ত কোনো শিক্ষার্থী পাওয়া যায়নি।
            </div>
          ) : (
            restRankers.map((performer, idx) => {
              const currentRank = performer.rank || idx + 4;
              return (
                <div
                  key={performer.id}
                  style={{
                    background: '#141416',
                  }}
                  className="rounded-2xl sm:rounded-full border border-white/10 hover:border-amber-400/50 p-2.5 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 shadow-lg hover:shadow-2xl transition-all duration-200 group"
                >
                  {/* Left: Medal Coin + Avatar + Name */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    
                    {/* Metallic Silver Medal Coin */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-400/50 flex items-center justify-center">
                        <span className="text-xs font-black text-slate-200 tracking-tight">
                          {currentRank}th
                        </span>
                      </div>
                    </div>

                    {/* Student Avatar */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/40 shrink-0 shadow-sm">
                      <img
                        src={performer.photoUrl}
                        alt={performer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Student Name */}
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-extrabold text-white truncate max-w-[130px] sm:max-w-[220px]">
                        {performer.name}
                      </h4>
                    </div>

                  </div>

                  {/* Middle Stats (Exam Score, Attendance, Attentive) */}
                  <div className="flex items-center justify-around flex-1 max-w-sm px-2 sm:px-6">
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black text-white block">
                        {performer.examScorePercent}%
                      </span>
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                        EXAM SCORE
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black text-white block">
                        {performer.attendancePercent}%
                      </span>
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                        ATTENDANCE
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black text-white block">
                        {performer.attentiveMin}min
                      </span>
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                        ATTENTIVE
                      </span>
                    </div>
                  </div>

                  {/* Right: Big Score Number & Label */}
                  <div className="text-right shrink-0 pr-2 sm:pr-0 min-w-[50px]">
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

      </div>
    </div>
  );
}
