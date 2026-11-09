'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DEFAULT_NOTICES, NoticeItem } from '@/lib/defaultNotices';
import { DEFAULT_BANNERS, BannerItem } from '@/lib/defaultBanners';
import {
  FaArrowRight,
  FaThumbtack,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa6';

export default function HeroSection() {
  // 1. Pinned Top 3 Notices State (Vertical Swipe-Up)
  const [pinnedNotices, setPinnedNotices] = useState<NoticeItem[]>(() => {
    const pinned = DEFAULT_NOTICES.filter((n) => n.isPinned);
    const rest = DEFAULT_NOTICES.filter((n) => !n.isPinned);
    return [...pinned, ...rest].slice(0, 3);
  });

  const [noticeIndex, setNoticeIndex] = useState<number>(0);
  const [noticeTransitioning, setNoticeTransitioning] = useState<boolean>(true);
  const [noticePaused, setNoticePaused] = useState<boolean>(false);

  // 2. Hero Banners State (Horizontal Full-Width Auto-Swipe, No Buttons)
  const [banners, setBanners] = useState<BannerItem[]>(
    DEFAULT_BANNERS.filter((b) => b.isActive)
  );
  const [bannerIndex, setBannerIndex] = useState<number>(0);
  const [bannerTransitioning, setBannerTransitioning] = useState<boolean>(true);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    // Load Pinned Notices
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
            setNoticeIndex(0);
          }
        }
      })
      .catch(() => {});

    // Load Active Hero Banners
    fetch('/api/banners', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.banners && Array.isArray(data.banners)) {
          const activeList = data.banners.filter((b: BannerItem) => b.isActive);
          if (activeList.length > 0) {
            setBanners(activeList);
            setBannerIndex(0);
          }
        }
      })
      .catch(() => {});
  }, []);

  // --- Notice Vertical Swipe-Up Logic ---
  const totalNotices = pinnedNotices.length;
  const extendedNotices =
    totalNotices > 1 ? [...pinnedNotices, pinnedNotices[0]] : pinnedNotices;

  useEffect(() => {
    if (totalNotices <= 1 || noticePaused) return;
    const timer = setInterval(() => {
      setNoticeTransitioning(true);
      setNoticeIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, [totalNotices, noticePaused]);

  useEffect(() => {
    if (totalNotices <= 1) return;
    if (noticeIndex === totalNotices) {
      const timeout = setTimeout(() => {
        setNoticeTransitioning(false);
        setNoticeIndex(0);
      }, 650);
      return () => clearTimeout(timeout);
    }
  }, [noticeIndex, totalNotices]);

  const handleNextNotice = () => {
    if (totalNotices <= 1 || noticeIndex >= totalNotices) return;
    setNoticeTransitioning(true);
    setNoticeIndex((prev) => prev + 1);
  };

  const handlePrevNotice = () => {
    if (totalNotices <= 1) return;
    setNoticeTransitioning(true);
    setNoticeIndex((prev) => (prev <= 0 ? totalNotices - 1 : prev - 1));
  };

  const activeNoticeDot = totalNotices > 0 ? noticeIndex % totalNotices : 0;

  // --- Banner Horizontal Auto-Swipe Logic (No Buttons) ---
  const totalBanners = banners.length;
  const extendedBanners =
    totalBanners > 1 ? [...banners, banners[0]] : banners;

  useEffect(() => {
    if (totalBanners <= 1) return;
    const timer = setInterval(() => {
      setBannerTransitioning(true);
      setBannerIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalBanners]);

  useEffect(() => {
    if (totalBanners <= 1) return;
    if (bannerIndex === totalBanners) {
      const timeout = setTimeout(() => {
        setBannerTransitioning(false);
        setBannerIndex(0);
      }, 750);
      return () => clearTimeout(timeout);
    }
  }, [bannerIndex, totalBanners]);

  // Touch & Mouse Drag Swipe Support (Buttonless Natural Swipe)
  const handleTouchStart = (clientX: number) => {
    touchStartXRef.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartXRef.current === null || totalBanners <= 1) return;
    const diff = touchStartXRef.current - clientX;
    touchStartXRef.current = null;

    if (Math.abs(diff) > 40) {
      setBannerTransitioning(true);
      if (diff > 0) {
        // Swiped left -> next banner
        if (bannerIndex < totalBanners) {
          setBannerIndex((prev) => prev + 1);
        }
      } else {
        // Swiped right -> previous banner
        setBannerIndex((prev) => (prev <= 0 ? totalBanners - 1 : prev - 1));
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Smooth Vertical Swipe-Up Pinned Notice Board (Latest 3 Pinned Notices) */}
      <div
        onMouseEnter={() => setNoticePaused(true)}
        onMouseLeave={() => setNoticePaused(false)}
        className="bg-white rounded-2xl border border-slate-200/95 shadow-sm px-2.5 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2.5 sm:gap-3.5 overflow-hidden relative group"
      >
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

        <div className="relative h-9 sm:h-10 flex-1 overflow-hidden">
          <div
            style={{
              transform: `translateY(-${noticeIndex * 100}%)`,
              transition: noticeTransitioning
                ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none',
            }}
            className="w-full h-full"
          >
            {extendedNotices.map((notice, idx) => (
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

        <div className="flex items-center gap-2 shrink-0 pl-1 border-l border-slate-100">
          {totalNotices > 1 && (
            <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-1">
              {pinnedNotices.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setNoticeTransitioning(true);
                    setNoticeIndex(i);
                  }}
                  aria-label={`নোটিশ ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    activeNoticeDot === i
                      ? 'w-1.5 h-3.5 bg-[#C8102E]'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}

          {totalNotices > 1 && (
            <div className="hidden md:flex flex-col gap-0.5">
              <button
                type="button"
                onClick={handlePrevNotice}
                title="পূর্ববর্তী নোটিশ"
                className="w-5 h-4 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#C8102E] flex items-center justify-center transition"
              >
                <FaChevronUp className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={handleNextNotice}
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

      {/* 2. Full-Width Auto-Swiping Hero Banner Section (No Buttons, Proportional on Mobile & Desktop) */}
      <section
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleTouchStart(e.clientX)}
        onMouseUp={(e) => handleTouchEnd(e.clientX)}
        className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-[#061226] select-none shadow-md"
      >
        <div
          style={{
            transform: `translateX(-${bannerIndex * 100}%)`,
            transition: bannerTransitioning
              ? 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
          }}
          className="flex w-full"
        >
          {extendedBanners.map((banner, idx) => {
            const imgElement = (
              <div className="w-full aspect-[3/1] relative overflow-hidden bg-[#061226]">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'শিক্ষানোভা ব্যানার'}
                  draggable={false}
                  className="w-full h-full object-cover block"
                />
              </div>
            );

            return (
              <div key={`${banner.id}-${idx}`} className="w-full shrink-0">
                {banner.linkUrl ? (
                  <Link href={banner.linkUrl} className="block w-full">
                    {imgElement}
                  </Link>
                ) : (
                  imgElement
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
