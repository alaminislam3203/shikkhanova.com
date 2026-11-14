"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  RawQuestion,
  toBengaliClass,
  toBengaliNumber,
  getStoredSubjectQuestions,
  getSubjectsForClassAndGroup,
  getStoredQuizCovers,
  QuizCovers,
  DEFAULT_QUIZ_COVERS,
  CustomQuizCard,
} from "@/lib/defaultQuizData";
import { CustomExam } from "@/lib/quizExamStorage";
import {
  FaArrowLeft,
  FaBookOpen,
  FaClock,
  FaCheck,
  FaXmark,
  FaLock,
  FaLockOpen,
  FaRotateRight,
  FaAward,
  FaCircleCheck,
  FaCircleXmark,
  FaFilter,
  FaGem,
  FaGift,
  FaFire,
  FaCircleQuestion,
  FaGraduationCap,
  FaChevronRight,
  FaPlay,
  FaUsers,
  FaLayerGroup,
  FaStar,
} from "react-icons/fa6";

interface SubjectExamItem {
  id: string;
  title: string;
  subtitle?: string;
  classGrade: number;
  subject: string;
  durationMinutes: number;
  questionCount: number;
  isPaid: boolean;
  price?: number;
  badge?: string;
  sourceType: "auto_bank" | "custom";
  examCode?: string;
  questions?: RawQuestion[];
  isBuiltIn?: boolean;
}

function SubjectDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const classParam = searchParams.get("class");
  const subjectParam = searchParams.get("subject") || "বাংলা";

  const selectedClass = classParam ? parseInt(classParam, 10) || 5 : 5;
  const selectedSubject = subjectParam;

  // Active Tab Filter: 'all' | 'free' | 'paid'
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");

  // Data States
  const [customExams, setCustomExams] = useState<CustomExam[]>([]);
  const [customCards, setCustomCards] = useState<CustomQuizCard[]>([]);
  const [bankQuestions, setBankQuestions] = useState<RawQuestion[]>([]);
  const [covers, setCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [unlockedClasses, setUnlockedClasses] = useState<number[]>([]);

  // Student Identity inputs
  const [studentName, setStudentName] = useState<string>("");
  const [studentRoll, setStudentRoll] = useState<string>("");

  // Examination Runner States
  const [activeExam, setActiveExam] = useState<SubjectExamItem | null>(null);
  const [examQuestions, setExamQuestions] = useState<RawQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "wrong" | "unanswered">("all");
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [codePromptExam, setCodePromptExam] = useState<SubjectExamItem | null>(null);

  const testRunnerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize student name & roll
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("sn_student_quiz_name");
      const storedRoll = localStorage.getItem("sn_student_quiz_roll");
      if (storedName) setStudentName(storedName);
      else if (session?.user?.name) setStudentName(session.user.name);

      if (storedRoll) setStudentRoll(storedRoll);
      else if ((session?.user as any)?.rollNumber) {
        setStudentRoll((session.user as any).rollNumber);
      }
    } catch {}
  }, [session]);

  // Load Unlocked Classes from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sn_unlocked_classes");
      if (saved) {
        setUnlockedClasses(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Fetch Subject Data & Model Tests
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Custom Exams for this subject and class
        const examsPromise = fetch(
          `/api/quiz/custom-exams?classGrade=${selectedClass}&subject=${encodeURIComponent(
            selectedSubject,
          )}&activeOnly=true`,
          { cache: "no-store" },
        )
          .then((r) => r.json())
          .catch(() => ({ exams: [] }));

        // 2. Fetch Question Bank for this subject
        const questionsPromise = fetch(
          `/api/quiz/questions?classGrade=${selectedClass}&subject=${encodeURIComponent(
            selectedSubject,
          )}&category=subject`,
          { cache: "no-store" },
        )
          .then((r) => r.json())
          .catch(() => ({ questions: [] }));

        // 3. Fetch Quiz Cards
        const cardsPromise = fetch("/api/quiz/cards", { cache: "no-store" })
          .then((r) => r.json())
          .catch(() => ({ cards: [] }));

        // 4. Fetch Covers
        const coversPromise = fetch("/api/quiz/covers", { cache: "no-store" })
          .then((r) => r.json())
          .catch(() => ({ covers: DEFAULT_QUIZ_COVERS }));

        const [examsRes, qsRes, cardsRes, coversRes] = await Promise.all([
          examsPromise,
          questionsPromise,
          cardsPromise,
          coversPromise,
        ]);

        if (!isMounted) return;

        if (Array.isArray(examsRes?.exams)) {
          setCustomExams(examsRes.exams);
        }

        if (Array.isArray(qsRes?.questions) && qsRes.questions.length > 0) {
          setBankQuestions(qsRes.questions);
        } else {
          // Fallback to local default questions if any
          const localQs = getStoredSubjectQuestions(selectedClass, selectedSubject);
          setBankQuestions(localQs);
        }

        if (Array.isArray(cardsRes?.cards)) {
          setCustomCards(cardsRes.cards);
        }

        if (coversRes?.covers) {
          setCovers(coversRes.covers);
        } else {
          setCovers(getStoredQuizCovers());
        }
      } catch (err) {
        console.error("Error loading subject quiz details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedClass, selectedSubject]);

  // Combine All Model Tests for this Class & Subject
  const allModelTests: SubjectExamItem[] = useMemo(() => {
    const list: SubjectExamItem[] = [];

    // A. Custom Exams created specifically for this class & subject
    customExams.forEach((exam) => {
      list.push({
        id: exam.id,
        title: exam.title,
        subtitle: exam.subtitle,
        classGrade: exam.classGrade,
        subject: exam.subject,
        durationMinutes: exam.durationMinutes || 20,
        questionCount:
          Array.isArray(exam.questions) && exam.questions.length > 0
            ? exam.questions.length
            : exam.questionCount || 20,
        isPaid: Boolean(exam.isPaid),
        price: exam.price || 50,
        badge: exam.badge || (exam.isPaid ? "পেইড" : "ফ্রি"),
        sourceType: exam.sourceType || "auto_bank",
        examCode: exam.examCode,
        questions: exam.questions,
        isBuiltIn: false,
      });
    });

    // B. Custom Quiz Cards matching this class & subject
    customCards
      .filter(
        (card) =>
          card.classGrade === selectedClass &&
          card.subject.toLowerCase() === selectedSubject.toLowerCase(),
      )
      .forEach((card) => {
        // avoid duplicate if same title exists
        if (!list.some((e) => e.title === card.title)) {
          list.push({
            id: `card_${card.id}`,
            title: card.title,
            subtitle: card.subtitle,
            classGrade: card.classGrade,
            subject: card.subject,
            durationMinutes: card.durationMinutes || 15,
            questionCount: card.questionCount || 15,
            isPaid: Boolean(card.isPaid),
            price: card.price || 50,
            badge: card.badge || (card.isPaid ? "পেইড" : "ফ্রি"),
            sourceType: "auto_bank",
            isBuiltIn: false,
          });
        }
      });

    // C. Default / Comprehensive Built-in Model Tests from question bank
    // Always provide at least 1 Free Comprehensive Model Test so students can test immediately
    const totalBank = bankQuestions.length;
    list.push({
      id: "builtin_subject_comprehensive",
      title: `${selectedSubject} পূর্ণাঙ্গ বিষয়ভিত্তিক মডেল টেস্ট`,
      subtitle: `${toBengaliClass(selectedClass)} শ্রেণির পাঠ্যবই অনুসারে বাছাইকৃত গুরুত্বপূর্ণ বহুনির্বাচনী প্রশ্ন`,
      classGrade: selectedClass,
      subject: selectedSubject,
      durationMinutes: Math.max(10, Math.min(30, Math.min(25, totalBank || 20))),
      questionCount: Math.min(25, Math.max(10, totalBank)),
      isPaid: false,
      badge: "ফ্রি টেস্ট",
      sourceType: "auto_bank",
      isBuiltIn: true,
    });

    // If bank has more than 20 questions, add a Rapid Speed Test (ফ্রি)
    if (totalBank >= 15) {
      list.push({
        id: "builtin_speed_test",
        title: `${selectedSubject} কুইক স্পিড টেস্ট (১০ প্রশ্ন)`,
        subtitle: `কম সময়ে দ্রুত যাচাই করুন বিষয়টির উপর আপনার প্রস্তুতি`,
        classGrade: selectedClass,
        subject: selectedSubject,
        durationMinutes: 10,
        questionCount: 10,
        isPaid: false,
        badge: "স্পিড টেস্ট",
        sourceType: "auto_bank",
        isBuiltIn: true,
      });
    }

    return list;
  }, [customExams, customCards, bankQuestions, selectedClass, selectedSubject]);

  // Filtered Model Tests based on tab
  const displayedModelTests = useMemo(() => {
    if (filterType === "free") {
      return allModelTests.filter((t) => !t.isPaid);
    }
    if (filterType === "paid") {
      return allModelTests.filter((t) => t.isPaid);
    }
    return allModelTests;
  }, [allModelTests, filterType]);

  // Counts
  const freeTestsCount = useMemo(() => allModelTests.filter((t) => !t.isPaid).length, [allModelTests]);
  const paidTestsCount = useMemo(() => allModelTests.filter((t) => t.isPaid).length, [allModelTests]);

  // Handle Starting an Exam
  const handleStartExam = (exam: SubjectExamItem) => {
    // If exam is locked with access code, check code
    if (exam.examCode && exam.examCode.trim()) {
      setCodePromptExam(exam);
      setEnteredCode("");
      return;
    }

    // Check Paid lock
    const isUnlocked =
      !exam.isPaid ||
      unlockedClasses.includes(exam.classGrade) ||
      session?.user?.role === "ADMIN";

    if (!isUnlocked) {
      toast.error(`🔒 এটি একটি পেইড মডেল টেস্ট (৳${exam.price || 50})। অনুগ্রহ করে আনলক করুন।`);
      return;
    }

    launchExam(exam);
  };

  const launchExam = (exam: SubjectExamItem) => {
    let questionsToUse: RawQuestion[] = [];

    if (Array.isArray(exam.questions) && exam.questions.length > 0) {
      questionsToUse = exam.questions;
    } else {
      // Pick from bankQuestions
      if (bankQuestions.length > 0) {
        const shuffled = [...bankQuestions].sort(() => 0.5 - Math.random());
        questionsToUse = shuffled.slice(0, exam.questionCount);
      } else {
        // Fallback questions if bank is completely empty
        questionsToUse = [
          {
            q: `${exam.subject} বিষয়ের ১ম প্রশ্ন: নিম্নের কোনটি সঠিক?`,
            options: ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],
            ans: 0,
            explanation: "সঠিক উত্তর হলো অপশন ১।",
          },
          {
            q: `${exam.subject} বিষয়ের ২য় প্রশ্ন: মৌলিক ধারণা অনুযায়ী কোনটি প্রযোজ্য?`,
            options: ["ক", "খ", "গ", "ঘ"],
            ans: 1,
            explanation: "খ সঠিক কারণ এটি পাঠ্যবইয়ের নিয়ম মেনে চলে।",
          },
        ];
      }
    }

    setActiveExam(exam);
    setExamQuestions(questionsToUse);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setIsTestActive(true);
    setReviewFilter("all");

    const totalSeconds = (exam.durationMinutes || 20) * 60;
    setTimeLeft(totalSeconds);
    setTotalTime(totalSeconds);

    // Scroll smoothly to test area
    setTimeout(() => {
      testRunnerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Confirm Access Code
  const handleVerifyAccessCode = () => {
    if (!codePromptExam) return;
    if (
      codePromptExam.examCode &&
      enteredCode.trim().toUpperCase() !== codePromptExam.examCode.trim().toUpperCase()
    ) {
      toast.error("ভুল অ্যাক্সেস কোড! অনুগ্রহ করে সঠিক কোড দিন।");
      return;
    }
    const examToStart = codePromptExam;
    setCodePromptExam(null);
    setEnteredCode("");
    launchExam(examToStart);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (isTestActive && !isSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleSubmitQuiz(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, isSubmitted, timeLeft]);

  // Select Option
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // Submit Quiz
  const handleSubmitQuiz = (isTimeOut = false) => {
    if (isSubmitted) return;

    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.ans) {
        score++;
      }
    });

    const total = examQuestions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    setQuizScore(score);
    setIsSubmitted(true);
    setReviewFilter("all");

    if (isTimeOut) {
      toast("⏰ সময় শেষ! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হয়েছে।", { icon: "⏳" });
    } else {
      toast.success("🎉 আপনার মডেল টেস্ট সফলভাবে সাবমিট হয়েছে!");
    }

    // Determine Medal
    let medal = "⭐ Top 10";
    if (percentage === 100) medal = "🥇 Gold";
    else if (percentage >= 80) medal = "🥈 Silver";
    else if (percentage >= 60) medal = "🥉 Bronze";

    const finalStudentName =
      studentName.trim() ||
      session?.user?.name ||
      `শিক্ষার্থী #${Math.floor(100 + Math.random() * 900)}`;

    const finalRoll =
      studentRoll.trim() ||
      (session?.user as any)?.rollNumber ||
      undefined;

    if (studentName.trim()) {
      try {
        localStorage.setItem("sn_student_quiz_name", studentName.trim());
      } catch {}
    }
    if (studentRoll.trim()) {
      try {
        localStorage.setItem("sn_student_quiz_roll", studentRoll.trim());
      } catch {}
    }

    // Save to centralized server API
    fetch("/api/quiz/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: activeExam?.id || "subject_model_test",
        examTitle: activeExam?.title || `${selectedSubject} মডেল টেস্ট`,
        classGrade: selectedClass,
        subject: selectedSubject,
        studentName: finalStudentName,
        studentRoll: finalRoll,
        studentEmail: session?.user?.email,
        score,
        total,
        percentage,
        timeTakenSeconds: totalTime - timeLeft,
      }),
    }).catch(() => {});
  };

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Cover image for this subject if set
  const subjectCoverImage = covers.subjects?.[selectedSubject];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & BREADCRUMB
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 overflow-hidden">
            <Link
              href={`/quiz?class=${selectedClass}`}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#C8102E] transition shrink-0"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
              <span>সকল কুইজ</span>
            </Link>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <span className="shrink-0 text-slate-600">
              {toBengaliClass(selectedClass)} শ্রেণি
            </span>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <span className="text-[#C8102E] font-black truncate">{selectedSubject}</span>
          </div>

          <Link
            href={`/quiz?class=${selectedClass}`}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <span>শ্রেণি/বিষয় বদলান</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* ─────────────────────────────────────────────────────────────
            2. SUBJECT HERO BANNER
        ───────────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-6 sm:p-10 border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#C8102E] text-white text-xs font-black shadow-xs">
                  {toBengaliClass(selectedClass)} শ্রেণি
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-white text-xs font-bold border border-white/20">
                  📖 বিষয়ভিত্তিক মডেল টেস্ট হাব
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {selectedSubject} — সকল মডেল টেস্ট ও কুইজ
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedSubject} বিষয়ের প্রতিটি অধ্যায় ও সিলেবাস অনুযায়ী সাজানো মডেল টেস্টসমূহ।
                ফ্রি ও পেইড টেস্ট দিয়ে সময়ভিত্তিক লাইভ পরীক্ষার মাধ্যমে আপনার পূর্ণাঙ্গ প্রস্তুতি যাচাই করুন।
              </p>

              <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-300 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <FaLayerGroup className="text-amber-400" />
                  <span>মোট মডেল টেস্ট: {toBengaliNumber(allModelTests.length)}টি</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <FaBookOpen className="text-teal-400" />
                  <span>প্রশ্ন ব্যাংকে আছে: {toBengaliNumber(bankQuestions.length)}টি MCQ</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <FaGift className="text-emerald-400" />
                  <span>ফ্রি টেস্ট: {toBengaliNumber(freeTestsCount)}টি</span>
                </div>
              </div>
            </div>

            {/* Optional Cover Image / Visual Icon */}
            {subjectCoverImage ? (
              <div className="w-full md:w-56 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/60 shrink-0">
                <img
                  src={subjectCoverImage}
                  alt={selectedSubject}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl sm:text-6xl shrink-0 shadow-2xl">
                📚
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. LIVE TEST RUNNER (WHEN A TEST IS STARTED)
        ───────────────────────────────────────────────────────────── */}
        {isTestActive && activeExam && (
          <div
            ref={testRunnerRef}
            className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-[#C8102E]/30 shadow-xl space-y-6 scroll-mt-20 animate-in fade-in duration-300"
          >
            {/* Runner Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-xs border border-blue-200">
                    {toBengaliClass(selectedClass)} শ্রেণি
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                    {selectedSubject}
                  </span>
                  {activeExam.isPaid ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-black text-xs border border-rose-200">
                      🔒 পেইড টেস্ট
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                      ✨ ফ্রি টেস্ট
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {activeExam.title}
                </h2>
                {activeExam.subtitle && (
                  <p className="text-xs text-slate-500 font-medium">{activeExam.subtitle}</p>
                )}
              </div>

              {/* Timer & Controls */}
              <div className="flex items-center gap-3 shrink-0">
                {!isSubmitted ? (
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-base font-black shadow-xs ${
                      timeLeft < 120
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    <FaClock className="w-4 h-4 text-amber-400" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                    পরীক্ষা সমাপ্ত ✅
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmitted && !confirm("আপনি কি পরীক্ষা বাতিল করে ফিরে যেতে চান?")) {
                      return;
                    }
                    setIsTestActive(false);
                    setActiveExam(null);
                  }}
                  className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  title="বন্ধ করুন"
                >
                  <FaXmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Student Name/Roll bar if not submitted */}
            {!isSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    শিক্ষার্থীর নাম (ফলাফল সংরক্ষণের জন্য)
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#C8102E]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    রোল / আইডি (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    placeholder="উদা: ১২"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>
            )}

            {/* POST-SUBMIT SCORE CARD */}
            {isSubmitted && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-[#1e0a14] text-white space-y-5 text-center shadow-xl">
                <div className="text-4xl">
                  {quizScore / examQuestions.length >= 0.8
                    ? "🏆"
                    : quizScore / examQuestions.length >= 0.5
                    ? "🎯"
                    : "💪"}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black">
                    ফলাফল: {toBengaliNumber(quizScore)} / {toBengaliNumber(examQuestions.length)}
                  </h3>
                  <p className="text-sm text-slate-300">
                    সাফল্যের হার:{" "}
                    <span className="font-black text-amber-400">
                      {Math.round((quizScore / examQuestions.length) * 100)}%
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => launchExam(activeExam)}
                    className="px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <FaRotateRight className="w-3.5 h-3.5" />
                    <span>পুনরায় টেস্ট দিন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestActive(false);
                      setActiveExam(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
                  >
                    অন্যান্য মডেল টেস্ট দেখুন
                  </button>
                </div>

                {/* Review filter buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 flex-wrap text-xs">
                  <span className="text-slate-400 font-bold mr-1">পর্যালোচনা:</span>
                  {(["all", "correct", "wrong", "unanswered"] as const).map((rf) => (
                    <button
                      key={rf}
                      type="button"
                      onClick={() => setReviewFilter(rf)}
                      className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                        reviewFilter === rf
                          ? "bg-white text-slate-900"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      }`}
                    >
                      {rf === "all" && "সকল প্রশ্ন"}
                      {rf === "correct" && "সঠিক উত্তর"}
                      {rf === "wrong" && "ভুল উত্তর"}
                      {rf === "unanswered" && "অনুত্তরিত"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTIONS LIST */}
            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const selectedOpt = selectedAnswers[idx];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.ans;
                const isWrong = isAnswered && selectedOpt !== q.ans;

                // Apply Review Filter
                if (isSubmitted) {
                  if (reviewFilter === "correct" && !isCorrect) return null;
                  if (reviewFilter === "wrong" && !isWrong) return null;
                  if (reviewFilter === "unanswered" && isAnswered) return null;
                }

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? "bg-emerald-50/50 border-emerald-200"
                          : isWrong
                          ? "bg-rose-50/50 border-rose-200"
                          : "bg-slate-50 border-slate-200"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {toBengaliNumber(idx + 1)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">
                          {q.q}
                        </h4>
                      </div>

                      {isSubmitted && (
                        <div>
                          {isCorrect && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                              <FaCircleCheck /> সঠিক
                            </span>
                          )}
                          {isWrong && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center gap-1">
                              <FaCircleXmark /> ভুল
                            </span>
                          )}
                          {!isAnswered && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                              অনুত্তরিত
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";

                        if (!isSubmitted) {
                          if (selectedOpt === optIdx) {
                            btnStyle =
                              "bg-[#0A1E3C] text-white border-[#0A1E3C] shadow-xs";
                          }
                        } else {
                          // Submitted View
                          if (optIdx === q.ans) {
                            btnStyle =
                              "bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs";
                          } else if (selectedOpt === optIdx && selectedOpt !== q.ans) {
                            btnStyle =
                              "bg-rose-500 text-white border-rose-500 font-bold";
                          } else {
                            btnStyle = "bg-white/60 border-slate-200 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(idx, optIdx)}
                            className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {["ক", "খ", "গ", "ঘ"][optIdx] || optIdx + 1}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isSubmitted && q.explanation && (
                      <div className="mt-3 pl-8 text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-[#C8102E]">💡 ব্যাখ্যা: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            {!isSubmitted && (
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">
                  উত্তর প্রদান করা হয়েছে:{" "}
                  <span className="text-[#C8102E] font-black">
                    {toBengaliNumber(Object.keys(selectedAnswers).length)}
                  </span>{" "}
                  / {toBengaliNumber(examQuestions.length)}টি
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmitQuiz(false)}
                  className="px-6 py-3 rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>উত্তরপত্র জমা দিন</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            4. MODEL TESTS SECTION & FILTER TABS
        ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>মডেল টেস্টসমূহ</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {toBengaliNumber(displayedModelTests.length)}টি টেস্ট
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                পছন্দের মডেল টেস্টটি সিলেক্ট করে পরীক্ষা শুরু করুন।
              </p>
            </div>

            {/* Filter Tabs: All, Free, Paid */}
            <div className="inline-flex rounded-2xl bg-white p-1 border border-slate-200 shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  filterType === "all"
                    ? "bg-[#0A1E3C] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>সকল টেস্ট</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {toBengaliNumber(allModelTests.length)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType("free")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  filterType === "free"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>✨ ফ্রি</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {toBengaliNumber(freeTestsCount)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType("paid")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  filterType === "paid"
                    ? "bg-[#C8102E] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🔒 পেইড</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {toBengaliNumber(paidTestsCount)}
                </span>
              </button>
            </div>
          </div>

          {/* Model Tests Cards Grid */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-bold text-sm">
              মডেল টেস্টসমূহ লোড হচ্ছে...
            </div>
          ) : displayedModelTests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <div className="text-4xl">📝</div>
              <h3 className="text-base font-black text-slate-800">
                এই ক্যাটাগরিতে কোনো মডেল টেস্ট পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                অন্যান্য ফিল্টার নির্বাচন করুন অথবা সরাসরি কুইজ ব্যাংকের পূর্ণাঙ্গ টেস্টে অংশ নিন।
              </p>
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className="px-4 py-2 rounded-xl bg-[#0A1E3C] text-white font-bold text-xs"
              >
                সকল টেস্ট দেখুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedModelTests.map((exam) => {
                const isUnlocked =
                  !exam.isPaid ||
                  unlockedClasses.includes(exam.classGrade) ||
                  session?.user?.role === "ADMIN";

                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-[#C8102E]/40 hover:shadow-lg transition flex flex-col justify-between space-y-4 group relative"
                  >
                    <div className="space-y-2.5">
                      {/* Badge row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] border border-blue-200">
                          {toBengaliClass(exam.classGrade)} শ্রেণি
                        </span>

                        {exam.isPaid ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-black text-[11px] border border-rose-200 flex items-center gap-1">
                            <FaLock className="w-2.5 h-2.5" />
                            <span>পেইড (৳{exam.price || 50})</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-[11px] border border-emerald-200">
                            ✨ {exam.badge || "ফ্রি"}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-[#C8102E] transition-colors leading-snug">
                          {exam.title}
                        </h3>
                        {exam.subtitle && (
                          <p className="text-xs text-slate-500 font-medium line-clamp-2">
                            {exam.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Meta Information */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50">
                          <FaClock className="w-3 h-3 text-slate-400" />
                          <span className="font-bold">
                            {toBengaliNumber(exam.durationMinutes)} মিনিট
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50">
                          <FaBookOpen className="w-3 h-3 text-slate-400" />
                          <span className="font-bold">
                            {toBengaliNumber(exam.questionCount)}টি MCQ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleStartExam(exam)}
                          className="w-full py-2.5 rounded-xl bg-[#0A1E3C] group-hover:bg-[#C8102E] text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <FaPlay className="w-3 h-3" />
                          <span>টেস্ট শুরু করুন</span>
                        </button>
                      ) : (
                        <Link
                          href={`/pay-fee?class=${exam.classGrade}`}
                          className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-[#C8102E] text-rose-700 hover:text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-rose-200"
                        >
                          <FaLock className="w-3 h-3" />
                          <span>আনলক করুন (৳{exam.price || 50})</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. ACCESS CODE PROMPT MODAL (IF REQUIRED BY EXAM)
        ───────────────────────────────────────────────────────────── */}
        {codePromptExam && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl mx-auto mb-2">
                  <FaLock />
                </div>
                <h3 className="text-base font-black text-slate-800">
                  পরীক্ষার অ্যাক্সেস কোড দিন
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  "{codePromptExam.title}" পরীক্ষায় অংশ নিতে শিক্ষক বা অ্যাডমিন প্রদত্ত কোডটি লিখুন।
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                  placeholder="উদা: MATH26"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3 py-2.5 text-center text-sm font-mono font-black text-slate-800 outline-none uppercase tracking-wider"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCodePromptExam(null)}
                  className="w-1/2 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleVerifyAccessCode}
                  className="w-1/2 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs transition active:scale-95 cursor-pointer shadow-md"
                >
                  যাচাই ও শুরু
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="text-slate-400 font-bold text-sm">লোড হচ্ছে...</div>
        </div>
      }
    >
      <SubjectDetailsContent />
    </Suspense>
  );
}

