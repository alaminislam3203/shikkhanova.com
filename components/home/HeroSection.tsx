'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEFAULT_NOTICES, NoticeItem } from '@/lib/defaultNotices';
import {
  FaUserCheck,
  FaAward,
  FaFilePdf,
  FaLocationDot,
  FaPhone,
  FaArrowRight,
  FaThumbtack,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa6';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi2';
import { TbCashBanknote } from 'react-icons/tb';
import Logo from '@/components/common/Logo';

export default function HeroSection() {
  const [pinnedNotices, setPinnedNotices] = useState<NoticeItem[]>(() => {
    const pinned = DEFAULT_NOTICES.filter((n) => n.isPinned);
    const rest = DEFAULT_NOTICES.filter((n) => !n.isPinned);
    return [...pinned, ...rest].slice(0, 3);
  });

  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/notices', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.notices && Array.isArray(data.notices) && data.notices.length > 0) {
          const all: NoticeItem[] = data.notices;
          const pinned = all.filter((n) => Boolean(n.isPinned));
          const unpinned = all.filter((n) => !n.isPinned);
          const topThree = [...pinned, ...unpinned].slice(0, 3);
          if (topThree.length > 0) {
            setPinnedNotices(topThree);
            setSlideIndex(0);
          }
        }
      })
      .catch(() => {});
  }, []);

  const totalNotices = pinnedNotices.length;
  const extendedSlides =
    totalNotices > 1 ? [...pinnedNotices, pinnedNotices[0]] : pinnedNotices;

  // Auto swipe-up timer every 3.5 seconds
  useEffect(() => {
    if (totalNotices <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setSlideIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, [totalNotices, isPaused]);

  // Seamless loop reset when reaching the cloned slide at the end
  useEffect(() => {
    if (totalNotices <= 1) return;

    if (slideIndex === totalNotices) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(0);
      }, 650);
      return () => clearTimeout(timeout);
    }
  }, [slideIndex, totalNotices]);

  const handleNextSlide = () => {
    if (totalNotices <= 1) return;
    if (slideIndex >= totalNotices) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  };

  const handlePrevSlide = () => {
    if (totalNotices <= 1) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => (prev <= 0 ? totalNotices - 1 : prev - 1));
  };

  const activeDotIndex = totalNotices > 0 ? slideIndex % totalNotices : 0;

  return (
    <div className="space-y-4">
      {/* Professional Smooth Vertical Swipe-Up Pinned Notice Board (Latest 3 Pinned Notices) */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="bg-white rounded-2xl border border-slate-200/95 shadow-sm px-2.5 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2.5 sm:gap-3.5 overflow-hidden relative group"
      >
        {/* Left Notice Board Badge */}
        <Link
          href="/notices"
          className="bg-[#C8102E] hover:bg-[#A60D26] text-white text-xs font-extrabold px-3 sm:px-3.5 py-2 rounded-xl shrink-0 flex items-center gap-1.5 shadow-xs uppercase tracking-wider transition"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
          </span>
          <span>নোটিশ বোর্ড</span>
        </Link>

        {/* Vertical Swipe-Up Viewport */}
        <div className="relative h-9 sm:h-10 flex-1 overflow-hidden">
          <div
            style={{
              transform: `translateY(-${slideIndex * 100}%)`,
              transition: isTransitioning
                ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none',
            }}
            className="w-full h-full"
          >
            {extendedSlides.map((notice, idx) => (
              <div
                key={`${notice.id}-${idx}`}
                className="w-full h-9 sm:h-10 flex items-center justify-between gap-3 pr-1"
              >
                <Link
                  href="/notices"
                  className="flex items-center gap-2 min-w-0 flex-1 group/item"
                >
                  <span className="inline-flex items-center gap-1 bg-red-50 text-[#C8102E] border border-red-200/80 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0">
                    <FaThumbtack className="w-2.5 h-2.5 -rotate-45 text-[#C8102E]" />
                    <span className="hidden xs:inline">
                      {notice.categoryLabel || 'জরুরি নোটিশ'}
                    </span>
                  </span>

                  <span className="text-xs sm:text-sm font-bold text-[#0A1E3C] group-hover/item:text-[#C8102E] truncate transition-colors">
                    {notice.title}
                  </span>
                </Link>

                {notice.date && (
                  <span className="hidden lg:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200/70 shrink-0">
                    {notice.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Controls: Slide Dots, Up/Down Arrows & All Notices Link */}
        <div className="flex items-center gap-2 shrink-0 pl-1 border-l border-slate-100">
          {/* Vertical Indicator Dots */}
          {totalNotices > 1 && (
            <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-1">
              {pinnedNotices.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setSlideIndex(i);
                  }}
                  aria-label={`নোটিশ ${i + 1}`}
                  className={` rounded-full transition-all duration-300 ${
                    activeDotIndex === i
                      ? 'w-1.5 h-3.5 bg-[#C8102E]'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Manual Swipe Up/Down Mini Buttons */}
          {totalNotices > 1 && (
            <div className="hidden md:flex flex-col gap-0.5">
              <button
                type="button"
                onClick={handlePrevSlide}
                title="পূর্ববর্তী নোটিশ"
                className="w-5 h-4 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#C8102E] flex items-center justify-center transition"
              >
                <FaChevronUp className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                title="পরবর্তী নোটিশ"
                className="w-5 h-4 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#C8102E] flex items-center justify-center transition"
              >
                <FaChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          <Link
            href="/notices"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E] hover:text-white bg-red-50 hover:bg-[#C8102E] px-2.5 sm:px-3 py-1.5 rounded-xl border border-red-200/70 transition shrink-0"
          >
            <span className="hidden sm:inline">সকল নোটিশ</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <section
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden rounded-3xl text-white p-6 sm:p-12 lg:p-16 shadow-premium border-b-4 border-[#C8102E]"
      >
        {/* Decorative Glow Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#C8102E]/25 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/15 shadow-sm">
                <FaLocationDot className="text-[#EF5350]" />
                জুম্মাপাড়া, নীলফামারী সদর
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#C8102E] text-white border border-red-400/40 shadow-sm">
                <HiSparkles className="text-amber-300" />
                "শিখবো, জিতবো"
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ৫ম থেকে ১০ম শ্রেণি
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              শিক্ষানোভা <span className="text-[#EF5350]">SikkhaNova</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য রোল অনুযায়ী দৈনিক উপস্থিতি, কোচিং রেজাল্ট ও স্বয়ংক্রিয় মার্কশিট, বিকাশ/নগদে প্রিমিয়াম হ্যান্ডনোট এবং ইউটিউব ভিডিও ক্লাস।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/pdfs"
                className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A60D26] text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-nova transition transform hover:-translate-y-0.5"
              >
                <FaFilePdf className="w-4 h-4" /> পিডিএফ হ্যান্ডনোট
              </Link>

              <Link
                href="/results"
                className="inline-flex items-center gap-2 bg-white text-[#0A1E3C] hover:bg-slate-100 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md transition transform hover:-translate-y-0.5"
              >
                <FaAward className="w-4 h-4 text-[#C8102E]" /> রেজাল্ট খুঁজুন
              </Link>

              <Link
                href="/notices"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-white/20 transition transform hover:-translate-y-0.5"
              >
                <FaUserCheck className="w-4 h-4 text-emerald-400" /> নোটিশ বোর্ড দেখুন
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-blue-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <HiShieldCheck className="w-4 h-4 text-emerald-400" /> নির্ভরযোগ্য কোচিং সিস্টেম
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <TbCashBanknote className="w-4 h-4 text-nova-400" /> বিকাশ ও নগদ TrxID ভেরিফিকেশন
              </span>
            </div>
          </div>

          {/* Right Column: 3D Floating Glass Showcase Logo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl border-2 border-white/40 space-y-6 transform hover:scale-102 transition-transform duration-300">
              <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-4 border border-slate-100 flex items-center justify-center shadow-inner">
                <Logo size="lg" clickable={false} />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-50 text-brand-900 font-bold border border-brand-100">
                  <span className="flex items-center gap-1.5">
                    <FaLocationDot className="text-nova-600" /> কেন্দ্র:
                  </span>
                  <span>জুম্মাপাড়া, নীলফামারী সদর</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-100">
                  <span className="flex items-center gap-1.5">
                    <FaPhone className="text-emerald-600" /> হেল্পলাইন:
                  </span>
                  <span className="font-bn-normal font-bold">০১৭১২৫৯২৫১৯</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 text-rose-900 font-bold border border-rose-100">
                  <span className="flex items-center gap-1.5">
                    <HiSparkles className="text-slogan-600" /> স্লোগান:
                  </span>
                  <span className="font-black text-slogan-600">"শিখবো, জিতবো"</span>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0A1E3C] hover:bg-[#C8102E] text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
              >
                <span>স্টুডেন্ট ও টিচার পোর্টাল</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
