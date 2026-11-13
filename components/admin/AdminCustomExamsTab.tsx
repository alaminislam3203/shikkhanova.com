"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { CustomExam } from "@/lib/quizExamStorage";
import { toBengaliClass, getSubjectsForClassAndGroup, JUNIOR_SUBJECTS_5_8 } from "@/lib/defaultQuizData";
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaClock,
  FaCheck,
  FaXmark,
  FaLock,
  FaLockOpen,
  FaUsers,
  FaAward,
  FaRotate,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa6";

interface AdminCustomExamsTabProps {
  onNavigateToResults?: (examId: string) => void;
}

export default function AdminCustomExamsTab({ onNavigateToResults }: AdminCustomExamsTabProps) {
  const [exams, setExams] = useState<CustomExam[]>([]);
  const [submissionsCountMap, setSubmissionsCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSubtitle, setFormSubtitle] = useState<string>("");
  const [formClass, setFormClass] = useState<number>(6);
  const [formSubject, setFormSubject] = useState<string>("গণিত");
  const [formCode, setFormCode] = useState<string>("");
  const [formDuration, setFormDuration] = useState<number>(20);
  const [formQuestionCount, setFormQuestionCount] = useState<number>(20);
  const [formSourceType, setFormSourceType] = useState<"auto_bank" | "custom">("auto_bank");
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Subjects for selected class in form
  const availableSubjects = useMemo(() => {
    try {
      const subs = getSubjectsForClassAndGroup(formClass, "all");
      if (Array.isArray(subs) && subs.length > 0) return subs;
    } catch {}
    return JUNIOR_SUBJECTS_5_8 || [];
  }, [formClass]);

  // Keep formSubject valid
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.some((s) => s.name === formSubject)) {
      setFormSubject(availableSubjects[0].name);
    }
  }, [availableSubjects, formSubject]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/custom-exams?activeOnly=false", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data?.exams)) {
        setExams(data.exams);
      }

      // Also fetch submissions to count per exam
      const subRes = await fetch("/api/quiz/submissions", { cache: "no-store" });
      const subData = await subRes.json();
      if (Array.isArray(subData?.submissions)) {
        const counts: Record<string, number> = {};
        subData.submissions.forEach((s: any) => {
          if (s.examId) {
            counts[s.examId] = (counts[s.examId] || 0) + 1;
          }
        });
        setSubmissionsCountMap(counts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormClass(6);
    setFormSubject("গণিত");
    setFormCode("");
    setFormDuration(20);
    setFormQuestionCount(20);
    setFormSourceType("auto_bank");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exam: CustomExam) => {
    setEditingId(exam.id);
    setFormTitle(exam.title);
    setFormSubtitle(exam.subtitle || "");
    setFormClass(exam.classGrade);
    setFormSubject(exam.subject);
    setFormCode(exam.examCode || "");
    setFormDuration(exam.durationMinutes || 20);
    setFormQuestionCount(exam.questionCount || 20);
    setFormSourceType(exam.sourceType || "auto_bank");
    setFormIsActive(exam.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("অনুগ্রহ করে পরীক্ষার নাম লিখুন।");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/quiz/custom-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          title: formTitle,
          subtitle: formSubtitle,
          classGrade: formClass,
          subject: formSubject,
          examCode: formCode,
          durationMinutes: formDuration,
          questionCount: formQuestionCount,
          sourceType: formSourceType,
          isActive: formIsActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "পরীক্ষা সফলভাবে সংরক্ষণ করা হয়েছে!");
        setIsModalOpen(false);
        loadData();
      } else {
        toast.error(data.error || "সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExam = async (id: string, title: string) => {
    if (!confirm(`আপনি কি "${title}" পরীক্ষাটি মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/quiz/custom-exams?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("পরীক্ষাটি সফলভাবে মুছে ফেলা হয়েছে।");
        loadData();
      } else {
        toast.error("মুছে ফেলা সম্ভব হয়নি।");
      }
    } catch {
      toast.error("নেটওয়ার্ক সমস্যা হয়েছে।");
    }
  };

  const handleToggleActive = async (exam: CustomExam) => {
    try {
      const updated = !exam.isActive;
      const res = await fetch("/api/quiz/custom-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...exam,
          isActive: updated,
        }),
      });
      if (res.ok) {
        toast.success(
          updated
            ? `"${exam.title}" পরীক্ষাটি শিক্ষার্থীদের জন্য চালু করা হয়েছে।`
            : `"${exam.title}" পরীক্ষাটি স্থগিত রাখা হয়েছে।`
        );
        loadData();
      }
    } catch {
      toast.error("স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
    }
  };

  const activeCount = exams.filter((e) => e.isActive).length;
  const totalSubmissions = Object.values(submissionsCountMap).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & STATS */}
      <div className="bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8102E] text-white text-xs font-bold">
            <span>🎯 কাস্টম MCQ এক্সাম কন্ট্রোল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            ব্যাচ ও শিক্ষার্থীদের জন্য কাস্টম পরীক্ষা
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            নির্দিষ্ট ক্লাস ও বিষয়ের ওপর পরীক্ষা সেট করুন, কোড দিন এবং লাইভ ফলাফল পর্যবেক্ষণ করুন।
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
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>নতুন পরীক্ষা তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">মোট পরীক্ষা তৈরি</div>
            <div className="text-2xl font-black text-slate-800">{exams.length}টি</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            📝
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">বর্তমানে সক্রিয় টেস্ট</div>
            <div className="text-2xl font-black text-emerald-600">{activeCount}টি</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            🟢
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">মোট শিক্ষার্থী সাবমিশন</div>
            <div className="text-2xl font-black text-[#C8102E]">{totalSubmissions}টি</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C8102E] flex items-center justify-center text-xl">
            👥
          </div>
        </div>
      </div>

      {/* 2. EXAMS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <span>পরীক্ষার তালিকা</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {exams.length}টি
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-bold text-sm">
            পরীক্ষার তথ্য লোড হচ্ছে...
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="text-4xl">📝</div>
            <h4 className="text-base font-black text-slate-700">কোনো কাস্টম পরীক্ষা তৈরি করা হয়নি</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              আপনার শিক্ষার্থীদের জন্য নতুন পরীক্ষা তৈরি করতে উপরের "নতুন পরীক্ষা তৈরি করুন" বাটনে ক্লিক করুন।
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-[#0A1E3C] text-white font-bold text-xs"
            >
              + প্রথম পরীক্ষা তৈরি করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const subCount = submissionsCountMap[exam.id] || 0;
              return (
                <div
                  key={exam.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 p-5 space-y-4 shadow-sm hover:shadow-md ${
                    exam.isActive ? "border-slate-200" : "border-slate-200 opacity-70 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] border border-blue-200">
                          {toBengaliClass(exam.classGrade)} শ্রেণি
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                          {exam.subject}
                        </span>
                        {exam.examCode ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono font-black text-[10px] border border-purple-200 flex items-center gap-1">
                            <FaLock className="w-2.5 h-2.5" />
                            <span>{exam.examCode}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                            <FaLockOpen className="w-2.5 h-2.5" />
                            <span>উন্মুক্ত</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-black text-slate-800 leading-snug">
                        {exam.title}
                      </h4>
                      {exam.subtitle && (
                        <p className="text-xs text-slate-500 font-medium">{exam.subtitle}</p>
                      )}
                    </div>

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(exam)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black transition flex items-center gap-1.5 shrink-0 ${
                        exam.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                      title="স্ট্যাটাস পরিবর্তন করুন"
                    >
                      <span className={`w-2 h-2 rounded-full ${exam.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                      <span>{exam.isActive ? "সক্রিয়" : "বন্ধ"}</span>
                    </button>
                  </div>

                  {/* Details Badge Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 text-center">
                      <div className="text-[10px] text-slate-400 font-bold">সময়সীমা</div>
                      <div className="font-black text-slate-700 flex items-center justify-center gap-1 mt-0.5">
                        <FaClock className="w-3 h-3 text-slate-400" />
                        <span>{exam.durationMinutes} মি.</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 text-center">
                      <div className="text-[10px] text-slate-400 font-bold">প্রশ্ন সংখ্যা</div>
                      <div className="font-black text-slate-700 flex items-center justify-center gap-1 mt-0.5">
                        <FaBookOpen className="w-3 h-3 text-slate-400" />
                        <span>{exam.questionCount}টি</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-red-50 text-center">
                      <div className="text-[10px] text-[#C8102E] font-bold">অংশগ্রহণকারী</div>
                      <div className="font-black text-[#C8102E] flex items-center justify-center gap-1 mt-0.5">
                        <FaUsers className="w-3 h-3 text-[#C8102E]" />
                        <span>{subCount} জন</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigateToResults?.(exam.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#0A1E3C] hover:bg-black text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      <FaAward className="w-3 h-3 text-amber-400" />
                      <span>ফলাফল দেখুন ({subCount})</span>
                      <FaArrowRight className="w-2.5 h-2.5 text-slate-400" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(exam)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                        title="এডিট করুন"
                      >
                        <FaPen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition"
                        title="মুছে ফেলুন"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  {editingId ? "পরীক্ষা সম্পাদনা করুন" : "নতুন কাস্টম পরীক্ষা তৈরি করুন"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  পরীক্ষার তথ্য পূরণ করে সংরক্ষণ করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4">
              {/* Exam Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পরীক্ষার নাম *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="উদা: ৬ষ্ঠ শ্রেণি গণিত সাপ্তাহিক পরীক্ষা - ১"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold outline-none"
                  required
                />
              </div>

              {/* Exam Subtitle */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  সংক্ষিপ্ত নোট / সিলেবাস (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="উদা: ১ম ও ২য় অধ্যায়ের বহুনির্বাচনী প্রশ্ন"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Class & Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    শ্রেণি নির্বাচন
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    {[5, 6, 7, 8, 9, 10].map((cls) => (
                      <option key={cls} value={cls}>
                        {toBengaliClass(cls)} শ্রেণি
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বিষয়
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    {availableSubjects.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.icon} {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration & Questions Count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    সময়সীমা (মিনিট)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রশ্ন সংখ্যা
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={formQuestionCount}
                    onChange={(e) => setFormQuestionCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Exam Access Code (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  অ্যাক্সেস কোড / পাসওয়ার্ড (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="উদা: MATH26 (ফাকা রাখলে যে কেউ দিতে পারবে)"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-800 font-mono font-bold outline-none uppercase"
                  />
                  <FaLock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  শিক্ষার্থীরা পরীক্ষায় প্রবেশের সময় এই কোডটি প্রদান করবে।
                </p>
              </div>

              {/* Question Source */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">প্রশ্নের উৎস</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      formSourceType === "auto_bank"
                        ? "bg-blue-50 border-blue-500 text-blue-800"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="sourceType"
                      checked={formSourceType === "auto_bank"}
                      onChange={() => setFormSourceType("auto_bank")}
                      className="text-blue-600"
                    />
                    <span>প্রশ্ন ব্যাংক থেকে অটো পিক</span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      formSourceType === "custom"
                        ? "bg-purple-50 border-purple-500 text-purple-800"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="sourceType"
                      checked={formSourceType === "custom"}
                      onChange={() => setFormSourceType("custom")}
                      className="text-purple-600"
                    />
                    <span>বর্তমান বিষয়ের প্রশ্ন</span>
                  </label>
                </div>
              </div>

              {/* Active Checkbox */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C8102E] focus:ring-0"
                />
                <span>পরীক্ষাটি সাথে সাথে চালু (সক্রিয়) রাখুন</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

