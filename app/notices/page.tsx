'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaBell,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaFilePdf,
  FaEye,
  FaXmark,
  FaThumbtack,
  FaCircleCheck,
  FaArrowRight,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'exam' | 'routine' | 'admission' | 'general';
  categoryLabel: string;
  targetClass: string;
  isPinned?: boolean;
  summary: string;
  details: string;
  attachmentUrl?: string;
}

const NOTICES_DATA: NoticeItem[] = [
  {
    id: 'n-1',
    title: '৫ম থেকে ১০ম শ্রেণির মাসিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষার সময়সূচি প্রকাশ',
    date: '১০ নভেম্বর, ২০২৬',
    category: 'exam',
    categoryLabel: 'পরীক্ষা ও ফলাফল',
    targetClass: '৫ম - ১০ম শ্রেণি',
    isPinned: true,
    summary:
      'আগামী সপ্তাহ থেকে ৫ম থেকে ১০ম শ্রেণির সকল ব্যাচের মাসিক মূল্যায়ন ও বিশেষ মডেল টেস্ট পরীক্ষা শুরু হতে যাচ্ছে।',
    details:
      'শিক্ষা নোভা একাডেমির ৫ম থেকে ১০ম শ্রেণির সকল শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী সপ্তাহ থেকে মাসিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষা অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে নির্ধারিত সময়ের ১৫ মিনিট পূর্বে কেন্দ্রে উপস্থিত থাকার জন্য নির্দেশ দেওয়া হলো। পরীক্ষার ফলাফল ও ডিজিটাল মার্কশিট আমাদের ওয়েবসাইটের "কোচিং রেজাল্ট" পাতায় রোল নম্বর অনুযায়ী প্রকাশ করা হবে।',
    attachmentUrl: '/results',
  },
  {
    id: 'n-2',
    title: 'নতুন শিক্ষাবর্ষে ৫ম থেকে ১০ম শ্রেণির স্পেশাল ব্যাচে ভর্তি চলছে',
    date: '০৮ নভেম্বর, ২০২৬',
    category: 'admission',
    categoryLabel: 'ভর্তি বিজ্ঞপ্তি',
    targetClass: 'সকল শ্রেণি',
    isPinned: true,
    summary:
      'জুম্মাপাড়া, নীলফামারী সদর ক্যাম্পাসে সীমিত আসনে ৫ম থেকে ১০ম শ্রেণির নতুন ব্যাচে ভর্তি কার্যক্রম শুরু হয়েছে।',
    details:
      'অভিজ্ঞ শিক্ষক মণ্ডলী ও আধুনিক ডিজিটাল মনিটরিং ব্যবস্থায় পরিচালিত শিক্ষা নোভা একাডেমিতে ৫ম, ৬ষ্ঠ, ৭ম, ৮ম, ৯ম ও ১০ম শ্রেণির নতুন ব্যাচে ভর্তি চলছে। প্রতিদিন অধ্যায়ভিত্তিক লেকচার শিট, সাপ্তাহিক পরীক্ষা এবং দুর্বল শিক্ষার্থীদের জন্য আলাদা কেয়ার ক্লাসের ব্যবস্থা রয়েছে। বিস্তারিত জানতে যোগাযোগ করুন: ০১৭১২৫৯২৫১৯।',
  },
  {
    id: 'n-3',
    title: '৯ম ও ১০ম শ্রেণির পদার্থ, রসায়ন ও উচ্চতর গণিত প্রিমিয়াম হ্যান্ডনোট প্রকাশ',
    date: '০৫ নভেম্বর, ২০২৬',
    category: 'general',
    categoryLabel: 'হ্যান্ডনোট ও শিট',
    targetClass: '৯ম - ১০ম শ্রেণি',
    summary:
      'বোর্ড পরীক্ষার সর্বশেষ সিলেবাস অনুযায়ী অধ্যায়ভিত্তিক রঙিন হ্যান্ডনোট ও চূড়ান্ত সাজেশন এখন পিডিএফ শপে পাওয়া যাচ্ছে।',
    details:
      '৯ম ও ১০ম শ্রেণির বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও উচ্চতর গণিতের বিশেষ হ্যান্ডনোট এবং সৃজনশীল ও বহুনির্বাচনি সাজেশন ওয়েবসাইটের "পিডিএফ শিট ও নোট" সেকশনে আপলোড করা হয়েছে। বিকাশ বা নগদে নির্ধারিত ফি পেমেন্ট করে TrxID ভেরিফিকেশনের মাধ্যমে সাথে সাথে ডাউনলোড করা যাবে।',
    attachmentUrl: '/pdfs',
  },
  {
    id: 'n-4',
    title: '৭ম ও ৮ম শ্রেণির গণিত ও ইংরেজি বিশেষ রিভিশন ক্লাসের সময়সূচি',
    date: '০২ নভেম্বর, ২০২৬',
    category: 'routine',
    categoryLabel: 'ক্লাস রুটিন',
    targetClass: '৭ম - ৮ম শ্রেণি',
    summary:
      'আগামী শুক্রবার সকাল ৯:০০ ঘটিকায় ৭ম ও ৮ম শ্রেণির গণিত ও ইংরেজি বিষয়ের বিশেষ সমাধান ক্লাস অনুষ্ঠিত হবে।',
    details:
      '৭ম ও ৮ম শ্রেণির শিক্ষার্থীদের জ্যামিতি, বীজগণিত এবং ইংরেজি গ্রামারের গুরুত্বপূর্ণ টপিকগুলোর ওপর আগামী শুক্রবার সকাল ৯:০০ ঘটিকা হতে ১১:৩০ ঘটিকা পর্যন্ত বিশেষ রিভিশন ও ডাউট সলভিং ক্লাস অনুষ্ঠিত হবে। ক্লাস শেষে প্র্যাকটিস শিট প্রদান করা হবে।',
  },
  {
    id: 'n-5',
    title: 'সাপ্তাহিক মেধা যাচাই পরীক্ষার মেধাতালিকা ও পুরস্কার বিতরণী সংক্রান্ত বিজ্ঞপ্তি',
    date: '২৮ অক্টোবর, ২০২৬',
    category: 'exam',
    categoryLabel: 'পরীক্ষা ও ফলাফল',
    targetClass: '৫ম - ১০ম শ্রেণি',
    summary:
      'সাপ্তাহিক পরীক্ষায় প্রতিটি শ্রেণিতে ১ম, ২য় ও ৩য় স্থান অধিকারী কৃতি শিক্ষার্থীদের মাঝে বিশেষ শিক্ষাবৃত্তি ও ক্রেস্ট প্রদান।',
    details:
      'গত মাসের সাপ্তাহিক ও মাসিক পরীক্ষায় সর্বোচ্চ নম্বরপ্রাপ্ত কৃতি শিক্ষার্থীদের ফলাফল প্রকাশিত হয়েছে। ওয়েবসাইটের রেজাল্ট পেজ থেকে রোল নম্বর দিয়ে বিস্তারিত মার্কশিট ডাউনলোড করা যাবে। আগামী শনিবার কৃতি শিক্ষার্থীদের হাতে পুরস্কার তুলে দেওয়া হবে।',
    attachmentUrl: '/results',
  },
];

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  const categories = [
    { id: 'all', label: 'সকল নোটিশ' },
    { id: 'exam', label: 'পরীক্ষা ও ফলাফল' },
    { id: 'admission', label: 'ভর্তি বিজ্ঞপ্তি' },
    { id: 'routine', label: 'ক্লাস রুটিন' },
    { id: 'general', label: 'হ্যান্ডনোট ও সাধারণ' },
  ];

  const filteredNotices = NOTICES_DATA.filter((item) => {
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

