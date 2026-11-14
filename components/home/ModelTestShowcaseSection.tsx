"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  toBengaliClass,
  toBengaliNumber,
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
  FaGift,
  FaCheck,
  FaArrowRight,
  FaCrown,
  FaFire,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaClipboardList,
} from "react-icons/fa6";

// Dynamic Unified Showcase Item Interface
interface DynamicShowcaseItem {
  id: string;
  type: "custom_exam" | "package" | "class_test";
  title: string;
  subtitle: string;
  classGrade?: number;
  subject?: string;
  badge: string;
  badgeColor: "red" | "emerald" | "amber" | "purple" | "blue";
  price: number;
  originalPrice?: number;
  isPaid: boolean;
  coverImage?: string;
  questionCount?: number;
  durationMinutes?: number;
  participantCount?: number;
  features?: string[];
  link: string;
}

export default function ModelTestShowcaseSection() {
  const [activeTab, setActiveTab] = useState<
    "all" | "exams" | "classes" | "packages" | "free"
  >("all");

  // Dynamic Data States
  const [quizPrices, setQuizPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [quizPackages, setQuizPackages] = useState<QuizPackageItem[]>(
    DEFAULT_QUIZ_PACKAGES,
  );
  const [quizCovers, setQuizCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);
  const [customExams, setCustomExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Slider State (Responsive for Mobile, Tablet, and Desktop)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
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

  // 1. Responsive Cards Per View Calculator
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2); // Tablet: 2 cards
      } else {
        setCardsPerView(1); // Mobile: 1 card
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Hydrate & Fetch 100% Real Dynamic Data from APIs
  useEffect(() => {
    // Stored Fallbacks
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

    // A. Fetch Live Prices
    fetch("/api/quiz/prices", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.prices) {
          setQuizPrices(data.prices);
          saveStoredQuizPrices(data.prices);
        }
      })
      .catch(() => {});

    // B. Fetch Live Packages
    fetch("/api/quiz/packages", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.packages && Array.isArray(data.packages)) {
          setQuizPackages(data.packages);
          saveStoredQuizPackages(data.packages);
        }
      })
      .catch(() => {});

    // C. Fetch Live Covers
    fetch("/api/quiz/covers", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.covers && typeof data.covers === "object") {
          setQuizCovers(data.covers);
          saveStoredQuizCovers(data.covers);
        }
      })
      .catch(() => {});

    // D. Fetch Live Custom Exams
    fetch("/api/quiz/custom-exams?activeOnly=true", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.exams)) {
          setCustomExams(data.exams);
        }
      })
      .catch(() => {});

    // E. Fetch Live Submissions for Real Participant Count
    fetch("/api/quiz/submissions", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.submissions)) {
          setSubmissions(data.submissions);
        }
      })
      .catch(() => {});
  }, []);

  // 3. Build Dynamic Showcase Items Without Any Dummy Data
  const allDynamicItems: DynamicShowcaseItem[] = useMemo(() => {
    const list: DynamicShowcaseItem[] = [];

    // A. Active Live Custom Exams from Admin
    customExams.forEach((exam) => {
      const participantCount = submissions.filter(
        (s) => s.examId === exam.id,
      ).length;
      const classPrice = quizPrices.classPrices[exam.classGrade] || 50;
      const price = exam.isPaid ? exam.price || classPrice : 0;
      const coverImage =
        exam.coverImage ||
        quizCovers.subjects[exam.subject] ||
        quizCovers.classes[exam.classGrade];

      list.push({
        id: `custom_exam_${exam.id}`,
        type: "custom_exam",
        title: exam.title,
        subtitle:
          exam.subtitle ||
          `${toBengaliClass(exam.classGrade)} শ্রেণি • ${exam.subject}`,
        classGrade: exam.classGrade,
        subject: exam.subject,
        badge: exam.badge || (exam.isPaid ? "পেইড এক্সাম" : "ফ্রি এক্সাম"),
        badgeColor: exam.isPaid ? "red" : "emerald",
        price,
        isPaid: !!exam.isPaid,
        coverImage,
        questionCount: exam.questionCount || 20,
        durationMinutes: exam.durationMinutes || 20,
        participantCount,
        link: `/quiz?class=${exam.classGrade}`,
      });
    });

    // B. Class-wise Dynamic Tests (5 to 10)
    classBadges.forEach((c) => {
      const classPrice = quizPrices.classPrices[c.grade] || 50;
      const coverImage =
        quizCovers.classes[c.grade] || quizCovers.classes[String(c.grade)];
      const participantCount = submissions.filter(
        (s) => s.classGrade === c.grade,
      ).length;

      list.push({
        id: `class_test_${c.grade}`,
        type: "class_test",
        title: `${toBengaliClass(c.grade)} শ্রেণি পূর্ণাঙ্গ মডেল টেস্ট`,
        subtitle: `${c.tag} • অধ্যায়ভিত্তিক প্রস্তুতি ও চূড়ান্ত মূল্যায়ন`,
        classGrade: c.grade,
        badge: c.tag,
        badgeColor: "blue",
        price: classPrice,
        isPaid: true,
        coverImage,
        participantCount,
        link: `/quiz?class=${c.grade}`,
      });
    });

    // C. Dynamic Packages from Admin
    quizPackages
      .filter((pkg) => pkg.isActive)
      .forEach((pkg) => {
        list.push({
          id: `pkg_${pkg.id}`,
          type: "package",
          title: pkg.title,
          subtitle: pkg.tagline,
          badge: pkg.badge || (pkg.isPopular ? "জনপ্রিয় প্যাকেজ" : "স্পেশাল অফার"),
          badgeColor: pkg.isPopular ? "purple" : "amber",
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          isPaid: true,
          features: pkg.features,
          link: "/quiz",
        });
      });

    return list;
  }, [customExams, submissions, quizPrices, quizCovers, quizPackages]);

  // 4. Filter Items by Active Tab
  const displayItems = useMemo(() => {
    if (activeTab === "exams") {
      return allDynamicItems.filter((i) => i.type === "custom_exam");
    }
    if (activeTab === "classes") {
      return allDynamicItems.filter((i) => i.type === "class_test");
    }
    if (activeTab === "packages") {
      return allDynamicItems.filter((i) => i.type === "package");
    }
    if (activeTab === "free") {
      return allDynamicItems.filter((i) => !i.isPaid);
    }
    return allDynamicItems;
  }, [activeTab, allDynamicItems]);

  // Max sliding index
  const maxIndex = Math.max(0, displayItems.length - cardsPerView);

  // Reset index when tab or cardsPerView changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab, cardsPerView]);

  // 5. Auto Slide Timer (Runs on BOTH Desktop & Mobile when not paused)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  // Navigation Handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe for Mobile & Tablet
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
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setTimeout(() => setIsPaused(false), 2500);
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
              <span>লাইভ মডেল টেস্ট ও কুইজ প্রস্তুতি</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#0A1E3C] tracking-tight">
              আজই তোমার প্রস্তুতি যাচাই করো —{" "}
              <span className="text-[#C8102E]">অনলাইন MCQ টেস্ট</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির প্রতিটি বিষয়ের অধ্যায়ভিত্তিক ফ্রি ও পেইড পরীক্ষা।
              তাৎক্ষণিক স্বয়ংক্রিয় ফলাফল, সমাধান, মেধা তালিকা ও স্পেশাল প্যাকেজ।
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

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "all"
                ? "bg-[#0A1E3C] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            সবগুলো দেখুন (All)
          </button>

          {customExams.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("exams")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === "exams"
                  ? "bg-gradient-to-r from-[#C8102E] to-rose-600 text-white shadow-md shadow-red-500/20"
                  : "bg-red-50 text-[#C8102E] hover:bg-red-100 border border-red-200"
              }`}
            >
              <FaBolt className="w-3 h-3 text-amber-300" />
              <span>লাইভ কাস্টম এক্সাম ({toBengaliNumber(customExams.length)})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "classes"
                ? "bg-[#0A1E3C] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            📚 শ্রেণিভিত্তিক টেস্ট (৫ম - ১০ম)
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
            <span>স্পেশাল প্যাকেজ</span>
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
        </div>

        {/* ─── DYNAMIC RESPONSIVE SLIDER (Desktop, Tablet & Mobile) ─── */}
        <div className="pt-6 space-y-4">
          {/* Header Row with Active Count and Slider Arrow Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                {activeTab === "exams"
                  ? "লাইভ কাস্টম মডেল টেস্ট"
                  : activeTab === "classes"
                    ? "শ্রেণিভিত্তিক মডেল টেস্ট"
                    : activeTab === "packages"
                      ? "স্পেশাল প্যাকেজ অফার"
                      : activeTab === "free"
                        ? "১০০% ফ্রি টেস্টসমূহ"
                        : "সক্রিয় মডেল টেস্ট ও প্যাকেজ"}
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {toBengaliNumber(displayItems.length)}টি টেস্ট
              </span>
            </div>

            {/* Slider Navigation Buttons (Visible on BOTH Desktop & Mobile) */}
            {maxIndex > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <FaChevronLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
                  aria-label="Next Slide"
                >
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Slider Container with Touch and Mouse Hover Pause */}
          {displayItems.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center text-slate-500 font-bold text-xs">
              এই ক্যাটাগরিতে এই মুহূর্তে কোনো পরীক্ষা পাওয়া যায়নি।
            </div>
          ) : (
            <div
              className="relative overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                }}
              >
                {displayItems.map((item) => {
                  const discountPct =
                    item.originalPrice && item.originalPrice > item.price
                      ? Math.round(
                          ((item.originalPrice - item.price) /
                            item.originalPrice) *
                            100,
                        )
                      : null;

                  return (
                    <div
                      key={item.id}
                      className="w-full sm:w-1/2 lg:w-1/3 shrink-0 p-2 sm:p-2.5"
                    >
                      <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-[#C8102E]/60 shadow-xs hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden h-full">
                        <div>
                          {/* Card Top: Badge & Status */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black shadow-xs ${
                                item.badgeColor === "red"
                                  ? "bg-red-100 text-[#C8102E] border border-red-200"
                                  : item.badgeColor === "purple"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : item.badgeColor === "amber"
                                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                                      : item.badgeColor === "emerald"
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {item.badge}
                            </span>

                            {item.participantCount !== undefined &&
                            item.participantCount > 0 ? (
                              <div className="flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                                <FaUsers className="w-2.5 h-2.5 text-[#C8102E]" />
                                <span>
                                  {toBengaliNumber(item.participantCount)} জন
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">
                                সক্রিয় টেস্ট
                              </span>
                            )}
                          </div>

                          {/* Optional Card Cover Image */}
                          {item.coverImage && (
                            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70 mb-3 relative">
                              <img
                                src={item.coverImage}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {item.classGrade && (
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                                  {toBengaliClass(item.classGrade)} শ্রেণি
                                </div>
                              )}
                            </div>
                          )}

                          {/* Titles */}
                          <div className="space-y-1">
                            {item.classGrade && item.subject && (
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {toBengaliClass(item.classGrade)} শ্রেণি •{" "}
                                {item.subject}
                              </div>
                            )}
                            <h4 className="text-base font-black text-[#0A1E3C] leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {item.subtitle}
                            </p>
                          </div>

                          {/* Key Specs: Questions / Duration / Features */}
                          <div className="pt-3">
                            {item.type === "package" && item.features ? (
                              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                                {item.features.slice(0, 3).map((feat, fIdx) => (
                                  <li
                                    key={fIdx}
                                    className="flex items-start gap-1.5"
                                  >
                                    <span className="text-emerald-600 font-black shrink-0 mt-0.5 text-xs">
                                      ✓
                                    </span>
                                    <span className="leading-snug text-[11px]">
                                      {feat}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                                {item.questionCount && (
                                  <span className="inline-flex items-center gap-1">
                                    <FaClipboardList className="w-3 h-3 text-[#C8102E]" />
                                    <span>
                                      {toBengaliNumber(item.questionCount)}টি
                                      প্রশ্ন
                                    </span>
                                  </span>
                                )}
                                {item.questionCount && item.durationMinutes && (
                                  <span className="text-slate-300">•</span>
                                )}
                                {item.durationMinutes && (
                                  <span className="inline-flex items-center gap-1">
                                    <FaClock className="w-3 h-3 text-blue-600" />
                                    <span>
                                      {toBengaliNumber(item.durationMinutes)}{" "}
                                      মিনিট
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price & CTA Button */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            {item.isPaid ? (
                              <>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-xl sm:text-2xl font-black text-[#C8102E]">
                                    ৳{toBengaliNumber(item.price)}
                                  </span>
                                  {item.originalPrice &&
                                    item.originalPrice > item.price && (
                                      <span className="text-xs font-bold text-slate-400 line-through">
                                        ৳{toBengaliNumber(item.originalPrice)}
                                      </span>
                                    )}
                                </div>
                                {discountPct ? (
                                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                                    {toBengaliNumber(discountPct)}% ছাড়
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400">
                                    পেইড টেস্ট
                                  </span>
                                )}
                              </>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                <FaGift className="w-3 h-3" />
                                <span>১০০% ফ্রি</span>
                              </div>
                            )}
                          </div>

                          <Link
                            href={item.link}
                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl shadow-md transition active:scale-95 shrink-0 ${
                              item.type === "package"
                                ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white hover:opacity-95"
                                : "bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#C8102E] text-white hover:opacity-95"
                            }`}
                          >
                            <span>
                              {item.type === "package"
                                ? "প্যাকেজ দেখুন"
                                : "টেস্ট দিন"}
                            </span>
                            <FaArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Dots Indicator */}
              {maxIndex > 0 && (
                <div className="flex items-center justify-center gap-1.5 pt-4 pb-1">
                  {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
                        currentIndex === dotIdx
                          ? "w-6 bg-[#C8102E]"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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