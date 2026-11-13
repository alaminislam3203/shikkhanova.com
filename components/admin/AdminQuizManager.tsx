"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  RawQuestion,
  SUBJECT_LIST,
  toBengaliClass,
  getStoredFreeQuestions,
  saveStoredFreeQuestions,
  getStoredPaidQuestions,
  saveStoredPaidQuestions,
  getStoredSubjectQuestions,
  saveStoredSubjectQuestions,
  FREE_CLASS_QUESTIONS,
  PAID_CLASS_QUESTIONS,
  SUBJECT_QUESTIONS,
  QuizPrices,
  DEFAULT_QUIZ_PRICES,
  getStoredQuizPrices,
  saveStoredQuizPrices,
  AcademicGroup,
  QuizSubjectItem,
  getSubjectsForClassAndGroup,
  JUNIOR_SUBJECTS_5_8,
  SCIENCE_SUBJECTS_9_10,
  HUMANITIES_SUBJECTS_9_10,
  COMMERCE_SUBJECTS_9_10,
  COMPULSORY_SUBJECTS_9_10,
  QuizPackageItem,
  DEFAULT_QUIZ_PACKAGES,
  getStoredQuizPackages,
  saveStoredQuizPackages,
  PackageUnlockScope,
  QuizCovers,
  DEFAULT_QUIZ_COVERS,
  getStoredQuizCovers,
  saveStoredQuizCovers,
  CustomQuizCard,
  DEFAULT_CUSTOM_QUIZ_CARDS,
  getStoredCustomQuizCards,
  saveStoredCustomQuizCards,
} from "@/lib/defaultQuizData";
import {
  FaPlus,
  FaTrash,
  FaPen,
  FaFileLines,
  FaGift,
  FaGem,
  FaBookOpen,
  FaCircleCheck,
  FaArrowUpRightFromSquare,
  FaRotateLeft,
  FaCheck,
  FaXmark,
  FaCircleInfo,
  FaCoins,
  FaFloppyDisk,
  FaTag,
  FaImage,
  FaCloudArrowUp,
  FaLayerGroup,
  FaDownload,
  FaAward,
  FaClipboardList,
} from "react-icons/fa6";
import AdminCustomExamsTab from "./AdminCustomExamsTab";
import AdminQuizResultsTab from "./AdminQuizResultsTab";

type QuizCategory = "free" | "paid" | "subject";

export default function AdminQuizManager() {
  const [category, setCategory] = useState<QuizCategory>("free");
  const [selectedClass, setSelectedClass] = useState<number>(6);
  const [selectedGroup, setSelectedGroup] = useState<AcademicGroup>("science");
  const [selectedSubject, setSelectedSubject] =
    useState<string>("বাংলা ১ম পত্র");

  const availableSubjects = useMemo(() => {
    try {
      if (typeof getSubjectsForClassAndGroup === "function") {
        const list = getSubjectsForClassAndGroup(selectedClass, selectedGroup);
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch {}

    // Safe inline resolver fallback
    if (selectedClass <= 8) {
      if (selectedClass === 5) {
        return [
          { name: "বাংলা", icon: "📖", color: "from-rose-500 to-red-600" },
          { name: "ইংরেজি", icon: "🔤", color: "from-blue-500 to-indigo-600" },
          {
            name: "প্রাথমিক গণিত",
            icon: "➗",
            color: "from-emerald-500 to-teal-600",
          },
          {
            name: "প্রাথমিক বিজ্ঞান",
            icon: "🔬",
            color: "from-purple-500 to-violet-600",
          },
          {
            name: "বাংলাদেশ ও বিশ্বপরিচয়",
            icon: "🌍",
            color: "from-amber-500 to-orange-600",
          },
          {
            name: "ইসলাম ও নৈতিক শিক্ষা",
            icon: "🕌",
            color: "from-emerald-600 to-green-700",
          },
          {
            name: "হিন্দুধর্ম ও নৈতিক শিক্ষা",
            icon: "🛕",
            color: "from-amber-600 to-orange-700",
          },
        ];
      }
      return JUNIOR_SUBJECTS_5_8 || [];
    }

    if (selectedGroup === "science") return SCIENCE_SUBJECTS_9_10 || [];
    if (selectedGroup === "humanities") return HUMANITIES_SUBJECTS_9_10 || [];
    if (selectedGroup === "commerce") return COMMERCE_SUBJECTS_9_10 || [];
    return COMPULSORY_SUBJECTS_9_10 || [];
  }, [selectedClass, selectedGroup]);

  // Keep selectedSubject in sync with available subjects
  useEffect(() => {
    if (
      availableSubjects.length > 0 &&
      !availableSubjects.some((s) => s.name === selectedSubject)
    ) {
      setSelectedSubject(availableSubjects[0].name);
    }
  }, [availableSubjects, selectedSubject]);

  const [activeTab, setActiveTab] = useState<
    | "list"
    | "add"
    | "bulk"
    | "prices"
    | "covers"
    | "cards"
    | "import-json"
    | "custom-exams"
    | "results"
  >("list");
  const [selectedResultExamId, setSelectedResultExamId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<RawQuestion[]>([]);

  // JSON Auto-Import State
  const [jsonImportFile, setJsonImportFile] = useState<File | null>(null);
  const [rawParsedJson, setRawParsedJson] = useState<any>(null);
  const [importScope, setImportScope] = useState<"all" | "single">("all");
  const [importTargetClass, setImportTargetClass] = useState<number>(6);
  const [importTargetSubject, setImportTargetSubject] =
    useState<string>("বাংলা ১ম পত্র");
  const [jsonImportPreview, setJsonImportPreview] = useState<{
    totalQuestions: number;
    subjects: {
      key: string;
      name: string;
      icon: string;
      count: number;
      testsCount: number;
      questions: RawQuestion[];
    }[];
  } | null>(null);
  const [isImportingJson, setIsImportingJson] = useState<boolean>(false);

  // Available subjects for the selected target class in JSON import
  const importAvailableSubjects = useMemo(() => {
    try {
      const subs = getSubjectsForClassAndGroup(importTargetClass, "all");
      if (Array.isArray(subs) && subs.length > 0) return subs;
    } catch {}
    return JUNIOR_SUBJECTS_5_8 || [];
  }, [importTargetClass]);

  // Keep importTargetSubject valid when target class changes
  useEffect(() => {
    if (
      importAvailableSubjects.length > 0 &&
      !importAvailableSubjects.some((s) => s.name === importTargetSubject)
    ) {
      setImportTargetSubject(importAvailableSubjects[0].name);
    }
  }, [importAvailableSubjects, importTargetSubject]);

  // Quiz Pricing & Special Packages Management State (SSR safe)
  const [prices, setPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [packages, setPackages] = useState<QuizPackageItem[]>(
    DEFAULT_QUIZ_PACKAGES,
  );
  const [covers, setCovers] = useState<QuizCovers>(DEFAULT_QUIZ_COVERS);
  const [customCards, setCustomCards] = useState<CustomQuizCard[]>(
    DEFAULT_CUSTOM_QUIZ_CARDS,
  );
  const [isSavingPrices, setIsSavingPrices] = useState<boolean>(false);
  const [isSavingCovers, setIsSavingCovers] = useState<boolean>(false);
  const [isSavingCards, setIsSavingCards] = useState<boolean>(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Add / Edit Form State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formQ, setFormQ] = useState<string>("");
  const [formA, setFormA] = useState<string>("");
  const [formB, setFormB] = useState<string>("");
  const [formC, setFormC] = useState<string>("");
  const [formD, setFormD] = useState<string>("");
  const [formAns, setFormAns] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState<string>("");

  // Bulk State
  const [bulkText, setBulkText] = useState<string>("");

  // Notification message
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Load quiz prices and packages safely after mount
  useEffect(() => {
    try {
      const stored = getStoredQuizPrices();
      if (stored) {
        setPrices(stored);
      }
    } catch {}

    try {
      const storedPkgs = getStoredQuizPackages();
      if (storedPkgs && storedPkgs.length > 0) {
        setPackages(storedPkgs);
      }
    } catch {}

    fetch("/api/quiz/prices")
      .then((res) => res.json())
      .then((data) => {
        if (data?.prices) {
          setPrices(data.prices);
          saveStoredQuizPrices(data.prices);
        }
      })
      .catch(() => {});

    fetch("/api/quiz/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data?.packages && Array.isArray(data.packages)) {
          setPackages(data.packages);
          saveStoredQuizPackages(data.packages);
        }
      })
      .catch(() => {});

    try {
      const storedCovers = getStoredQuizCovers();
      if (storedCovers) {
        setCovers(storedCovers);
      }
    } catch {}

    fetch("/api/quiz/covers", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.covers && typeof data.covers === "object") {
          const serverHasCovers =
            (data.covers.classes &&
              Object.keys(data.covers.classes).length > 0) ||
            (data.covers.subjects &&
              Object.keys(data.covers.subjects).length > 0);

          if (serverHasCovers) {
            setCovers(data.covers);
            saveStoredQuizCovers(data.covers);
          } else {
            // If server file is empty, check if localStorage has covers and push to server
            const localCovers = getStoredQuizCovers();
            const localHasCovers =
              (localCovers?.classes &&
                Object.keys(localCovers.classes).length > 0) ||
              (localCovers?.subjects &&
                Object.keys(localCovers.subjects).length > 0);

            if (localHasCovers) {
              setCovers(localCovers);
              fetch("/api/quiz/covers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ covers: localCovers }),
              }).catch(() => {});
            } else {
              setCovers(data.covers);
            }
          }
        }
      })
      .catch(() => {});

    try {
      const storedCards = getStoredCustomQuizCards();
      if (storedCards && storedCards.length > 0) {
        setCustomCards(storedCards);
      }
    } catch {}

    fetch("/api/quiz/cards", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.cards && Array.isArray(data.cards)) {
          setCustomCards(data.cards);
          saveStoredCustomQuizCards(data.cards);
        }
      })
      .catch(() => {});
  }, []);

  // Save Quiz Prices & Special Packages Handler with Instant Toast Feedback
  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrices(true);
    const saveToastId = toast.loading(
      "সব মূল্য ও প্যাকেজ সংরক্ষণ করা হচ্ছে...",
    );
    try {
      const [resPrices, resPackages, resCovers] = await Promise.all([
        fetch("/api/quiz/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prices),
        }),
        fetch("/api/quiz/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packages }),
        }),
        fetch("/api/quiz/covers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ covers }),
        }),
      ]);

      const dataPrices = await resPrices.json();
      const dataPackages = await resPackages.json();

      if (resPrices.ok && resPackages.ok) {
        saveStoredQuizPrices(prices);
        saveStoredQuizPackages(packages);
        saveStoredQuizCovers(covers);
        toast.success(
          dataPackages.message ||
            "কুইজ ও স্পেশাল প্যাকেজ সফলভাবে সংরক্ষিত হয়েছে!",
          {
            id: saveToastId,
            duration: 4000,
          },
        );
        setMsg({
          text: "কুইজের মূল্য ও স্পেশাল মডেল টেস্ট প্যাকেজ সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!",
          type: "success",
        });
      } else {
        toast.error(
          dataPrices.error ||
            dataPackages.error ||
            "মূল্য বা প্যাকেজ সংরক্ষণ ব্যর্থ হয়েছে।",
          {
            id: saveToastId,
          },
        );
        setMsg({
          text:
            dataPrices.error || dataPackages.error || "সংরক্ষণ ব্যর্থ হয়েছে।",
          type: "error",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।", {
        id: saveToastId,
      });
      setMsg({
        text: err.message || "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।",
        type: "error",
      });
    } finally {
      setIsSavingPrices(false);
    }
  };

  // Reset Prices to Defaults with Toast
  const handleResetPricesToDefault = () => {
    if (
      !confirm(
        "আপনি কি সকল কুইজ ও প্যাকেজের মূল্য মূল ডিফল্ট ফি-তে ফিরিয়ে নিতে চান?",
      )
    )
      return;
    setPrices(DEFAULT_QUIZ_PRICES);
    saveStoredQuizPrices(DEFAULT_QUIZ_PRICES);
    toast.success(
      'কুইজের মূল্য ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে। সংরক্ষণ করতে "সব মূল্য সংরক্ষণ করুন" বাটনে ক্লিক করুন।',
      {
        duration: 4000,
      },
    );
    setMsg({
      text: '🔄 কুইজের মূল্য ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে। সংরক্ষণ করতে "সব মূল্য সংরক্ষণ করুন" বাটনে ক্লিক করুন।',
      type: "success",
    });
  };

  // Package Management Handlers
  const handleAddNewPackage = () => {
    const newPkg: QuizPackageItem = {
      id: `pkg_${Date.now()}`,
      title: "নতুন স্পেশাল প্যাকেজ",
      badge: "স্পেশাল অফার",
      tagline: "মডেল টেস্ট ও পূর্ণাঙ্গ সমাধানের বিশেষ অফার।",
      price: 100,
      originalPrice: 180,
      features: [
        "পূর্ণাঙ্গ মডেল টেস্ট অ্যাক্সেস",
        "তাৎক্ষণিক স্কোর ও গ্রেড শিট",
        "ব্যাখ্যাসহ প্রতিটি প্রশ্নের সঠিক উত্তর",
      ],
      unlockScope: "single_class",
      isPopular: false,
      isActive: true,
      accentColor: "red",
    };
    setPackages((prev) => [...prev, newPkg]);
    toast.success(
      "নতুন প্যাকেজ কার্ড যুক্ত করা হয়েছে! তথ্য পূরণ করে সংরক্ষণ বাটনে ক্লিক করুন।",
    );
  };

  const handleUpdatePackage = (
    id: string,
    updates: Partial<QuizPackageItem>,
  ) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg)),
    );
  };

  const handleDeletePackage = (id: string) => {
    if (!confirm("আপনি কি এই প্যাকেজটি মুছে ফেলতে চান?")) return;
    setPackages((prev) => prev.filter((p) => p.id !== id));
    toast.success("প্যাকেজটি তালিকা থেকে মুছে ফেলা হয়েছে।");
  };

  const handleResetPackagesToDefault = () => {
    if (
      !confirm(
        "আপনি কি স্পেশাল মডেল টেস্ট প্যাকেজসমূহ মূল ডিফল্ট তালিকায় ফিরিয়ে নিতে চান?",
      )
    )
      return;
    setPackages(DEFAULT_QUIZ_PACKAGES);
    saveStoredQuizPackages(DEFAULT_QUIZ_PACKAGES);
    toast.success("প্যাকেজসমূহ ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে।");
  };

  // 🖼️ Cover Image Handlers
  const handleCoverUpload = async (
    key: string,
    file: File,
    type: "classes" | "subjects",
  ) => {
    if (!file) return;
    setUploadingTarget(`${type}_${key}`);
    const uploadToastId = toast.loading("কভার ছবি আপলোড হচ্ছে...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const nextCovers: QuizCovers = {
          ...covers,
          [type]: {
            ...covers[type],
            [key]: data.url,
          },
        };
        setCovers(nextCovers);
        saveStoredQuizCovers(nextCovers);

        // Auto-save to server immediately upon successful Cloudinary upload
        try {
          const saveRes = await fetch("/api/quiz/covers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ covers: nextCovers }),
          });
          if (saveRes.ok) {
            toast.success(
              "কভার ছবি ক্লাউডে সফলভাবে আপলোড ও স্থায়ীভাবে সংরক্ষণ করা হয়েছে!",
              {
                id: uploadToastId,
                duration: 4000,
              },
            );
            setMsg({
              text: "কভার ছবি সফলভাবে আপলোড ও সেভ করা হয়েছে!",
              type: "success",
            });
          } else {
            toast.success("ছবি আপলোড হয়েছে এবং ব্রাউজারে সংরক্ষিত হয়েছে!", {
              id: uploadToastId,
              duration: 4000,
            });
          }
        } catch {
          toast.success("ছবি আপলোড হয়েছে এবং ব্রাউজারে সংরক্ষিত হয়েছে!", {
            id: uploadToastId,
            duration: 4000,
          });
        }
      } else {
        toast.error(data.error || "ছবি আপলোড ব্যর্থ হয়েছে।", {
          id: uploadToastId,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "আপলোডে সমস্যা হয়েছে।", { id: uploadToastId });
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleRemoveCover = async (
    key: string,
    type: "classes" | "subjects",
  ) => {
    const nextType = { ...covers[type] };
    delete nextType[key];
    const nextCovers: QuizCovers = {
      ...covers,
      [type]: nextType,
    };
    setCovers(nextCovers);
    saveStoredQuizCovers(nextCovers);

    try {
      await fetch("/api/quiz/covers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ covers: nextCovers }),
      });
      toast.success("কভার ইমেজ সফলভাবে রিমুভ ও স্থায়ীভাবে আপডেট করা হয়েছে!");
    } catch {
      toast.success("কভার ইমেজ ব্রাউজার থেকে রিমুভ হয়েছে।");
    }
  };

  const handleSaveCovers = async (customCovers?: QuizCovers | any) => {
    // Guard against React SyntheticEvent / MouseEvent being passed from onClick
    const isRealCovers =
      customCovers &&
      typeof customCovers === "object" &&
      !("nativeEvent" in customCovers) &&
      !("target" in customCovers) &&
      ("classes" in customCovers || "subjects" in customCovers);

    const payload: QuizCovers = isRealCovers ? customCovers : covers;
    setIsSavingCovers(true);
    const saveToastId = toast.loading("কভার ইমেজ সংরক্ষণ ও আপডেট করা হচ্ছে...");
    try {
      saveStoredQuizCovers(payload);
      const res = await fetch("/api/quiz/covers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ covers: payload }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.covers) {
          setCovers(data.covers);
          saveStoredQuizCovers(data.covers);
        }
        toast.success(data.message || "সকল কভার ইমেজ সফলভাবে সংরক্ষিত হয়েছে!", {
          id: saveToastId,
          duration: 4000,
        });
        setMsg({
          text: "কুইজ কার্ডের কভার ইমেজ সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!",
          type: "success",
        });
      } else {
        toast.error(data.error || "কভার ইমেজ সংরক্ষণ ব্যর্থ হয়েছে।", {
          id: saveToastId,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্কে সমস্যা হয়েছে।", {
        id: saveToastId,
      });
    } finally {
      setIsSavingCovers(false);
    }
  };

  // 🃏 Dynamic Custom MCQ Card Handlers
  const handleSaveCardsToApi = async (cardsToSave: CustomQuizCard[]) => {
    setIsSavingCards(true);
    saveStoredCustomQuizCards(cardsToSave);
    try {
      const res = await fetch("/api/quiz/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: cardsToSave }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.cards) {
          setCustomCards(data.cards);
          saveStoredCustomQuizCards(data.cards);
        }
        toast.success(
          data.message || "MCQ কার্ডসমূহ সফলভাবে সংরক্ষণ করা হয়েছে!",
        );
        setMsg({
          text: "সকল কাস্টম MCQ কার্ড সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!",
          type: "success",
        });
      } else {
        toast.error(data.error || "কার্ড সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.success("কার্ডসমূহ ব্রাউজারে সংরক্ষিত হয়েছে।");
    } finally {
      setIsSavingCards(false);
    }
  };

  const handleAddNewCard = () => {
    const newCard: CustomQuizCard = {
      id: `card_${Date.now()}`,
      title: `${toBengaliClass(selectedClass)} শ্রেণি স্পেশাল মডেল টেস্ট`,
      subtitle: "পূর্ণাঙ্গ অধ্যায়ভিত্তিক ও বোর্ড স্ট্যান্ডার্ড প্রস্তুতি টেস্ট",
      classGrade: selectedClass,
      subject: selectedSubject || "সাধারণ গণিত",
      group: selectedClass >= 9 ? selectedGroup : undefined,
      isPaid: false,
      price: 0,
      badge: "নতুন টেস্ট",
      coverImage: "",
      questionCount: 20,
      durationMinutes: 20,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const nextCards = [newCard, ...customCards];
    setCustomCards(nextCards);
    handleSaveCardsToApi(nextCards);
    toast.success("নতুন MCQ কার্ড তৈরি হয়েছে! তথ্য ও কভার ছবি যুক্ত করুন।");
  };

  const handleUpdateCard = (id: string, updates: Partial<CustomQuizCard>) => {
    const nextCards = customCards.map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    setCustomCards(nextCards);
    saveStoredCustomQuizCards(nextCards);
  };

  const handleDeleteCard = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই MCQ কার্ডটি মুছে ফেলতে চান?")) return;
    const nextCards = customCards.filter((c) => c.id !== id);
    setCustomCards(nextCards);
    handleSaveCardsToApi(nextCards);
    toast.success("কার্ডটি মুছে ফেলা হয়েছে।");
  };

  const handleCardCoverUpload = async (cardId: string, file: File) => {
    if (!file) return;
    setUploadingTarget(`card_${cardId}`);
    const uploadToastId = toast.loading(
      "কার্ডের আলাদা কভার ছবি আপলোড হচ্ছে...",
    );
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const nextCards = customCards.map((c) =>
          c.id === cardId ? { ...c, coverImage: data.url } : c,
        );
        setCustomCards(nextCards);
        handleSaveCardsToApi(nextCards);
        toast.success(
          "কার্ডের কভার ছবি সফলভাবে আপলোড ও ক্লাউডে সংরক্ষিত হয়েছে!",
          {
            id: uploadToastId,
            duration: 4000,
          },
        );
      } else {
        toast.error(data.error || "আপলোড ব্যর্থ হয়েছে।", { id: uploadToastId });
      }
    } catch (err: any) {
      toast.error(err.message || "আপলোডে সমস্যা হয়েছে।", { id: uploadToastId });
    } finally {
      setUploadingTarget(null);
    }
  };

  // Load questions whenever category, class, or subject changes
  useEffect(() => {
    loadCurrentQuestions();
    setEditingIndex(null);
    resetForm();
  }, [category, selectedClass, selectedSubject]);

  const loadCurrentQuestions = () => {
    // 1. Instant sync from local storage
    if (category === "free") {
      setQuestions(getStoredFreeQuestions(selectedClass));
    } else if (category === "paid") {
      setQuestions(getStoredPaidQuestions(selectedClass));
    } else {
      setQuestions(getStoredSubjectQuestions(selectedClass, selectedSubject));
    }

    // 2. Fetch from server API
    fetch(
      `/api/quiz/questions?classGrade=${selectedClass}&subject=${encodeURIComponent(
        selectedSubject,
      )}&category=${category}`,
      { cache: "no-store" },
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          // Sync local storage as well
          if (category === "free") {
            saveStoredFreeQuestions(selectedClass, data.questions);
          } else if (category === "paid") {
            saveStoredPaidQuestions(selectedClass, data.questions);
          } else {
            saveStoredSubjectQuestions(
              selectedClass,
              selectedSubject,
              data.questions,
            );
          }
        }
      })
      .catch(() => {});
  };

  const persistQuestions = (updated: RawQuestion[]) => {
    setQuestions(updated);
    if (category === "free") {
      saveStoredFreeQuestions(selectedClass, updated);
    } else if (category === "paid") {
      saveStoredPaidQuestions(selectedClass, updated);
    } else {
      saveStoredSubjectQuestions(selectedClass, selectedSubject, updated);
    }

    // Push to server API in background
    fetch("/api/quiz/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classGrade: selectedClass,
        category,
        subject: selectedSubject,
        questions: updated,
      }),
    }).catch(() => {});
  };

  const resetForm = () => {
    setFormQ("");
    setFormA("");
    setFormB("");
    setFormC("");
    setFormD("");
    setFormAns(0);
    setFormExplanation("");
    setEditingIndex(null);
  };

  // Add / Update Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formQ.trim() ||
      !formA.trim() ||
      !formB.trim() ||
      !formC.trim() ||
      !formD.trim()
    ) {
      toast.error("অনুগ্রহ করে প্রশ্ন এবং ৪টি অপশন অবশ্যই পূরণ করুন।");
      setMsg({
        text: "অনুগ্রহ করে প্রশ্ন এবং ৪টি অপশন অবশ্যই পূরণ করুন।",
        type: "error",
      });
      return;
    }

    const newQuestion: RawQuestion = {
      q: formQ.trim(),
      options: [formA.trim(), formB.trim(), formC.trim(), formD.trim()],
      ans: formAns,
      explanation: formExplanation.trim() || undefined,
      isPremium: category === "paid",
    };

    let updatedList = [...questions];
    if (
      editingIndex !== null &&
      editingIndex >= 0 &&
      editingIndex < updatedList.length
    ) {
      updatedList[editingIndex] = newQuestion;
      toast.success("প্রশ্ন সফলভাবে আপডেট করা হয়েছে!");
      setMsg({ text: "প্রশ্ন সফলভাবে আপডেট করা হয়েছে!", type: "success" });
    } else {
      updatedList.push(newQuestion);
      toast.success("নতুন প্রশ্ন সফলভাবে যুক্ত করা হয়েছে!");
      setMsg({ text: "নতুন প্রশ্ন সফলভাবে যুক্ত করা হয়েছে!", type: "success" });
    }

    persistQuestions(updatedList);
    resetForm();
    setActiveTab("list");
  };

  // Start Edit
  const handleStartEdit = (index: number) => {
    const target = questions[index];
    if (!target) return;
    setEditingIndex(index);
    setFormQ(target.q);
    setFormA(target.options[0] || "");
    setFormB(target.options[1] || "");
    setFormC(target.options[2] || "");
    setFormD(target.options[3] || "");
    setFormAns(target.ans);
    setFormExplanation(target.explanation || "");
    setActiveTab("add");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Delete Question
  const handleDeleteQuestion = (index: number) => {
    if (!confirm(`আপনি কি ${index + 1} নম্বর প্রশ্নটি মুছে ফেলতে চান?`)) return;
    const updated = questions.filter((_, i) => i !== index);
    persistQuestions(updated);
    toast.success("প্রশ্ন মুছে ফেলা হয়েছে।");
    setMsg({ text: "🗑️ প্রশ্ন মুছে ফেলা হয়েছে।", type: "success" });
  };

  // Reset to Factory Defaults
  const handleResetToDefault = () => {
    const confirmed = confirm(
      "সতর্কতা: এটি বর্তমান শ্রেণি ও ক্যাটাগরির সকল কাস্টম পরিবর্তন মুছে দিয়ে মূল ডিফল্ট প্রশ্নগুলো ফিরিয়ে আনবে। আপনি কি নিশ্চিত?",
    );
    if (!confirmed) return;

    let defaults: RawQuestion[] = [];
    if (category === "free") {
      defaults = FREE_CLASS_QUESTIONS[selectedClass] || [];
    } else if (category === "paid") {
      defaults = PAID_CLASS_QUESTIONS[selectedClass] || [];
    } else {
      defaults = SUBJECT_QUESTIONS[selectedSubject] || [];
    }

    persistQuestions(defaults);
    toast.success("ডিফল্ট প্রশ্ন সফলভাবে রিস্টোর হয়েছে।");
    setMsg({
      text: "🔄 ডিফল্ট প্রশ্ন সফলভাবে রিস্টোর হয়েছে।",
      type: "success",
    });
  };

  // Bulk Import
  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      toast.error("কোনো প্রশ্ন পাওয়া যায়নি। সঠিক ফরম্যাটে লিখুন।");
      setMsg({
        text: "কোনো প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে সঠিক ফরম্যাটে লিখুন।",
        type: "error",
      });
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;
    const newItems: RawQuestion[] = [];

    lines.forEach((line) => {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 6) {
        const qText = parts[0];
        const ops: [string, string, string, string] = [
          parts[1],
          parts[2],
          parts[3],
          parts[4],
        ];
        const ansChar = parts[5].toUpperCase();
        const ansIdx =
          ansChar === "A"
            ? 0
            : ansChar === "B"
              ? 1
              : ansChar === "C"
                ? 2
                : ansChar === "D"
                  ? 3
                  : 0;
        const exp = parts[6] ? parts[6] : undefined;

        newItems.push({
          q: qText,
          options: ops,
          ans: ansIdx,
          explanation: exp,
          isPremium: category === "paid",
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    });

    const updated = [...questions, ...newItems];
    persistQuestions(updated);
    setBulkText("");
    toast.success(`${addedCount}টি প্রশ্ন সফলভাবে যোগ হয়েছে!`);
    setMsg({
      text: `${addedCount}টি প্রশ্ন সফলভাবে যোগ হয়েছে! ${skippedCount > 0 ? `(${skippedCount}টি লাইন সঠিক ছিল না)` : ""}`,
      type: "success",
    });
    setActiveTab("list");
  };

  // Helper for JSON parsing & subject mapping (Supports both All Subjects and Single Subject mode)
  const parseJsonFileContent = (
    data: any,
    targetClass: number,
    scope: "all" | "single" = importScope,
    singleSubjName: string = importTargetSubject
  ) => {
    const iconMap: Record<string, string> = {
      bangla: "📖",
      math: "➗",
      science: "🔬",
      ict: "💻",
      islam: "🕌",
      hindu: "🛕",
      bgs: "🌍",
    };

    const mapKeyToSubject = (key: string) => {
      const k = key.toLowerCase().trim();
      if (k === "bangla" || k === "bengali")
        return targetClass === 5 ? "বাংলা" : "বাংলা ১ম পত্র";
      if (k === "math" || k === "mathematics")
        return targetClass === 5 ? "প্রাথমিক গণিত" : "গণিত";
      if (k === "science")
        return targetClass === 5 ? "প্রাথমিক বিজ্ঞান" : "বিজ্ঞান";
      if (k === "ict")
        return targetClass >= 9 ? "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)" : "ICT";
      if (k === "islam") return "ইসলাম ও নৈতিক শিক্ষা";
      if (k === "hindu") return "হিন্দুধর্ম ও নৈতিক শিক্ষা";
      if (k === "bgs") return "বাংলাদেশ ও বিশ্বপরিচয়";
      return key;
    };

    // Deep recursive extractor that finds questions in any shape (flat array, tests.qs, or nested objects)
    const extractQuestionsFromAny = (input: any, depth = 5): RawQuestion[] => {
      if (!input || depth <= 0) return [];
      const qs: RawQuestion[] = [];

      if (Array.isArray(input)) {
        for (const item of input) {
          const qText = item?.q || item?.question;
          const opts = item?.o || item?.options;
          if (qText && Array.isArray(opts) && opts.length >= 2) {
            const rawAns = item.a ?? item.ans;
            const ansNum =
              typeof rawAns === "number" && rawAns >= 0 && rawAns <= 3
                ? rawAns
                : 0;
            qs.push({
              q: String(qText).trim(),
              options: [
                String(opts[0] || ""),
                String(opts[1] || ""),
                String(opts[2] || ""),
                String(opts[3] || ""),
              ],
              ans: ansNum,
              explanation:
                item.e || item.explanation
                  ? String(item.e || item.explanation).trim()
                  : undefined,
              isPremium: category === "paid",
            });
          } else if (item && typeof item === "object") {
            qs.push(...extractQuestionsFromAny(item, depth - 1));
          }
        }
        return qs;
      }

      if (typeof input === "object") {
        if (Array.isArray(input.tests)) {
          for (const t of input.tests) {
            if (Array.isArray(t?.qs)) {
              qs.push(...extractQuestionsFromAny(t.qs, depth - 1));
            }
          }
          if (qs.length > 0) return qs;
        }

        if (Array.isArray(input.questions)) {
          return extractQuestionsFromAny(input.questions, depth - 1);
        }

        for (const v of Object.values(input)) {
          qs.push(...extractQuestionsFromAny(v, depth - 1));
        }
      }

      return qs;
    };

    // 1. Single Subject Mode: All detected questions are grouped into the chosen subject
    if (scope === "single") {
      const allQs = extractQuestionsFromAny(data);
      const matchedIcon =
        importAvailableSubjects.find((s) => s.name === singleSubjName)?.icon ||
        "📚";

      return {
        totalQuestions: allQs.length,
        subjects:
          allQs.length > 0
            ? [
                {
                  key: "single",
                  name: singleSubjName,
                  icon: matchedIcon,
                  count: allQs.length,
                  testsCount: 1,
                  questions: allQs,
                },
              ]
            : [],
      };
    }

    // 2. All Subjects Mode: Detect keys for different subjects
    const subjectsSummary: {
      key: string;
      name: string;
      icon: string;
      count: number;
      testsCount: number;
      questions: RawQuestion[];
    }[] = [];
    let total = 0;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (const [key, val] of Object.entries(data)) {
        const platformName = mapKeyToSubject(key);
        const subQuestions = extractQuestionsFromAny(val);
        const testsCount = Array.isArray((val as any)?.tests)
          ? (val as any).tests.length
          : 1;
        if (subQuestions.length > 0) {
          subjectsSummary.push({
            key,
            name: platformName,
            icon: iconMap[key.toLowerCase()] || "📚",
            count: subQuestions.length,
            testsCount,
            questions: subQuestions,
          });
          total += subQuestions.length;
        }
      }
    } else if (Array.isArray(data)) {
      const subQuestions = extractQuestionsFromAny(data);
      if (subQuestions.length > 0) {
        subjectsSummary.push({
          key: "single",
          name: singleSubjName,
          icon: "📚",
          count: subQuestions.length,
          testsCount: 1,
          questions: subQuestions,
        });
        total += subQuestions.length;
      }
    }

    return { totalQuestions: total, subjects: subjectsSummary };
  };

  // Re-run parse automatically whenever raw JSON, class, scope, or selected subject changes
  useEffect(() => {
    if (rawParsedJson) {
      const preview = parseJsonFileContent(
        rawParsedJson,
        importTargetClass,
        importScope,
        importTargetSubject
      );
      setJsonImportPreview(preview);
    }
  }, [rawParsedJson, importTargetClass, importScope, importTargetSubject]);

  // Handle client-side file selection
  const handleJsonFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("অনুগ্রহ করে একটি বৈধ .json ফাইল নির্বাচন করুন।");
      return;
    }

    setJsonImportFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setRawParsedJson(parsed);
        const preview = parseJsonFileContent(
          parsed,
          importTargetClass,
          importScope,
          importTargetSubject
        );
        if (preview.totalQuestions === 0) {
          toast.error(
            "ফাইলের ভেতর কোনো প্রশ্ন পাওয়া যায়নি। ফরম্যাট পরীক্ষা করুন।"
          );
          setJsonImportPreview(null);
        } else {
          setJsonImportPreview(preview);
          toast.success(
            importScope === "single"
              ? `"${importTargetSubject}" বিষয়ে ${preview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন সফলভাবে শনাক্ত হয়েছে!`
              : `মোট ${preview.subjects.length}টি বিষয়ে ${preview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন সফলভাবে শনাক্ত হয়েছে!`
          );
        }
      } catch (err: any) {
        toast.error("ফাইলটি সঠিক JSON ফরম্যাটে নেই: " + err.message);
        setRawParsedJson(null);
        setJsonImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  // Download Sample JSON Template
  const handleDownloadSampleJson = (type: "single" | "multi") => {
    let sampleData: any;
    let fileName = "";
    if (type === "single") {
      const safeSubj = (importTargetSubject || "subject").replace(/\s+/g, "_");
      fileName = `sample_mcq_${safeSubj}.json`;
      sampleData = [
        {
          q: "বাংলাদেশের জাতীয় কবি কে?",
          o: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জসীমউদ্দীন", "জীবনানন্দ দাশ"],
          a: 0,
          e: "কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি।"
        },
        {
          q: "বৃত্তের কেন্দ্রগামী বৃহত্তম জ্যা-কে কী বলা হয়?",
          o: ["ব্যাসার্ধ", "পরিধি", "ব্যাস", "চাপ"],
          a: 2,
          e: "বৃত্তের কেন্দ্র দিয়ে অতিক্রমকারী জ্যা হলো ব্যাস, যা বৃত্তের বৃহত্তম জ্যা।"
        },
        {
          q: "উদ্ভিদ সালোকসংশ্লেষণ প্রক্রিয়ায় বায়ুমণ্ডল থেকে কোন গ্যাস গ্রহণ করে?",
          o: ["অক্সিজেন", "কার্বন ডাই-অক্সাইড", "নাইট্রোজেন", "মিথেন"],
          a: 1,
          e: "সূর্যালোকের উপস্থিতিতে সবুজ উদ্ভিদ কার্বন ডাই-অক্সাইড শোষণ করে শর্করা ও অক্সিজেন তৈরি করে।"
        },
        {
          q: "কম্পিউটারের মূল মস্তিষ্কের মতো কাজ করে কোনটি?",
          o: ["Monitor", "RAM", "CPU", "Hard Disk"],
          a: 2,
          e: "CPU (Central Processing Unit) কম্পিউটারের সকল গণনা ও নিয়ন্ত্রণ সম্পন্ন করে।"
        }
      ];
    } else {
      fileName = `sample_multi_subjects_mcq.json`;
      sampleData = {
        bangla: {
          tests: [
            {
              qs: [
                {
                  q: "‘বিদ্রোহী’ কবিতার রচয়িতা কে?",
                  o: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জসীমউদ্দীন", "সুকান্ত ভট্টাচার্য"],
                  a: 0,
                  e: "কাজী নজরুল ইসলাম ১৯২১ সালে যুগান্তকারী ‘বিদ্রোহী’ কবিতা রচনা করেন।"
                }
              ]
            }
          ]
        },
        math: {
          tests: [
            {
              qs: [
                {
                  q: "√৬৪ এর মান কত?",
                  o: ["৬", "৭", "৮", "৯"],
                  a: 2,
                  e: "৮ এর বর্গ হলো ৬৪।"
                }
              ]
            }
          ]
        },
        science: {
          tests: [
            {
              qs: [
                {
                  q: "পানির রাসায়নিক সংকেত কোনটি?",
                  o: ["CO2", "H2O", "NaCl", "O2"],
                  a: 1,
                  e: "পানি হাইড্রোজেন ও অক্সিজেনের সমন্বয়ে গঠিত (H2O)।"
                }
              ]
            }
          ]
        }
      };
    }

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`স্যাম্পল ফাইল (${fileName}) ডাউনলোড শুরু হয়েছে!`);
  };

  // Upload and Save Client-Parsed Batch to Server
  const handleSaveImportedBatch = async () => {
    if (!jsonImportPreview || jsonImportPreview.subjects.length === 0) {
      toast.error("কোনো প্রশ্ন পাওয়া যায়নি।");
      return;
    }

    setIsImportingJson(true);
    const saveToastId = toast.loading(
      `মোট ${jsonImportPreview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন সার্ভারে সংরক্ষণ করা হচ্ছে...`,
    );

    try {
      const batchData: Record<string, RawQuestion[]> = {};
      jsonImportPreview.subjects.forEach((s) => {
        batchData[s.name] = s.questions;
      });

      const res = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classGrade: importTargetClass,
          batch: batchData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          data.message ||
            (importScope === "single"
              ? `"${importTargetSubject}" বিষয়ের প্রশ্ন সফলভাবে সংরক্ষণ করা হয়েছে!`
              : "সকল বিষয়ের প্রশ্ন সার্ভারে সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!"),
          { id: saveToastId, duration: 5000 },
        );
        setMsg({
          text:
            importScope === "single"
              ? `🎉 অভিনন্দন! ${toBengaliClass(importTargetClass)} শ্রেণির "${importTargetSubject}" বিষয়ে মোট ${jsonImportPreview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন সফলভাবে সেভ করা হয়েছে!`
              : `🎉 অভিনন্দন! ${toBengaliClass(importTargetClass)} শ্রেণির মোট ${jsonImportPreview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন স্বয়ংক্রিয়ভাবে বিষয়ভিত্তিক সেভ করা হয়েছে!`,
          type: "success",
        });
        setSelectedClass(importTargetClass);
        if (importScope === "single") {
          setSelectedSubject(importTargetSubject);
          setCategory("subject");
        }
        loadCurrentQuestions();
        setActiveTab("list");
      } else {
        toast.error(data.error || "সংরক্ষণ ব্যর্থ হয়েছে।", { id: saveToastId });
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্কে সমস্যা হয়েছে।", {
        id: saveToastId,
      });
    } finally {
      setIsImportingJson(false);
    }
  };

  // One-click Auto Import from Server File data/mcq_questions.json
  const handleImportServerFileDirect = async () => {
    if (
      !confirm(
        `আপনি কি সার্ভারে বিদ্যমান data/mcq_questions.json ফাইল থেকে ${toBengaliClass(importTargetClass)} শ্রেণির সকল বিষয়ে প্রশ্নগুলো অটো-ইমপোর্ট করতে চান?`,
      )
    ) {
      return;
    }

    setIsImportingJson(true);
    const importToastId = toast.loading(
      "সার্ভারের mcq_questions.json থেকে প্রশ্ন প্রসেস ও ইমপোর্ট করা হচ্ছে...",
    );

    try {
      const res = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import_server_file",
          classGrade: importTargetClass,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          data.message || "সার্ভার ফাইল থেকে সকল প্রশ্ন সফলভাবে ইমপোর্ট হয়েছে!",
          { id: importToastId, duration: 5000 },
        );
        setMsg({
          text: `🎉 ${toBengaliClass(importTargetClass)} শ্রেণির সকল বিষয়ের প্রশ্ন সফলভাবে ইমপোর্ট সম্পন্ন হয়েছে! (মোট: ${data.totalImported?.toLocaleString("bn-BD")}টি প্রশ্ন)`,
          type: "success",
        });
        loadCurrentQuestions();
        setActiveTab("list");
      } else {
        toast.error(data.error || "সার্ভার ফাইল ইমপোর্ট ব্যর্থ হয়েছে।", {
          id: importToastId,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্কে সমস্যা হয়েছে।", {
        id: importToastId,
      });
    } finally {
      setIsImportingJson(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER WITH STATS & DIRECT PREVIEW LINK
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-full">
            <FaGem /> কেন্দ্রীয় কুইজ ও মডেল টেস্ট কন্ট্রোল
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            অনলাইন কুইজ ও MCQ ম্যানেজমেন্ট
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            শুধুমাত্র অ্যাডমিন প্যানেল থেকেই সকল শ্রেণির ফ্রি, পেইড এবং
            বিষয়ভিত্তিক মডেল টেস্টের MCQ প্রশ্ন যোগ, এডিট ও নিয়ন্ত্রণ করা যাবে।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/quiz"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0A1E3C] to-[#122A54] hover:from-[#122A54] hover:to-black text-white font-bold text-xs shadow-md transition"
          >
            <FaArrowUpRightFromSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>লাইভ কুইজ পেজ দেখুন</span>
          </Link>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            title="মূল ডিফল্ট প্রশ্নগুলো ফিরিয়ে আনুন"
          >
            <FaRotateLeft className="w-3.5 h-3.5" />
            <span>রিসেট ডিফল্ট</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CATEGORY, CLASS & SUBJECT FILTER CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              টেস্ট ক্যাটাগরি নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setCategory("free")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === "free"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaGift className="w-3 h-3" />
                <span>ফ্রি টেস্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("paid")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === "paid"
                    ? "bg-[#C8102E] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaGem className="w-3 h-3" />
                <span>পেইড টেস্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("subject")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === "subject"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FaBookOpen className="w-3 h-3" />
                <span>বিষয়ভিত্তিক</span>
              </button>
            </div>
          </div>

          {/* Class Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              শ্রেণি নির্বাচন
            </label>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1.5 rounded-2xl">
              {[5, 6, 7, 8, 9, 10].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedClass(c)}
                  className={`py-2 rounded-xl text-xs font-black transition ${
                    selectedClass === c
                      ? "bg-gradient-to-tr from-[#9B0D23] via-[#C8102E] to-[#E5254A] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {toBengaliClass(c)}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selector (If Subject category is selected) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {category === "subject"
                ? "বিষয় নির্বাচন করুন"
                : "নির্বাচিত স্ট্যাটাস"}
            </label>
            {category === "subject" ? (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold outline-none"
              >
                {availableSubjects.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between">
                <span>বর্তমান প্রশ্ন সংখ্যা:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#C8102E] font-black">
                  {questions.length}টি MCQ
                </span>
              </div>
            )}
          </div>

          {/* Academic Group Selector for Class 9-10 (Science / Humanities / Commerce / Compulsory) */}
          {category === "subject" &&
            (selectedClass === 9 || selectedClass === 10) && (
              <div className="col-span-1 md:col-span-3 pt-3 border-t border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>
                      🎓 {toBengaliClass(selectedClass)} শ্রেণির বিভাগ নির্বাচন:
                    </span>
                    <span className="text-[10px] bg-red-50 text-[#C8102E] font-bold px-2 py-0.5 rounded-full border border-red-200">
                      বিভাগভিত্তিক MCQ ম্যানেজমেন্ট
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    নির্বাচিত বিভাগের বিষয়গুলো পাশের ড্রপডাউনে স্বয়ংক্রিয়ভাবে
                    লোড হবে
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGroup("science")}
                    className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                      selectedGroup === "science"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-200 border-slate-200"
                    }`}
                  >
                    <span className="text-base">⚛️</span>
                    <span>বিজ্ঞান বিভাগ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGroup("humanities")}
                    className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                      selectedGroup === "humanities"
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-white text-slate-700 hover:bg-amber-50 hover:border-amber-200 border-slate-200"
                    }`}
                  >
                    <span className="text-base">📜</span>
                    <span>মানবিক বিভাগ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGroup("commerce")}
                    className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                      selectedGroup === "commerce"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200"
                    }`}
                  >
                    <span className="text-base">💼</span>
                    <span>ব্যবসায় শিক্ষা</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGroup("compulsory")}
                    className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                      selectedGroup === "compulsory"
                        ? "bg-[#0A1E3C] text-white border-[#0A1E3C] shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 border-slate-200"
                    }`}
                  >
                    <span className="text-base">🌐</span>
                    <span>আবশ্যিক বিষয়</span>
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB SWITCHER (LIST vs ADD vs BULK)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "list"
              ? "bg-[#0A1E3C] text-white shadow-sm"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FaFileLines className="w-3.5 h-3.5" />
          <span>প্রশ্ন তালিকা ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveTab("add");
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "add"
              ? "bg-[#C8102E] text-white shadow-sm"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>
            {editingIndex !== null ? "প্রশ্ন এডিট করুন" : "একক MCQ যোগ"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "bulk"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FaBookOpen className="w-3.5 h-3.5" />
          <span>বাল্ক আপলোড</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("import-json")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "import-json"
              ? "bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-sm"
              : "bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200"
          }`}
        >
          <FaCloudArrowUp
            className={`w-3.5 h-3.5 ${activeTab === "import-json" ? "text-amber-300" : "text-teal-600"}`}
          />
          <span>JSON ফাইল অটো-ইমপোর্ট</span>
          <span className="px-1.5 py-0.2 bg-teal-200/80 text-teal-950 text-[10px] rounded-full font-black">
            নতুন
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("prices")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "prices"
              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FaCoins className="w-3.5 h-3.5 text-amber-400" />
          <span>কুইজ ফি ও মূল্য নিয়ন্ত্রণ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("covers")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "covers"
              ? "bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-sm"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FaImage className="w-3.5 h-3.5 text-purple-300" />
          <span>কার্ডের কভার ইমেজ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "cards"
              ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <FaLayerGroup className="w-3.5 h-3.5 text-blue-300" />
          <span>MCQ কার্ড ({customCards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("custom-exams")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "custom-exams"
              ? "bg-gradient-to-r from-[#0A1E3C] to-[#163668] text-white shadow-sm"
              : "bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
          }`}
        >
          <FaClipboardList className={`w-3.5 h-3.5 ${activeTab === "custom-exams" ? "text-amber-300" : "text-blue-600"}`} />
          <span>🎯 কাস্টম এক্সাম</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "results"
              ? "bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-sm"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200"
          }`}
        >
          <FaAward className={`w-3.5 h-3.5 ${activeTab === "results" ? "text-amber-300" : "text-emerald-600"}`} />
          <span>📊 ফলাফল শিট</span>
          <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 text-[10px] rounded-full font-black">
            লাইভ
          </span>
        </button>
      </div>

      {/* Alert Message */}
      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{msg.text}</span>
          <button
            type="button"
            onClick={() => setMsg(null)}
            className="text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE QUESTION LIST
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "list" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">
                {toBengaliClass(selectedClass)} শ্রেণি —{" "}
                {category === "free"
                  ? "ফ্রি মডেল টেস্ট প্রশ্নমালা"
                  : category === "paid"
                    ? "প্রিমিয়াম মডেল টেস্ট প্রশ্নমালা"
                    : `${selectedSubject} বিষয়ের প্রশ্নমালা ${
                        selectedClass >= 9
                          ? selectedGroup === "science"
                            ? "(বিজ্ঞান বিভাগ)"
                            : selectedGroup === "humanities"
                              ? "(মানবিক বিভাগ)"
                              : selectedGroup === "commerce"
                                ? "(ব্যবসায় শিক্ষা)"
                                : "(আবশ্যিক বিষয়)"
                          : ""
                      }`}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                মোট প্রশ্ন সংখ্যা: {questions.length}টি
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab("add");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" />
              <span>নতুন প্রশ্ন যোগ</span>
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
              <p>এই শ্রেণি ও ক্যাটাগরিতে বর্তমানে কোনো প্রশ্ন নেই।</p>
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className="text-[#C8102E] font-bold hover:underline"
              >
                + এখনই প্রশ্ন যোগ করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-[#0A1E3C] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {q.q}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(idx)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="এডিট করুন"
                      >
                        <FaPen className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="মুছে ফেলুন"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 sm:pl-8">
                    {q.options.map((opt, opIdx) => {
                      const isCorrect = opIdx === q.ans;
                      return (
                        <div
                          key={opIdx}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                            isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-black text-slate-400">
                              {String.fromCharCode(65 + opIdx)}.
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                              সঠিক উত্তর
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation snippet */}
                  {q.explanation && (
                    <div className="pl-0 sm:pl-8 text-[11px] text-slate-500 bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/60">
                      <strong className="text-slate-700">ব্যাখ্যা: </strong>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: ADD / EDIT SINGLE MCQ FORM
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSaveQuestion}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">
                {editingIndex !== null
                  ? "প্রশ্ন এডিট করুন"
                  : "নতুন MCQ প্রশ্ন যোগ করুন"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                নির্বাচিত শ্রেণি:{" "}
                <strong>{toBengaliClass(selectedClass)} শ্রেণি</strong> •
                ক্যাটাগরি:{" "}
                <strong>
                  {category === "free"
                    ? "ফ্রি"
                    : category === "paid"
                      ? "পেইড"
                      : selectedSubject}
                </strong>
              </p>
            </div>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                এডিট বাতিল করুন
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              প্রশ্নের মূল পাঠ (Question Text) *
            </label>
            <textarea
              rows={2}
              required
              value={formQ}
              onChange={(e) => setFormQ(e.target.value)}
              placeholder="যেমন: বাংলাদেশের মহান স্বাধীনতা দিবস কবে?"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 outline-none transition"
            />
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অপশন A *
              </label>
              <input
                type="text"
                required
                value={formA}
                onChange={(e) => setFormA(e.target.value)}
                placeholder="যেমন: ২১ ফেব্রুয়ারি"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অপশন B *
              </label>
              <input
                type="text"
                required
                value={formB}
                onChange={(e) => setFormB(e.target.value)}
                placeholder="যেমন: ২৬ মার্চ"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অপশন C *
              </label>
              <input
                type="text"
                required
                value={formC}
                onChange={(e) => setFormC(e.target.value)}
                placeholder="যেমন: ১৬ ডিসেম্বর"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অপশন D *
              </label>
              <input
                type="text"
                required
                value={formD}
                onChange={(e) => setFormD(e.target.value)}
                placeholder="যেমন: ১৪ এপ্রিল"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                সঠিক উত্তর নির্বাচন করুন *
              </label>
              <select
                value={formAns}
                onChange={(e) => setFormAns(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold outline-none"
              >
                <option value={0}>A (প্রথম অপশন)</option>
                <option value={1}>B (দ্বিতীয় অপশন)</option>
                <option value={2}>C (তৃতীয় অপশন)</option>
                <option value={3}>D (চতুর্থ অপশন)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ব্যাখ্যা বা হিন্ট (ঐচ্ছিক — ফলাফল প্রদর্শনের জন্য)
              </label>
              <input
                type="text"
                value={formExplanation}
                onChange={(e) => setFormExplanation(e.target.value)}
                placeholder="যেমন: ১৯৭১ সালের ২৬ মার্চ প্রথম প্রহরে স্বাধীনতা ঘোষণা করা হয়।"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-black text-xs sm:text-sm shadow-md transition active:scale-98"
            >
              {editingIndex !== null
                ? " পরিবর্তন সংরক্ষণ করুন"
                : " প্রশ্ন যুক্ত করুন"}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              তালিকায় ফিরে যান
            </button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: BULK MCQ IMPORT FORM
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "bulk" && (
        <form
          onSubmit={handleBulkImport}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">
                একসাথে অনেকগুলো MCQ আপলোড (Bulk Import)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                নোটপ্যাড বা ওয়ার্ড থেকে কপি করে এক ক্লিকে ডজনখানেক প্রশ্ন যুক্ত
                করুন।
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FaCircleInfo className="text-[#C8102E]" />
              <span>ফরম্যাট লেখার নিয়মাবলী:</span>
            </div>
            <p>
              প্রতি লাইনে একটি করে প্রশ্ন পাইপ (
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold text-[#C8102E]">
                |
              </code>
              ) চিহ্ন দিয়ে আলাদা করে লিখুন:
            </p>
            <p className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              প্রশ্ন | অপশন A | অপশন B | অপশন C | অপশন D | সঠিক উত্তর (A/B/C/D)
              | ব্যাখ্যা (ঐচ্ছিক)
            </p>
            <p className="text-[11px] text-slate-400">
              উদাহরণ:{" "}
              <span className="font-mono">
                বাংলাদেশের জাতীয় ফল কোনটি? | আম | কাঁঠাল | লিচু | পেয়ারা | B |
                কাঁঠাল বাংলাদেশের জাতীয় ফল।
              </span>
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              এখানে আপনার প্রশ্নগুলো পেস্ট করুন:
            </label>
            <textarea
              rows={10}
              required
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`বাংলাদেশের রাজধানী কোনটি? | চট্টগ্রাম | ঢাকা | খুলনা | সিলেট | B | ঢাকা হলো রাজধানী।\n৫ × ৬ = কত? | ২০ | ২৫ | ৩০ | ৩৫ | C | ৫ এর সাথে ৬ গুণ করলে ৩০ হয়।`}
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl p-4 text-xs font-mono text-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-98"
            >
              সব প্রশ্ন যোগ করুন (Import Now)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: 💰 QUIZ & PACKAGE PRICING MANAGEMENT
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "prices" && (
        <form onSubmit={handleSavePrices} className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <FaCoins /> ফি কনফিগারেশন
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                পেইড কুইজ, টেস্ট ও প্যাকেজের মূল্য নির্ধারণ
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                অ্যাডমিন এখান থেকে যেকোনো সময় পরীক্ষার ফি বা প্যাকেজের মূল্য
                পরিবর্তন করতে পারবেন। পরিবর্তনটি সাথে সাথে কুইজ পেজে কার্যকর
                হবে।
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetPricesToDefault}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
              >
                <FaRotateLeft className="w-3 h-3" />
                <span>ডিফল্ট মূল্য</span>
              </button>

              <button
                type="submit"
                disabled={isSavingPrices}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9B0D23] via-[#C8102E] to-[#E5254A] hover:opacity-95 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <FaFloppyDisk className="w-3.5 h-3.5" />
                <span>
                  {isSavingPrices ? "সংরক্ষণ হচ্ছে..." : "মূল্য সংরক্ষণ করুন"}
                </span>
              </button>
            </div>
          </div>

          {/* Section 1: Class-wise Model Test Prices (Class 5 to 10) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
                শ্রেণিভিত্তিক পেইড মডেল টেস্টের ফি (Class-wise Paid Tests)
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                শিক্ষার্থীরা নির্দিষ্ট ক্লাসের মডেল টেস্ট আনলক করতে এই পরিমাণ
                টাকা প্রদান করবে।
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[5, 6, 7, 8, 9, 10].map((cls) => (
                <div
                  key={cls}
                  className="bg-slate-50/80 border border-slate-200 hover:border-[#C8102E]/40 p-3.5 rounded-2xl space-y-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">
                      {toBengaliClass(cls)} শ্রেণি
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#C8102E]">
                      পেইড
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-black text-slate-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      required
                      value={prices.classPrices[cls] ?? 50}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        setPrices((prev) => ({
                          ...prev,
                          classPrices: {
                            ...prev.classPrices,
                            [cls]: val,
                          },
                        }));
                      }}
                      className="w-full bg-white border border-slate-300 focus:border-[#C8102E] rounded-xl pl-7 pr-3 py-1.5 text-xs font-black text-slate-900 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Subject-wise Test Price */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                বিষয়ভিত্তিক টেস্টের একক ফি (Subject-wise Test Fee)
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                বাংলা, ইংরেজি, গণিত ইত্যাদি যেকোনো একটি নির্দিষ্ট বিষয়ের টেস্টের
                সাধারণ ফি।
              </p>
            </div>

            <div className="max-w-xs bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                একক বিষয়ের টেস্ট ফি (Single Subject Test)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-black text-slate-400">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  required
                  value={prices.subjectPrice ?? 50}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    setPrices((prev) => ({
                      ...prev,
                      subjectPrice: val,
                    }));
                  }}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl pl-8 pr-3 py-2 text-sm font-black text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Special Packages Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>
                    স্পেশাল মডেল টেস্ট প্যাকেজসমূহ (Dynamic Package Manager)
                  </span>
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  কুইজ পেজের ৩টি বা ততোধিক স্পেশাল অফার প্যাকেজের নাম, মূল্য,
                  ফিচার ও সক্রিয় অবস্থা ডাইনামিকভাবে ম্যানেজ করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetPackagesToDefault}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition"
                >
                  ডিফল্ট প্যাকেজ
                </button>
                <button
                  type="button"
                  onClick={handleAddNewPackage}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>প্যাকেজ যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {packages.map((pkg, idx) => (
                <div
                  key={pkg.id || idx}
                  className={`rounded-2xl border-2 p-4 sm:p-5 space-y-3.5 transition-all relative ${
                    pkg.isActive
                      ? pkg.isPopular
                        ? "bg-red-50/40 border-[#C8102E] shadow-sm"
                        : "bg-white border-slate-200 shadow-xs"
                      : "bg-slate-50/70 border-dashed border-slate-300 opacity-70"
                  }`}
                >
                  {/* Card Header: Active Toggle & Delete */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        #{idx + 1}
                      </span>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                        <input
                          type="checkbox"
                          checked={pkg.isActive}
                          onChange={(e) =>
                            handleUpdatePackage(pkg.id, {
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span
                          className={
                            pkg.isActive ? "text-emerald-700" : "text-slate-400"
                          }
                        >
                          {pkg.isActive ? "সক্রিয় (Active)" : "বন্ধ (Hidden)"}
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      title="প্যাকেজ মুছুন"
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        প্যাকেজের নাম (Title)
                      </label>
                      <input
                        type="text"
                        required
                        value={pkg.title}
                        onChange={(e) =>
                          handleUpdatePackage(pkg.id, { title: e.target.value })
                        }
                        placeholder="যেমন: Full Class Package"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        ব্যাজ (Badge)
                      </label>
                      <input
                        type="text"
                        value={pkg.badge || ""}
                        onChange={(e) =>
                          handleUpdatePackage(pkg.id, { badge: e.target.value })
                        }
                        placeholder="যেমন: জনপ্রিয় অফার"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Pricing: Current & Original */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        বর্তমান মূল্য (৳)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs font-black text-slate-400">
                          ৳
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          required
                          value={pkg.price}
                          onChange={(e) => {
                            const val = Math.max(
                              0,
                              Number(e.target.value) || 0,
                            );
                            handleUpdatePackage(pkg.id, { price: val });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl pl-6 pr-2 py-1.5 text-xs font-black text-[#C8102E] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        আসল মূল্য (ছাড়ের জন্য)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs font-black text-slate-400">
                          ৳
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={pkg.originalPrice ?? ""}
                          onChange={(e) => {
                            const val = e.target.value
                              ? Math.max(0, Number(e.target.value))
                              : undefined;
                            handleUpdatePackage(pkg.id, { originalPrice: val });
                          }}
                          placeholder="ঐচ্ছিক"
                          className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl pl-6 pr-2 py-1.5 text-xs font-bold text-slate-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      সংক্ষিপ্ত বিবরণ (Tagline)
                    </label>
                    <input
                      type="text"
                      value={pkg.tagline}
                      onChange={(e) =>
                        handleUpdatePackage(pkg.id, { tagline: e.target.value })
                      }
                      placeholder="প্যাকেজের সারসংক্ষেপ..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none"
                    />
                  </div>

                  {/* Scope & Popular Checkbox */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        আনলক স্কোপ
                      </label>
                      <select
                        value={pkg.unlockScope}
                        onChange={(e) =>
                          handleUpdatePackage(pkg.id, {
                            unlockScope: e.target.value as any,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      >
                        <option value="single_class">এক ক্লাসের সব বিষয়</option>
                        <option value="all_classes">
                          ৫ম-১০ম সকল ক্লাস (VIP)
                        </option>
                        <option value="single_subject">একক বিষয়</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-4">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={pkg.isPopular}
                          onChange={(e) =>
                            handleUpdatePackage(pkg.id, {
                              isPopular: e.target.checked,
                            })
                          }
                          className="rounded text-[#C8102E] focus:ring-[#C8102E] w-4 h-4"
                        />
                        <span>জনপ্রিয় ব্যাজ দেখাবে</span>
                      </label>
                    </div>
                  </div>

                  {/* Feature Bullet Points (Multiline Editor) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        প্যাকেজের সুবিধাসমূহ (প্রতি লাইনে একটি)
                      </label>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {pkg.features.length}টি ফিচার
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={pkg.features.join("\n")}
                      onChange={(e) => {
                        const feats = e.target.value
                          .split("\n")
                          .filter((l) => l.trim().length > 0);
                        handleUpdatePackage(pkg.id, { features: feats });
                      }}
                      placeholder="১টি বিষয়ের সকল প্রশ্ন&#10;ইনস্ট্যান্ট ফলাফল ও গ্রেড&#10;ব্যাখ্যাসহ সমাধান"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl p-2.5 text-xs text-slate-800 outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetPricesToDefault}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              ডিফল্ট রিসেট
            </button>

            <button
              type="submit"
              disabled={isSavingPrices}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#9B0D23] via-[#C8102E] to-[#E5254A] hover:opacity-95 text-white font-black text-sm shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center gap-2"
            >
              <FaFloppyDisk className="w-4 h-4" />
              <span>
                {isSavingPrices
                  ? "সংরক্ষণ হচ্ছে..."
                  : "সব মূল্য ও প্যাকেজ সংরক্ষণ করুন"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: CARD OPTIONAL COVER IMAGES MANAGER
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "covers" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full mb-1">
                <FaImage /> ঐচ্ছিক কভার ইমেজ (Optional Cover Photo)
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                মডেল টেস্ট কার্ডের কভার ইমেজ ম্যানেজমেন্ট
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ছবি আপলোড করলে কার্ডের শীর্ষে থাম্বনেইল দেখাবে। ছবি না দিলে
                স্বয়ংক্রিয়ভাবে ডিফল্ট আইকন থাকবে।
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveCovers()}
              disabled={isSavingCovers}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:opacity-95 text-white font-black text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <FaFloppyDisk className="w-3.5 h-3.5" />
              <span>
                {isSavingCovers ? "সংরক্ষণ হচ্ছে..." : "কভার ইমেজ সংরক্ষণ করুন"}
              </span>
            </button>
          </div>

          {/* Section 1: Class-wise Model Test Covers (Classes 5 to 10) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                শ্রেণিভিত্তিক টেস্ট কার্ডের কভার ছবি (Classes 5-10)
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ফ্রি ও পেইড উভয় শ্রেণিভিত্তিক কার্ডে এই কভার ইমেজ প্রদর্শিত হবে।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[5, 6, 7, 8, 9, 10].map((cls) => {
                const coverUrl = covers.classes[cls];
                const isUploading = uploadingTarget === `classes_${cls}`;

                return (
                  <div
                    key={cls}
                    className="bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl p-4 space-y-3 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">
                        🎓 {toBengaliClass(cls)} শ্রেণি
                      </span>
                      {coverUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCover(String(cls), "classes")
                          }
                          className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <FaTrash className="w-2.5 h-2.5" />
                          <span>রিমুভ</span>
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Preview or Placeholder */}
                    <div className="w-full aspect-video rounded-xl bg-white border border-dashed border-slate-300 overflow-hidden flex items-center justify-center relative group">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={`${cls} cover`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-center p-3 text-slate-400 space-y-1">
                          <FaImage className="w-6 h-6 mx-auto text-slate-300" />
                          <span className="text-[11px] block font-medium">
                            কভার ছবি নেই (ডিফল্ট আইকন শো করবে)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-1.5">
                      <label className="block w-full py-2 px-3 bg-white border border-slate-300 hover:border-purple-500 rounded-xl text-center text-xs font-bold text-slate-700 cursor-pointer transition shadow-2xs hover:bg-purple-50/40">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleCoverUpload(
                                String(cls),
                                e.target.files[0],
                                "classes",
                              );
                            }
                          }}
                        />
                        <span className="flex items-center justify-center gap-1.5">
                          <FaCloudArrowUp className="w-3.5 h-3.5 text-purple-600" />
                          <span>
                            {isUploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
                          </span>
                        </span>
                      </label>

                      <input
                        type="url"
                        placeholder="অথবা ইমেজ লিংক পেস্ট করুন..."
                        value={coverUrl || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCovers((prev) => ({
                            ...prev,
                            classes: {
                              ...prev.classes,
                              [cls]: val,
                            },
                          }));
                        }}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          const nextCovers = {
                            ...covers,
                            classes: { ...covers.classes, [cls]: val },
                          };
                          saveStoredQuizCovers(nextCovers);
                          fetch("/api/quiz/covers", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ covers: nextCovers }),
                          }).catch(() => {});
                        }}
                        className="w-full bg-white border border-slate-200 focus:border-purple-600 rounded-xl px-2.5 py-1 text-[11px] text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Subject-wise Test Covers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  বিষয়ভিত্তিক টেস্ট কার্ডের কভার ছবি (
                  {toBengaliClass(selectedClass)} শ্রেণির বিষয়সমূহ)
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  নিচের বিষয়গুলোর কার্ডে কভার ছবি যুক্ত করুন। ছবি না থাকলে
                  ডিফল্ট বিষয় আইকন দেখাবে।
                </p>
              </div>

              {/* Class & Group quick switcher for covers */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[5, 6, 7, 8, 9, 10].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedClass(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                      selectedClass === c
                        ? "bg-purple-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {toBengaliClass(c)}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Group switcher for 9-10 */}
            {(selectedClass === 9 || selectedClass === 10) && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(
                  [
                    "science",
                    "humanities",
                    "commerce",
                    "compulsory",
                  ] as AcademicGroup[]
                ).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGroup(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition border ${
                      selectedGroup === g
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {g === "science"
                      ? "⚛️ বিজ্ঞান"
                      : g === "humanities"
                        ? "📜 মানবিক"
                        : g === "commerce"
                          ? "💼 ব্যবসায়"
                          : "🌐 আবশ্যিক"}
                  </button>
                ))}
              </div>
            )}

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSubjects.map((sub) => {
                const coverUrl = covers.subjects[sub.name];
                const isUploading = uploadingTarget === `subjects_${sub.name}`;

                return (
                  <div
                    key={sub.name}
                    className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 space-y-3 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sub.icon}</span>
                        <span className="text-xs font-black text-slate-800 line-clamp-1">
                          {sub.name}
                        </span>
                      </div>
                      {coverUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCover(sub.name, "subjects")
                          }
                          className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <FaTrash className="w-2.5 h-2.5" />
                          <span>রিমুভ</span>
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="w-full aspect-video rounded-xl bg-white border border-dashed border-slate-300 overflow-hidden flex items-center justify-center relative group">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-center p-3 text-slate-400 space-y-1">
                          <span className="text-2xl block">{sub.icon}</span>
                          <span className="text-[11px] block font-medium">
                            কভার ছবি নেই (আইকন মোড সক্রিয়)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-1.5">
                      <label className="block w-full py-2 px-3 bg-white border border-slate-300 hover:border-blue-500 rounded-xl text-center text-xs font-bold text-slate-700 cursor-pointer transition shadow-2xs hover:bg-blue-50/40">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleCoverUpload(
                                sub.name,
                                e.target.files[0],
                                "subjects",
                              );
                            }
                          }}
                        />
                        <span className="flex items-center justify-center gap-1.5">
                          <FaCloudArrowUp className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {isUploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
                          </span>
                        </span>
                      </label>

                      <input
                        type="url"
                        placeholder="অথবা ইমেজ লিংক পেস্ট করুন..."
                        value={coverUrl || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCovers((prev) => ({
                            ...prev,
                            subjects: {
                              ...prev.subjects,
                              [sub.name]: val,
                            },
                          }));
                        }}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          const nextCovers = {
                            ...covers,
                            subjects: { ...covers.subjects, [sub.name]: val },
                          };
                          saveStoredQuizCovers(nextCovers);
                          fetch("/api/quiz/covers", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ covers: nextCovers }),
                          }).catch(() => {});
                        }}
                        className="w-full bg-white border border-slate-200 focus:border-blue-600 rounded-xl px-2.5 py-1 text-[11px] text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSaveCovers()}
              disabled={isSavingCovers}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:opacity-95 text-white font-black text-sm shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <FaFloppyDisk className="w-4 h-4" />
              <span>
                {isSavingCovers
                  ? "সংরক্ষণ হচ্ছে..."
                  : "সব কভার ইমেজ সংরক্ষণ করুন"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: DYNAMIC CUSTOM MCQ / MODEL TEST CARDS MANAGER
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "cards" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
                <FaLayerGroup /> আনলিমিটেড MCQ টেস্ট কার্ড তৈরি
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                কাস্টম MCQ ও মডেল টেস্ট কার্ড ম্যানেজমেন্ট
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                অ্যাডমিন এখানে ইচ্ছামতো নতুন নতুন মডেল টেস্ট কার্ড তৈরি করতে
                পারবেন এবং প্রতিটির জন্য আলাদা কভার ছবি আপলোড করতে পারবেন।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddNewCard}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-95 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <FaPlus className="w-3.5 h-3.5" />
                <span>নতুন কার্ড যোগ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveCardsToApi(customCards)}
                disabled={isSavingCards}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <FaFloppyDisk className="w-3.5 h-3.5" />
                <span>
                  {isSavingCards ? "সংরক্ষণ হচ্ছে..." : "সব কার্ড সেভ করুন"}
                </span>
              </button>
            </div>
          </div>

          {/* Cards List / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {customCards.map((card, cIdx) => (
              <div
                key={card.id || cIdx}
                className={`bg-white rounded-3xl border-2 p-5 space-y-4 shadow-sm hover:shadow-md transition relative flex flex-col justify-between ${
                  card.isActive
                    ? card.isPaid
                      ? "border-red-200"
                      : "border-emerald-200"
                    : "border-dashed border-slate-300 opacity-70"
                }`}
              >
                {/* Top Bar: Card index, Active toggle, Delete */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      কার্ড #{cIdx + 1}
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={card.isActive}
                        onChange={(e) => {
                          const val = e.target.checked;
                          handleUpdateCard(card.id, { isActive: val });
                          const next = customCards.map((c) =>
                            c.id === card.id ? { ...c, isActive: val } : c,
                          );
                          handleSaveCardsToApi(next);
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>{card.isActive ? "সক্রিয়" : "লুকানো"}</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition cursor-pointer"
                    title="কার্ডটি মুছে ফেলুন"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Individual Cover Image Container */}
                <div className="space-y-2">
                  <div className="w-full aspect-video rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden relative group flex items-center justify-center">
                    {card.coverImage ? (
                      <>
                        <img
                          src={card.coverImage}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="px-3 py-1.5 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-bold cursor-pointer shadow">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleCardCoverUpload(
                                    card.id,
                                    e.target.files[0],
                                  );
                                }
                              }}
                            />
                            ছবি পরিবর্তন
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateCard(card.id, { coverImage: "" });
                              const next = customCards.map((c) =>
                                c.id === card.id ? { ...c, coverImage: "" } : c,
                              );
                              handleSaveCardsToApi(next);
                            }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            রিমুভ
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 space-y-1.5">
                        <FaImage className="w-7 h-7 mx-auto text-slate-300" />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-black cursor-pointer border border-blue-200 transition">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleCardCoverUpload(
                                  card.id,
                                  e.target.files[0],
                                );
                              }
                            }}
                          />
                          <FaCloudArrowUp className="w-3.5 h-3.5" />
                          <span>আলাদা ছবি আপলোড করুন</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Manual URL input fallback */}
                  <input
                    type="url"
                    placeholder="অথবা কভার ইমেজ লিঙ্ক পেস্ট করুন..."
                    value={card.coverImage || ""}
                    onChange={(e) =>
                      handleUpdateCard(card.id, { coverImage: e.target.value })
                    }
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      const next = customCards.map((c) =>
                        c.id === card.id ? { ...c, coverImage: val } : c,
                      );
                      handleSaveCardsToApi(next);
                    }}
                    className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                {/* Form Fields: Title, Subtitle */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      কার্ডের শিরোনাম (Title)
                    </label>
                    <input
                      type="text"
                      required
                      value={card.title}
                      onChange={(e) =>
                        handleUpdateCard(card.id, { title: e.target.value })
                      }
                      onBlur={() => handleSaveCardsToApi(customCards)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      উপ-শিরোনাম / সংক্ষিপ্ত বিবরণ
                    </label>
                    <input
                      type="text"
                      value={card.subtitle || ""}
                      onChange={(e) =>
                        handleUpdateCard(card.id, { subtitle: e.target.value })
                      }
                      onBlur={() => handleSaveCardsToApi(customCards)}
                      placeholder="যেমন: অধ্যায় ১-৩ প্রস্তুতি ও ব্যাখ্যা"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  {/* Class, Subject, Badge Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        শ্রেণি (Class)
                      </label>
                      <select
                        value={card.classGrade}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleUpdateCard(card.id, { classGrade: val });
                          const next = customCards.map((c) =>
                            c.id === card.id ? { ...c, classGrade: val } : c,
                          );
                          handleSaveCardsToApi(next);
                        }}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none cursor-pointer"
                      >
                        {[5, 6, 7, 8, 9, 10].map((c) => (
                          <option key={c} value={c}>
                            {toBengaliClass(c)} শ্রেণি
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        ব্যাজ / ট্যাগ (Badge)
                      </label>
                      <input
                        type="text"
                        value={card.badge || ""}
                        onChange={(e) =>
                          handleUpdateCard(card.id, { badge: e.target.value })
                        }
                        onBlur={() => handleSaveCardsToApi(customCards)}
                        placeholder="যেমন: স্পেশাল / মেগা"
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">
                      বিষয় (Subject)
                    </label>
                    <input
                      type="text"
                      value={card.subject}
                      onChange={(e) =>
                        handleUpdateCard(card.id, { subject: e.target.value })
                      }
                      onBlur={() => handleSaveCardsToApi(customCards)}
                      placeholder="যেমন: পদার্থবিজ্ঞান"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 outline-none"
                    />
                  </div>

                  {/* Free vs Paid Toggle & Price */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-black">
                        <input
                          type="checkbox"
                          checked={card.isPaid}
                          onChange={(e) => {
                            const isPaid = e.target.checked;
                            const price = isPaid ? card.price || 50 : 0;
                            handleUpdateCard(card.id, { isPaid, price });
                            const next = customCards.map((c) =>
                              c.id === card.id ? { ...c, isPaid, price } : c,
                            );
                            handleSaveCardsToApi(next);
                          }}
                          className="rounded text-[#C8102E] focus:ring-[#C8102E] w-4 h-4 cursor-pointer"
                        />
                        <span>
                          {card.isPaid
                            ? "💎 পেইড মডেল টেস্ট"
                            : "🎁 ১০০% ফ্রি টেস্ট"}
                        </span>
                      </label>

                      {card.isPaid && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-500">
                            ফি: ৳
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={card.price}
                            onChange={(e) =>
                              handleUpdateCard(card.id, {
                                price: Number(e.target.value) || 0,
                              })
                            }
                            onBlur={() => handleSaveCardsToApi(customCards)}
                            className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-black text-[#C8102E] outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7:  JSON AUTO-IMPORT MANAGER (SUBJECT-WISE & ALL-SUBJECTS)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "import-json" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-teal-800 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200">
                <FaCloudArrowUp /> স্মার্ট JSON ফাইল অটো-ইমপোর্টার
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                JSON ফাইল থেকে বিষয়ভিত্তিক ও সকল বিষয়ের MCQ ইমপোর্ট
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl font-medium">
                এক ক্লিকে সকল বিষয়ের প্রশ্ন একসাথে অথবা পছন্দের নির্দিষ্ট একটি বিষয় সিলেক্ট করে JSON ফাইল আপলোড করুন। স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট বিষয়ের অধীনে সাজিয়ে সার্ভারে সেভ হয়ে যাবে।
              </p>
            </div>

            {/* Scope / Mode Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setImportScope("all")}
                className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  importScope === "all"
                    ? "bg-[#0A1E3C] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🌐</span>
                <span>সকল বিষয় একসাথে</span>
              </button>
              <button
                type="button"
                onClick={() => setImportScope("single")}
                className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  importScope === "single"
                    ? "bg-[#C8102E] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🎯</span>
                <span>নির্দিষ্ট বিষয়ভিত্তিক</span>
              </button>
            </div>
          </div>

          {/* Configuration Bar: Class Selector & (if single mode) Subject Selector */}
          <div className="bg-gradient-to-r from-slate-50 to-teal-50/30 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            {/* Target Class Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-slate-700">
                টার্গেট শ্রেণি:
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                {[5, 6, 7, 8, 9, 10].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setImportTargetClass(c)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition cursor-pointer ${
                      importTargetClass === c
                        ? "bg-[#C8102E] text-white shadow-xs"
                        : "bg-transparent text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">
                ({toBengaliClass(importTargetClass)} শ্রেণি)
              </span>
            </div>

            {/* Target Subject Selector (Visible when Single Subject mode is active) */}
            {importScope === "single" ? (
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-red-200 shadow-xs">
                <span className="text-xs font-black text-red-950 flex items-center gap-1">
                  <span>🎯</span>
                  <span>বিষয় নির্বাচন করুন:</span>
                </span>
                <select
                  value={importTargetSubject}
                  onChange={(e) => setImportTargetSubject(e.target.value)}
                  className="bg-red-50/50 hover:bg-red-50 text-slate-800 text-xs font-black py-1.5 px-3 rounded-lg border border-red-200 outline-none cursor-pointer"
                >
                  {importAvailableSubjects.map((sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.icon} {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-xs font-bold text-teal-800 bg-teal-100/60 px-3 py-1.5 rounded-xl border border-teal-200">
                ✓ সকল বিষয়ের কী (bangla, math, science ইত্যাদি) স্বয়ংক্রিয়ভাবে শনাক্ত হবে
              </div>
            )}
          </div>

          {/* TWO MAIN UPLOAD TILES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OPTION 1: ⚡ DIRECT IMPORT FROM SERVER FILE */}
            <div className="bg-gradient-to-br from-teal-50/70 via-emerald-50/50 to-white border-2 border-teal-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-teal-950">
                    সার্ভারে বিদ্যমান ফাইল থেকে ১-ক্লিকে অটো ইমপোর্ট
                  </h4>
                  <p className="text-[11px] text-teal-700 font-medium">
                    প্রজেক্টের{" "}
                    <code className="bg-teal-100/70 px-1 py-0.5 rounded font-mono font-bold">
                      data/mcq_questions.json
                    </code>{" "}
                    ফাইল থেকে সরাসরি সেভ করুন
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-3.5 rounded-2xl border border-teal-200/80 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                  <span>✓</span>
                  <span>
                    কম্পিউটার বা ফোন থেকে আলাদা ফাইল সিলেক্ট করার প্রয়োজন নেই।
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                  <span>✓</span>
                  <span>
                    ৭টি বিষয়ের প্রায় ৭,০০০+ প্রশ্ন সেকেন্ডের মধ্যে অটো-ম্যাপ হয়ে সার্ভারে সেভ হবে।
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                  <span>✓</span>
                  <span>
                    টার্গেট: {toBengaliClass(importTargetClass)} শ্রেণির সকল বিষয়ের প্রশ্নব্যাংক।
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isImportingJson}
                onClick={handleImportServerFileDirect}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 hover:from-teal-800 hover:to-emerald-900 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isImportingJson ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>প্রসেস ও ইমপোর্ট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>
                      ⚡ সার্ভারের mcq_questions.json থেকে সব বিষয়ে অটো-ইমপোর্ট করুন
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* OPTION 2: 📁 UPLOAD CUSTOM JSON FILE FROM DEVICE */}
            <div className="bg-gradient-to-br from-slate-50 via-red-50/20 to-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0A1E3C] text-white flex items-center justify-center text-xl shadow-md shrink-0">
                  📁
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-800">
                    {importScope === "single"
                      ? `"${importTargetSubject}" বিষয়ের JSON ফাইল আপলোড`
                      : "ডিভাইস থেকে কাস্টম JSON ফাইল আপলোড"}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {importScope === "single"
                      ? `এই ফাইলে থাকা সকল প্রশ্ন সরাসরি "${importTargetSubject}" বিষয়ের অধীনে যুক্ত হবে`
                      : "আপনার কম্পিউটার বা ফোন থেকে যেকোনো .json ফাইল ড্রপ বা সিলেক্ট করুন"}
                  </p>
                </div>
              </div>

              <div className="relative border-2 border-dashed border-slate-300 hover:border-[#C8102E] bg-white rounded-2xl p-6 text-center transition group cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1.5 pointer-events-none">
                  <div className="text-2xl text-slate-400 group-hover:text-[#C8102E] transition">
                    📂
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    {jsonImportFile
                      ? `নির্বাচিত ফাইল: ${jsonImportFile.name} (${(jsonImportFile.size / 1024).toFixed(1)} KB)`
                      : "JSON ফাইলটি এখানে ক্লিক করে নির্বাচন করুন"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    সমর্থিত ফরম্যাট: .json (ম্যাক্সিমাম ২০ মেগাবাইট)
                  </p>
                </div>
              </div>

              {jsonImportFile && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-500">
                    ফাইল লোড সফল হয়েছে
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setJsonImportFile(null);
                      setRawParsedJson(null);
                      setJsonImportPreview(null);
                    }}
                    className="text-xs font-bold text-[#C8102E] hover:underline cursor-pointer"
                  >
                    ফাইল পরিবর্তন / বাতিল করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DETECTED PREVIEW OF UPLOADED JSON */}
          {jsonImportPreview && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md">
                <div>
                  <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                    {importScope === "single"
                      ? "বিষয়ভিত্তিক প্রিভিউ ও সারাংশ"
                      : "ফাইল প্রিভিউ ও সারাংশ"}
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    {importScope === "single" ? (
                      <>
                        <span>{importAvailableSubjects.find(s => s.name === importTargetSubject)?.icon || "📚"}</span>
                        <span>{importTargetSubject}</span>
                        <span className="text-emerald-400 font-mono text-sm">
                          ({jsonImportPreview.totalQuestions.toLocaleString("bn-BD")}টি MCQ পাওয়া গেছে)
                        </span>
                      </>
                    ) : (
                      <>
                        মোট {jsonImportPreview.subjects.length}টি বিষয়ে{" "}
                        {jsonImportPreview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন প্রস্তুত আছে
                      </>
                    )}
                  </h4>
                  <p className="text-xs text-slate-300">
                    টার্গেট শ্রেণি:{" "}
                    <span className="font-black text-amber-300">
                      {toBengaliClass(importTargetClass)} শ্রেণি
                    </span>
                    {importScope === "single" && (
                      <span className="ml-2 text-slate-400">
                        • মোড: নির্দিষ্ট বিষয়ভিত্তিক
                      </span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isImportingJson}
                  onClick={handleSaveImportedBatch}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {isImportingJson ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-3.5 h-3.5" />
                      <span>
                        {importScope === "single"
                          ? `"${importTargetSubject}" বিষয়ের প্রশ্ন সেভ করুন`
                          : "সবগুলো বিষয়ের প্রশ্ন সার্ভারে সেভ করুন"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* In Single Subject Mode: Display sample preview of first 3 questions */}
              {importScope === "single" && jsonImportPreview.subjects[0]?.questions?.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700 border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span>👁️</span>
                      <span>শনাক্তকৃত প্রশ্নের নমুনা প্রিভিউ (প্রথম ৩টি প্রশ্ন):</span>
                    </span>
                    <span className="text-teal-700">
                      মোট: {jsonImportPreview.totalQuestions.toLocaleString("bn-BD")}টি প্রশ্ন
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {jsonImportPreview.subjects[0].questions.slice(0, 3).map((q, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs"
                      >
                        <p className="font-bold text-slate-800 line-clamp-2">
                          <span className="text-red-600 font-mono mr-1">#{idx + 1}.</span>
                          {q.q}
                        </p>
                        <div className="space-y-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center justify-between ${
                                oIdx === q.ans
                                  ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-300"
                                  : "bg-slate-50 text-slate-600"
                              }`}
                            >
                              <span>{["ক", "খ", "গ", "ঘ"][oIdx]}. {opt}</span>
                              {oIdx === q.ans && (
                                <span className="text-[10px] text-emerald-700 font-bold">✓ সঠিক</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-[10px] text-slate-500 italic bg-amber-50/60 p-1.5 rounded border border-amber-200/50 line-clamp-2">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In All Subjects Mode: Grid of detected subjects */}
              {importScope === "all" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {jsonImportPreview.subjects.map((subj) => (
                    <div
                      key={subj.key}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{subj.icon}</span>
                        <div className="space-y-0.5">
                          <h5 className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">
                            {subj.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            কী (Key): "{subj.key}"
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          প্রশ্ন সংখ্যা:
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-black">
                          {subj.count.toLocaleString("bn-BD")}টি MCQ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMPREHENSIVE HELP, RULES & FORMAT GUIDE */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>💡</span>
                  <span>JSON ফাইল তৈরির নিয়মাবলী ও ফরম্যাট নির্দেশিকা</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  যেকোনো একটি সমর্থিত ফরম্যাটে আপনার প্রশ্নের .json ফাইল তৈরি করুন।
                </p>
              </div>

              {/* Sample Download Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadSampleJson("single")}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black shadow-2xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <FaDownload className="text-[#C8102E]" />
                  <span>একক বিষয়ের স্যাম্পল JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSampleJson("multi")}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-black shadow-2xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <FaDownload className="text-teal-700" />
                  <span>সকল বিষয়ের স্যাম্পল JSON</span>
                </button>
              </div>
            </div>

            {/* Visual Format Tabs / Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* FORMAT 1: Flat Array (Recommended for single subject) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">১</span>
                    <span>সরাসরি প্রশ্নের অ্যারে (সবচেয়ে সহজ)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black rounded-full border border-emerald-200">
                    রেকমেন্ডেড
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  একটি সাধারণ অ্যারে যাতে প্রতিটি প্রশ্নের জন্য অবজেক্ট থাকবে:
                </p>
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`[
  {
    "q": "বাংলাদেশের রাজধানী কোনটি?",
    "o": ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী"],
    "a": 0,
    "e": "১৯৭১ সালে ঢাকা বাংলাদেশের রাজধানী হয়।"
  },
  {
    "q": "বৃত্তের বৃহত্তম জ্যা কোনটি?",
    "o": ["ব্যাসার্ধ", "পরিধি", "ব্যাস", "চাপ"],
    "a": 2
  }
]`}
                </pre>
              </div>

              {/* FORMAT 2: Tests & Questions structure (mcq_questions.json style) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px] font-black">২</span>
                    <span>অধ্যায়/টেস্ট ভিত্তিক ফরম্যাট</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-black rounded-full border border-blue-200">
                    tests[].qs[]
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  টেস্ট বা অধ্যায় ভিত্তিক সেটের ভেতরে প্রশ্নের লিস্ট:
                </p>
                <pre className="bg-slate-900 text-sky-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`{
  "tests": [
    {
      "qs": [
        {
          "q": "পানির রাসায়নিক সংকেত কোনটি?",
          "o": ["CO2", "H2O", "NaCl", "O2"],
          "a": 1,
          "e": "পানি হলো H2O"
        }
      ]
    }
  ]
}`}
                </pre>
              </div>

              {/* FORMAT 3: Multi-Subject Object */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[11px] font-black">৩</span>
                    <span>একাধিক বিষয় একসাথে</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 font-black rounded-full border border-purple-200">
                    Multi-Subject
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  প্রতিটি বিষয়ের নাম বা কী দিয়ে আলাদা করা:
                </p>
                <pre className="bg-slate-900 text-purple-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`{
  "bangla": {
    "tests": [{ "qs": [...] }]
  },
  "math": [
    { "q": "...", "o": [...], "a": 0 }
  ],
  "science": { ... }
}`}
                </pre>
              </div>
            </div>

            {/* FIELD DICTIONARY / RULES TABLE */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider text-slate-500">
                📋 ফিল্ডগুলোর বিবরণ ও প্রয়োজনীয় শর্তাবলী:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-red-600 font-bold font-mono">q / question</code>
                    <span className="text-[10px] bg-red-100 text-red-800 font-black px-1.5 py-0.5 rounded">আবশ্যক</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    প্রশ্নের মূল টেক্সট বা বাক্য। যেমন: <span className="font-medium text-slate-800">"বাংলাদেশের জাতীয় ফুল কোনটি?"</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-red-600 font-bold font-mono">o / options</code>
                    <span className="text-[10px] bg-red-100 text-red-800 font-black px-1.5 py-0.5 rounded">আবশ্যক</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    ৪টি উত্তরের অপশনযুক্ত অ্যারে। যেমন: <span className="font-mono text-slate-700 font-medium">["গোলাপ", "শাপলা", "বেলি", "জবা"]</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-red-600 font-bold font-mono">a / ans</code>
                    <span className="text-[10px] bg-red-100 text-red-800 font-black px-1.5 py-0.5 rounded">আবশ্যক</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    সঠিক উত্তরের ক্রমিক সংখ্যা (০ থেকে ৩):
                    <br />
                    <span className="font-mono text-emerald-700 font-bold">0</span> = ১ম অপশন (ক), <span className="font-mono text-emerald-700 font-bold">1</span> = ২য় (খ), <span className="font-mono text-emerald-700 font-bold">2</span> = ৩য় (গ), <span className="font-mono text-emerald-700 font-bold">3</span> = ৪র্থ (ঘ)।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-slate-700 font-bold font-mono">e / explanation</code>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-black px-1.5 py-0.5 rounded">ঐচ্ছিক</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    সঠিক উত্তরের পেছনে তথ্যমূলক ব্যাখ্যা। শিক্ষার্থী পরীক্ষা শেষে এই ব্যাখ্যা দেখতে পাবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. CUSTOM EXAMS TAB
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "custom-exams" && (
        <AdminCustomExamsTab
          onNavigateToResults={(examId) => {
            setSelectedResultExamId(examId);
            setActiveTab("results");
          }}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. EXAM RESULTS & LEADERBOARD TAB
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "results" && (
        <AdminQuizResultsTab initialExamId={selectedResultExamId} />
      )}
    </div>
  );
}
