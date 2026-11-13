"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { QuizSubmission, CustomExam } from "@/lib/quizExamStorage";
import { toBengaliClass } from "@/lib/defaultQuizData";
import { showConfirmToast } from "@/lib/confirmToast";
import {
  FaAward,
  FaTrophy,
  FaPrint,
  FaTrash,
  FaRotate,
  FaMagnifyingGlass,
  FaFilter,
  FaUserGraduate,
  FaCheckCircle,
  FaCircleXmark,
  FaCalendarDays,
} from "react-icons/fa6";

interface AdminQuizResultsTabProps {
  initialExamId?: string | null;
}

export default function AdminQuizResultsTab({ initialExamId }: AdminQuizResultsTabProps) {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [exams, setExams] = useState<CustomExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterExamId, setFilterExamId] = useState<string>(initialExamId || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch custom exams for filter dropdown
      const examRes = await fetch("/api/quiz/custom-exams?activeOnly=false", { cache: "no-store" });
      const examData = await examRes.json();
      if (Array.isArray(examData?.exams)) {
        setExams(examData.exams);
      }

      // 2. Fetch submissions
      const params = new URLSearchParams();
      if (filterClass !== "all") params.set("classGrade", filterClass);
      if (filterExamId !== "all") params.set("examId", filterExamId);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/quiz/submissions?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data?.submissions)) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterClass, filterExamId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleDeleteSubmission = (id: string, name: string) => {
    showConfirmToast({
      title: "রেজাল্ট রেকর্ড মুছবেন?",
      message: `আপনি কি "${name}" এর পরীক্ষার রেকর্ডটি মুছে ফেলতে চান?`,
      confirmText: "হ্যাঁ, মুছে ফেলুন",
      cancelText: "বাতিল",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/quiz/submissions?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
          if (res.ok) {
            toast.success("রেকর্ড মুছে ফেলা হয়েছে।");
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
          } else {
            toast.error("মুছে ফেলা সম্ভব হয়নি।");
          }
        } catch {
          toast.error("নেটওয়ার্কে সমস্যা হয়েছে।");
        }
      },
    });
  };

  const handleClearAll = () => {
    const isExamFiltered = filterExamId !== "all";
    const targetExam = exams.find((e) => e.id === filterExamId);
    const confirmMsg = isExamFiltered
      ? `আপনি কি "${targetExam?.title || filterExamId}" পরীক্ষার সকল ফলাফল ডাটাবেজ থেকে মুছে ফেলতে চান?`
      : "আপনি কি সকল শিক্ষার্থীর পরীক্ষার ফলাফল ডাটাবেজ থেকে পরিষ্কার করতে চান?";

    showConfirmToast({
      title: "ফলাফল তালিকা পরিষ্কার করবেন?",
      message: confirmMsg,
      confirmText: "হ্যাঁ, পরিষ্কার করুন",
      cancelText: "বাতিল",
      onConfirm: async () => {
        try {
          const url = isExamFiltered
            ? `/api/quiz/submissions?clearAll=true&examId=${encodeURIComponent(filterExamId)}`
            : `/api/quiz/submissions?clearAll=true`;

          const res = await fetch(url, { method: "DELETE" });
          if (res.ok) {
            toast.success("ফলাফল তালিকা সফলভাবে পরিষ্কার করা হয়েছে।");
            loadData();
          } else {
            toast.error("পরিষ্কার করা সম্ভব হয়নি।");
          }
        } catch {
          toast.error("নেটওয়ার্কে সমস্যা হয়েছে।");
        }
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const totalCount = submissions.length;
  const avgPct = useMemo(() => {
    if (totalCount === 0) return 0;
    const sum = submissions.reduce((acc, s) => acc + (s.percentage || 0), 0);
    return Math.round(sum / totalCount);
  }, [submissions, totalCount]);

  const passCount = useMemo(() => {
    return submissions.filter((s) => (s.percentage || 0) >= 40).length;
  }, [submissions]);

  const topScorer = useMemo(() => {
    if (submissions.length === 0) return null;
    return [...submissions].sort((a, b) => b.percentage - a.percentage)[0];
  }, [submissions]);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SUMMARY */}
      <div className="bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-xs font-black">
            <FaAward className="w-3.5 h-3.5" />
            <span>সেন্ট্রাল রেজাল্ট ড্যাশবোর্ড</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            MCQ পরীক্ষার ফলাফল ও লাইভ লিডারবোর্ড
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            শিক্ষার্থীদের দেওয়া কুইজ ও কাস্টম পরীক্ষার ফলাফল, র‍্যাংক এবং বিস্তারিত শিট।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadData}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
            title="রিফ্রেশ করুন"
          >
            <FaRotate className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition active:scale-95 flex items-center gap-2"
          >
            <FaPrint className="w-3.5 h-3.5 text-amber-300" />
            <span>প্রিন্ট / PDF শিট</span>
          </button>

          {submissions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-3 rounded-2xl bg-rose-600/80 hover:bg-rose-700 text-white font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
            >
              <FaTrash className="w-3 h-3" />
              <span>পরিষ্কার করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-0.5">
          <div className="text-[11px] text-slate-500 font-bold">মোট পরীক্ষার্থী</div>
          <div className="text-2xl font-black text-slate-800">{totalCount} জন</div>
          <div className="text-[10px] text-slate-400">পরীক্ষা সম্পন্ন</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-0.5">
          <div className="text-[11px] text-slate-500 font-bold">গড় পারসেন্টেজ</div>
          <div className="text-2xl font-black text-blue-600">{avgPct}%</div>
          <div className="text-[10px] text-slate-400">সামগ্রিক মান</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-0.5">
          <div className="text-[11px] text-slate-500 font-bold">কৃতকার্য (Pass ≥৪০%)</div>
          <div className="text-2xl font-black text-emerald-600">{passCount} জন</div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            {totalCount > 0 ? `${Math.round((passCount / totalCount) * 100)}% পাশ` : "০%"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-0.5">
          <div className="text-[11px] text-slate-500 font-bold">সেরা স্কোরার</div>
          <div className="text-sm font-black text-[#C8102E] truncate">
            {topScorer ? topScorer.studentName : "—"}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">
            {topScorer ? `${topScorer.score}/${topScorer.total} (${topScorer.percentage}%)` : "—"}
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800">
          <FaFilter className="text-slate-400" />
          <span>ফলাফল ফিল্টার করুন:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Class Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              শ্রেণি
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#C8102E] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="all">সকল শ্রেণি</option>
              {[5, 6, 7, 8, 9, 10].map((c) => (
                <option key={c} value={c}>
                  {toBengaliClass(c)} শ্রেণি
                </option>
              ))}
            </select>
          </div>

          {/* Exam Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              নির্দিষ্ট পরীক্ষা
            </label>
            <select
              value={filterExamId}
              onChange={(e) => setFilterExamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#C8102E] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="all">সকল পরীক্ষা</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {toBengaliClass(ex.classGrade)} শ্রেণি — {ex.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search by Name or Roll */}
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              শিক্ষার্থীর নাম বা রোল নম্বর দিয়ে খুঁজুন
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম বা রোল লিখে খুঁজুন..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#C8102E] rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 outline-none"
                />
                <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0A1E3C] hover:bg-black text-white text-xs font-bold transition"
              >
                খুঁজুন
              </button>
              {(filterClass !== "all" || filterExamId !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterClass("all");
                    setFilterExamId("all");
                    setSearchQuery("");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  রিসেট
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* 4. RESULTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Printable Header */}
        <div className="hidden print:block p-6 border-b border-slate-200 text-center space-y-1">
          <h1 className="text-xl font-black text-slate-900">শিক্ষানোভা ডিজিটাল মডেল টেস্ট</h1>
          <p className="text-xs text-slate-600">শিক্ষার্থীদের মেধা মূল্যায়ন ও ফলাফল বিবরণী</p>
          <div className="text-[10px] text-slate-400 pt-1">
            মুদ্রণ তারিখ: {new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-4 w-14 text-center">মেধা ক্রম</th>
                <th className="py-3 px-4">শিক্ষার্থী ও রোল</th>
                <th className="py-3 px-4">শ্রেণি ও বিষয়</th>
                <th className="py-3 px-4">পরীক্ষার নাম</th>
                <th className="py-3 px-4 text-center">প্রাপ্ত স্কোর</th>
                <th className="py-3 px-4 text-center">শতকরা হার</th>
                <th className="py-3 px-4 text-center">মেডেল</th>
                <th className="py-3 px-4">তারিখ ও সময়</th>
                <th className="py-3 px-4 text-center print:hidden">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-bold">
                    ফলাফল তথ্য লোড হচ্ছে...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    কোনো পরীক্ষার ফলাফল পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                submissions.map((sub, idx) => {
                  const isPassed = sub.percentage >= 40;
                  const rank = idx + 1;
                  let rankBadge = `${rank}`;
                  let rankClass = "bg-slate-100 text-slate-700";

                  if (rank === 1) {
                    rankBadge = "🥇 ১ম";
                    rankClass = "bg-amber-100 text-amber-900 border border-amber-300 font-black";
                  } else if (rank === 2) {
                    rankBadge = "🥈 ২য়";
                    rankClass = "bg-slate-200 text-slate-800 border border-slate-300 font-black";
                  } else if (rank === 3) {
                    rankBadge = "🥉 ৩য়";
                    rankClass = "bg-amber-50 text-amber-800 border border-amber-200 font-black";
                  }

                  const formattedDate = new Date(sub.submittedAt).toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] ${rankClass}`}>
                          {rankBadge}
                        </span>
                      </td>

                      {/* Student & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <FaUserGraduate className="w-3 h-3 text-slate-400" />
                          <span>{sub.studentName}</span>
                        </div>
                        {sub.rollNumber && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            রোল: <span className="font-bold text-slate-700">{sub.rollNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* Class & Subject */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {toBengaliClass(sub.classGrade)} শ্রেণি
                        </div>
                        <div className="text-[10px] text-slate-500">{sub.subject}</div>
                      </td>

                      {/* Exam Title */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="font-semibold text-slate-700 line-clamp-1" title={sub.examTitle}>
                          {sub.examTitle}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center font-bold">
                        <span className="text-slate-900 font-black text-sm">{sub.score}</span>
                        <span className="text-slate-400 text-xs"> / {sub.total}</span>
                      </td>

                      {/* Percentage & Progress Bar */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`font-black text-xs ${
                              sub.percentage >= 80
                                ? "text-emerald-700"
                                : sub.percentage >= 60
                                ? "text-blue-700"
                                : sub.percentage >= 40
                                ? "text-amber-700"
                                : "text-rose-600"
                            }`}
                          >
                            {sub.percentage}%
                          </span>
                          {isPassed ? (
                            <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <FaCircleXmark className="w-3 h-3 text-rose-500" />
                          )}
                        </div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.percentage >= 80
                                ? "bg-emerald-500"
                                : sub.percentage >= 40
                                ? "bg-blue-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(100, sub.percentage)}%` }}
                          />
                        </div>
                      </td>

                      {/* Medal */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {sub.medal || "⭐ Top 10"}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FaCalendarDays className="w-2.5 h-2.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center print:hidden">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubmission(sub.id, sub.studentName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

