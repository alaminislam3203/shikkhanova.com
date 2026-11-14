"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
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
  FaLightbulb,
  FaPenToSquare,
  FaFeatherPointed,
  FaMagnifyingGlass,
  FaChevronUp,
  FaChevronDown,
  FaLandmark,
  FaGlobe,
  FaCoins,
  FaTrophy,
  FaMedal,
  FaUserGraduate,
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

  // Active Tab Filter: 'all' | 'free' | 'paid' | 'chapters'
  const [filterType, setFilterType] = useState<"all" | "free" | "paid" | "chapters">("all");

  // Chapter-wise data states
  const [chapterGroups, setChapterGroups] = useState<{
    name: string;
    type: string;
    author?: string;
    testCount: number;
    totalQuestions: number;
    tests: { id: string; name: string; min: number; questionCount: number }[];
  }[]>([]);
  const [chapterTypeFilter, setChapterTypeFilter] = useState<string>("all");
  const [chapterSearch, setChapterSearch] = useState<string>("");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);

  const isBdwpSubject =
    selectedSubject.includes("বাংলাদেশ ও বিশ্বপরিচয়") ||
    selectedSubject.includes("বাংলাদেশ ও বিশ্ব পরিচয়") ||
    selectedSubject.includes("বাবি") ||
    selectedSubject.toLowerCase().includes("bdwp");

  const isGrammarSubject =
    !isBdwpSubject &&
    (selectedSubject.includes("২") ||
      selectedSubject.includes("2") ||
      selectedSubject.includes("ব্যাকরণ"));

  const isBangla1st = selectedSubject.includes("বাংলা") && !isGrammarSubject;

  const availableChapterTypes = useMemo(() => {
    const set = new Set<string>();
    chapterGroups.forEach((c) => {
      if (c.type && c.type.trim()) set.add(c.type.trim());
    });
    return Array.from(set);
  }, [chapterGroups]);

  // Data States
  const [customExams, setCustomExams] = useState<CustomExam[]>([]);
  const [bankQuestions, setBankQuestions] = useState<RawQuestion[]>([]);
  const [covers, setCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);
  const [quizPrices, setQuizPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [loading, setLoading] = useState<boolean>(true);
  const [unlockedClasses, setUnlockedClasses] = useState<number[]>([]);
  const [subjectLeaderboard, setSubjectLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);

  const loadSubjectLeaderboard = useCallback(() => {
    if (!selectedSubject) return;
    setLoadingLeaderboard(true);
    const query = new URLSearchParams({
      subject: selectedSubject,
      sortBy: "rank",
      limit: "15",
    });
    if (selectedClass) {
      query.set("classGrade", String(selectedClass));
    }

    fetch(`/api/quiz/submissions?${query.toString()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.submissions)) {
          setSubjectLeaderboard(data.submissions);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingLeaderboard(false));
  }, [selectedClass, selectedSubject]);

  useEffect(() => {
    loadSubjectLeaderboard();
  }, [loadSubjectLeaderboard]);

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

        // 4. Fetch Chapter Tests (from Bangla 1st & 2nd Paper Unified Database)
        const chaptersPromise = fetch(
          `/api/quiz/chapter-tests?action=chapters&subject=${encodeURIComponent(selectedSubject)}`,
          { cache: "no-store" }
        )
          .then((r) => r.json())
          .catch(() => ({ success: false, chapters: [] }));

        const [examsRes, qsRes, coversRes, chaptersRes] = await Promise.all([
          examsPromise,
          questionsPromise,
          coversPromise,
          chaptersPromise,
        ]);

        if (!isMounted) return;

        if (Array.isArray(examsRes?.exams)) {
          setCustomExams(examsRes.exams);
        }

        if (chaptersRes?.success && Array.isArray(chaptersRes.chapters)) {
          setChapterGroups(chaptersRes.chapters);
        } else {
          setChapterGroups([]);
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

    // 2. Class-wise Paid Model Test for this subject
    list.push({
      id: `classwise_paid_${selectedClass}_${selectedSubject}`,
      title: `${toBengaliClass(selectedClass)} শ্রেণি — ${selectedSubject} পেইড মডেল টেস্ট`,
      subtitle: `পূর্ণাঙ্গ স্পেশাল মডেল টেস্ট • অধ্যায়ভিত্তিক স্পেশাল MCQ • বিস্তারিত ফলাফল, র‍্যাংক ও সমাধান`,
      classGrade: selectedClass,
      subject: selectedSubject,
      durationMinutes: 25,
      questionCount: Math.min(30, Math.max(15, totalBank || 25)),
      isPaid: true,
      price: classPrice,
      badge: "Paid Model Test",
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
        title: `${selectedSubject} কুইক স্পিড টেস্ট (১০ প্রশ্ন)`,
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

  // Filtered Chapters based on type and search query
  const filteredChapters = useMemo(() => {
    let list = chapterGroups;
    if (chapterTypeFilter !== "all") {
      list = list.filter((c) => c.type === chapterTypeFilter);
    }
    if (chapterSearch.trim()) {
      const q = chapterSearch.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.author && c.author.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [chapterGroups, chapterTypeFilter, chapterSearch]);

  // Counts
  const freeTestsCount = useMemo(
    () => allModelTests.filter((t) => !t.isPaid).length,
    [allModelTests],
  );
  const paidTestsCount = useMemo(
    () => allModelTests.filter((t) => t.isPaid).length,
    [allModelTests],
  );

  // Require Login Helper
  const requireLogin = () => {
    toast.error("পরীক্ষা দিতে অনুগ্রহ করে আগে লগইন করুন!");
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/quiz/subject?class=${selectedClass}&subject=${encodeURIComponent(selectedSubject)}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
  };

  // Handle Starting an Exam
  const handleStartExam = (exam: SubjectExamItem) => {
    if (!session?.user) {
      requireLogin();
      return;
    }

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

  const launchExam = (exam: SubjectExamItem, practice: boolean = false) => {
    if (!session?.user) {
      requireLogin();
      return;
    }

    setIsPracticeMode(practice);
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

  // Launch Chapter Test (from Bangla Unified Database)
  const handleStartChapterTest = async (
    testId: string,
    mode: "exam" | "practice" = "exam",
  ) => {
    if (!session?.user) {
      requireLogin();
      return;
    }

    try {
      toast.loading("টেস্ট লোড হচ্ছে...", { id: "load_ch_test" });
      const res = await fetch(
        `/api/quiz/chapter-tests?action=test&id=${encodeURIComponent(testId)}`,
      );
      const data = await res.json();
      toast.dismiss("load_ch_test");

      if (data?.success && data.test) {
        const t = data.test;
        const examItem: SubjectExamItem = {
          id: t.id,
          title: `${t.ch} — ${t.name}`,
          subtitle: `${t.type}${t.author ? ' • ' + t.author : ''} • ${
            mode === "practice"
              ? "অনুশীলন মোড (তাৎক্ষণিক সঠিক উত্তর ও ব্যাখ্যা)"
              : "পূর্ণাঙ্গ পরীক্ষা মোড"
          }`,
          classGrade: selectedClass,
          subject: selectedSubject,
          durationMinutes: t.durationMinutes || 20,
          questionCount: Array.isArray(t.questions) ? t.questions.length : 20,
          isPaid: false,
          badge: mode === "practice" ? "অনুশীলন" : "অধ্যায় পরীক্ষা",
          sourceType: "custom",
          questions: (t.questions || []).map((q: any) => ({
            q: q.q,
            options: q.options,
            ans: q.ans,
            explanation: q.explanation,
            stem: q.stem,
            stemLabel: q.stemLabel,
            items: q.items,
            tail: q.tail,
            page: q.page,
            chapter: t.ch,
            category: t.type,
          })),
        };
        launchExam(examItem, mode === "practice");
      } else {
        toast.error("টেস্টের প্রশ্নাবলী পাওয়া যায়নি।");
      }
    } catch {
      toast.dismiss("load_ch_test");
      toast.error("টেস্ট লোড করতে সমস্যা হয়েছে।");
    }
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
    if (isTestActive && !isSubmitted && !isPracticeMode && timeLeft > 0) {
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
  }, [isTestActive, isSubmitted, isPracticeMode, timeLeft]);

  // Select Option
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    if (isPracticeMode && selectedAnswers[qIdx] !== undefined) return;
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

    // Save to centralized server API (Leaderboard)
    fetch("/api/quiz/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: activeExam?.id || "subject_model_test",
        examTitle: activeExam?.title || `${selectedSubject} মডেল টেস্ট`,
        classGrade: selectedClass,
        subject: selectedSubject,
        studentName: finalStudentName,
        rollNumber: finalRoll,
        studentRoll: finalRoll,
        studentEmail: session?.user?.email,
        score,
        total,
        percentage,
        timeTakenSeconds: Math.max(1, totalTime - timeLeft),
      }),
    })
      .then(() => {
        loadSubjectLeaderboard();
      })
      .catch(() => {});
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
              <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-xl">
                <FaBookOpen className="text-white/80 w-7 h-7 sm:w-12 sm:h-12 md:w-16 md:h-16" />
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
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-black text-xs border border-rose-200 flex items-center gap-1">
                      <FaLock className="w-2.5 h-2.5" />
                      <span>পেইড টেস্ট</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200 flex items-center gap-1">
                      <FaGift className="w-2.5 h-2.5" />
                      <span>ফ্রি টেস্ট</span>
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
                  <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200 flex items-center gap-1.5">
                    <span>পরীক্ষা সমাপ্ত</span>
                    <FaCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
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
              <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-[#1e0a14] text-white space-y-3 sm:space-y-5 text-center shadow-xl">
                <div className="flex justify-center text-amber-400">
                  {quizScore / examQuestions.length >= 0.8 ? (
                    <FaAward className="w-8 h-8 sm:w-12 sm:h-12 text-amber-400" />
                  ) : quizScore / examQuestions.length >= 0.5 ? (
                    <FaStar className="w-8 h-8 sm:w-12 sm:h-12 text-amber-400" />
                  ) : (
                    <FaBookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
                  )}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className="text-base sm:text-2xl font-black">
                    ফলাফল: {toBengaliNumber(quizScore)} /{" "}
                    {toBengaliNumber(examQuestions.length)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    সাফল্যের হার:{" "}
                    <span className="font-black text-amber-400">
                      {Math.round((quizScore / examQuestions.length) * 100)}%
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:justify-center sm:gap-2 pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => launchExam(activeExam)}
                    className="px-1.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-[10px] sm:text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer"
                  >
                    <FaRotateRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">পুনরায় টেস্ট</span>
                  </button>
                  <a
                    href="#subject-leaderboard"
                    className="px-1.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] sm:text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer"
                  >
                    <FaTrophy className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-900 shrink-0" />
                    <span className="truncate">মেধা তালিকা</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestActive(false);
                      setActiveExam(null);
                    }}
                    className="px-1.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] sm:text-xs transition active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    <span className="truncate">অন্যান্য টেস্ট</span>
                  </button>
                </div>

                {/* Review filter buttons */}
                <div className="pt-2.5 sm:pt-4 border-t border-white/10 flex items-center justify-center gap-1 sm:gap-1.5 flex-nowrap sm:flex-wrap text-[10px] sm:text-xs overflow-x-auto no-scrollbar">
                  <span className="text-slate-400 font-bold mr-0.5 sm:mr-1 text-[9px] sm:text-xs shrink-0">
                    পর্যালোচনা:
                  </span>
                  {(["all", "correct", "wrong", "unanswered"] as const).map(
                    (rf) => (
                      <button
                        key={rf}
                        type="button"
                        onClick={() => setReviewFilter(rf)}
                        className={`px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg font-bold transition text-[9px] sm:text-[11px] shrink-0 cursor-pointer ${
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

            {/* Practice mode hint banner */}
            {isPracticeMode && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <FaLightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>অনুশীলন মোড: প্রতিটি প্রশ্নে ক্লিক করলেই সঙ্গে সঙ্গে সঠিক উত্তর ও পাঠ্যবইয়ের ব্যাখ্যা দেখতে পাবেন।</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] shrink-0 font-bold">তাৎক্ষণিক উত্তর</span>
              </div>
            )}

            {/* QUESTIONS LIST */}
            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const selectedOpt = selectedAnswers[idx];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.ans;
                const isWrong = isAnswered && selectedOpt !== q.ans;
                const showInstant = isPracticeMode && isAnswered;
                const showFeedback = isSubmitted || showInstant;

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
                      showFeedback
                        ? isCorrect
                          ? "bg-emerald-50/50 border-emerald-200"
                          : isWrong
                            ? "bg-rose-50/50 border-rose-200"
                            : "bg-slate-50 border-slate-200"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Optional Stem / Uddipok */}
                    {q.stem && (
                      <div className="mb-3 ml-8 p-3 bg-blue-50/80 border-l-4 border-blue-600 rounded-r-xl text-xs text-slate-800">
                        <b className="text-blue-900 block mb-0.5">
                          {q.stemLabel || "উদ্দীপক"}:
                        </b>
                        <p className="whitespace-pre-line leading-relaxed">
                          {q.stem}
                        </p>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {toBengaliNumber(idx + 1)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">
                          {q.q}
                        </h4>
                      </div>

                      {showFeedback && (
                        <div className="shrink-0">
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

                    {/* Optional Roman items i, ii, iii */}
                    {q.items && q.items.length > 0 && (
                      <div className="my-2 ml-8 p-2.5 bg-slate-100/90 rounded-xl text-xs text-slate-700 space-y-1">
                        {q.items.map((it, iIdx) => (
                          <div key={iIdx} className="font-medium">
                            {it}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Optional tail question */}
                    {q.tail && (
                      <p className="text-xs font-bold text-slate-800 ml-8 mb-2.5">
                        {q.tail}
                      </p>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";

                        if (!showFeedback) {
                          if (selectedOpt === optIdx) {
                            btnStyle =
                              "bg-[#0A1E3C] text-white border-[#0A1E3C] shadow-xs";
                          }
                        } else {
                          // Feedback View (Submitted or Practice)
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
                            disabled={isSubmitted || (isPracticeMode && isAnswered)}
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

                    {/* Explanation and Page number */}
                    {showFeedback && (q.explanation || q.page) && (
                      <div className="mt-3 ml-8 text-xs text-slate-700 bg-blue-50/80 p-3 rounded-xl border border-blue-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900">
                          <FaLightbulb className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>সঠিক উত্তর: {["ক", "খ", "গ", "ঘ"][q.ans]}</span>
                          {q.page && (
                            <span className="text-slate-500 font-normal">
                              (পাঠ্যবইয়ের পৃষ্ঠা: {toBengaliNumber(q.page)})
                            </span>
                          )}
                        </div>
                        {q.explanation && (
                          <p className="text-slate-600 leading-relaxed">
                            {q.explanation}
                          </p>
                        )}
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
          {/* Chapter-wise Promotion Banner */}
          {chapterGroups.length > 0 && filterType !== "chapters" && (
            <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0A1E3C] via-[#102A54] to-indigo-950 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-400/20">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-[11px] font-bold border border-blue-400/30">
                  <FaBookOpen className="w-3 h-3 text-cyan-300" />
                  <span>অধ্যায়ভিত্তিক স্পেশাল প্রস্তুতি</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isGrammarSubject
                    ? `${toBengaliClass(selectedClass)} শ্রেণির ${selectedSubject} — ব্যাকরণ ও নির্মিতির অধ্যায়ভিত্তিক প্রস্তুতি`
                    : isBangla1st
                    ? `${toBengaliClass(selectedClass)} শ্রেণির বাংলা — কবিতা ও গদ্যের অধ্যায়ভিত্তিক পরীক্ষা`
                    : `${toBengaliClass(selectedClass)} শ্রেণির ${selectedSubject} — অধ্যায়ভিত্তিক মডেল টেস্ট ও অনুশীলন`}
                </h3>
                <p className="text-xs text-blue-200/90 leading-relaxed">
                  পাঠ্যবইয়ের প্রতিটি অধ্যায়ের ওপর আলাদা আলাদা পরীক্ষা দিন এবং অনুশীলন মোডে তাৎক্ষণিক সঠিক উত্তর ও ব্যাখ্যা জেনে নিন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFilterType("chapters")}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs transition active:scale-95 shadow-md flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
              >
                <span>অধ্যায়সমূহ দেখুন ({toBengaliNumber(chapterGroups.length)}টি অধ্যায়)</span>
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{filterType === "chapters" ? "অধ্যায়ভিত্তিক মডেল টেস্ট" : "মডেল টেস্টসমূহ"}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {filterType === "chapters"
                    ? `${toBengaliNumber(filteredChapters.length)}টি অধ্যায়`
                    : `${toBengaliNumber(displayedModelTests.length)}টি টেস্ট`}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {filterType === "chapters"
                  ? `${toBengaliClass(selectedClass)} শ্রেণির পাঠ্যবইয়ের অধ্যায় নির্বাচন করে পরীক্ষা বা অনুশীলন শুরু করুন।`
                  : `${toBengaliClass(selectedClass)} শ্রেণির ${selectedSubject} বিষয়ের ফ্রি ও পেইড মডেল টেস্ট বেছে নিন।`}
              </p>
            </div>

            {/* Filter Tabs: All, Free, Paid, Chapters */}
            <div className="inline-flex rounded-2xl bg-white p-1 border border-slate-200 shadow-2xs self-start sm:self-auto flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
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
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
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
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
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

              {chapterGroups.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterType("chapters")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    filterType === "chapters"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FaBookOpen className="w-3 h-3 text-indigo-300" />
                  <span>অধ্যায়ভিত্তিক</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {toBengaliNumber(chapterGroups.length)}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* VIEW 1: CHAPTER-WISE EXAMS VIEW */}
          {filterType === "chapters" ? (
            <div className="space-y-5">
              {/* Category Filter & Search Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Type Filter Buttons */}
                  {availableChapterTypes.length > 1 && (
                    <div className="inline-flex rounded-2xl bg-slate-100 p-1 self-start flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setChapterTypeFilter("all")}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                          chapterTypeFilter === "all"
                            ? "bg-[#0A1E3C] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <span>সকল অধ্যায়</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/80">
                          {toBengaliNumber(chapterGroups.length)}
                        </span>
                      </button>
                      {availableChapterTypes.map((tName) => {
                        let icon = <FaBookOpen className="w-3 h-3 text-blue-500" />;
                        if (tName === "কবিতা") icon = <FaFeatherPointed className="w-3 h-3 text-rose-500" />;
                        else if (tName === "নির্মিতি") icon = <FaPenToSquare className="w-3 h-3 text-amber-500" />;
                        else if (tName === "ইতিহাস ও রাষ্ট্র") icon = <FaLandmark className="w-3 h-3 text-amber-500" />;
                        else if (tName === "ভূগোল ও পরিবেশ") icon = <FaGlobe className="w-3 h-3 text-emerald-500" />;
                        else if (tName === "অর্থনীতি") icon = <FaCoins className="w-3 h-3 text-cyan-500" />;
                        else if (tName === "সমাজবিজ্ঞান") icon = <FaUsers className="w-3 h-3 text-purple-500" />;

                        return (
                          <button
                            key={tName}
                            type="button"
                            onClick={() => setChapterTypeFilter(tName)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                              chapterTypeFilter === tName
                                ? "bg-[#0A1E3C] text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {icon}
                            <span>{tName}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Search Input with React Icon */}
                  <div className="w-full sm:w-72 relative">
                    <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={chapterSearch}
                      onChange={(e) => setChapterSearch(e.target.value)}
                      placeholder={
                        isBdwpSubject
                          ? "অধ্যায়ের নাম খুঁজুন (যেমন: মুক্তিযুদ্ধ, নদ-নদী, অর্থনীতি)..."
                          : isGrammarSubject
                          ? "অধ্যায়ের নাম খুঁজুন (যেমন: ধ্বনি, সমাস, কারক)..."
                          : isBangla1st
                          ? "অধ্যায় বা লেখকের নাম খুঁজুন..."
                          : `${selectedSubject} বিষয়ের অধ্যায় খুঁজুন...`
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <FaLightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>টিপস: <b>"পরীক্ষা"</b> মোডে টাইমারসহ টেস্ট দিন অথবা <b>"অনুশীলন"</b> মোডে তাৎক্ষণিক সঠিক উত্তর ও পৃষ্ঠা নম্বরসহ ব্যাখ্যা জানুন।</span>
                </div>
              </div>

              {/* Chapters List Grid */}
              {filteredChapters.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-2">
                  <FaBookOpen className="w-10 h-10 text-indigo-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">কোনো অধ্যায় পাওয়া যায়নি</h4>
                  <p className="text-xs text-slate-500">অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChapters.map((ch) => {
                    const isExpanded = expandedChapter === ch.name;
                    return (
                      <div
                        key={ch.name}
                        className={`bg-white rounded-2xl sm:rounded-3xl border transition-all space-y-3 p-4 sm:p-5 shadow-xs hover:shadow-md ${
                          isExpanded
                            ? "border-indigo-300 ring-2 ring-indigo-50"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
                                  ch.type === "কবিতা"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : ch.type === "নির্মিতি"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : ch.type === "ভূগোল ও পরিবেশ"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : ch.type === "অর্থনীতি"
                                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                    : ch.type === "সমাজবিজ্ঞান"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : ch.type === "ইতিহাস ও রাষ্ট্র"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {ch.type === "কবিতা" ? (
                                  <>
                                    <FaFeatherPointed className="w-2.5 h-2.5 text-rose-600" />
                                    <span>কবিতা</span>
                                  </>
                                ) : ch.type === "নির্মিতি" ? (
                                  <>
                                    <FaPenToSquare className="w-2.5 h-2.5 text-amber-600" />
                                    <span>নির্মিতি</span>
                                  </>
                                ) : ch.type === "ভূগোল ও পরিবেশ" ? (
                                  <>
                                    <FaGlobe className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>{ch.type}</span>
                                  </>
                                ) : ch.type === "অর্থনীতি" ? (
                                  <>
                                    <FaCoins className="w-2.5 h-2.5 text-cyan-600" />
                                    <span>{ch.type}</span>
                                  </>
                                ) : ch.type === "সমাজবিজ্ঞান" ? (
                                  <>
                                    <FaUsers className="w-2.5 h-2.5 text-purple-600" />
                                    <span>{ch.type}</span>
                                  </>
                                ) : ch.type === "ইতিহাস ও রাষ্ট্র" ? (
                                  <>
                                    <FaLandmark className="w-2.5 h-2.5 text-amber-600" />
                                    <span>{ch.type}</span>
                                  </>
                                ) : (
                                  <>
                                    <FaBookOpen className="w-2.5 h-2.5 text-blue-600" />
                                    <span>{ch.type}</span>
                                  </>
                                )}
                              </span>
                              {ch.author && (
                                <span className="text-xs text-slate-500 font-medium truncate max-w-[180px]">
                                  {ch.author}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                              {ch.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {toBengaliNumber(ch.testCount)}টি মডেল টেস্ট • {toBengaliNumber(ch.totalQuestions)}টি বহুনির্বাচনী প্রশ্ন
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedChapter(isExpanded ? null : ch.name)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                              isExpanded
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            <span>{isExpanded ? "লুকান" : "টেস্টসমূহ"}</span>
                            {isExpanded ? (
                              <FaChevronUp className="w-2.5 h-2.5" />
                            ) : (
                              <FaChevronDown className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </div>

                        {/* Expanded Tests inside this chapter */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 sm:gap-2.5">
                            {ch.tests.map((t) => (
                              <div
                                key={t.id}
                                className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-2 hover:bg-indigo-50/40 transition"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <div
                                    className="font-bold text-[11px] sm:text-xs text-slate-800 line-clamp-2 leading-tight"
                                    title={t.name}
                                  >
                                    {t.name}
                                  </div>
                                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                                    {toBengaliNumber(t.questionCount)}টি প্রশ্ন • {toBengaliNumber(t.min)} মিনিট
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-1 sm:gap-1.5 pt-1 border-t border-slate-200/60">
                                  <button
                                    type="button"
                                    onClick={() => handleStartChapterTest(t.id, "exam")}
                                    className="w-full py-1 sm:py-1.5 px-1 rounded-lg sm:rounded-xl bg-[#0A1E3C] hover:bg-[#102A54] text-white text-[10px] sm:text-xs font-black transition active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-1"
                                  >
                                    <FaPenToSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
                                    <span>পরীক্ষা</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStartChapterTest(t.id, "practice")}
                                    className="w-full py-1 sm:py-1.5 px-1 rounded-lg sm:rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-black transition active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-1"
                                  >
                                    <FaLightbulb className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200" />
                                    <span>অনুশীলন</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Model Tests Cards Grid */
            loading ? (
            <div className="py-16 text-center text-slate-400 font-bold text-sm">
              মডেল টেস্টসমূহ লোড হচ্ছে...
            </div>
          ) : displayedModelTests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <FaClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
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
                    className={`bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition flex flex-col justify-between space-y-2.5 sm:space-y-3 group relative shadow-xs hover:shadow-lg ${
                      exam.isPaid
                        ? "border-t-4 border-t-[#C8102E] border-slate-200"
                        : "border-t-4 border-t-emerald-600 border-slate-200"
                    }`}
                  >
                    <div className="space-y-2 sm:space-y-2.5">
                      {/* Optional Cover Image */}
                      {cardImage && (
                        <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-1.5 sm:mb-2 relative group shadow-2xs">
                          <img
                            src={cardImage}
                            alt={exam.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Badge row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] sm:text-[11px] border border-blue-200 w-fit">
                          {toBengaliClass(exam.classGrade)} শ্রেণি
                        </span>

                        {exam.isPaid ? (
                          <span
                            className={`px-2 sm:px-2.5 py-0.5 rounded-full font-black text-[9px] sm:text-[11px] border flex items-center gap-1 w-fit ${
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
                                <span>৳{exam.price || 50}</span>
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-[9px] sm:text-[11px] border border-emerald-200 flex items-center gap-1 w-fit">
                            <FaGift className="w-2.5 h-2.5" />
                            <span>{exam.badge || "ফ্রি"}</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-base font-black text-slate-900 group-hover:text-[#C8102E] transition-colors leading-snug line-clamp-2">
                          {exam.title}
                        </h3>
                        {exam.subtitle && (
                          <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-1 sm:line-clamp-2">
                            {exam.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Meta Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-slate-100 text-[10px] sm:text-xs text-slate-600">
                        <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-50">
                          <FaClock className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-slate-400 shrink-0" />
                          <span className="font-bold truncate">
                            {toBengaliNumber(exam.durationMinutes)} মিনিট
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-50">
                          <FaBookOpen className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-slate-400 shrink-0" />
                          <span className="font-bold truncate">
                            {toBengaliNumber(exam.questionCount)}টি MCQ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1.5 sm:pt-2">
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleStartExam(exam)}
                          className={`w-full py-2 sm:py-2.5 rounded-xl text-white font-black text-[11px] sm:text-xs transition active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs ${
                            exam.isPaid
                              ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800"
                              : "bg-[#0A1E3C] group-hover:bg-[#C8102E]"
                          }`}
                        >
                          <FaPlay className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                          <span>
                            {exam.isPaid
                              ? "প্রিমিয়াম টেস্ট"
                              : "ফ্রি টেস্ট"}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartExam(exam)}
                          className="w-full py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:from-[#0F284E] hover:to-[#A50D26] text-white font-black text-[11px] sm:text-xs transition active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-md"
                        >
                          <FaLock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                          <span>কিনুন (৳{exam.price || 50})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
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
            5. 🏆 SUBJECT LEADERBOARD / মেধা তালিকা
        ───────────────────────────────────────────────────────────── */}
        <section id="subject-leaderboard" className="space-y-4 pt-6 border-t border-slate-200 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1">
                <FaTrophy className="w-3 h-3 text-amber-600" />
                <span>মেধা তালিকা ও র‍্যাঙ্কিং</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>{selectedSubject} — সেরা শিক্ষার্থীদের মেধা তালিকা</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {toBengaliNumber(subjectLeaderboard.length)} জন
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {toBengaliClass(selectedClass)} শ্রেণির {selectedSubject} বিষয়ে মডেল টেস্ট সম্পন্নকারী সেরা শিক্ষার্থীদের র‍্যাঙ্কিং
              </p>
            </div>

            <Link
              href={`/quiz?class=${selectedClass}#leaderboard`}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 shadow-2xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <FaAward className="w-3.5 h-3.5 text-amber-500" />
              <span>সকল বিষয়ের মূল লিডারবোর্ড ➔</span>
            </Link>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {loadingLeaderboard ? (
              <div className="p-8 text-center text-xs text-slate-400 font-bold">
                মেধা তালিকা লোড হচ্ছে...
              </div>
            ) : subjectLeaderboard.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <FaTrophy className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-700">
                  এখনও এই বিষয়ে কোনো ফলাফল জমা পড়েনি
                </h4>
                <p className="text-[11px] text-slate-400">
                  উপরের যেকোনো অধ্যায়ের পরীক্ষা সম্পন্ন করে সবার আগে লিডারবোর্ডে নিজের নাম যুক্ত করুন!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <th className="py-3 px-4 w-16">র‍্যাঙ্ক</th>
                      <th className="py-3 px-4">শিক্ষার্থী</th>
                      <th className="py-3 px-4">মডেল টেস্ট / অধ্যায়</th>
                      <th className="py-3 px-4 text-center">স্কোর</th>
                      <th className="py-3 px-4 text-center">সাফল্য</th>
                      <th className="py-3 px-4 text-center">সময়</th>
                      <th className="py-3 px-4 text-center">মেডেল</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjectLeaderboard.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-black">
                          {idx === 0 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <FaTrophy className="w-3.5 h-3.5 text-amber-500" /> ১
                            </span>
                          ) : idx === 1 ? (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <FaAward className="w-3.5 h-3.5 text-slate-400" /> ২
                            </span>
                          ) : idx === 2 ? (
                            <span className="inline-flex items-center gap-1 text-amber-700">
                              <FaMedal className="w-3.5 h-3.5 text-amber-700" /> ৩
                            </span>
                          ) : (
                            <span className="text-slate-600 pl-1">{toBengaliNumber(idx + 1)}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <FaUserGraduate className="w-3 h-3 text-slate-400" />
                            <span>{item.studentName}</span>
                          </div>
                          {item.rollNumber && (
                            <div className="text-[10px] text-slate-500">
                              রোল: {toBengaliNumber(item.rollNumber)}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 max-w-xs truncate">
                          {item.examTitle || selectedSubject}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-[#C8102E]">
                          {toBengaliNumber(item.score)}/{toBengaliNumber(item.total)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-700">
                          {toBengaliNumber(item.percentage)}%
                        </td>
                        <td className="py-3 px-4 text-center text-slate-500 text-[11px]">
                          {item.timeTakenSeconds ? (
                            <span className="inline-flex items-center gap-1">
                              <FaClock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{formatTime(item.timeTakenSeconds)}</span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.percentage === 100
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : item.percentage >= 80
                                ? "bg-slate-100 text-slate-800 border-slate-300"
                                : item.percentage >= 60
                                ? "bg-orange-50 text-orange-800 border-orange-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                          >
                            <FaAward className="w-2.5 h-2.5" />
                            <span>
                              {item.percentage === 100
                                ? "গোল্ড"
                                : item.percentage >= 80
                                ? "সিলভার"
                                : item.percentage >= 60
                                ? "ব্রোঞ্জ"
                                : "শীর্ষ ১০"}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

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
