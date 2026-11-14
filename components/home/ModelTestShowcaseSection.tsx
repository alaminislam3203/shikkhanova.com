"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
} from "@/lib/defaultQuizData";
import {
  FaBolt,
  FaGem,
  FaGift,
  FaCheck,
  FaArrowRight,
  FaLock,
  FaCrown,
  FaFire,
  FaStar,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

export default function ModelTestShowcaseSection() {
  const [activeTab, setActiveTab] = useState<
    "bestsellers" | "all" | "free" | "packages"
  >("bestsellers");

  const [quizPrices, setQuizPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [quizPackages, setQuizPackages] = useState<QuizPackageItem[]>(
    DEFAULT_QUIZ_PACKAGES,
  );
  const [quizCovers, setQuizCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);

  // Mobile Carousel Auto-slide State
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const classBadges = [
    { grade: 5, tag: "বৃত্তি ও ফাইনাল" },
    { grade: 6, tag: "নতুন কারিকুলাম" },
    { grade: 7, tag: "অধ্যায়ভিত্তিক" },
    { grade: 8, tag: "জুনিয়র স্পেশাল" },
    { grade: 9, tag: "বিজ্ঞান/মানবিক/ব্যবসায়" },
    { grade: 10, tag: "এসএসসি ক্র্যাশ ব্যাচ" },
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
    fetch("/api/quiz/prices", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.prices) {
          setQuizPrices(data.prices);
          saveStoredQuizPrices(data.prices);
        }
      })
      .catch(() => {});

    // Fetch live packages
    fetch("/api/quiz/packages", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.packages && Array.isArray(data.packages)) {
          setQuizPackages(data.packages);
          saveStoredQuizPackages(data.packages);
        }
      })
      .catch(() => {});

    // Fetch live covers
    fetch("/api/quiz/covers", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.covers && typeof data.covers === "object") {
          setQuizCovers(data.covers);
          saveStoredQuizCovers(data.covers);
        }
      })
      .catch(() => {});
  }, []);

  // 🏆 Curated High-Selling & Popular MCQ Model Tests
  const bestSellingTests = [
    {
      id: "best-ssc-all",
      title: "এসএসসি ২০২৫ পূর্ণাঙ্গ মডেল টেস্ট সিরিজ",
      subtitle: "বোর্ড স্ট্যান্ডার্ড পূর্ণ সিলেবাস MCQ পরীক্ষা ও ব্যাখ্যাসহ সমাধান",
      grade: 10,
      subject: "সকল বিষয়",
      salesCount: "২,৭৫০+ শিক্ষার্থী কিনেছে",
      rating: "৪.৯",
      reviewCount: "৬৫০+ রিভিউ",
      testsCount: "৬০টি টেস্ট",
      badge: "🔥 বেস্ট সেলার",
      badgeGradient: "from-red-600 to-rose-500",
      accentBg: "bg-red-500/10",
      price: quizPrices.classPrices[10] || 50,
      originalPrice: (quizPrices.classPrices[10] || 50) * 2,
      discountText: "৫০% ছাড়",
      features: [
        "অধ্যায়ভিত্তিক ও পূর্ণাঙ্গ বোর্ড মডেল টেস্ট",
        "তাৎক্ষণিক স্বয়ংক্রিয় স্কোর ও মেধা তালিকা",
        "প্রতিটি প্রশ্নের বিস্তারিত নির্ভুল সমাধান",
      ],
      link: "/quiz?class=10",
    },
    {
      id: "best-class10-science",
      title: "১০ম শ্রেণি বিজ্ঞান স্পেশাল কম্বো",
      subtitle: "পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও উচ্চতর গণিত মেগা টেস্ট",
      grade: 10,
      subject: "বিজ্ঞান গ্রুপ",
      salesCount: "২,১২০+ শিক্ষার্থী কিনেছে",
      rating: "৫.০",
      reviewCount: "৪৮০+ রিভিউ",
      testsCount: "৪৫টি টেস্ট",
      badge: "🏆 সর্বাধিক বিক্রিত",
      badgeGradient: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10",
      price: quizPrices.classPrices[10] || 50,
      originalPrice: 120,
      discountText: "৫৮% ছাড়",
      features: [
        "কঠিন গাণিতিক ও সৃজনশীল MCQ প্র্যাকটিস",
        "টাইমারসহ রিয়েল এক্সাম এনভায়রনমেন্ট",
        "টপ ১০০ লিডারবোর্ড মেডেল ও ব্যাজ",
      ],
      link: "/quiz/subject?class=10&subject=পদার্থবিজ্ঞান",
    },
    {
      id: "best-class8-junior",
      title: "৮ম শ্রেণি জুনিয়র মেধাবৃত্তি ও বার্ষিক মডেল টেস্ট",
      subtitle: "নতুন কারিকুলাম ও জুনিয়র বৃত্তি পরীক্ষার পূর্ণাঙ্গ স্পেশাল প্রস্তুতি",
      grade: 8,
      subject: "সকল বিষয়",
      salesCount: "১,৮৯০+ শিক্ষার্থী কিনেছে",
      rating: "৪.৮",
      reviewCount: "৩৪০+ রিভিউ",
      testsCount: "৪০টি টেস্ট",
      badge: "⚡ ট্রেন্ডিং টেস্ট",
      badgeGradient: "from-blue-600 to-indigo-600",
      accentBg: "bg-blue-500/10",
      price: quizPrices.classPrices[8] || 50,
      originalPrice: (quizPrices.classPrices[8] || 50) * 2,
      discountText: "৫০% ছাড়",
      features: [
        "নতুন কারিকুলাম প্রশ্ন ব্যাংক ও নমুনা পরীক্ষা",
        "দুর্বলতা চিহ্নিত করার পারফরম্যান্স গ্রাফ",
        "অনলিমিটেড রি-টেস্ট ও প্র্যাকটিস সুযোগ",
      ],
      link: "/quiz?class=8",
    },
    {
      id: "best-class9-math",
      title: "৯ম ও ১০ম শ্রেণি সাধারণ গণিত বোর্ড চ্যালেঞ্জ",
      subtitle: "অধ্যায়ভিত্তিক শর্টকাট টেকনিক ও নির্ভুল বহুনির্বাচনী অনুশীলন",
      grade: 9,
      subject: "সাধারণ গণিত",
      salesCount: "১,৭৫০+ শিক্ষার্থী কিনেছে",
      rating: "৪.৯",
      reviewCount: "৪১০+ রিভিউ",
      testsCount: "৩৫টি টেস্ট",
      badge: "⭐ টপ রেটেড",
      badgeGradient: "from-emerald-600 to-teal-600",
      accentBg: "bg-emerald-500/10",
      price: quizPrices.classPrices[9] || 50,
      originalPrice: 100,
      discountText: "৫০% ছাড়",
      features: [
        "ক্যালকুলেশন শর্টকাট ট্রিকস ও টিপস",
        "বিগত ৫ বছরের বোর্ড প্রশ্ন সমাধান",
        "ভুল উত্তরগুলোর তাৎক্ষণিক সংশোধন",
      ],
      link: "/quiz/subject?class=10&subject=সাধারণ গণিত",
    },
    {
      id: "best-class5-scholarship",
      title: "৫ম শ্রেণি প্রাথমিক মেধা বৃত্তি পরীক্ষা ২০২৫",
      subtitle: "বাংলা, গণিত, ইংরেজি ও বিজ্ঞান বিষয়ে ১০০% কমন উপযোগী টেস্ট",
      grade: 5,
      subject: "প্রাথমিক বৃত্তি",
      salesCount: "১,৫৩০+ অভিভাবক পছন্দ",
      rating: "৪.৯",
      reviewCount: "২৯০+ রিভিউ",
      testsCount: "৩০টি টেস্ট",
      badge: "🎯 সেরা পছন্দ",
      badgeGradient: "from-rose-600 to-pink-600",
      accentBg: "bg-rose-500/10",
      price: quizPrices.classPrices[5] || 50,
      originalPrice: 100,
      discountText: "৫০% ছাড়",
      features: [
        "ছোটদের উপযোগী সহজ ও আকর্ষণীয় প্রশ্ন",
        "অভিভাবকদের জন্য প্রগ্রেস ট্র্যাকিং রিপোর্ট",
        "বৃত্তি পরীক্ষায় এ প্লাস নিশ্চিত করার প্রস্তুতি",
      ],
      link: "/quiz?class=5",
    },
    {
      id: "best-vip-all",
      title: "ফুল সিলেবাস অল ক্লাস VIP মেগা প্যাকেজ",
      subtitle: "৫ম থেকে ১০ম শ্রেণির সকল বিষয়ের টেস্ট ও লাইফটাইম আনলিমিটেড অ্যাক্সেস",
      grade: 10,
      subject: "৫ম-১০ম সকল ক্লাস",
      salesCount: "১,৪২০+ শিক্ষার্থী যুক্ত",
      rating: "৫.০",
      reviewCount: "৫৭০+ রিভিউ",
      testsCount: "২০০+ টেস্ট",
      badge: "👑 মেগা বান্ডেল",
      badgeGradient: "from-purple-600 to-indigo-600",
      accentBg: "bg-purple-500/10",
      price: quizPackages.find((p) => p.id === "vip_all")?.price || 200,
      originalPrice:
        quizPackages.find((p) => p.id === "vip_all")?.originalPrice || 400,
      discountText: "৫০% মেগা ছাড়",
      features: [
        "সবগুলো ক্লাসের সকল বিষয় একসাথে সম্পূর্ণ আনলক",
        "লাইফটাইম VIP মেম্বারশিপ ও প্রায়োরিটি সাপোর্ট",
        "স্পেশাল এক্সক্লুসিভ সাজেশন ও প্রিমিয়াম শিট",
      ],
      link: "/quiz",
    },
  ];

  // Mobile Auto Slide Timer (Runs every 3.5 seconds when not paused)
  useEffect(() => {
    if (isPaused || activeTab !== "bestsellers") return;

    const interval = setInterval(() => {
      setCurrentMobileIndex((prev) => (prev + 1) % bestSellingTests.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, activeTab, bestSellingTests.length]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      if (diff > 45) {
        // Swiped Left -> Next
        setCurrentMobileIndex((prev) => (prev + 1) % bestSellingTests.length);
      } else if (diff < -45) {
        // Swiped Right -> Prev
        setCurrentMobileIndex((prev) =>
          prev === 0 ? bestSellingTests.length - 1 : prev - 1,
        );
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    // Resume auto-slide after brief pause
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <section className="space-y-6" suppressHydrationWarning>
      <div className="p-4 sm:p-8 lg:p-10 relative overflow-hidden bg-white/80 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 text-[#C8102E] text-xs font-black border border-red-200">
              <FaFire className="w-3 h-3 text-red-600 animate-pulse" />
              <span>জনপ্রিয় ও সর্বাধিক বিক্রিত মডেল টেস্ট</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#0A1E3C] tracking-tight">
              আজই তোমার প্রস্তুতি যাচাই করো —{" "}
              <span className="text-[#C8102E]">অনলাইন MCQ টেস্ট</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              হাজারো শিক্ষার্থীর পছন্দের সেরা MCQ মডেল টেস্ট। অধ্যায়ভিত্তিক প্র্যাকটিস,
              তাৎক্ষণিক স্বয়ংক্রিয় ফলাফল, সমাধান, মেধা তালিকা ও স্পেশাল অফার।
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

        {/* Category Tabs: Best Sellers / All Classes / Free / Packages */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab("bestsellers")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "bestsellers"
                ? "bg-gradient-to-r from-[#C8102E] to-rose-600 text-white shadow-md shadow-red-500/20"
                : "bg-red-50 text-[#C8102E] hover:bg-red-100 border border-red-200"
            }`}
          >
            <FaFire className="w-3 h-3 text-amber-300" />
            <span>🔥 বেশি বিক্রিত টেস্ট (Best Sellers)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "all"
                ? "bg-[#0A1E3C] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            📚 শ্রেণিভিত্তিক টেস্ট (৫ম - ১০ম)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("free")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "free"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <FaGift className="w-3 h-3" />
            <span>১০০% ফ্রি টেস্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "packages"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            <FaCrown className="w-3 h-3 text-amber-500" />
            <span>স্পেশাল প্যাকেজ অফার</span>
          </button>
        </div>

        {/* 1. TOP-SELLING MCQ TESTS SHOWCASE (Active Tab = 'bestsellers') */}
        {activeTab === "bestsellers" && (
          <div className="pt-6 space-y-4">
            {/* Header with Counter and Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>সর্বাধিক বিক্রিত ও জনপ্রিয় MCQ মডেল টেস্ট</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-red-100 text-[#C8102E] text-[10px] font-black">
                    হট ট্রেন্ডিং
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  শিক্ষার্থীদের পছন্দের শীর্ষে থাকা সেরা মডেল টেস্ট সিরিজ
                </p>
              </div>

              {/* Mobile Slide Navigation Buttons */}
              <div className="flex sm:hidden items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMobileIndex((prev) =>
                      prev === 0 ? bestSellingTests.length - 1 : prev - 1,
                    )
                  }
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                  aria-label="Previous Slide"
                >
                  <FaChevronLeft className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMobileIndex(
                      (prev) => (prev + 1) % bestSellingTests.length,
                    )
                  }
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                  aria-label="Next Slide"
                >
                  <FaChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* ─── MOBILE VIEW: AUTO-SLIDER CAROUSEL (Visible on < sm) ─── */}
            <div
              className="block sm:hidden relative overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentMobileIndex * 100}%)`,
                }}
              >
                {bestSellingTests.map((item) => {
                  const coverImage =
                    quizCovers.classes[item.grade] ||
                    quizCovers.classes[String(item.grade)];

                  return (
                    <div
                      key={item.id}
                      className="w-full shrink-0 px-0.5"
                    >
                      <div className="bg-white rounded-2xl border-2 border-red-200/90 shadow-md p-4 flex flex-col justify-between relative overflow-hidden">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[10px] font-black shadow-xs bg-gradient-to-r ${item.badgeGradient}`}
                          >
                            {item.badge}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <FaStar className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                            <span>{item.rating}</span>
                          </div>
                        </div>

                        {/* Optional Cover */}
                        {coverImage && (
                          <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 mb-3 relative">
                            <img
                              src={coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded">
                              {toBengaliClass(item.grade)} শ্রেণি
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {toBengaliClass(item.grade)} শ্রেণি • {item.subject}
                            </div>
                            <h4 className="text-base font-black text-[#0A1E3C] leading-snug mt-0.5 line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {item.subtitle}
                            </p>
                          </div>

                          {/* Social Proof */}
                          <div className="flex items-center justify-between text-[11px] font-bold bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="inline-flex items-center gap-1.5 text-slate-700">
                              <FaUsers className="w-3 h-3 text-[#C8102E]" />
                              <span>{item.salesCount}</span>
                            </span>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                              {item.testsCount}
                            </span>
                          </div>

                          {/* Features */}
                          <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                            {item.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-black shrink-0 mt-0.5">
                                  ✓
                                </span>
                                <span className="leading-tight text-[11px]">
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Price & CTA */}
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-black text-[#C8102E]">
                                ৳{item.price}
                              </span>
                              <span className="text-xs font-bold text-slate-400 line-through">
                                ৳{item.originalPrice}
                              </span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                              {item.discountText}
                            </span>
                          </div>

                          <Link
                            href={item.link}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 shrink-0"
                          >
                            <span>টেস্ট শুরু করুন</span>
                            <FaArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Carousel Indicators (Dots) */}
              <div className="flex items-center justify-center gap-1.5 pt-3 pb-1">
                {bestSellingTests.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentMobileIndex(dotIdx)}
                    className={`transition-all duration-300 rounded-full h-1.5 ${
                      currentMobileIndex === dotIdx
                        ? "w-6 bg-[#C8102E]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ─── DESKTOP VIEW: RESPONSIVE GRID (Visible on sm & up) ─── */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bestSellingTests.map((item) => {
                const coverImage =
                  quizCovers.classes[item.grade] ||
                  quizCovers.classes[String(item.grade)];

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl border border-slate-200/90 hover:border-[#C8102E]/60 shadow-xs hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Glow & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-black shadow-xs bg-gradient-to-r ${item.badgeGradient}`}
                      >
                        {item.badge}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <FaStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{item.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({item.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Optional Cover */}
                    {coverImage && (
                      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70 mb-3 relative">
                        <img
                          src={coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          {toBengaliClass(item.grade)} শ্রেণি
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {toBengaliClass(item.grade)} শ্রেণি • {item.subject}
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-[#0A1E3C] leading-snug mt-1 group-hover:text-[#C8102E] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Sales Social Proof Pill */}
                      <div className="flex items-center justify-between text-xs font-bold bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <span className="inline-flex items-center gap-1.5 text-slate-700">
                          <FaUsers className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span>{item.salesCount}</span>
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-100">
                          {item.testsCount}
                        </span>
                      </div>

                      {/* Features */}
                      <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                        {item.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-black shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price & CTA */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#C8102E]">
                            ৳{item.price}
                          </span>
                          <span className="text-xs font-bold text-slate-400 line-through">
                            ৳{item.originalPrice}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                          {item.discountText}
                        </span>
                      </div>

                      <Link
                        href={item.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md transition transform group-hover:scale-102 active:scale-95 shrink-0"
                      >
                        <span>টেস্ট শুরু করুন</span>
                        <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CLASS-WISE MODEL TESTS GRID (Shown in 'all' or 'free' tab) */}
        {(activeTab === "all" || activeTab === "free") && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800">
                {activeTab === "free"
                  ? "শ্রেণিভিত্তিক ফ্রি মডেল টেস্ট"
                  : "শ্রেণিভিত্তিক মডেল টেস্ট (ফ্রি ও পেইড)"}
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                ৫ম – ১০ম শ্রেণি
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {classBadges.map((c) => {
                const clsPrice = quizPrices.classPrices[c.grade] || 50;
                const coverImage =
                  quizCovers.classes[c.grade] ||
                  quizCovers.classes[String(c.grade)];

                return (
                  <Link
                    key={c.grade}
                    href={`/quiz?class=${c.grade}`}
                    className="group bg-white hover:bg-gradient-to-b hover:from-white hover:to-red-50/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-red-300 transition-all flex flex-col justify-between text-center relative overflow-hidden shadow-xs hover:shadow-md"
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
                      {activeTab === "free" ? (
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
                      <span>টেস্ট দিন</span>
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. DYNAMIC SPECIAL PACKAGES SHOWCASE (Shown ONLY when 'packages' tab is clicked) */}
        {activeTab === "packages" && (
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
                  বিকাশ, নগদ, রকেট বা উপায়ের মাধ্যমে সহজে যেকোনো আকর্ষণীয়
                  প্যাকেজ আনলক করুন
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
                      ? Math.round(
                          ((pkg.originalPrice - pkg.price) /
                            pkg.originalPrice) *
                            100,
                        )
                      : null;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 space-y-4 relative flex flex-col justify-between ${
                        isPopular
                          ? "border-2 border-[#C8102E] shadow-xl md:-translate-y-1"
                          : "border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300"
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#9B0D23] to-[#C8102E] text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-bl-2xl shadow-xs">
                          {pkg.badge || "জনপ্রিয় অফার"}
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
                          {pkg.originalPrice &&
                            pkg.originalPrice > pkg.price && (
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
                              <span className="text-emerald-600 font-black shrink-0 mt-0.5">
                                ✓
                              </span>
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
                              ? "bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] text-white hover:opacity-95 shadow-md"
                              : "bg-slate-100 hover:bg-[#0A1E3C] text-slate-800 hover:text-white"
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