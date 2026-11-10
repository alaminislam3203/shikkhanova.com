'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FaChevronLeft,
  FaChevronRight,
  FaAward,
  FaGraduationCap,
  FaImage,
} from 'react-icons/fa6';
import { AchieverItem } from '@/lib/defaultAchievers';
import { toBengaliClass } from '@/lib/defaultQuizData';

const CLASS_TABS = [
  { label: 'সকল সাফল্য', value: 'all' },
  { label: '১০ম শ্রেণি', value: '10' },
  { label: '৯ম শ্রেণি', value: '9' },
  { label: '৮ম শ্রেণি', value: '8' },
  { label: '৭ম শ্রেণি', value: '7' },
  { label: '৬ষ্ঠ শ্রেণি', value: '6' },
];

export default function SuccessStoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [achievers, setAchievers] = useState<AchieverItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    fetchAchievers();
  }, [selectedClass]);

  // Auto-swipe / change every 3 seconds
  useEffect(() => {
    if (loading || achievers.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const scrollStep = isMobile ? container.clientWidth * 0.9 : 320;

      // Loop back to beginning when reaching the end
      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, achievers.length, isPaused]);

  const fetchAchievers = async () => {
    try {
      setLoading(true);
      const url =
        selectedClass === 'all'
          ? '/api/achievers'
          : `/api/achievers?classGrade=${selectedClass}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.achievers && Array.isArray(data.achievers)) {
        setAchievers(data.achievers);
      } else {
        setAchievers([]);
      }
    } catch {
      setAchievers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scrollAmount = isMobile ? scrollContainerRef.current.clientWidth * 0.9 : 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // 3-Card on mobile, 4-Card on desktop Skeleton Loader Component
  const renderSkeletonCards = () => (
    <div
      ref={scrollContainerRef}
      className="flex gap-2 sm:gap-6 overflow-x-auto py-3 px-1 sm:px-4 no-scrollbar"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={`skeleton-${i}`}
          className="w-[calc((100%-16px)/3)] min-w-[96px] sm:w-[280px] lg:w-[calc(25%-18px)] shrink-0 bg-white border border-slate-200/90 shadow-xs rounded-xs sm:rounded-sm overflow-hidden flex flex-col animate-pulse"
        >
          {/* Skeleton Photo Container with Shimmer */}
          <div className="relative w-full aspect-[4/4.8] bg-slate-200/80 overflow-hidden flex items-center justify-center">
            <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-slate-300/60 flex items-center justify-center text-slate-400">
              <FaImage className="w-3.5 h-3.5 sm:w-6 sm:h-6 opacity-40" />
            </div>

            {/* Skeleton Top Badge */}
            <div className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 w-8 sm:w-16 h-2.5 sm:h-4 bg-red-100 rounded-xs" />

            {/* Skeleton Class Pill */}
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-7 sm:w-14 h-2.5 sm:h-4 bg-slate-300/80 rounded-xs" />
          </div>

          {/* Skeleton Information Box */}
          <div className="p-1.5 sm:p-5 flex flex-col justify-between flex-1 space-y-1 sm:space-y-2 border-t border-slate-100">
            <div className="space-y-1 sm:space-y-2">
              {/* Name Skeleton (Crimson light bar) */}
              <div className="h-3 sm:h-5 bg-[#C8102E]/20 rounded-xs w-4/5" />
              {/* Class Skeleton */}
              <div className="h-2 sm:h-3.5 bg-slate-200 rounded-xs w-3/5" />
              {/* Achievement Skeleton */}
              <div className="h-2 sm:h-3.5 bg-slate-200 rounded-xs w-full" />
            </div>

            {/* Institution Skeleton */}
            <div className="pt-1 sm:pt-2 border-t border-slate-100">
              <div className="h-2 sm:h-3 bg-slate-200/70 rounded-xs w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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

      {/* Carousel Wrapper with Red Navigation Arrow Buttons (Auto-swipe every 3s, pauses on hover/touch) */}
      <div
        className="relative group/carousel px-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          title="পূর্ববর্তী শিক্ষার্থী"
          aria-label="Previous Student"
          className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-6 sm:w-8 h-9 sm:h-12 bg-[#C8102E]/90 hover:bg-[#A50D26] text-white flex items-center justify-center shadow-lg transition-all rounded-xs focus:outline-none"
        >
          <FaChevronLeft className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          title="পরবর্তী শিক্ষার্থী"
          aria-label="Next Student"
          className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-6 sm:w-8 h-9 sm:h-12 bg-[#C8102E]/90 hover:bg-[#A50D26] text-white flex items-center justify-center shadow-lg transition-all rounded-xs focus:outline-none"
        >
          <FaChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Content Area: Skeleton Loader vs Achievers Cards (3 per screen on mobile) */}
        {loading ? (
          renderSkeletonCards()
        ) : achievers.length === 0 ? (
          renderSkeletonCards()
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-6 overflow-x-auto scroll-smooth py-3 px-1 sm:px-4 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {achievers.map((student) => {
              const isImgLoaded = loadedImages[student.id];

              return (
                <div
                  key={student.id}
                  className="w-[calc((100%-16px)/3)] min-w-[96px] sm:w-[280px] lg:w-[calc(25%-18px)] shrink-0 bg-white border border-slate-200/90 hover:border-[#C8102E]/60 shadow-xs hover:shadow-md transition-all duration-300 rounded-xs sm:rounded-sm overflow-hidden flex flex-col group/card"
                >
                  {/* Student Photo Container with Image Skeleton */}
                  <div className="relative w-full aspect-[4/4.8] overflow-hidden bg-slate-200">
                    {/* Placeholder Shimmer while image loads */}
                    {!isImgLoaded && (
                      <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                        <FaImage className="w-5 h-5 sm:w-8 sm:h-8 text-slate-300" />
                      </div>
                    )}

                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      loading="lazy"
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [student.id]: true,
                        }))
                      }
                      className={`w-full h-full object-cover object-top transition-all duration-500 group-hover/card:scale-105 ${
                        isImgLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    {student.badge && (
                      <span className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 bg-[#C8102E] text-white text-[7px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-xs shadow-xs tracking-wider">
                        {student.badge}
                      </span>
                    )}

                    <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-[#0A1E3C]/80 backdrop-blur-xs text-white text-[7px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-xs truncate max-w-[85%]">
                      {toBengaliClass(student.classGrade)} শ্রেণি
                    </span>
                  </div>

                  {/* Student Information Box */}
                  <div className="p-1.5 sm:p-5 flex flex-col justify-between flex-1 text-left space-y-0.5 sm:space-y-1.5 border-t border-slate-100">
                    <div>
                      <h3 className="text-[10px] sm:text-lg font-bold text-[#C8102E] leading-tight truncate group-hover/card:underline" title={student.name}>
                        {student.name}
                      </h3>
                      <p className="text-[9px] sm:text-sm font-bold text-slate-800 leading-tight mt-0.5 truncate">
                        {student.classLabel}
                      </p>
                      <p className="text-[8px] sm:text-xs font-semibold text-emerald-700 sm:text-slate-600 truncate mt-0.5">
                        {student.achievement}
                      </p>
                    </div>

                    <div className="pt-1 sm:pt-2 border-t border-slate-100/80">
                      <p className="text-[8px] sm:text-[11px] text-slate-500 font-medium truncate flex items-center gap-0.5 sm:gap-1" title={student.institution}>
                        <FaGraduationCap className="text-slate-400 shrink-0 w-2 h-2 sm:w-3 sm:h-3" />
                        <span className="truncate">{student.institution}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
