'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FaChevronLeft,
  FaChevronRight,
  FaAward,
  FaGraduationCap,
} from 'react-icons/fa6';
import { DEFAULT_ACHIEVERS, AchieverItem } from '@/lib/defaultAchievers';

const CLASS_TABS = [
  { label: 'সকল সাফল্য', value: 'all' },
  { label: '১০ম শ্রেণি (SSC)', value: '10' },
  { label: '৯ম শ্রেণি', value: '9' },
  { label: '৮ম শ্রেণি', value: '8' },
  { label: '৭ম শ্রেণি', value: '7' },
  { label: '৬ষ্ঠ শ্রেণি', value: '6' },
];

export default function SuccessStoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [achievers, setAchievers] = useState<AchieverItem[]>(DEFAULT_ACHIEVERS);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAchievers();
  }, [selectedClass]);

  const fetchAchievers = async () => {
    try {
      setLoading(true);
      const url =
        selectedClass === 'all'
          ? '/api/achievers'
          : `/api/achievers?classGrade=${selectedClass}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.achievers && Array.isArray(data.achievers) && data.achievers.length > 0) {
        setAchievers(data.achievers);
      } else {
        const filtered =
          selectedClass === 'all'
            ? DEFAULT_ACHIEVERS
            : DEFAULT_ACHIEVERS.filter(
                (a) => a.classGrade === Number(selectedClass)
              );
        setAchievers(filtered);
      }
    } catch {
      const filtered =
        selectedClass === 'all'
          ? DEFAULT_ACHIEVERS
          : DEFAULT_ACHIEVERS.filter(
              (a) => a.classGrade === Number(selectedClass)
            );
      setAchievers(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative py-6 sm:py-8 space-y-6">
      {/* Title & Decorative Divider (Matching UCC Style Reference) */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3C] tracking-tight">
          আমাদের <span className="text-[#C8102E]">সাফল্য গাঁথা</span>
        </h2>

        {/* UCC Style Red Accent Line With Center Block */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <div className="w-9 h-[3px] bg-[#C8102E] rounded-full" />
          <div className="w-3 h-[6px] bg-[#C8102E] rounded-xs" />
          <div className="w-9 h-[3px] bg-[#C8102E] rounded-full" />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto pt-1 font-medium">
          ৬ষ্ঠ থেকে ১০ম শ্রেণির মেধাবী শিক্ষার্থীদের বোর্ড পরীক্ষা, মূল্যায়ন ও মডেল টেস্টে ধারাবাহিক সাফল্য
        </p>
      </div>

      {/* Class Selector Pills (Class 6 - 10) */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
        {CLASS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSelectedClass(tab.value)}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all whitespace-nowrap ${
              selectedClass === tab.value
                ? 'bg-[#C8102E] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-[#C8102E] hover:bg-red-50 border border-slate-200/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Carousel Wrapper with Red Navigation Arrow Buttons */}
      <div className="relative group/carousel px-1">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          title="পূর্ববর্তী শিক্ষার্থী"
          aria-label="Previous Student"
          className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-12 bg-[#C8102E] hover:bg-[#A50D26] text-white flex items-center justify-center shadow-lg transition-all rounded-xs focus:outline-none"
        >
          <FaChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          title="পরবর্তী শিক্ষার্থী"
          aria-label="Next Student"
          className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-12 bg-[#C8102E] hover:bg-[#A50D26] text-white flex items-center justify-center shadow-lg transition-all rounded-xs focus:outline-none"
        >
          <FaChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Horizontal Cards Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-3 px-2 sm:px-4 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {achievers.map((student) => (
            <div
              key={student.id}
              className="w-[260px] sm:w-[280px] lg:w-[calc(25%-18px)] shrink-0 bg-white border border-slate-200/90 hover:border-[#C8102E]/60 shadow-xs hover:shadow-md transition-all duration-300 rounded-sm overflow-hidden flex flex-col group/card"
            >
              {/* Student Photo Container (Loaded via Cloudinary) */}
              <div className="relative w-full aspect-[4/4.8] overflow-hidden bg-slate-100">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
                />

                {student.badge && (
                  <span className="absolute top-2.5 right-2.5 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs shadow-xs tracking-wider">
                    {student.badge}
                  </span>
                )}

                <span className="absolute bottom-2 left-2 bg-[#0A1E3C]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                  {student.classGrade}ম শ্রেণি
                </span>
              </div>

              {/* Student Information Box */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 text-left space-y-1.5 border-t border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#C8102E] leading-snug group-hover/card:underline">
                    {student.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-1">
                    {student.classLabel}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {student.achievement}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100/80">
                  <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
                    <FaGraduationCap className="text-slate-400 shrink-0" />
                    <span>{student.institution}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Result Call to Action */}
      <div className="text-center pt-2">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 bg-[#0A1E3C] hover:bg-[#C8102E] text-white font-bold text-xs px-5 py-2.5 rounded-sm transition shadow-xs"
        >
          <FaAward className="text-amber-400" />
          <span>সকল পরীক্ষার ফলাফল ও মেধা তালিকা দেখুন</span>
        </Link>
      </div>
    </section>
  );
}

