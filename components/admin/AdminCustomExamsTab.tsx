"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { CustomExam } from "@/lib/quizExamStorage";
import {
  RawQuestion,
  toBengaliClass,
  getSubjectsForClassAndGroup,
  JUNIOR_SUBJECTS_5_8,
} from "@/lib/defaultQuizData";
import { showConfirmToast } from "@/lib/confirmToast";
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
  FaCloudArrowUp,
  FaDownload,
  FaListCheck,
  FaCircleCheck,
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

  // Form State for Exam Basic Details
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

  // Question Management Modal State for a Specific Exam
  const [questionModalExam, setQuestionModalExam] = useState<CustomExam | null>(null);
  const [examQuestions, setExamQuestions] = useState<RawQuestion[]>([]);
  const [isSavingQuestions, setIsSavingQuestions] = useState<boolean>(false);

  // Manual 1-by-1 Question Inputs
  const [manualQ, setManualQ] = useState<string>("");
  const [manualOpt0, setManualOpt0] = useState<string>("");
  const [manualOpt1, setManualOpt1] = useState<string>("");
  const [manualOpt2, setManualOpt2] = useState<string>("");
  const [manualOpt3, setManualOpt3] = useState<string>("");
  const [manualAns, setManualAns] = useState<number>(0);
  const [manualExplanation, setManualExplanation] = useState<string>("");

  const jsonFileInputRef = useRef<HTMLInputElement>(null);

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

      // Fetch submissions count per exam
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

  // Delete Exam with Custom Hot Toast Confirmation
  const handleDeleteExam = (id: string, title: string) => {
    showConfirmToast({
      title: "পরীক্ষা মুছে ফেলবেন?",
      message: `আপনি কি "${title}" পরীক্ষাটি সম্পূর্ণ মুছে ফেলতে চান? এটি মুছে ফেললে শিক্ষার্থীরা আর এই পরীক্ষায় অংশ নিতে পারবে না।`,
      confirmText: "হ্যাঁ, মুছে ফেলুন",
      cancelText: "বাতিল",
      onConfirm: async () => {
        const res = await fetch(`/api/quiz/custom-exams?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("পরীক্ষাটি সফলভাবে মুছে ফেলা হয়েছে।");
          loadData();
        } else {
          toast.error("মুছে ফেলা সম্ভব হয়নি।");
        }
      },
    });
  };

  const handleToggleActive = (exam: CustomExam) => {
    if (exam.isActive) {
      showConfirmToast({
        title: "পরীক্ষা বন্ধ করবেন?",
        message: `আপনি কি "${exam.title}" পরীক্ষাটি বন্ধ করতে চান? বন্ধ রাখলে শিক্ষার্থীরা আর এই পরীক্ষায় অংশ নিতে পারবে না।`,
        confirmText: "হ্যাঁ, বন্ধ করুন",
        cancelText: "বাতিল",
        onConfirm: async () => {
          await toggleExamStatus(exam, false);
        },
      });
    } else {
      toggleExamStatus(exam, true);
    }
  };

  const toggleExamStatus = async (exam: CustomExam, nextStatus: boolean) => {
    try {
      const res = await fetch("/api/quiz/custom-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...exam,
          isActive: nextStatus,
        }),
      });
      if (res.ok) {
        toast.success(
          nextStatus
            ? `"${exam.title}" পরীক্ষাটি চালু করা হয়েছে।`
            : `"${exam.title}" পরীক্ষাটি বন্ধ করা হয়েছে।`
        );
        loadData();
      }
    } catch {
      toast.error("স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
    }
  };

  // ─── QUESTIONS MANAGEMENT FOR A SPECIFIC EXAM ───

  const handleOpenQuestionsModal = (exam: CustomExam) => {
    setQuestionModalExam(exam);
    setExamQuestions(Array.isArray(exam.questions) ? [...exam.questions] : []);
    resetManualInputs();
  };

  const resetManualInputs = () => {
    setManualQ("");
    setManualOpt0("");
    setManualOpt1("");
    setManualOpt2("");
    setManualOpt3("");
    setManualAns(0);
    setManualExplanation("");
  };

  // Add 1-by-1 manual question
  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQ.trim()) {
      toast.error("প্রশ্নের টেক্সট লিখুন।");
      return;
    }
    if (!manualOpt0.trim() || !manualOpt1.trim()) {
      toast.error("কমপক্ষে অপশন ১ এবং অপশন ২ পূরণ করুন।");
      return;
    }

    const newQ: RawQuestion = {
      q: manualQ.trim(),
      options: [
        manualOpt0.trim(),
        manualOpt1.trim(),
        manualOpt2.trim() || "—",
        manualOpt3.trim() || "—",
      ],
      ans: manualAns,
      explanation: manualExplanation.trim() || undefined,
    };

    setExamQuestions((prev) => [...prev, newQ]);
    resetManualInputs();
    toast.success("প্রশ্নটি তালিকায় যোগ করা হয়েছে!");
  };

  // Delete individual question from list
  const handleDeleteQuestionFromList = (index: number) => {
    setExamQuestions((prev) => prev.filter((_, i) => i !== index));
    toast.success("প্রশ্নটি তালিকা থেকে সরানো হয়েছে।");
  };

  // JSON File Parser & Uploader for this Exam
  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Robust question extractor
        const extractQuestions = (input: any): RawQuestion[] => {
          if (!input) return [];
          const list: RawQuestion[] = [];

          if (Array.isArray(input)) {
            for (const item of input) {
              const qText = item?.q || item?.question;
              const opts = item?.o || item?.options;
              if (qText && Array.isArray(opts) && opts.length >= 2) {
                const ans = typeof item.a === "number" ? item.a : typeof item.ans === "number" ? item.ans : 0;
                list.push({
                  q: String(qText).trim(),
                  options: [
                    String(opts[0] || ""),
                    String(opts[1] || ""),
                    String(opts[2] || "—"),
                    String(opts[3] || "—"),
                  ],
                  ans: ans >= 0 && ans <= 3 ? ans : 0,
                  explanation: item.e || item.explanation ? String(item.e || item.explanation).trim() : undefined,
                });
              } else if (item && typeof item === "object") {
                list.push(...extractQuestions(item));
              }
            }
            return list;
          }

          if (typeof input === "object") {
            if (Array.isArray(input.questions)) return extractQuestions(input.questions);
            if (Array.isArray(input.tests)) {
              for (const t of input.tests) {
                if (Array.isArray(t?.qs)) list.push(...extractQuestions(t.qs));
              }
              if (list.length > 0) return list;
            }
            for (const val of Object.values(input)) {
              if (Array.isArray(val) || typeof val === "object") {
                list.push(...extractQuestions(val));
              }
            }
          }
          return list;
        };

        const extracted = extractQuestions(parsed);
        if (extracted.length === 0) {
          toast.error("ফাইলে কোনো সঠিক MCQ প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে সঠিক ফরম্যাটের JSON ফাইল নির্বাচন করুন।");
          return;
        }

        setExamQuestions((prev) => [...prev, ...extracted]);
        toast.success(`🎉 ফাইল থেকে মোট ${extracted.length}টি প্রশ্ন সফলভাবে যোগ করা হয়েছে!`);
      } catch {
        toast.error("JSON ফাইল রিড বা পার্স করতে সমস্যা হয়েছে। ফাইলের সিনট্যাক্স চেক করুন।");
      }
    };
    reader.readAsText(file);
    if (jsonFileInputRef.current) jsonFileInputRef.current.value = "";
  };

  // Download Sample JSON Template for Exam
  const handleDownloadSampleJson = () => {
    const sample = {
      examTitle: questionModalExam?.title || "Custom Exam",
      classGrade: questionModalExam?.classGrade || 6,
      subject: questionModalExam?.subject || "গণিত",
      questions: [
        {
          q: "বৃত্তের পরিধি ও ব্যাসের অনুপাতকে কী বলে?",
          options: ["পাই (π)", "থিটা (θ)", "আলফা (α)", "রেডিয়ান"],
          ans: 0,
          explanation: "বৃত্তের পরিধি ও ব্যাসের অনুপাত একটি ধ্রুবক সংখ্যা, যাকে পাই (π) বলা হয় (মান প্রায় ৩.১৪১৬)।",
        },
        {
          q: "ত্রিভুজের তিন কোণের সমষ্টি কত ডিগ্রি?",
          options: ["৯০°", "১২০°", "১৮০°", "৩৬০°"],
          ans: 2,
          explanation: "ইউক্লিডীয় জ্যামিতিতে যেকোনো ত্রিভুজের তিনটি কোণের যোগফল দুই সমকোণ বা ১৮০ ডিগ্রি।",
        },
        {
          q: "পানির রাসায়নিক সংকেত কোনটি?",
          options: ["CO2", "H2O", "NaCl", "HCl"],
          ans: 1,
          explanation: "পানির রাসায়নিক সংকেত H2O।",
        },
      ],
    };

    const blob = new Blob([JSON.stringify(sample, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sample_exam_${questionModalExam?.id || "custom"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("স্যাম্পল JSON ফাইল ডাউনলোড শুরু হয়েছে!");
  };

  // Save Questions to Exam on Server
  const handleSaveQuestionsToExam = async () => {
    if (!questionModalExam) return;

    if (examQuestions.length === 0) {
      toast.error("অনুগ্রহ করে কমপক্ষে ১টি প্রশ্ন যোগ করুন অথবা প্রশ্ন ব্যাংক থেকে ব্যবহারের জন্য অটো-পিক রাখুন।");
      return;
    }

    setIsSavingQuestions(true);
    try {
      const res = await fetch("/api/quiz/custom-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...questionModalExam,
          sourceType: "custom",
          questions: examQuestions,
          questionCount: examQuestions.length,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`🎉 "${questionModalExam.title}"-এ মোট ${examQuestions.length}টি প্রশ্ন সফলভাবে সংরক্ষিত হয়েছে!`);
        setQuestionModalExam(null);
        loadData();
      } else {
        toast.error(data.error || "প্রশ্ন সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setIsSavingQuestions(false);
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
            নির্দিষ্ট সিলেবাসে পরীক্ষা সেট করুন, JSON বা ম্যানুয়ালি প্রশ্ন এন্ট্রি দিন এবং লাইভ ফলাফল পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadData}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <FaRotate className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer"
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
              className="px-4 py-2.5 rounded-xl bg-[#0A1E3C] text-white font-bold text-xs cursor-pointer"
            >
              + প্রথম পরীক্ষা তৈরি করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const subCount = submissionsCountMap[exam.id] || 0;
              const hasCustomQs = Array.isArray(exam.questions) && exam.questions.length > 0;
              const customQsCount = exam.questions?.length || 0;

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
                        {hasCustomQs ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                            📋 {customQsCount}টি কাস্টম MCQ
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                            🏦 অটো ব্যাংক ({exam.questionCount}টি)
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
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                        <span>{hasCustomQs ? customQsCount : exam.questionCount}টি</span>
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

                  {/* Actions & Question Management Button */}
                  <div className="space-y-2 pt-2">
                    {/* Primary Button to Manage Questions for THIS Exam */}
                    <button
                      type="button"
                      onClick={() => handleOpenQuestionsModal(exam)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                        hasCustomQs
                          ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                      }`}
                    >
                      <FaListCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        {hasCustomQs
                          ? `প্রশ্ন এন্ট্রি ও এডিট করুন (${customQsCount}টি প্রশ্ন যুক্ত আছে)`
                          : "+ এই পরীক্ষায় নিজস্ব প্রশ্ন বা JSON ফাইল দিন"}
                      </span>
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToResults?.(exam.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#0A1E3C] hover:bg-black text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FaAward className="w-3 h-3 text-amber-400" />
                        <span>ফলাফল ({subCount})</span>
                        <FaArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(exam)}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="পরীক্ষার তথ্য এডিট করুন"
                        >
                          <FaPen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExam(exam.id, exam.title)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. CREATE / EDIT EXAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  {editingId ? "পরীক্ষা সম্পাদনা করুন" : "নতুন কাস্টম পরীক্ষা তৈরি করুন"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  পরীক্ষার শিরোনাম, ক্লাস ও সময়সীমা নির্ধারণ করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
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
                    ডিফল্ট প্রশ্ন সংখ্যা
                  </label>
                  <input
                    type="number"
                    min={1}
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
                    placeholder="উদা: MATH26 (ফাঁকা রাখলে সবার জন্য উন্মুক্ত)"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-800 font-mono font-bold outline-none uppercase"
                  />
                  <FaLock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  শিক্ষার্থীরা পরীক্ষায় প্রবেশের সময় এই কোডটি প্রদান করবে।
                </p>
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
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. QUESTION MANAGEMENT MODAL (JSON UPLOAD & 1-BY-1 QUESTION CREATOR) */}
      {questionModalExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-xs border border-blue-200">
                    {toBengaliClass(questionModalExam.classGrade)} শ্রেণি
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                    {questionModalExam.subject}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                    মোট {examQuestions.length}টি প্রশ্ন সংযুক্ত
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                  "{questionModalExam.title}" — পরীক্ষার প্রশ্নসমূহ পরিচালনা
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setQuestionModalExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="space-y-6 overflow-y-auto pr-1 flex-1">
              {/* SECTION A: JSON FILE UPLOAD BOX */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#C8102E] rounded-2xl p-5 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-100 text-[#C8102E] flex items-center justify-center text-xl shrink-0">
                      <FaCloudArrowUp />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">
                        ১. JSON ফাইল আপলোড করে এক সাথে সকল প্রশ্ন যুক্ত করুন
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        কম্পিউটার থেকে তৈরি করা .json ফাইল ড্র্যাগ করে ছাড়ুন বা সিলেক্ট করুন
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadSampleJson}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FaDownload className="w-3 h-3 text-slate-500" />
                      <span>স্যাম্পল JSON ডাউনলোড</span>
                    </button>

                    <label className="px-4 py-2 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95">
                      <FaCloudArrowUp className="w-3.5 h-3.5" />
                      <span>.JSON ফাইল সিলেক্ট করুন</span>
                      <input
                        ref={jsonFileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleJsonFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION B: 1-BY-1 MANUAL QUESTION ADDER */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                      ২
                    </span>
                    <span>অথবা একটি একটি করে নিজে নতুন প্রশ্ন লিখুন</span>
                  </h4>
                </div>

                <form onSubmit={handleAddManualQuestion} className="space-y-3">
                  {/* Question Text */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      প্রশ্নের মূল টেক্সট বা বাক্য *
                    </label>
                    <input
                      type="text"
                      value={manualQ}
                      onChange={(e) => setManualQ(e.target.value)}
                      placeholder="উদা: বাংলাদেশের জাতীয় পাখির নাম কী?"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold outline-none"
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Option 0 (ক) */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="radio"
                        name="manualAns"
                        checked={manualAns === 0}
                        onChange={() => setManualAns(0)}
                        className="text-[#C8102E] w-4 h-4 cursor-pointer"
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                      />
                      <span className="text-xs font-black text-slate-700 w-5">ক)</span>
                      <input
                        type="text"
                        value={manualOpt0}
                        onChange={(e) => setManualOpt0(e.target.value)}
                        placeholder="১ম অপশন লিখুন"
                        className="bg-transparent text-xs text-slate-800 font-medium outline-none flex-1"
                      />
                    </div>

                    {/* Option 1 (খ) */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="radio"
                        name="manualAns"
                        checked={manualAns === 1}
                        onChange={() => setManualAns(1)}
                        className="text-[#C8102E] w-4 h-4 cursor-pointer"
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                      />
                      <span className="text-xs font-black text-slate-700 w-5">খ)</span>
                      <input
                        type="text"
                        value={manualOpt1}
                        onChange={(e) => setManualOpt1(e.target.value)}
                        placeholder="২য় অপশন লিখুন"
                        className="bg-transparent text-xs text-slate-800 font-medium outline-none flex-1"
                      />
                    </div>

                    {/* Option 2 (গ) */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="radio"
                        name="manualAns"
                        checked={manualAns === 2}
                        onChange={() => setManualAns(2)}
                        className="text-[#C8102E] w-4 h-4 cursor-pointer"
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                      />
                      <span className="text-xs font-black text-slate-700 w-5">গ)</span>
                      <input
                        type="text"
                        value={manualOpt2}
                        onChange={(e) => setManualOpt2(e.target.value)}
                        placeholder="৩য় অপশন লিখুন"
                        className="bg-transparent text-xs text-slate-800 font-medium outline-none flex-1"
                      />
                    </div>

                    {/* Option 3 (ঘ) */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="radio"
                        name="manualAns"
                        checked={manualAns === 3}
                        onChange={() => setManualAns(3)}
                        className="text-[#C8102E] w-4 h-4 cursor-pointer"
                        title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                      />
                      <span className="text-xs font-black text-slate-700 w-5">ঘ)</span>
                      <input
                        type="text"
                        value={manualOpt3}
                        onChange={(e) => setManualOpt3(e.target.value)}
                        placeholder="৪র্থ অপশন লিখুন"
                        className="bg-transparent text-xs text-slate-800 font-medium outline-none flex-1"
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      ব্যাখ্যা (ঐচ্ছিক — ফলাফল প্রদর্শনের সময় শিক্ষার্থী দেখতে পাবে)
                    </label>
                    <input
                      type="text"
                      value={manualExplanation}
                      onChange={(e) => setManualExplanation(e.target.value)}
                      placeholder="উদা: দোয়েল বাংলাদেশের জাতীয় পাখি..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FaPlus className="w-3 h-3" />
                      <span>প্রশ্নটি তালিকায় যোগ করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION C: CURRENT QUESTIONS LIST & PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span>সংযুক্ত প্রশ্ন তালিকা ({examQuestions.length}টি)</span>
                  </h4>
                  {examQuestions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        showConfirmToast({
                          title: "সকল প্রশ্ন খালি করবেন?",
                          message: "আপনি কি এই তালিকার সকল প্রশ্ন মুছে ফেলতে চান?",
                          confirmText: "হ্যাঁ, খালি করুন",
                          cancelText: "বাতিল",
                          onConfirm: () => {
                            setExamQuestions([]);
                            toast.success("তালিকা খালি করা হয়েছে।");
                          },
                        });
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      সকল প্রশ্ন পরিষ্কার করুন
                    </button>
                  )}
                </div>

                {examQuestions.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-1">
                    <div className="text-2xl">📋</div>
                    <p className="text-xs font-bold text-slate-600">বর্তমানে কোনো প্রশ্ন যোগ করা হয়নি</p>
                    <p className="text-[11px] text-slate-400">
                      উপরে JSON ফাইল আপলোড করুন অথবা নিজে এক এক করে প্রশ্ন যোগ করুন।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {examQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-2 relative group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black mr-2">
                              প্রশ্ন #{idx + 1}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800">
                              {q.q}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuestionFromList(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                            title="প্রশ্নটি মুছে ফেলুন"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Options preview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.ans;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                                  isCorrect
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                    : "bg-slate-50 border-slate-200 text-slate-600"
                                }`}
                              >
                                {isCorrect ? (
                                  <FaCircleCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    {oIdx === 0 ? "ক" : oIdx === 1 ? "খ" : oIdx === 2 ? "গ" : "ঘ"}
                                  </span>
                                )}
                                <span className="truncate">{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                            <span className="font-bold text-slate-700">ব্যাখ্যা: </span>
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Save Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 shrink-0">
              <div className="text-xs text-slate-600 font-bold">
                মোট সংযুক্ত: <span className="text-[#C8102E] font-black">{examQuestions.length}টি প্রশ্ন</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalExam(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                >
                  বাতিল
                </button>

                <button
                  type="button"
                  onClick={handleSaveQuestionsToExam}
                  disabled={isSavingQuestions}
                  className="px-6 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>
                    {isSavingQuestions ? "সংরক্ষণ হচ্ছে..." : "এই প্রশ্নগুলো পরীক্ষায় সেভ করুন"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
