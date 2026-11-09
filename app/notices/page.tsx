'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FaBell,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaEye,
  FaXmark,
  FaThumbtack,
  FaCircleCheck,
  FaArrowRight,
  FaPlus,
} from 'react-icons/fa6';
import { DEFAULT_NOTICES, NoticeItem } from '@/lib/defaultNotices';

export default function NoticesPage() {
  const { data: session } = useSession();
  const [notices, setNotices] = useState<NoticeItem[]>(DEFAULT_NOTICES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('sn_notices_cache_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotices(parsed);
        }
      }
    } catch {}

    fetch('/api/notices', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.notices && Array.isArray(data.notices) && data.notices.length > 0) {
          setNotices(data.notices);
          try {
            sessionStorage.setItem('sn_notices_cache_v1', JSON.stringify(data.notices));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: 'সকল নোটিশ' },
    { id: 'exam', label: 'পরীক্ষা ও ফলাফল' },
    { id: 'admission', label: 'ভর্তি বিজ্ঞপ্তি' },
    { id: 'routine', label: 'ক্লাস রুটিন' },
    { id: 'general', label: 'হ্যান্ডনোট ও সাধারণ' },
  ];

  const filteredNotices = notices.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden text-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-2xl border-b-4 border-[#C8102E]"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white text-xs font-bold px-3.5 py-1 rounded-sm uppercase tracking-wider shadow-xs">
              <FaBell className="w-3.5 h-3.5 text-amber-300" />
              অফিশিয়াল নোটিশ বোর্ড
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              সকল নোটিশ ও একাডেমিক বিজ্ঞপ্তি
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              শিক্ষা নোভা একাডেমির ৫ম থেকে ১০ম শ্রেণির ক্লাস রুটিন, পরীক্ষার সময়সূচি, ফলাফল ও জরুরি বিজ্ঞপ্তিসমূহ নিয়মিত এখানে আপডেট করা হয়।
            </p>
            {session?.user?.role === 'ADMIN' && (
              <div className="pt-1">
                <Link
                  href="/admin?tab=notices"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-sm text-xs shadow transition"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>অ্যাডমিন প্যানেল থেকে নোটিশ যুক্ত বা এডিট করুন</span>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-xs space-y-1.5 shrink-0">
            <p className="text-slate-300 font-semibold">জরুরি তথ্য ও অনুসন্ধান:</p>
            <p className="text-base font-black font-bn-normal text-white">০১৭১২৫৯২৫১৯</p>
            <p className="text-[11px] text-emerald-300 flex items-center gap-1 font-semibold">
              <FaCircleCheck /> জুম্মাপাড়া, নীলফামারী সদর
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-sm text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#C8102E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px] sm:w-72">
          <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নোটিশ খুঁজুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
            <FaBell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">কোনো নোটিশ পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">অন্য কোনো ক্যাটাগরি বা কি-ওয়ার্ড দিয়ে চেষ্টা করুন।</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notice.isPinned
                  ? 'border-l-4 border-l-[#C8102E] border-slate-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#C8102E] text-white px-2 py-0.5 rounded-sm">
                      <FaThumbtack className="w-2.5 h-2.5" /> পিন করা নোটিশ
                    </span>
                  )}
                  <span className="text-[11px] font-bold bg-slate-100 text-[#0A1E3C] px-2.5 py-0.5 rounded-sm border border-slate-200">
                    {notice.categoryLabel}
                  </span>
                  <span className="text-[11px] font-bold bg-red-50 text-[#C8102E] px-2.5 py-0.5 rounded-sm border border-red-100">
                    {notice.targetClass}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <FaCalendarDays className="text-slate-400" /> {notice.date}
                  </span>
                </div>

                <h2
                  onClick={() => setActiveNotice(notice)}
                  className="text-base sm:text-lg font-bold text-[#0A1E3C] hover:text-[#C8102E] cursor-pointer transition"
                >
                  {notice.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {notice.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveNotice(notice)}
                  className="inline-flex items-center gap-1.5 bg-[#0A1E3C] hover:bg-[#C8102E] text-white text-xs font-bold px-4 py-2.5 rounded-sm transition shadow-xs"
                >
                  <FaEye className="w-3.5 h-3.5" />
                  <span>বিস্তারিত দেখুন</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice Details Modal */}
      {activeNotice && (
        <div
          onClick={() => setActiveNotice(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-t-4 border-[#C8102E] space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-[#C8102E] text-white px-2.5 py-0.5 rounded-sm">
                    {activeNotice.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    প্রকাশের তারিখ: {activeNotice.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C]">
                  {activeNotice.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveNotice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-[#C8102E] flex items-center justify-center transition shrink-0"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{activeNotice.details}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                আদেশক্রমে: <strong className="text-[#0A1E3C]">পরিচালক, শিক্ষা নোভা একাডেমি</strong>
              </div>

              <div className="flex items-center gap-2">
                {activeNotice.attachmentUrl && (
                  <Link
                    href={activeNotice.attachmentUrl}
                    className="inline-flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-bold px-4 py-2 rounded-sm transition"
                  >
                    <span>সংশ্লিষ্ট পেজে যান</span>
                    <FaArrowRight className="w-3 h-3" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActiveNotice(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-sm transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
