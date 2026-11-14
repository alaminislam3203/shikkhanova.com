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
  QuizPrices,
  DEFAULT_QUIZ_PRICES,
  getStoredQuizPrices,
} from "@/lib/defaultQuizData";
import { CustomExam } from "@/lib/quizExamStorage";
import { showConfirmToast } from "@/lib/confirmToast";
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
  FaKey,
  FaCopy,
  FaPhone,
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
  coverImage?: string;
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
  const [bankQuestions, setBankQuestions] = useState<RawQuestion[]>([]);
  const [covers, setCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);
  const [quizPrices, setQuizPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [loading, setLoading] = useState<boolean>(true);
  const [unlockedClasses, setUnlockedClasses] = useState<number[]>([]);

  // Student Identity inputs
  const [studentName, setStudentName] = useState<string>("");
  const [studentRoll, setStudentRoll] = useState<string>("");

  // Examination Runner States
  const [activeExam, setActiveExam] = useState<SubjectExamItem | null>(null);
  const [examQuestions, setExamQuestions] = useState<RawQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "correct" | "wrong" | "unanswered"
  >("all");

  // Exam Access Code Prompt
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [codePromptExam, setCodePromptExam] = useState<SubjectExamItem | null>(
    null,
  );

  // Payment / Unlock Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [targetPaidExam, setTargetPaidExam] = useState<SubjectExamItem | null>(
    null,
  );
  const [accessCodeInput, setAccessCodeInput] = useState<string>("");
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState<string>("");

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
      if (session?.user?.id) {
        const userSaved = localStorage.getItem(
          `sn_unlocked_classes_${session.user.id}`,
        );
        if (userSaved) {
          setUnlockedClasses(JSON.parse(userSaved));
        }
      }
    } catch {}
  }, [session?.user?.id]);

  // Load Quiz Prices
  useEffect(() => {
    try {
      const stored = getStoredQuizPrices();
      if (stored) setQuizPrices(stored);
    } catch {}

    fetch("/api/quiz/prices")
      .then((r) => r.json())
      .then((data) => {
        if (data?.prices) setQuizPrices(data.prices);
      })
      .catch(() => {});
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

        // 3. Fetch Covers
        const coversPromise = fetch("/api/quiz/covers", { cache: "no-store" })
          .then((r) => r.json())
          .catch(() => ({ covers: DEFAULT_QUIZ_COVERS }));

        const [examsRes, qsRes, coversRes] = await Promise.all([
          examsPromise,
          questionsPromise,
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
          const localQs = getStoredSubjectQuestions(
            selectedClass,
            selectedSubject,
          );
          setBankQuestions(localQs);
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
    const totalBank = bankQuestions.length;
    const classPrice = quizPrices.classPrices[selectedClass] || 50;
    const classCover =
      covers.classes?.[selectedClass] ||
      covers.classes?.[String(selectedClass)] ||
      "";
    const subjectCover = covers.subjects?.[selectedSubject] || "";

    // 1. 🎁 Class-wise Free Model Test for this subject
    list.push({
      id: `classwise_free_${selectedClass}_${selectedSubject}`,
      title: `${toBengaliClass(selectedClass)} শ্রেণি — ${selectedSubject} ফ্রি মডেল টেস্ট`,
      subtitle: `${toBengaliClass(selectedClass)} শ্রেণির পাঠ্যবই অনুযায়ী তৈরি ফ্রি বহুনির্বাচনী মডেল টেস্ট ও তাৎক্ষণিক ফলাফল`,
      classGrade: selectedClass,
      subject: selectedSubject,
      durationMinutes: 20,
      questionCount: Math.min(25, Math.max(10, totalBank || 20)),
      isPaid: false,
      badge: "Free Model Test",
      coverImage: subjectCover || classCover,
      sourceType: "auto_bank",
      isBuiltIn: true,
    });

    // 2. 💎 Class-wise Paid Model Test for this subject
    list.push({
      id: `classwise_paid_${selectedClass}_${selectedSubject}`,
      title: `💎 ${toBengaliClass(selectedClass)} শ্রেণি — ${selectedSubject} পেইড মডেল টেস্ট`,
      subtitle: `পূর্ণাঙ্গ স্পেশাল মডেল টেস্ট • অধ্যায়ভিত্তিক স্পেশাল MCQ • বিস্তারিত ফলাফল, র‍্যাংক ও সমাধান`,
      classGrade: selectedClass,
      subject: selectedSubject,
      durationMinutes: 25,
      questionCount: Math.min(30, Math.max(15, totalBank || 25)),
      isPaid: true,
      price: classPrice,
      badge: "💎 Paid Model Test",
      coverImage: classCover || subjectCover,
      sourceType: "auto_bank",
      isBuiltIn: true,
    });

    // 3. Custom Exams created specifically by Admin for this class & subject
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
        coverImage: exam.coverImage || subjectCover || classCover,
        sourceType: exam.sourceType || "auto_bank",
        examCode: exam.examCode,
        questions: exam.questions,
        isBuiltIn: false,
      });
    });

    // 4. If bank has more than 15 questions, add a Rapid Speed Test (ফ্রি)
    if (totalBank >= 15) {
      list.push({
        id: "builtin_speed_test",
        title: `⚡ ${selectedSubject} কুইক স্পিড টেস্ট (১০ প্রশ্ন)`,
        subtitle: `কম সময়ে দ্রুত যাচাই করুন বিষয়টির উপর আপনার প্রস্তুতি`,
        classGrade: selectedClass,
        subject: selectedSubject,
        durationMinutes: 10,
        questionCount: 10,
        isPaid: false,
        badge: "স্পিড টেস্ট",
        coverImage: subjectCover || classCover,
        sourceType: "auto_bank",
        isBuiltIn: true,
      });
    }

    return list;
  }, [
    customExams,
    bankQuestions,
    selectedClass,
    selectedSubject,
    quizPrices,
    covers,
  ]);

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
  const freeTestsCount = useMemo(
    () => allModelTests.filter((t) => !t.isPaid).length,
    [allModelTests],
  );
  const paidTestsCount = useMemo(
    () => allModelTests.filter((t) => t.isPaid).length,
    [allModelTests],
  );

  // Handle Starting an Exam
  const handleStartExam = (exam: SubjectExamItem) => {
    // If exam is locked with access code, prompt code
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
      setTargetPaidExam(exam);
      setAccessCodeInput("");
      setUnlockSuccessMsg("");
      setPaymentModalOpen(true);
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
        // Fallback questions if bank is empty
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
      testRunnerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Confirm Access Code
  const handleVerifyAccessCode = () => {
    if (!codePromptExam) return;
    if (
      codePromptExam.examCode &&
      enteredCode.trim().toUpperCase() !==
        codePromptExam.examCode.trim().toUpperCase()
    ) {
      toast.error("ভুল অ্যাক্সেস কোড! অনুগ্রহ করে সঠিক কোড দিন।");
      return;
    }
    const examToStart = codePromptExam;
    setCodePromptExam(null);
    setEnteredCode("");
    launchExam(examToStart);
  };

  // Verify Unlock Paid Test via TrxID or Promo Code
  const handleVerifyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCodeInput.trim().toUpperCase();
    const validCodes = [
      "NOVA50",
      "SHIKKHA2026",
      "SHIKKHANOVA",
      "ADMIN100",
      "FREE2026",
    ];
    const isCodeValid = validCodes.includes(code);
    const isTrxValid = code.length >= 6;

    if (isCodeValid || isTrxValid) {
      const updated = Array.from(new Set([...unlockedClasses, selectedClass]));
      setUnlockedClasses(updated);
      try {
        localStorage.setItem("sn_unlocked_classes", JSON.stringify(updated));
        if (session?.user?.id) {
          localStorage.setItem(
            `sn_unlocked_classes_${session.user.id}`,
            JSON.stringify(updated),
          );
        }
      } catch {}

      setUnlockSuccessMsg(
        `🎉 অভিনন্দন! ${toBengaliClass(selectedClass)} শ্রেণির মডেল টেস্ট আনলক হয়েছে!`,
      );
      toast.success("পেইড মডেল টেস্ট সফলভাবে আনলক হয়েছে!");

      setTimeout(() => {
        setPaymentModalOpen(false);
        if (targetPaidExam) {
          launchExam(targetPaidExam);
        }
      }, 1200);
    } else {
      toast.error("অনুগ্রহ করে সঠিক অ্যাক্সেস কোড অথবা TrxID প্রদান করুন।");
    }
  };

  // Copy helper
  const copyNumber = (num: string, label: string) => {
    try {
      navigator.clipboard.writeText(num);
      toast.success(`${label} নাম্বার কপি হয়েছে!`);
    } catch {
      toast.error("কপি করা যায়নি।");
    }
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
      toast("⏰ সময় শেষ! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হয়েছে।", {
        icon: "⏳",
      });
    } else {
      toast.success("🎉 আপনার মডেল টেস্ট সফলভাবে সাবমিট হয়েছে!");
    }

    const finalStudentName =
      studentName.trim() ||
      session?.user?.name ||
      `শিক্ষার্থী #${Math.floor(100 + Math.random() * 900)}`;

    const finalRoll =
      studentRoll.trim() || (session?.user as any)?.rollNumber || undefined;

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

  const subjectCoverImage = covers.subjects?.[selectedSubject];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & BREADCRUMB
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                if (isTestActive && !isSubmitted) {
                  showConfirmToast({
                    title: "পরীক্ষা বাতিল করবেন?",
                    message: "আপনি কি পরীক্ষা বাতিল করে ফিরে যেতে চান?",
                    confirmText: "হ্যাঁ, বাতিল করুন",
                    cancelText: "না, পরীক্ষা দিন",
                    confirmButtonClass: "bg-[#C8102E] hover:bg-[#A50D26]",
                    onConfirm: () => {
                      setIsTestActive(false);
                      setActiveExam(null);
                      router.push(`/quiz?class=${selectedClass}`);
                    },
                  });
                  return;
                }
                router.push(`/quiz?class=${selectedClass}`);
              }}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#C8102E] transition shrink-0 cursor-pointer"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
              <span>সকল কুইজ</span>
            </button>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <span className="shrink-0 text-slate-600">
              {toBengaliClass(selectedClass)} শ্রেণি
            </span>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <span className="text-[#C8102E] font-black truncate">
              {selectedSubject}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isTestActive && !isSubmitted) {
                showConfirmToast({
                  title: "পরীক্ষা বাতিল করবেন?",
                  message: "আপনি কি পরীক্ষা বাতিল করে ফিরে যেতে চান?",
                  confirmText: "হ্যাঁ, বাতিল করুন",
                  cancelText: "না, পরীক্ষা দিন",
                  confirmButtonClass: "bg-[#C8102E] hover:bg-[#A50D26]",
                  onConfirm: () => {
                    setIsTestActive(false);
                    setActiveExam(null);
                    router.push(`/quiz?class=${selectedClass}`);
                  },
                });
                return;
              }
              router.push(`/quiz?class=${selectedClass}`);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>শ্রেণি/বিষয় বদলান</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* ─────────────────────────────────────────────────────────────
            2. SUBJECT HERO BANNER
        ───────────────────────────────────────────────────────────── */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-4 sm:p-8 md:p-10 border border-slate-800">
          <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-6">
            <div className="space-y-2 sm:space-y-3 max-w-2xl min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#C8102E] text-white text-[10px] sm:text-xs font-black shadow-xs">
                  {toBengaliClass(selectedClass)} শ্রেণি
                </span>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold border border-white/20">
                  📖 বিষয়ভিত্তিক মডেল টেস্ট হাব
                </span>
              </div>

              <h1 className="text-base sm:text-2xl md:text-4xl font-black tracking-tight leading-snug sm:leading-tight">
                {selectedSubject} — সকল মডেল টেস্ট ও কুইজ
              </h1>

              <p className="text-[11px] sm:text-sm text-slate-300 leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                {toBengaliClass(selectedClass)} শ্রেণির {selectedSubject} বিষয়ের
                সিলেবাস অনুযায়ী সাজানো ফ্রি ও পেইড মডেল টেস্ট। সময়ভিত্তিক
                পরীক্ষার মাধ্যমে আপনার পূর্ণাঙ্গ প্রস্তুতি যাচাই করুন।
              </p>

              <div className="flex items-center gap-1.5 sm:gap-3 pt-1 text-[10px] sm:text-xs font-bold text-slate-300 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10">
                  <FaLayerGroup className="text-amber-400 text-xs sm:text-sm" />
                  <span>
                    মোট: {toBengaliNumber(allModelTests.length)}টি
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10">
                  <FaGift className="text-emerald-400 text-xs sm:text-sm" />
                  <span>ফ্রি: {toBengaliNumber(freeTestsCount)}টি</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10">
                  <FaGem className="text-rose-400 text-xs sm:text-sm" />
                  <span>পেইড: {toBengaliNumber(paidTestsCount)}টি</span>
                </div>
              </div>
            </div>

            {/* Visual Icon / Cover Image */}
            {subjectCoverImage ? (
              <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-900/60 shrink-0">
                <img
                  src={subjectCoverImage}
                  alt={selectedSubject}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl sm:text-5xl md:text-6xl shrink-0 shadow-xl">
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
                  <p className="text-xs text-slate-500 font-medium">
                    {activeExam.subtitle}
                  </p>
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
                    if (!isSubmitted) {
                      showConfirmToast({
                        title: "পরীক্ষা বাতিল করবেন?",
                        message: "আপনি কি পরীক্ষা বাতিল করে ফিরে যেতে চান?",
                        confirmText: "হ্যাঁ, বাতিল করুন",
                        cancelText: "না, চালিয়ে যান",
                        confirmButtonClass: "bg-[#C8102E] hover:bg-[#A50D26]",
                        onConfirm: () => {
                          setIsTestActive(false);
                          setActiveExam(null);
                          toast.success("পরীক্ষা বাতিল করা হয়েছে।");
                        },
                      });
                      return;
                    }
                    setIsTestActive(false);
                    setActiveExam(null);
                  }}
                  className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
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
                    ফলাফল: {toBengaliNumber(quizScore)} /{" "}
                    {toBengaliNumber(examQuestions.length)}
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
                  <span className="text-slate-400 font-bold mr-1">
                    পর্যালোচনা:
                  </span>
                  {(["all", "correct", "wrong", "unanswered"] as const).map(
                    (rf) => (
                      <button
                        key={rf}
                        type="button"
                        onClick={() => setReviewFilter(rf)}
                        className={`px-3 py-1 rounded-lg font-bold transition text-[11px] cursor-pointer ${
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
                    ),
                  )}
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
                          } else if (
                            selectedOpt === optIdx &&
                            selectedOpt !== q.ans
                          ) {
                            btnStyle =
                              "bg-rose-500 text-white border-rose-500 font-bold";
                          } else {
                            btnStyle =
                              "bg-white/60 border-slate-200 text-slate-400";
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
                        <span className="font-bold text-[#C8102E]">
                          💡 ব্যাখ্যা:{" "}
                        </span>
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
                {toBengaliClass(selectedClass)} শ্রেণির {selectedSubject} বিষয়ের
                ফ্রি ও পেইড মডেল টেস্ট বেছে নিন।
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
                <FaGift className="w-3 h-3 text-emerald-300" />
                <span>ফ্রি টেস্ট</span>
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
                <FaGem className="w-3 h-3 text-rose-300" />
                <span>পেইড টেস্ট</span>
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
                এই ফিল্টারে কোনো মডেল টেস্ট পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                অন্যান্য ফিল্টার নির্বাচন করুন অথবা সরাসরি কুইজ ব্যাংকের
                পূর্ণাঙ্গ টেস্টে অংশ নিন।
              </p>
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className="px-4 py-2 rounded-xl bg-[#0A1E3C] text-white font-bold text-xs cursor-pointer"
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

                const cardImage =
                  exam.coverImage ||
                  subjectCoverImage ||
                  covers.classes?.[selectedClass] ||
                  covers.classes?.[String(selectedClass)];

                return (
                  <div
                    key={exam.id}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border transition flex flex-col justify-between space-y-3 group relative shadow-xs hover:shadow-lg ${
                      exam.isPaid
                        ? "border-t-4 border-t-[#C8102E] border-slate-200"
                        : "border-t-4 border-t-emerald-600 border-slate-200"
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Optional Cover Image */}
                      {cardImage && (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-2 relative group shadow-2xs">
                          <img
                            src={cardImage}
                            alt={exam.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Badge row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] border border-blue-200">
                          {toBengaliClass(exam.classGrade)} শ্রেণি
                        </span>

                        {exam.isPaid ? (
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-black text-[11px] border flex items-center gap-1 ${
                              isUnlocked
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {isUnlocked ? (
                              <>
                                <FaCheck className="w-2.5 h-2.5" />
                                <span>আনলকড</span>
                              </>
                            ) : (
                              <>
                                <FaLock className="w-2.5 h-2.5" />
                                <span>পেইড (৳{exam.price || 50})</span>
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-[11px] border border-emerald-200 flex items-center gap-1">
                            <FaGift className="w-2.5 h-2.5" />
                            <span>{exam.badge || "১০০% ফ্রি"}</span>
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
                          className={`w-full py-2.5 rounded-xl text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                            exam.isPaid
                              ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800"
                              : "bg-[#0A1E3C] group-hover:bg-[#C8102E]"
                          }`}
                        >
                          <FaPlay className="w-3 h-3" />
                          <span>
                            {exam.isPaid
                              ? "প্রিমিয়াম টেস্ট দিন"
                              : "ফ্রি টেস্ট দিন"}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartExam(exam)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:from-[#0F284E] hover:to-[#A50D26] text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <FaLock className="w-3 h-3" />
                          <span>Paid Test কিনুন (৳{exam.price || 50})</span>
                        </button>
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
                  "{codePromptExam.title}" পরীক্ষায় অংশ নিতে শিক্ষক বা অ্যাডমিন
                  প্রদত্ত কোডটি লিখুন।
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

        {/* ─────────────────────────────────────────────────────────────
            6. PAYMENT & ACCESS CODE UNLOCK MODAL
        ───────────────────────────────────────────────────────────── */}
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center text-base">
                    <FaGem />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      পেইড মডেল টেস্ট আনলক করুন
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {toBengaliClass(selectedClass)} শ্রেণি — {selectedSubject}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                >
                  <FaXmark className="w-4 h-4" />
                </button>
              </div>

              {/* Price Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    এককালীন ফি
                  </div>
                  <div className="text-xl font-black">
                    ৳
                    {targetPaidExam?.price ||
                      quizPrices.classPrices[selectedClass] ||
                      50}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-200 font-medium">
                  {selectedSubject} বিষয়ের সকল পেইড টেস্ট উন্মুক্ত হবে
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">
                  সেন্ড মানি বা পেমেন্ট নাম্বার (ক্লিক করলেই কপি হবে):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => copyNumber("01712592519", "bKash")}
                    className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-left hover:bg-pink-100 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-black text-pink-700 text-[11px]">
                        bKash (Personal)
                      </div>
                      <div className="font-mono text-slate-800 font-bold text-xs mt-0.5">
                        01712592519
                      </div>
                    </div>
                    <FaCopy className="w-3 h-3 text-pink-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => copyNumber("01712592519", "Nagad")}
                    className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left hover:bg-amber-100 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-black text-amber-800 text-[11px]">
                        Nagad (Personal)
                      </div>
                      <div className="font-mono text-slate-800 font-bold text-xs mt-0.5">
                        01712592519
                      </div>
                    </div>
                    <FaCopy className="w-3 h-3 text-amber-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => copyNumber("017125925194", "Rocket")}
                    className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-left hover:bg-purple-100 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-black text-purple-700 text-[11px]">
                        Rocket (Personal)
                      </div>
                      <div className="font-mono text-slate-800 font-bold text-xs mt-0.5">
                        017125925194
                      </div>
                    </div>
                    <FaCopy className="w-3 h-3 text-purple-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => copyNumber("01712592519", "Upay")}
                    className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-left hover:bg-blue-100 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-black text-blue-700 text-[11px]">
                        Upay (Personal)
                      </div>
                      <div className="font-mono text-slate-800 font-bold text-xs mt-0.5">
                        01712592519
                      </div>
                    </div>
                    <FaCopy className="w-3 h-3 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerifyUnlock} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    TrxID অথবা অ্যাক্সেস কোড লিখুন
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={accessCodeInput}
                      onChange={(e) => setAccessCodeInput(e.target.value)}
                      placeholder="যেমন: NOVA50 বা TrxID"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none font-mono font-bold"
                    />
                    <FaKey className="absolute right-3.5 top-3 text-slate-400 w-3.5 h-3.5" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 ডেমো কোড:{" "}
                    <code className="font-bold text-[#C8102E]">NOVA50</code> বা{" "}
                    <code className="font-bold text-[#C8102E]">
                      SHIKKHA2026
                    </code>
                  </p>
                </div>

                {unlockSuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {unlockSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-lg transition active:scale-95 cursor-pointer"
                >
                  🔓 টেস্ট আনলক করুন
                </button>
              </form>

              {/* Online Pay Fee Direct Link */}
              <div className="text-center pt-2 border-t border-slate-100">
                <Link
                  href={`/pay-fee?class=${selectedClass}&subject=${encodeURIComponent(selectedSubject)}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>অনলাইন ফি পেমেন্ট পেইজে যান (/pay-fee)</span>
                  <FaChevronRight className="w-2.5 h-2.5" />
                </Link>
              </div>

              {/* Helpline */}
              <div className="text-center text-xs text-slate-500 pt-1 flex items-center justify-center gap-1.5">
                <span>যেকোনো প্রয়োজনে কল করুন:</span>
                <a
                  href="tel:01712592519"
                  onClick={() => copyNumber("01712592519", "হেল্পলাইন")}
                  className="font-bold text-[#C8102E] hover:underline flex items-center gap-1"
                >
                  <FaPhone className="w-2.5 h-2.5" />
                  <span>০১৭১২৫৯২৫১৯</span>
                </a>
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
