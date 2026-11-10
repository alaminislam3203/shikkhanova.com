'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FaTrophy,
  FaAward,
  FaMedal,
  FaCrown,
  FaArrowRight,
  FaMagnifyingGlass,
  FaFilter,
  FaRotateRight,
  FaUser,
  FaGraduationCap,
  FaStar,
  FaFilePdf,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

interface LeaderboardItem {
  id: string;
  name: string;
  classGrade: number;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  medal: string;
  date: string;
}

const DEFAULT_LEADERBOARD: LeaderboardItem[] = [
  {
    id: 'lead-1',
    name: 'তানভীর আহমেদ',
    classGrade: 10,
    subject: 'পদার্থবিজ্ঞান মডেল টেস্ট',
    score: 10,
    total: 10,
    percentage: 100,
    medal: '🥇 Gold Medal',
    date: '১০ নভেম্বর ২০২৬',
  },
  {
    id: 'lead-2',
    name: 'ফারজানা আক্তার মীম',
    classGrade: 9,
    subject: 'উচ্চতর গণিত',
    score: 10,
    total: 10,
    percentage: 100,
    medal: '🥇 Gold Medal',
    date: '০৯ নভেম্বর ২০২৬',
  },
  {
    id: 'lead-3',
    name: 'রাকিবুল হাসান',
    classGrade: 8,
    subject: 'ইংরেজি ব্যাকরণ',
    score: 9,
    total: 10,
    percentage: 90,
    medal: '🥈 Silver Medal',
    date: '০৮ নভেম্বর ২০২৬',
  },
  {
    id: 'lead-4',
    name: 'সুমাইয়া জাহান',
    classGrade: 7,
    subject: 'সাধারণ বিজ্ঞান',
    score: 9,
    total: 10,
    percentage: 90,
    medal: '🥈 Silver Medal',
    date: '০৮ নভেম্বর ২০২৬',
  },
  {
    id: 'lead-5',
    name: 'মেহেদী হাসান শুভ',
    classGrade: 10,
    subject: 'রসায়ন স্পেশাল কুইজ',
    score: 8,
    total: 10,
    percentage: 80,
    medal: '🥈 Silver Medal',
    date: '০৭ নভেম্বর ২০২৬',
  },
  {
    id: 'lead-6',
    name: 'আরিয়ান ইসলাম',
    classGrade: 6,
    subject: 'বাংলা ১ম পত্র',
    score: 8,
    total: 10,
    percentage: 80,
    medal: '🥈 Silver Medal',
    date: '০৬ নভেম্বর ২০২৬',
  },
  {
    id: 'lead-7',
    name: 'নুসরাত ফারিয়া',
    classGrade: 5,
    subject: 'প্রাথমিক গণিত',
    score: 7,
    total: 10,
    percentage: 70,
    medal: '🥉 Bronze Medal',
    date: '০৫ নভেম্বর ২০২৬',
  },
];

function toBengaliNum(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

function toBengaliClass(grade: number): string {
  const map: Record<number, string> = {
    5: '৫ম',
    6: '৬ষ্ঠ',
    7: '৭ম',
    8: '৮ম',
    9: '৯ম',
    10: '১০ম',
  };
  return map[grade] || `${grade}ম`;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<LeaderboardItem[]>(DEFAULT_LEADERBOARD);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sn_quiz_results');
      if (stored) {
        const parsed: LeaderboardItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Combine user test submissions with top showcase list
          const combined = [...parsed, ...DEFAULT_LEADERBOARD];
          // Remove duplicates by name + subject
          const unique = combined.filter(
            (v, i, a) => a.findIndex((t) => t.name === v.name && t.subject === v.subject) === i
          );
          // Sort by percentage / score descending
          unique.sort((a, b) => b.percentage - a.percentage);
          setResults(unique);
        }
      }
    } catch {}
  }, []);

  const filteredResults = results.filter((item) => {
    const matchesClass =
      selectedClass === 'all' || item.classGrade.toString() === selectedClass;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const top3 = results.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <FaTrophy className="text-amber-300 w-3.5 h-3.5" />
              <span>অনলাইন কুইজ ও মডেল টেস্ট</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              🏆 অফিসিয়াল লিডারবোর্ড (মেধাতালিকা)
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের মডেল টেস্ট ও কুইজ মূল্যায়নের শীর্ষ র‍্যাঙ্কিং, মেডেল ও স্কোরবোর্ড।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href="/quiz"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#A00D24] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-xs transition active:scale-95"
            >
              <span>মডেল টেস্ট দিন</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/account"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl border border-white/15 transition active:scale-95"
            >
              <FaUser className="w-3.5 h-3.5 text-nova-400" />
              <span>আমার একাউন্ট</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((student, idx) => {
          const isFirst = idx === 0;
          const isSecond = idx === 1;
          const isThird = idx === 2;

          return (
            <div
              key={student.id}
              className={`rounded-2xl sm:rounded-3xl p-5 border transition shadow-xs flex flex-col justify-between relative overflow-hidden ${
                isFirst
                  ? 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 border-amber-300 md:order-2 md:-translate-y-2 shadow-md'
                  : isSecond
                  ? 'bg-white border-slate-200 md:order-1'
                  : 'bg-white border-slate-200 md:order-3'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-3xl">
                  {isFirst ? '👑' : isSecond ? '🥈' : '🥉'}
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    isFirst
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : isSecond
                      ? 'bg-slate-100 text-slate-800 border border-slate-200'
                      : 'bg-orange-50 text-orange-900 border border-orange-200'
                  }`}
                >
                  {isFirst ? '১ম স্থান (Top 1)' : isSecond ? '২য় স্থান' : '৩য় স্থান'}
                </span>
              </div>

              <div className="py-4 space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {student.name}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {toBengaliClass(student.classGrade)} শ্রেণি • {student.subject}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">স্কোর:</span>
                  <span className="text-lg font-black text-[#C8102E]">
                    {toBengaliNum(student.score)} / {toBengaliNum(student.total)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {student.percentage}% সঠিক
                </span>
                <span className="text-slate-400 text-[11px]">{student.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Medal Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1">
          <div className="text-2xl">🥇</div>
          <h4 className="text-xs sm:text-sm font-black text-slate-800">Gold Rank</h4>
          <p className="text-[10px] text-slate-500">১০০% পারফেক্ট স্কোর</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1">
          <div className="text-2xl">🥈</div>
          <h4 className="text-xs sm:text-sm font-black text-slate-800">Silver Rank</h4>
          <p className="text-[10px] text-slate-500">৮০%+ সঠিক উত্তর</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1">
          <div className="text-2xl">🥉</div>
          <h4 className="text-xs sm:text-sm font-black text-slate-800">Bronze Rank</h4>
          <p className="text-[10px] text-slate-500">৬০%+ মেধা স্কোর</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1">
          <div className="text-2xl">⭐</div>
          <h4 className="text-xs sm:text-sm font-black text-slate-800">Top Rankers</h4>
          <p className="text-[10px] text-slate-500">সাপ্তাহিক মেধা তালিকা</p>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'সকল শ্রেণি' },
            { id: '5', label: '৫ম' },
            { id: '6', label: '৬ষ্ঠ' },
            { id: '7', label: '৭ম' },
            { id: '8', label: '৮ম' },
            { id: '9', label: '৯ম' },
            { id: '10', label: '১০ম' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClass(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedClass === c.id
                  ? 'bg-[#0A1E3C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="শিক্ষার্থী বা বিষয়ের নাম খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20"
          />
        </div>

      </div>

      {/* 5. Main Leaderboard Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <FaTrophy className="text-amber-500" />
            <span>সম্পূর্ণ মেধা তালিকা ({toBengaliNum(filteredResults.length)} জন শিক্ষার্থী)</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">র‍্যাঙ্কিং ক্রমানুসারে</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3.5 px-4 w-16 text-center">র‍্যাঙ্ক</th>
                <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-3.5 px-4">শ্রেণি</th>
                <th className="py-3.5 px-4">পরীক্ষার বিষয়</th>
                <th className="py-3.5 px-4 text-center">স্কোর</th>
                <th className="py-3.5 px-4 text-center">শতাংশ</th>
                <th className="py-3.5 px-4 text-center">মেডেল</th>
                <th className="py-3.5 px-4 text-right">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                    কোনো তথ্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredResults.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-800 border border-slate-300'
                            : idx === 2
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {idx === 0 ? '১' : idx === 1 ? '২' : idx === 2 ? '৩' : toBengaliNum(idx + 1)}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[180px] sm:max-w-none">{item.name}</span>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                      {toBengaliClass(item.classGrade)} শ্রেণি
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {item.subject}
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 text-center font-black text-[#C8102E] text-sm">
                      {toBengaliNum(item.score)}/{toBengaliNum(item.total)}
                    </td>

                    {/* Percentage */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px]">
                        {item.percentage}%
                      </span>
                    </td>

                    {/* Medal */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {item.medal}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px] whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 6. Call To Action Footer Card */}
      <div className="bg-gradient-to-r from-[#0A1E3C] to-[#1E3A8A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-base sm:text-lg font-black">আপনিও কি মেধা তালিকায় শীর্ষস্থান পেতে চান?</h3>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            শিক্ষা নোভার অধ্যায়ভিত্তিক মডেল টেস্ট দিন এবং আপনার মেধা যাচাই করুন।
          </p>
        </div>

        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A00D24] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-xs transition active:scale-95 shrink-0"
        >
          <FaTrophy className="w-4 h-4 text-amber-300" />
          <span>এখনই কুইজ শুরু করুন</span>
        </Link>
      </div>

    </div>
  );
}
