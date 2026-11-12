'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  toBengaliClass,
  QuizPrices,
  DEFAULT_QUIZ_PRICES,
  getStoredQuizPrices,
  saveStoredQuizPrices,
  QuizPackageItem,
  DEFAULT_QUIZ_PACKAGES,
  getStoredQuizPackages,
  saveStoredQuizPackages,
  QuizCovers,
  DEFAULT_QUIZ_COVERS,
  getStoredQuizCovers,
  saveStoredQuizCovers,
} from '@/lib/defaultQuizData';
import {
  FaBolt,
  FaGem,
  FaGift,
  FaCheck,
  FaArrowRight,
  FaLock,
  FaCrown,
} from 'react-icons/fa6';

export default function ModelTestShowcaseSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'paid' | 'packages'>('all');
  const [quizPrices, setQuizPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [quizPackages, setQuizPackages] = useState<QuizPackageItem[]>(DEFAULT_QUIZ_PACKAGES);
  const [quizCovers, setQuizCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);

  const classBadges = [
    { grade: 5, tag: 'বৃত্তি ও ফাইনাল' },
    { grade: 6, tag: 'নতুন কারিকুলাম' },
    { grade: 7, tag: 'অধ্যায়ভিত্তিক' },
    { grade: 8, tag: 'জুনিয়র স্পেশাল' },
    { grade: 9, tag: 'বিজ্ঞান/মানবিক/ব্যবসায়' },
    { grade: 10, tag: 'এসএসসি ক্র্যাশ ব্যাচ' },
  ];

  // Hydrate Dynamic Prices, Packages, and Covers
  useEffect(() => {
    try {
      const storedPrices = getStoredQuizPrices();
      if (storedPrices) setQuizPrices(storedPrices);
    } catch {}

    try {
      const storedPkgs = getStoredQuizPackages();
      if (storedPkgs && storedPkgs.length > 0) setQuizPackages(storedPkgs);
    } catch {}

    try {
      const storedCovers = getStoredQuizCovers();
      if (storedCovers) setQuizCovers(storedCovers);
    } catch {}

    // Fetch live prices
    fetch('/api/quiz/prices', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.prices) {
          setQuizPrices(data.prices);
          saveStoredQuizPrices(data.prices);
        }
      })
      .catch(() => {});

    // Fetch live packages
    fetch('/api/quiz/packages', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.packages && Array.isArray(data.packages)) {
          setQuizPackages(data.packages);
          saveStoredQuizPackages(data.packages);
        }
      })
      .catch(() => {});

    // Fetch live covers
    fetch('/api/quiz/covers', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.covers && typeof data.covers === 'object') {
          setQuizCovers(data.covers);
          saveStoredQuizCovers(data.covers);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-br from-white via-red-50/20 to-white rounded-3xl p-6 sm:p-10 border border-red-100 shadow-md relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 text-[#C8102E] text-xs font-black border border-red-200">
              <FaBolt className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>ইন্টারেক্টিভ কুইজ ও প্রস্তুতি</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#0A1E3C] tracking-tight">
              আজই তোমার প্রস্তুতি যাচাই করো — <span className="text-[#C8102E]">অনলাইন মডেল টেস্ট</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির প্রতিটি বিষয়ের অধ্যায়ভিত্তিক ফ্রি ও পেইড MCQ পরীক্ষা। তাৎক্ষণিক স্বয়ংক্রিয় ফলাফল, সমাধান, মেধা তালিকা ও স্পেশাল মডেল টেস্ট প্যাকেজ।
            </p>
          </div>

          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            <span>সবগুলো টেস্ট দেখুন</span>
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Tabs: All / Free / Paid / Special Packages */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0A1E3C] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সবগুলো দেখুন (All)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('free')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'free'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <FaGift className="w-3 h-3" />
            <span>১০০% ফ্রি টেস্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paid')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'paid'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'bg-red-50 text-[#C8102E] hover:bg-red-100 border border-red-200'
            }`}
          >
            <FaGem className="w-3 h-3" />
            <span>প্রিমিয়াম মডেল টেস্ট (Paid)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <FaCrown className="w-3 h-3 text-amber-500" />
            <span>স্পেশাল প্যাকেজ অফার</span>
          </button>
        </div>

        {/* 1. CLASS-WISE MODEL TESTS GRID (Shown in 'all', 'free', or 'paid') */}
        {activeTab !== 'packages' && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800">
                {activeTab === 'free'
                  ? '🎁 শ্রেণিভিত্তিক ফ্রি মডেল টেস্ট'
                  : activeTab === 'paid'
                  ? '💎 শ্রেণিভিত্তিক পেইড / প্রিমিয়াম মডেল টেস্ট'
                  : 'শ্রেণিভিত্তিক মডেল টেস্ট (ফ্রি ও পেইড)'}
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                ৫ম – ১০ম শ্রেণি
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {classBadges.map((c) => {
                const clsPrice = quizPrices.classPrices[c.grade] || 50;
                const coverImage = quizCovers.classes[c.grade];
                const showPaidBadge = activeTab === 'paid';

                return (
                  <Link
                    key={c.grade}
                    href={`/quiz`}
                    className={`group bg-white hover:bg-gradient-to-b hover:from-white hover:to-red-50/60 p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between text-center relative overflow-hidden shadow-xs hover:shadow-md ${
                      showPaidBadge
                        ? 'border-red-200 hover:border-[#C8102E]'
                        : 'border-slate-200/90 hover:border-red-300'
                    }`}
                  >
                    {/* Optional Cover Image */}
                    {coverImage && (
                      <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 mb-2 relative">
                        <img
                          src={coverImage}
                          alt={`${toBengaliClass(c.grade)} শ্রেণি`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-[#C8102E] transition-colors">
                        {c.tag}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-800">
                        {toBengaliClass(c.grade)} শ্রেণি
                      </h4>

                      {/* Dynamic Free or Paid Badge */}
                      {showPaidBadge ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#C8102E] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                          <FaGem className="w-2.5 h-2.5" /> ৳{clsPrice}
                        </div>
                      ) : activeTab === 'free' ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <FaGift className="w-2.5 h-2.5" /> ১০০% ফ্রি
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            ফ্রি
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[#C8102E] bg-red-50 px-1.5 py-0.5 rounded border border-red-100 font-mono">
                            পেইড ৳{clsPrice}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-black text-[#C8102E] group-hover:translate-x-0.5 transition-transform">
                      <span>{showPaidBadge ? 'পেইড টেস্ট দিন' : 'টেস্ট দিন'}</span>
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. DYNAMIC SPECIAL PACKAGES SHOWCASE (Shown ONLY when 'packages' tab is clicked) */}
        {activeTab === 'packages' && (
          <div className="pt-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] bg-red-50 px-3 py-0.5 rounded-full border border-red-200 mb-1">
                  <FaCrown className="text-amber-500" /> বিশেষ অফার ও প্যাকেজ
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1E3C]">
                  স্পেশাল মডেল টেস্ট প্যাকেজ
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  বিকাশ, নগদ, রকেট বা উপায়ের মাধ্যমে সহজে যেকোনো আকর্ষণীয় প্যাকেজ আনলক করুন
                </p>
              </div>

              <Link
                href="/quiz"
                className="text-xs font-black text-[#C8102E] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>সব প্যাকেজের বিবরণ ও আনলক কোড</span>
                <FaArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            {/* Dynamic Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {quizPackages
                .filter((pkg) => pkg.isActive)
                .map((pkg) => {
                  const isPopular = pkg.isPopular;
                  const discountPct =
                    pkg.originalPrice && pkg.originalPrice > pkg.price
                      ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                      : null;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 space-y-4 relative flex flex-col justify-between ${
                        isPopular
                          ? 'border-2 border-[#C8102E] shadow-xl md:-translate-y-1'
                          : 'border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300'
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#9B0D23] to-[#C8102E] text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-bl-2xl shadow-xs">
                          {pkg.badge || 'জনপ্রিয় অফার'}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-1">
                          {!isPopular && pkg.badge && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                              {pkg.badge}
                            </span>
                          )}
                          <h4 className="text-base sm:text-lg font-black text-slate-900">
                            {pkg.title}
                          </h4>
                        </div>

                        {/* Price & Discount */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-[#C8102E]">
                            ৳{pkg.price}
                          </span>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <span className="text-xs sm:text-sm font-bold text-slate-400 line-through">
                              ৳{pkg.originalPrice}
                            </span>
                          )}
                          {discountPct && (
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                              {discountPct}% ছাড়
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {pkg.tagline}
                        </p>

                        {/* Features Bullet List */}
                        <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                          {pkg.features.slice(0, 4).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-black shrink-0 mt-0.5">✓</span>
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Unlock Action Button */}
                      <div className="pt-2">
                        <Link
                          href="/quiz"
                          className={`w-full py-2.5 sm:py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 active:scale-98 shadow-sm ${
                            isPopular
                              ? 'bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] text-white hover:opacity-95 shadow-md'
                              : 'bg-slate-100 hover:bg-[#0A1E3C] text-slate-800 hover:text-white'
                          }`}
                        >
                          <FaLock className="w-3 h-3" />
                          <span>প্যাকেজটি আনলক করুন</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Feature Highlights Footer inside Showcase */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-bold">
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>তাৎক্ষণিক অটোমেটিক স্কোর ও গ্রেড</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>প্রতিটি প্রশ্নের বিস্তারিত সঠিক ব্যাখ্যা</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>মেধা তালিকা / লিডারবোর্ড মেডেল</span>
          </div>
        </div>
      </div>
    </section>
  );
}
