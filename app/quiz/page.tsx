"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  RawQuestion,
  SUBJECT_LIST,
  getStoredFreeQuestions,
  getStoredPaidQuestions,
  getStoredSubjectQuestions,
  toBengaliClass,
  toBengaliNumber,
  QuizPrices,
  DEFAULT_QUIZ_PRICES,
  getStoredQuizPrices,
  saveStoredQuizPrices,
  AcademicGroup,
  QuizSubjectItem,
  getSubjectsForClassAndGroup,
  QuizPackageItem,
  DEFAULT_QUIZ_PACKAGES,
  getStoredQuizPackages,
  saveStoredQuizPackages,
  PackageUnlockScope,
  QuizCovers,
  DEFAULT_QUIZ_COVERS,
  getStoredQuizCovers,
  saveStoredQuizCovers,
} from "@/lib/defaultQuizData";
import {
  FaAward,
  FaCircleCheck,
  FaCircleXmark,
  FaGift,
  FaGem,
  FaRotateRight,
  FaCheck,
  FaLock,
  FaKey,
  FaGear,
  FaLayerGroup,
  FaStar,
  FaClock,
  FaFilter,
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaUserGraduate,
  FaLockOpen,
} from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { CustomExam } from "@/lib/quizExamStorage";
import { showConfirmToast } from "@/lib/confirmToast";

interface QuizResultItem {
  id: string;
  name: string;
  classGrade: number;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  medal: string;
  date: string;
}

export default function QuizPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const requireLoginForQuiz = () => {
    toast.error(
      "কুইজ টেস্ট দিতে অনুগ্রহ করে আগে লগইন করুন (ফ্রি ও পেইড উভয় টেস্টের জন্যই লগইন আবশ্যক)",
    );
    router.push("/login?callbackUrl=/quiz");
  };

  // Navigation / Filter States
  const [selectedClass, setSelectedClass] = useState<number>(6);
  const [selectedGroup, setSelectedGroup] = useState<AcademicGroup>("science");
  const [selectedSubject, setSelectedSubject] =
    useState<string>("বাংলা ১ম পত্র");

  const currentSubjects = useMemo(() => {
    try {
      if (typeof getSubjectsForClassAndGroup === "function") {
        const list = getSubjectsForClassAndGroup(selectedClass, selectedGroup);
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch {}
    return [];
  }, [selectedClass, selectedGroup]);

  // Subject Question Summary State (Fetched from API for live badges)
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>(
    {},
  );
  const [isLoadingCounts, setIsLoadingCounts] = useState<boolean>(false);

  // Active Quiz State
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [activeTestTitle, setActiveTestTitle] = useState<string>("");
  const [activeTestSubtitle, setActiveTestSubtitle] = useState<string>("");
  const [activeTestBadge, setActiveTestBadge] = useState<string>("");
  const [activeQuestions, setActiveQuestions] = useState<RawQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Live Timer State (in seconds)
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  // Review Filter after submission: "all" | "wrong" | "correct" | "unanswered"
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "wrong" | "correct" | "unanswered"
  >("all");

  // Student Identity
  const [studentNameInput, setStudentNameInput] = useState<string>("");
  const [studentRollInput, setStudentRollInput] = useState<string>("");

  // Custom Live Exams State
  const [customExams, setCustomExams] = useState<CustomExam[]>([]);
  const [loadingCustomExams, setLoadingCustomExams] = useState<boolean>(false);
  const [activeCustomExamId, setActiveCustomExamId] = useState<string | null>(
    null,
  );
  const [examCodeModalOpen, setExamCodeModalOpen] = useState<boolean>(false);
  const [targetExamForCode, setTargetExamForCode] = useState<CustomExam | null>(
    null,
  );
  const [inputExamCode, setInputExamCode] = useState<string>("");

  // Leaderboard / Result Board State
  const [resultsList, setResultsList] = useState<QuizResultItem[]>([]);

  // Unlocked Paid Tests (persisted in localStorage)
  const [unlockedClasses, setUnlockedClasses] = useState<number[]>([]);

  // Dynamic Quiz Pricing State (SSR safe: defaults match between server and client initially)
  const [quizPrices, setQuizPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [quizPackages, setQuizPackages] = useState<QuizPackageItem[]>(
    DEFAULT_QUIZ_PACKAGES,
  );
  const [quizCovers, setQuizCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);

  // Payment / Unlock Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [paymentTargetClass, setPaymentTargetClass] = useState<number>(6);
  const [paymentPackageName, setPaymentPackageName] =
    useState<string>("Paid Model Test");
  const [paymentAmount, setPaymentAmount] = useState<number>(50);
  const [selectedPackageScope, setSelectedPackageScope] =
    useState<PackageUnlockScope>("single_class");
  const [accessCodeInput, setAccessCodeInput] = useState<string>("");
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState<string>("");

  // Refs for scrolling
  const testAreaRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Hydrate and fetch latest prices and packages safely after mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const cls = params.get("class");
        if (cls) {
          const parsed = parseInt(cls, 10);
          if (parsed >= 5 && parsed <= 10) {
            setSelectedClass(parsed);
          }
        }
      }
    } catch {}

    try {
      const stored = getStoredQuizPrices();
      if (stored) {
        setQuizPrices(stored);
      }
    } catch {}

    try {
      const storedPkgs = getStoredQuizPackages();
      if (storedPkgs && storedPkgs.length > 0) {
        setQuizPackages(storedPkgs);
      }
    } catch {}

    fetch("/api/quiz/prices")
      .then((res) => res.json())
      .then((data) => {
        if (data?.prices) {
          setQuizPrices(data.prices);
          saveStoredQuizPrices(data.prices);
        }
      })
      .catch(() => {});

    fetch("/api/quiz/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data?.packages && Array.isArray(data.packages)) {
          setQuizPackages(data.packages);
          saveStoredQuizPackages(data.packages);
        }
      })
      .catch(() => {});

    try {
      const storedCovers = getStoredQuizCovers();
      if (storedCovers) {
        setQuizCovers(storedCovers);
      }
    } catch {}

    fetch("/api/quiz/covers", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.covers && typeof data.covers === "object") {
          const localCovers = getStoredQuizCovers();
          const mergedCovers: QuizCovers = {
            classes: {
              ...(localCovers?.classes || {}),
              ...(data.covers.classes || {}),
            },
            subjects: {
              ...(localCovers?.subjects || {}),
              ...(data.covers.subjects || {}),
            },
          };
          setQuizCovers(mergedCovers);
          saveStoredQuizCovers(mergedCovers);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch dynamic question counts for the currently selected class
  useEffect(() => {
    setIsLoadingCounts(true);
    fetch(`/api/quiz/questions?classGrade=${selectedClass}&action=summary`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.summary && typeof data.summary === "object") {
          setSubjectCounts(data.summary);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingCounts(false));
  }, [selectedClass]);

  // Fetch active custom exams for the selected class
  useEffect(() => {
    setLoadingCustomExams(true);
    fetch(
      `/api/quiz/custom-exams?classGrade=${selectedClass}&activeOnly=true`,
      {
        cache: "no-store",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.exams)) {
          setCustomExams(data.exams);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCustomExams(false));
  }, [selectedClass]);

  // Fetch live centralized leaderboard submissions
  const loadLiveLeaderboard = () => {
    fetch(`/api/quiz/submissions?classGrade=${selectedClass}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.submissions) && data.submissions.length > 0) {
          const mapped: QuizResultItem[] = data.submissions.map((s: any) => ({
            id: s.id,
            name: s.rollNumber
              ? `${s.studentName} (রোল: ${s.rollNumber})`
              : s.studentName,
            classGrade: s.classGrade,
            subject: s.examTitle || s.subject,
            score: s.score,
            total: s.total,
            percentage: s.percentage,
            medal: s.medal || "⭐ Top 10",
            date: new Date(s.submittedAt).toLocaleDateString("bn-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          }));
          setResultsList(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadLiveLeaderboard();
  }, [selectedClass]);

  // Load persisted results and user-specific unlocked classes on mount
  useEffect(() => {
    try {
      const storedResults = localStorage.getItem("sn_quiz_results");
      if (storedResults) {
        setResultsList(JSON.parse(storedResults));
      }

      const storedName = localStorage.getItem("sn_student_quiz_name");
      if (storedName) {
        setStudentNameInput(storedName);
      }

      const storedRoll = localStorage.getItem("sn_student_quiz_roll");
      if (storedRoll) {
        setStudentRollInput(storedRoll);
      }

      if (session?.user?.id) {
        const userUnlockedKey = `sn_unlocked_classes_${session.user.id}`;
        const storedUnlocked = localStorage.getItem(userUnlockedKey);
        if (storedUnlocked) {
          setUnlockedClasses(JSON.parse(storedUnlocked));
        } else {
          setUnlockedClasses([]);
        }
      } else {
        setUnlockedClasses([]);
      }

      if (session?.user?.name && !storedName) {
        setStudentNameInput(session.user.name);
      }
      if ((session?.user as any)?.rollNumber && !storedRoll) {
        setStudentRollInput(String((session?.user as any)?.rollNumber));
      }

      // Check if URL has #leaderboard and scroll smoothly
      if (
        typeof window !== "undefined" &&
        window.location.hash === "#leaderboard"
      ) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }
    } catch {}
  }, [session?.user?.id, session?.user?.name]);

  // Countdown Timer Effect
  useEffect(() => {
    if (!isTestActive || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          toast(
            "⏰ সময় সমাপ্ত! আপনার পরীক্ষা স্বয়ংক্রিয়ভাবে জমা নেওয়া হয়েছে।",
            {
              icon: "⏱️",
              duration: 5000,
            },
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestActive, isSubmitted, timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Start Free Test for a specific class (5-10) — Strictly Requires Login
  const handleStartFreeClassTest = async (classGrade: number) => {
    if (!session?.user) {
      requireLoginForQuiz();
      return;
    }
    setSelectedClass(classGrade);
    let questions = getStoredFreeQuestions(classGrade);

    try {
      const res = await fetch(
        `/api/quiz/questions?classGrade=${classGrade}&category=free`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          questions = data.questions;
        }
      }
    } catch {}

    let displayQuestions = questions;
    if (questions.length > 25) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      displayQuestions = shuffled.slice(0, 25);
    }

    setActiveQuestions(displayQuestions);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setIsTestActive(true);
    setReviewFilter("all");
    setActiveTestTitle(
      `${toBengaliClass(classGrade)} শ্রেণি — অল-ইন-ওয়ান ফ্রি মডেল টেস্ট`,
    );
    setActiveTestSubtitle(
      "বোর্ড স্ট্যান্ডার্ড সকল বিষয়ের সমন্বয়ে ২৫টি গুরুত্বপূর্ণ MCQ",
    );
    setActiveTestBadge("Free Board Model Test");

    const secs = Math.max(10, Math.min(25, displayQuestions.length)) * 60;
    setTimeLeft(secs);
    setTotalTime(secs);

    scrollTo(testAreaRef);
  };

  // Start or open Paid Test — Strictly Requires Login & Purchase Verification
  const handleOpenPaidClassTest = (classGrade: number) => {
    if (!session?.user) {
      requireLoginForQuiz();
      return;
    }
    setSelectedClass(classGrade);
    const isUnlocked =
      unlockedClasses.includes(classGrade) || session?.user?.role === "ADMIN";

    if (isUnlocked) {
      handleStartPaidAfterUnlock(classGrade);
    } else {
      // Open Payment & Access Code Modal
      setPaymentTargetClass(classGrade);
      setPaymentPackageName(
        `${toBengaliClass(classGrade)} শ্রেণির প্রিমিয়াম মডেল টেস্ট`,
      );
      setPaymentAmount(quizPrices.classPrices[classGrade] || 50);
      setUnlockSuccessMsg("");
      setPaymentModalOpen(true);
    }
  };

  // Start Subject Test — Strictly Requires Login
  const handleStartSubjectTest = async (subjectName: string) => {
    if (!session?.user) {
      requireLoginForQuiz();
      return;
    }
    setSelectedSubject(subjectName);
    let questions = getStoredSubjectQuestions(selectedClass, subjectName);

    try {
      const res = await fetch(
        `/api/quiz/questions?classGrade=${selectedClass}&subject=${encodeURIComponent(
          subjectName,
        )}&category=subject`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          questions = data.questions;
        }
      }
    } catch {}

    const totalBankCount = questions.length;
    let displayQuestions = questions;
    if (questions.length > 30) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      displayQuestions = shuffled.slice(0, 30);
    }

    setActiveQuestions(displayQuestions);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setIsTestActive(true);
    setReviewFilter("all");
    setActiveTestTitle(
      `${toBengaliClass(selectedClass)} শ্রেণি — ${subjectName} বিষয়ভিত্তিক টেস্ট`,
    );
    setActiveTestSubtitle(
      totalBankCount > 30
        ? `মোট ${totalBankCount.toLocaleString("bn-BD")}টি প্রশ্নের ব্যাংক থেকে ৩০টি বাছাইকৃত প্রশ্ন`
        : `মোট ${totalBankCount}টি প্রশ্নের মডেল টেস্ট`,
    );
    setActiveTestBadge(`📖 ${subjectName}`);

    const secs = Math.max(10, Math.min(30, displayQuestions.length)) * 60;
    setTimeLeft(secs);
    setTotalTime(secs);

    scrollTo(testAreaRef);
  };

  // Start Custom Quiz Card Test (Created by Admin)
  const handleStartCustomCardTest = (card: CustomQuizCard) => {
    if (!session?.user) {
      requireLoginForQuiz();
      return;
    }
    setSelectedClass(card.classGrade);
    setSelectedSubject(card.subject);
    const isUnlocked =
      !card.isPaid ||
      unlockedClasses.includes(card.classGrade) ||
      session?.user?.role === "ADMIN";

    if (isUnlocked) {
      let questions = getStoredSubjectQuestions(card.classGrade, card.subject);
      if (questions.length === 0) {
        questions = card.isPaid
          ? getStoredPaidQuestions(card.classGrade)
          : getStoredFreeQuestions(card.classGrade);
      }
      setActiveQuestions(questions);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setIsTestActive(true);
      setReviewFilter("all");
      setActiveTestTitle(card.title);
      setActiveTestSubtitle(
        card.subtitle || `${card.subject} স্পেশাল মডেল টেস্ট`,
      );
      setActiveTestBadge(
        card.badge || (card.isPaid ? "💎 Premium Test" : "Free Test"),
      );

      const secs = Math.max(10, Math.min(30, questions.length)) * 60;
      setTimeLeft(secs);
      setTotalTime(secs);

      scrollTo(testAreaRef);
    } else {
      setPaymentTargetClass(card.classGrade);
      setPaymentPackageName(card.title);
      setPaymentAmount(card.price || 50);
      setUnlockSuccessMsg("");
      setPaymentModalOpen(true);
    }
  };

  // Submit Active Test
  const handleSubmitTest = (isAuto = false) => {
    let score = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.ans) {
        score++;
      }
    });

    const total = activeQuestions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    setQuizScore(score);
    setIsSubmitted(true);
    setReviewFilter("all");

    // Determine Medal
    let medal = "⭐ Top 10";
    if (percentage === 100) medal = "🥇 Gold";
    else if (percentage >= 80) medal = "🥈 Silver";
    else if (percentage >= 60) medal = "🥉 Bronze";

    const finalStudentName =
      studentNameInput.trim() ||
      session?.user?.name ||
      `শিক্ষার্থী #${Math.floor(100 + Math.random() * 900)}`;

    const finalRoll =
      studentRollInput.trim() ||
      (session?.user as any)?.rollNumber ||
      undefined;

    if (studentNameInput.trim()) {
      try {
        localStorage.setItem("sn_student_quiz_name", studentNameInput.trim());
      } catch {}
    }
    if (studentRollInput.trim()) {
      try {
        localStorage.setItem("sn_student_quiz_roll", studentRollInput.trim());
      } catch {}
    }

    const newRecord: QuizResultItem = {
      id: String(Date.now()),
      name: finalRoll
        ? `${finalStudentName} (রোল: ${finalRoll})`
        : finalStudentName,
      classGrade: selectedClass,
      subject: activeTestTitle.split("—")[1]?.trim() || "মডেল টেস্ট",
      score,
      total,
      percentage,
      medal,
      date: new Date().toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [newRecord, ...resultsList].slice(0, 30);
    setResultsList(updated);
    try {
      localStorage.setItem("sn_quiz_results", JSON.stringify(updated));
    } catch {}

    // Save to centralized server API
    fetch("/api/quiz/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: activeCustomExamId || "general_model_test",
        examTitle: activeTestTitle,
        classGrade: selectedClass,
        subject: activeTestTitle.split("—")[1]?.trim() || "মডেল টেস্ট",
        studentName: finalStudentName,
        rollNumber: finalRoll,
        score,
        total,
        timeTakenSeconds: totalTime - timeLeft,
      }),
    })
      .then(() => loadLiveLeaderboard())
      .catch(() => {});

    if (!isAuto) {
      toast.success(`পরীক্ষা জমা দেওয়া হয়েছে! আপনার স্কোর: ${score}/${total}`);
    }
  };

  // Start Custom Exam Created by Admin
  const handleStartCustomExam = (exam: CustomExam) => {
    if (!session?.user) {
      requireLoginForQuiz();
      return;
    }

    if (exam.examCode && exam.examCode.trim()) {
      setTargetExamForCode(exam);
      setInputExamCode("");
      setExamCodeModalOpen(true);
      return;
    }

    launchCustomExam(exam);
  };

  const handleVerifyExamCodeAndStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetExamForCode) return;

    if (
      inputExamCode.trim().toUpperCase() !==
      targetExamForCode.examCode?.trim().toUpperCase()
    ) {
      toast.error("সঠিক অ্যাক্সেস কোড প্রদান করুন।");
      return;
    }

    setExamCodeModalOpen(false);
    launchCustomExam(targetExamForCode);
  };

  const launchCustomExam = async (exam: CustomExam) => {
    const loadingToastId = toast.loading("পরীক্ষার প্রশ্ন লোড হচ্ছে...");
    try {
      const res = await fetch(
        `/api/quiz/custom-exams?id=${encodeURIComponent(exam.id)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      toast.dismiss(loadingToastId);

      if (Array.isArray(data?.questions) && data.questions.length > 0) {
        setActiveCustomExamId(exam.id);
        setActiveQuestions(data.questions);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setIsTestActive(true);
        setReviewFilter("all");
        setActiveTestTitle(exam.title);
        setActiveTestSubtitle(
          exam.subtitle ||
            `${toBengaliClass(exam.classGrade)} শ্রেণি — ${exam.subject} স্পেশাল টেস্ট`,
        );
        setActiveTestBadge(` ${exam.subject}`);

        const secs = (exam.durationMinutes || 20) * 60;
        setTimeLeft(secs);
        setTotalTime(secs);

        scrollTo(testAreaRef);
        toast.success(
          `"${exam.title}" শুরু হয়েছে! সময়: ${exam.durationMinutes} মিনিট`,
        );
      } else {
        toast.error("এই পরীক্ষার জন্য কোনো প্রশ্ন পাওয়া যায়নি।");
      }
    } catch {
      toast.dismiss(loadingToastId);
      toast.error("পরীক্ষা লোড করতে সমস্যা হয়েছে।");
    }
  };

  // Filtered Questions and Stats for Review
  const filteredReviewQuestions = useMemo(() => {
    const mapped = activeQuestions.map((q, idx) => ({
      ...q,
      originalIndex: idx,
    }));
    if (!isSubmitted || reviewFilter === "all") return mapped;
    return mapped.filter((item) => {
      const userSelected = selectedAnswers[item.originalIndex];
      const isAnswered = userSelected !== undefined;
      const isCorrect = isAnswered && userSelected === item.ans;
      if (reviewFilter === "wrong") return isAnswered && !isCorrect;
      if (reviewFilter === "correct") return isCorrect;
      if (reviewFilter === "unanswered") return !isAnswered;
      return true;
    });
  }, [activeQuestions, selectedAnswers, isSubmitted, reviewFilter]);

  const reviewStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    activeQuestions.forEach((q, idx) => {
      const userSelected = selectedAnswers[idx];
      if (userSelected === undefined) {
        unanswered++;
      } else if (userSelected === q.ans) {
        correct++;
      } else {
        wrong++;
      }
    });
    return { correct, wrong, unanswered, total: activeQuestions.length };
  }, [activeQuestions, selectedAnswers]);

  // Unlock paid test with access code or TrxID (scoped strictly to this logged-in user)
  const handleVerifyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      requireLoginForQuiz();
      return;
    }

    const code = accessCodeInput.trim().toUpperCase();

    // Universal promo access codes or valid TrxID (>= 6 chars)
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
      const classesToUnlock =
        selectedPackageScope === "all_classes"
          ? [5, 6, 7, 8, 9, 10]
          : [paymentTargetClass];

      const updated = Array.from(
        new Set([...unlockedClasses, ...classesToUnlock]),
      );
      setUnlockedClasses(updated);
      try {
        if (session?.user?.id) {
          localStorage.setItem(
            `sn_unlocked_classes_${session.user.id}`,
            JSON.stringify(updated),
          );
        }
      } catch {}

      setUnlockSuccessMsg(
        selectedPackageScope === "all_classes"
          ? "🎉 অভিনন্দন! ৫ম থেকে ১০ম সকল শ্রেণির প্রিমিয়াম মডেল টেস্ট সফলভাবে আনলক হয়েছে!"
          : `🎉 অভিনন্দন! ${toBengaliClass(paymentTargetClass)} শ্রেণির প্রিমিয়াম মডেল টেস্ট সফলভাবে আনলক হয়েছে!`,
      );
      setTimeout(() => {
        setPaymentModalOpen(false);
        handleStartPaidAfterUnlock(paymentTargetClass);
      }, 1400);
    } else {
      toast.error(
        "অনুগ্রহ করে সঠিক অ্যাক্সেস কোড অথবা বিকাশ/নগদ/রকেট/উপায় TrxID প্রদান করুন।",
      );
    }
  };

  const handleStartPaidAfterUnlock = async (classGrade: number) => {
    let questions = getStoredPaidQuestions(classGrade);

    try {
      const res = await fetch(
        `/api/quiz/questions?classGrade=${classGrade}&category=paid`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          questions = data.questions;
        }
      }
    } catch {}

    let displayQuestions = questions;
    if (questions.length > 30) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      displayQuestions = shuffled.slice(0, 30);
    }

    setActiveQuestions(displayQuestions);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setIsTestActive(true);
    setReviewFilter("all");
    setActiveTestTitle(
      `${toBengaliClass(classGrade)} শ্রেণি — প্রিমিয়াম মডেল টেস্ট`,
    );
    setActiveTestSubtitle(
      `বোর্ড স্ট্যান্ডার্ড সকল বিষয় থেকে বাছাইকৃত স্পেশাল ৩০টি প্রশ্ন`,
    );
    setActiveTestBadge("💎 Premium Test");

    const secs = Math.max(10, Math.min(30, displayQuestions.length)) * 60;
    setTimeLeft(secs);
    setTotalTime(secs);

    scrollTo(testAreaRef);
  };

  // Clear Leaderboard
  const handleClearResults = () => {
    showConfirmToast({
      title: "লিডারবোর্ড পরিষ্কার করবেন?",
      message: "আপনি কি রেজাল্ট বোর্ডের সকল ফলাফল পরিষ্কার করতে চান?",
      confirmText: "হ্যাঁ, পরিষ্কার করুন",
      cancelText: "বাতিল",
      onConfirm: () => {
        setResultsList([]);
        try {
          localStorage.removeItem("sn_quiz_results");
        } catch {}
        toast.success("রেজাল্ট বোর্ড সফলভাবে পরিষ্কার করা হয়েছে।");
      },
    });
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEADER SECTION (Compact Banner on Mobile)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-4 sm:p-8 lg:p-12 shadow-xl sm:shadow-2xl border border-slate-200/20 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 w-36 h-36 sm:w-64 sm:h-64 bg-[#C8102E]/25 rounded-full blur-2xl sm:blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 w-36 h-36 sm:w-64 sm:h-64 bg-blue-600/20 rounded-full blur-2xl sm:blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold shadow-md">
            <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
            <span>শিক্ষানোভা ডিজিটাল মডেল টেস্ট ২০২৬</span>
          </div>

          <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-tight">
            শিখুন • পরীক্ষা দিন • ফলাফল দেখুন
          </h1>

          <p className="text-[11px] sm:text-sm lg:text-base text-slate-200 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
            ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য অধ্যায়ভিত্তিক ও শ্রেণিভিত্তিক
            অনলাইন MCQ মডেল টেস্ট প্ল্যাটফর্ম। সাথে সাথে ফলাফল, সঠিক উত্তরের
            ব্যাখ্যা ও স্বয়ংক্রিয় লিডারবোর্ড।
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              onClick={() => handleStartFreeClassTest(selectedClass)}
              className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-[11px] sm:text-sm shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 sm:gap-2"
            >
              <FaGift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span>{toBengaliClass(selectedClass)} শ্রেণির Free Test</span>
            </button>

            <button
              onClick={() => scrollTo(resultsRef)}
              className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] sm:text-sm backdrop-blur-md border border-white/20 transition active:scale-95 flex items-center gap-1.5 sm:gap-2"
            >
              <FaAward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>লিডারবোর্ড</span>
            </button>

            {/* Admin Management Link — Visible ONLY if Admin is logged in */}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin?tab=mcqQuiz"
                className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/80 hover:bg-black text-amber-300 hover:text-amber-200 font-bold text-[11px] sm:text-xs border border-amber-400/30 transition flex items-center gap-1.5"
              >
                <FaGear className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>MCQ ম্যানেজমেন্ট</span>
              </Link>
            )}
          </div>

          {/* Student Name & Roll Inputs */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-200 shrink-0">
                আপনার নাম:
              </span>
              <input
                type="text"
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                placeholder="নাম লিখুন"
                className="bg-white/10 border border-white/20 focus:border-[#C8102E] rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-white placeholder-slate-400 outline-none w-36 sm:w-44"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-200 shrink-0">রোল:</span>
              <input
                type="text"
                value={studentRollInput}
                onChange={(e) => setStudentRollInput(e.target.value)}
                placeholder="রোল (ঐচ্ছিক)"
                className="bg-white/10 border border-white/20 focus:border-[#C8102E] rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-white placeholder-slate-400 outline-none w-24 sm:w-28 font-mono"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CLASS SELECTION TABS
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
            শ্রেণি নির্বাচন করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            প্রতিটি ক্লাসের জন্য আলাদা ফ্রি ও প্রিমিয়াম মডেল টেস্ট প্রস্তুত করা
            আছে
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
          {[5, 6, 7, 8, 9, 10].map((cls) => {
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-center transition-all duration-200 group relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-tr from-[#9B0D23] via-[#C8102E] to-[#E5254A] text-white border-transparent shadow-lg shadow-red-600/25 scale-102"
                    : "bg-white hover:bg-red-50/40 text-slate-700 border-slate-200 hover:border-red-200 shadow-xs"
                }`}
              >
                <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🎓</div>
                <div className="font-black text-xs sm:text-base">
                  {toBengaliClass(cls)} শ্রেণি
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${isSelected ? "text-red-100" : "text-slate-400"}`}
                >
                  Model Test
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE TEST PANEL (EXAMINATION AREA)
      ───────────────────────────────────────────────────────────── */}
      <div ref={testAreaRef}>
        {isTestActive && (
          <section className="bg-white rounded-3xl border-2 border-[#C8102E]/30 shadow-2xl p-6 sm:p-10 space-y-6 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-[#C8102E] text-xs font-bold border border-red-200">
                    {activeTestBadge}
                  </span>
                  {activeTestSubtitle && (
                    <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {activeTestSubtitle}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
                  {activeTestTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  মোট প্রশ্ন: {activeQuestions.length}টি • প্রতিটি প্রশ্নের সঠিক
                  উত্তর নির্বাচন করুন
                </p>
              </div>

              {/* Timer & Controls */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                {!isSubmitted && totalTime > 0 && (
                  <div
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border font-mono font-black text-sm shadow-xs transition ${
                      timeLeft <= 180
                        ? "bg-rose-50 text-rose-600 border-rose-300 animate-pulse"
                        : "bg-teal-50 text-teal-800 border-teal-200"
                    }`}
                  >
                    <FaClock
                      className={
                        timeLeft <= 180 ? "text-rose-600" : "text-teal-600"
                      }
                    />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmitted) {
                      showConfirmToast({
                        title: "পরীক্ষা বন্ধ করবেন?",
                        message: "আপনি কি পরীক্ষাটি বন্ধ করতে চান?",
                        confirmText: "হ্যাঁ, বন্ধ করুন",
                        cancelText: "না, চালিয়ে যান",
                        onConfirm: () => {
                          setIsTestActive(false);
                          toast.success("পরীক্ষা বন্ধ করা হয়েছে।");
                        },
                      });
                      return;
                    }
                    setIsTestActive(false);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>
            </div>

            {/* Results Score Banner & Mistakes Filter Bar (Visible after Submission) */}
            {isSubmitted && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A1E3C] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-white/10 px-3 py-0.5 rounded-full">
                      <FaAward /> পরীক্ষার ফলাফল ও মূল্যায়ন
                    </div>
                    <h4 className="text-2xl font-black">
                      আপনার স্কোর: {quizScore} / {activeQuestions.length} (
                      {Math.round((quizScore / activeQuestions.length) * 100)}%)
                    </h4>
                    <p className="text-xs text-slate-300">
                      {quizScore === activeQuestions.length
                        ? "🎉 অসাধারণ! আপনি ১০০% সঠিক উত্তর দিয়ে গোল্ড মেডেল অর্জন করেছেন!"
                        : quizScore >= activeQuestions.length * 0.8
                          ? "👏 খুব চমৎকার ফলাফল! সিলভার মেডেল নিশ্চিত হয়েছে।"
                          : "ভুল উত্তরগুলো ফিল্টার করে সঠিক ব্যাখ্যা পড়ে নিন। পরবর্তী টেস্টের জন্য শুভকামনা!"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnswers({});
                        setIsSubmitted(false);
                        const secs =
                          Math.max(10, Math.min(30, activeQuestions.length)) *
                          60;
                        setTimeLeft(secs);
                        setTotalTime(secs);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <FaRotateRight className="w-3.5 h-3.5" /> পুনরায় পরীক্ষা
                      দিন
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollTo(resultsRef)}
                      className="px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-black shadow-lg transition cursor-pointer"
                    >
                      লিডারবোর্ড দেখুন
                    </button>
                  </div>
                </div>

                {/* Filter Review Questions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100/90 rounded-2xl border border-slate-200">
                  <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <FaFilter className="text-slate-500" />
                    <span>উত্তর পর্যালোচনা ফিল্টার:</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setReviewFilter("all")}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                        reviewFilter === "all"
                          ? "bg-[#0A1E3C] text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      সকল প্রশ্ন ({reviewStats.total})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter("wrong")}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                        reviewFilter === "wrong"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                      }`}
                    >
                      <FaCircleXmark className="w-3 h-3" />
                      <span>ভুল উত্তর ({reviewStats.wrong})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter("correct")}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                        reviewFilter === "correct"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                    >
                      <FaCircleCheck className="w-3 h-3" />
                      <span>সঠিক উত্তর ({reviewStats.correct})</span>
                    </button>
                    {reviewStats.unanswered > 0 && (
                      <button
                        type="button"
                        onClick={() => setReviewFilter("unanswered")}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                          reviewFilter === "unanswered"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                        }`}
                      >
                        উত্তরহীন ({reviewStats.unanswered})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            {filteredReviewQuestions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-200">
                {isSubmitted
                  ? "এই ফিল্টারে কোনো প্রশ্ন নেই! 🎉"
                  : "এই ক্যাটাগরিতে এখনও কোনো প্রশ্ন আপলোড করা হয়নি।"}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviewQuestions.map((item) => {
                  const qIdx = item.originalIndex;
                  const userSelected = selectedAnswers[qIdx];
                  const isAnswered = userSelected !== undefined;
                  const isCorrect = isAnswered && userSelected === item.ans;

                  return (
                    <div
                      key={qIdx}
                      className={`p-5 rounded-2xl border transition-all ${
                        isSubmitted
                          ? isCorrect
                            ? "bg-emerald-50/60 border-emerald-300"
                            : isAnswered
                              ? "bg-rose-50/50 border-rose-300"
                              : "bg-amber-50/40 border-amber-200"
                          : isAnswered
                            ? "bg-slate-50/80 border-[#C8102E]/30"
                            : "bg-slate-50/40 border-slate-200"
                      }`}
                    >
                      {/* Question Title */}
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#0A1E3C] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {item.q}
                        </p>
                      </div>

                      {/* Options (A, B, C, D) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pl-0 sm:pl-8">
                        {item.options.map((optText, opIdx) => {
                          const isChosen = userSelected === opIdx;
                          const isTheCorrectOne =
                            isSubmitted && opIdx === item.ans;
                          const isWrongChoice =
                            isSubmitted && isChosen && !isTheCorrectOne;

                          let optStyles =
                            "bg-white border-slate-200 hover:border-slate-300 text-slate-700";

                          if (!isSubmitted && isChosen) {
                            optStyles =
                              "bg-red-50 border-[#C8102E] text-[#C8102E] font-bold shadow-xs";
                          } else if (isSubmitted) {
                            if (isTheCorrectOne) {
                              optStyles =
                                "bg-emerald-100/80 border-emerald-500 text-emerald-900 font-bold";
                            } else if (isWrongChoice) {
                              optStyles =
                                "bg-rose-100/80 border-rose-500 text-rose-900 font-bold line-through";
                            }
                          }

                          return (
                            <label
                              key={opIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${optStyles}`}
                            >
                              <input
                                type="radio"
                                name={`question_${qIdx}`}
                                value={opIdx}
                                disabled={isSubmitted}
                                checked={isChosen}
                                onChange={() => {
                                  setSelectedAnswers((prev) => ({
                                    ...prev,
                                    [qIdx]: opIdx,
                                  }));
                                }}
                                className="text-[#C8102E] focus:ring-[#C8102E] w-4 h-4 cursor-pointer"
                              />
                              <span className="font-bold uppercase text-slate-400">
                                {String.fromCharCode(65 + opIdx)}.
                              </span>
                              <span className="flex-1">{optText}</span>
                              {isSubmitted && isTheCorrectOne && (
                                <FaCircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {isSubmitted && isWrongChoice && (
                                <FaCircleXmark className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>

                      {/* Explanation Box (Visible after submission) */}
                      {isSubmitted && item.explanation && (
                        <div className="mt-3.5 pl-0 sm:pl-8">
                          <div className="bg-white/90 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 space-y-1">
                            <p className="font-bold text-slate-800">
                              💡 ব্যাখ্যা ও সঠিক উত্তর:
                            </p>
                            <p>{item.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Submit Action Footer (Shown during test) */}
            {activeQuestions.length > 0 && !isSubmitted && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 font-medium">
                    উত্তর দেওয়া হয়েছে:{" "}
                    <span className="font-bold text-[#C8102E]">
                      {Object.keys(selectedAnswers).length}
                    </span>{" "}
                    / {activeQuestions.length} টি
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSubmitTest(false)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-xl transition active:scale-95 cursor-pointer"
                  >
                    পরীক্ষা জমা দিন (Submit Test)
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3.5  LIVE CLASS TESTS & CUSTOM EXAMS (Created by Teacher/Admin)
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-0.5 rounded-full border border-red-200 mb-1">
              <FaClipboardList /> শিক্ষক কর্তৃক নির্ধারিত ক্লাস টেস্ট
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
              {toBengaliClass(selectedClass)} শ্রেণির লাইভ কাস্টম এক্সাম
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              আপনার ব্যাচ বা শ্রেণির জন্য নির্ধারিত সাপ্তাহিক ও মাসিক মূল্যায়ন
              পরীক্ষা
            </p>
          </div>
          {customExams.length > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              🟢 {customExams.length}টি লাইভ এক্সাম চলমান
            </span>
          )}
        </div>

        {loadingCustomExams ? (
          <div className="py-8 text-center text-slate-400 font-bold text-xs">
            লাইভ পরীক্ষার তথ্য লোড হচ্ছে...
          </div>
        ) : customExams.length === 0 ? (
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-dashed border-slate-300 text-center space-y-1.5">
            <div className="text-2xl">📋</div>
            <p className="text-xs font-bold text-slate-600">
              বর্তমানে {toBengaliClass(selectedClass)} শ্রেণির জন্য কোনো কাস্টম
              এক্সাম শিডিউল করা নেই।
            </p>
            <p className="text-[11px] text-slate-400">
              আপনি নিচের বিষয়ভিত্তিক মডেল টেস্ট বা ফ্রি টেস্টে অংশ নিয়ে
              প্রস্তুতি নিতে পারেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customExams.map((exam) => {
              const hasCode = !!(exam.examCode && exam.examCode.trim());
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] border border-blue-200">
                        {exam.subject}
                      </span>
                      {hasCode ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200 flex items-center gap-1">
                          <FaLock className="w-2.5 h-2.5" />
                          <span>কোড প্রয়োজন</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                          <FaLockOpen className="w-2.5 h-2.5" />
                          <span>সবার জন্য উন্মুক্ত</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-800 leading-snug group-hover:text-[#C8102E] transition">
                      {exam.title}
                    </h3>

                    {exam.subtitle && (
                      <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                        {exam.subtitle}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 flex items-center gap-1.5 text-slate-700 font-bold">
                        <FaClock className="w-3 h-3 text-slate-400" />
                        <span>সময়: {exam.durationMinutes} মিনিট</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 flex items-center gap-1.5 text-slate-700 font-bold">
                        <FaBookOpen className="w-3 h-3 text-slate-400" />
                        <span>প্রশ্ন: {exam.questionCount}টি</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartCustomExam(exam)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:from-[#122A54] hover:to-[#A50D26] text-white font-black text-xs shadow-md transition transform active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>টেস্টে অংশ নিন</span>
                    {hasCode ? <FaLock className="w-3 h-3" /> : <span>➔</span>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3.9 🌟 DYNAMIC CUSTOM MCQ & MODEL TEST CARDS (Added by Admin)
      ───────────────────────────────────────────────────────────── */}
      {customCards.filter((c) => c.isActive).length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200 mb-1">
                <FaStar className="text-amber-500" /> স্পেশাল মডেল টেস্ট কার্ড
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
                🌟 বিশেষ কুইজ ও মডেল টেস্ট কার্ড
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                অ্যাডমিন কর্তৃক প্রকাশিত প্রতিটি বিষয়ের আলাদা কভারযুক্ত স্পেশাল
                মডেল টেস্ট
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              মোট {customCards.filter((c) => c.isActive).length}টি কার্ড সক্রিয়
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customCards
              .filter((c) => c.isActive)
              .map((card) => {
                const isUnlocked =
                  !card.isPaid ||
                  unlockedClasses.includes(card.classGrade) ||
                  session?.user?.role === "ADMIN";

                return (
                  <div
                    key={card.id}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-300 shadow-sm hover:shadow-lg space-y-3.5 flex flex-col justify-between ${
                      card.isPaid
                        ? "border-t-4 border-t-[#C8102E] border-slate-200"
                        : "border-t-4 border-t-emerald-500 border-slate-200"
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Individual Cover Image */}
                      {card.coverImage ? (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 relative group shadow-xs">
                          <img
                            src={card.coverImage}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50/50 border border-dashed border-slate-300 flex items-center justify-center">
                          <span className="text-3xl">📖</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              card.isPaid
                                ? "bg-red-50 text-[#C8102E] border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {card.badge ||
                              (card.isPaid ? "পেইড টেস্ট" : "ফ্রি টেস্ট")}
                          </span>
                          <span className="text-xs font-black text-slate-500">
                            {toBengaliClass(card.classGrade)} শ্রেণি
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-800 line-clamp-2">
                          {card.title}
                        </h3>

                        {card.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {card.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">
                          {card.subject}
                        </span>
                        <span
                          className={`font-black ${
                            card.isPaid
                              ? "text-[#C8102E]"
                              : "text-emerald-700 font-bold"
                          }`}
                        >
                          {card.isPaid ? `৳${card.price}` : "১০০% ফ্রি"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartCustomCardTest(card)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer ${
                        !card.isPaid || isUnlocked
                          ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white"
                          : "bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:from-[#0F284E] hover:to-[#A50D26] text-white"
                      }`}
                    >
                      {!card.isPaid || isUnlocked ? (
                        <>
                          <FaCheck className="w-3.5 h-3.5" />
                          <span>টেস্ট দিন</span>
                        </>
                      ) : (
                        <>
                          <FaLock className="w-3.5 h-3.5" />
                          <span>টেস্ট কিনুন (৳{card.price})</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. SUBJECT-WISE MODEL TESTS
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
              {toBengaliClass(selectedClass)} শ্রেণির বিষয় নির্বাচন করুন
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {selectedClass >= 9
                ? "বিজ্ঞান, মানবিক, ব্যবসায় শিক্ষা ও আবশ্যিক বিষয়ের ওপর মডেল টেস্ট"
                : "যেকোনো বিষয়ের ওপর মডেল টেস্ট অনুশীলন করুন"}
            </p>
          </div>

          {/* Quick Class Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {[5, 6, 7, 8, 9, 10].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                  selectedClass === cls
                    ? "bg-[#C8102E] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {toBengaliClass(cls)}
              </button>
            ))}
          </div>
        </div>

        {/* Academic Group Selector for Class 9-10 */}
        {(selectedClass === 9 || selectedClass === 10) && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-black text-slate-800 flex items-center gap-1.5">
                <span>বিভাগ নির্বাচন করুন:</span>
                <span className="text-[10px] bg-red-50 text-[#C8102E] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  {toBengaliClass(selectedClass)} শ্রেণি
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                আপনার বিভাগের বিষয়গুলোতে ক্লিক করে স্পেশাল মডেল টেস্ট দিন
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedGroup("science")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                  selectedGroup === "science"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-200 border-slate-200"
                }`}
              >
                <span>⚛️</span>
                <span>বিজ্ঞান বিভাগ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGroup("humanities")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                  selectedGroup === "humanities"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-amber-50 hover:border-amber-200 border-slate-200"
                }`}
              >
                <span>📜</span>
                <span>মানবিক বিভাগ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGroup("commerce")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                  selectedGroup === "commerce"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200"
                }`}
              >
                <span>💼</span>
                <span>ব্যবসায় শিক্ষা</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGroup("compulsory")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                  selectedGroup === "compulsory"
                    ? "bg-[#0A1E3C] text-white border-[#0A1E3C] shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 border-slate-200"
                }`}
              >
                <span>🌐</span>
                <span>আবশ্যিক বিষয়</span>
              </button>
            </div>
          </div>
        )}

        {/* Subjects Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {currentSubjects.map((sub) => {
            const count = subjectCounts[sub.name] || 0;
            const subjectUrl = `/quiz/subject?class=${selectedClass}&subject=${encodeURIComponent(
              sub.name,
            )}`;

            return (
              <Link
                key={sub.name}
                href={subjectUrl}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-[#C8102E]/40 shadow-xs hover:shadow-md transition text-center space-y-2.5 group flex flex-col justify-between cursor-pointer"
              >
                {/* Optional Subject Cover Image or Icon */}
                {quizCovers.subjects[sub.name] ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-1 relative">
                    <img
                      src={quizCovers.subjects[sub.name]}
                      alt={sub.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="text-3xl transition-transform group-hover:scale-110">
                    {sub.icon}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1 group-hover:text-[#C8102E] transition-colors">
                    {sub.name}
                  </h4>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {count > 0 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        {count.toLocaleString("bn-BD")}টি MCQ
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        মডেল টেস্ট প্রস্তুত
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full py-2 rounded-xl bg-slate-100 group-hover:bg-[#C8102E] text-slate-700 group-hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5">
                  <FaBookOpen className="w-3 h-3" />
                  <span>মডেল টেস্টসমূহ দেখুন ➔</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SPECIAL PACKAGES & PRICING
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] bg-red-50 px-3 py-0.5 rounded-full border border-red-200 mb-1">
            <FaGem /> বিশেষ অফার ও প্যাকেজ
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
            স্পেশাল মডেল টেস্ট প্যাকেজ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            বিকাশ, নগদ, রকেট বা উপায় পেমেন্ট করে যেকোনো আকর্ষণীয় প্যাকেজ আনলক
            করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {quizPackages
            .filter((pkg) => pkg.isActive)
            .map((pkg) => {
              const isPopular = pkg.isPopular;
              const discountPct =
                pkg.originalPrice && pkg.originalPrice > pkg.price
                  ? Math.round(
                      ((pkg.originalPrice - pkg.price) / pkg.originalPrice) *
                        100,
                    )
                  : null;

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl p-6 transition-all duration-300 space-y-4 relative flex flex-col justify-between ${
                    isPopular
                      ? "border-2 border-[#C8102E] shadow-xl md:-translate-y-1.5"
                      : "border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-300"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#9B0D23] to-[#C8102E] text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-2xl shadow-xs">
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
                      <h3 className="text-lg font-black text-slate-900">
                        {pkg.title}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#C8102E]">
                        ৳{pkg.price}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-sm font-bold text-slate-400 line-through">
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

                    <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-black shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentPackageName(pkg.title);
                        setPaymentAmount(pkg.price);
                        setSelectedPackageScope(pkg.unlockScope);
                        setPaymentTargetClass(selectedClass);
                        setUnlockSuccessMsg("");
                        setPaymentModalOpen(true);
                      }}
                      className={`w-full py-3 rounded-2xl font-black text-xs transition active:scale-98 cursor-pointer ${
                        isPopular
                          ? "bg-gradient-to-r from-[#9B0D23] via-[#C8102E] to-[#E5254A] text-white shadow-lg shadow-red-600/30 hover:opacity-95"
                          : "bg-slate-900 hover:bg-black text-white"
                      }`}
                    >
                      প্যাকেজ কিনুন
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. 🏆 RESULT BOARD / LEADERBOARD SECTION
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={resultsRef}
        id="leaderboard"
        className="space-y-5 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200 mb-1">
              <FaAward /> মেধা তালিকা ও র‍্যাঙ্কিং
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1E3C]">
              Result Board (লিডারবোর্ড)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              সাম্প্রতিক পরীক্ষার ফলাফল ও সেরা শিক্ষার্থীদের মেডেল তালিকা
            </p>
          </div>

          {resultsList.length > 0 && (
            <button
              type="button"
              onClick={handleClearResults}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline"
            >
              ফলাফল পরিষ্কার করুন
            </button>
          )}
        </div>

        {/* 4 Medals Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div className="text-2xl">🥇</div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Gold Rank
            </h4>
            <p className="text-[10px] text-slate-500">১ম স্থান (১০০% স্কোর)</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div className="text-2xl">🥈</div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Silver Rank
            </h4>
            <p className="text-[10px] text-slate-500">২য় স্থান (৮০%+ স্কোর)</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div className="text-2xl">🥉</div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Bronze Rank
            </h4>
            <p className="text-[10px] text-slate-500">৩য় স্থান (৬০%+ স্কোর)</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div className="text-2xl">⭐</div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Top 10
            </h4>
            <p className="text-[10px] text-slate-500">সেরা অংশগ্রহণকারী</p>
          </div>
        </div>

        {/* Result Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <th className="py-3 px-4 w-14">Rank</th>
                  <th className="py-3 px-4">শিক্ষার্থী</th>
                  <th className="py-3 px-4">ক্লাস</th>
                  <th className="py-3 px-4">বিষয়/টেস্ট</th>
                  <th className="py-3 px-4 text-center">স্কোর</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4">মেডেল</th>
                  <th className="py-3 px-4">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resultsList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-slate-400 font-medium"
                    >
                      এখনও কোনো ফলাফল জমা পড়েনি। উপরে টেস্ট দিয়ে সবার আগে
                      লিডারবোর্ডে যুক্ত হোন!
                    </td>
                  </tr>
                ) : (
                  resultsList.map((res, i) => (
                    <tr
                      key={res.id || i}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="py-3 px-4 font-black text-slate-800">
                        {i === 0
                          ? "👑 ১"
                          : i === 1
                            ? "🥈 ২"
                            : i === 2
                              ? "🥉 ৩"
                              : i + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {res.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {toBengaliClass(res.classGrade)} শ্রেণি
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {res.subject}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-[#C8102E]">
                        {res.score}/{res.total}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        {res.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {res.medal}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {res.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. PAYMENT & ACCESS CODE MODAL
      ───────────────────────────────────────────────────────────── */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-[#C8102E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  পেমেন্ট ও আনলক
                </span>
                <h3 className="text-base font-black text-slate-800">
                  {paymentPackageName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* MFS Direct Send Money Card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  বিকাশ / নগদ / রকেট / উপায় পার্সোনাল নম্বর:
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="bg-white px-1 py-0.5 rounded border border-slate-200 shadow-xs flex items-center">
                    <img
                      src="/assets/images/bkash.png"
                      alt="bKash"
                      className="h-3.5 w-auto object-contain"
                    />
                  </div>
                  <div className="bg-white px-1 py-0.5 rounded border border-slate-200 shadow-xs flex items-center">
                    <img
                      src="/assets/images/nagad.png"
                      alt="Nagad"
                      className="h-3.5 w-auto object-contain"
                    />
                  </div>
                  <div className="bg-white px-1 py-0.5 rounded border border-slate-200 shadow-xs flex items-center">
                    <img
                      src="/assets/images/rocket.png"
                      alt="Rocket"
                      className="h-3.5 w-auto object-contain"
                    />
                  </div>
                  <div className="bg-white px-1 py-0.5 rounded border border-slate-200 shadow-xs flex items-center">
                    <img
                      src="/assets/images/upay.png"
                      alt="Upay"
                      className="h-3.5 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="font-mono font-black text-base text-[#0F2C59] tracking-wider">
                  01712592519
                </span>
                <span className="text-xs font-black text-[#C8102E] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  নির্ধারিত ফি: ৳{paymentAmount}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                যেকোনো মাধ্যম থেকে Send Money করে পাওয়া TrxID অথবা অ্যাডমিন
                অ্যাক্সেস কোড নিচে লিখুন।
              </p>
            </div>

            {/* Scope / Class Target Selection */}
            {selectedPackageScope === "all_classes" ? (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-3 rounded-xl text-xs text-purple-900 font-bold flex items-center gap-2">
                <span className="text-base">🌟</span>
                <span>
                  এই অল-ইন-ওয়ান প্যাকেজটি কিনলে ৫ম থেকে ১০ম সকল শ্রেণির সব মডেল
                  টেস্ট সম্পূর্ণ আনলক হবে!
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">
                    কোন শ্রেণির জন্য আনলক করতে চান?
                  </label>
                  <span className="font-black text-[#C8102E]">
                    {toBengaliClass(paymentTargetClass)} শ্রেণি
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[5, 6, 7, 8, 9, 10].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setPaymentTargetClass(cls)}
                      className={`py-1.5 rounded-xl text-xs font-black transition border ${
                        paymentTargetClass === cls
                          ? "bg-[#C8102E] text-white border-[#C8102E] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {toBengaliClass(cls)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleVerifyUnlock} className="space-y-3">
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
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none font-mono"
                  />
                  <FaKey className="absolute right-3.5 top-3 text-slate-400 w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 ডেমো অ্যাক্সেস কোড:{" "}
                  <code className="font-bold text-[#C8102E]">NOVA50</code> বা{" "}
                  <code className="font-bold text-[#C8102E]">SHIKKHA2026</code>
                </p>
              </div>

              {unlockSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {unlockSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-lg transition active:scale-98"
              >
                🔓 টেস্ট আনলক করুন
              </button>
            </form>

            {/* Helpline Link */}
            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 flex items-center justify-center gap-1.5">
              <span>যেকোনো প্রয়োজনে কল করুন:</span>
              <a
                href="tel:01712592519"
                className="font-bold text-[#C8102E] hover:underline"
              >
                ০১৭১২৫৯২৫১৯
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Exam Code Access Modal */}
      {examCodeModalOpen && targetExamForCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-sm font-black text-slate-800">
                🔒 অ্যাক্সেস কোড প্রয়োজন
              </h4>
              <button
                type="button"
                onClick={() => setExamCodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">
                "{targetExamForCode.title}"
              </span>{" "}
              পরীক্ষায় অংশগ্রহণের জন্য আপনার শিক্ষকের দেওয়া এক্সাম কোডটি লিখুন:
            </p>

            <form onSubmit={handleVerifyExamCodeAndStart} className="space-y-3">
              <input
                type="text"
                value={inputExamCode}
                onChange={(e) => setInputExamCode(e.target.value.toUpperCase())}
                placeholder="যেমন: MATH26"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-center font-mono font-black text-sm tracking-wider uppercase text-slate-800 outline-none"
                autoFocus
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExamCodeModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs shadow-md transition"
                >
                  শুরু করুন ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
