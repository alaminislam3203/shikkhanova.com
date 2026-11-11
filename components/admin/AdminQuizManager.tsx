'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
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
  QuizPackageItem,
  DEFAULT_QUIZ_PACKAGES,
  getStoredQuizPackages,
  saveStoredQuizPackages,
  PackageUnlockScope,
} from '@/lib/defaultQuizData';
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
} from 'react-icons/fa6';

type QuizCategory = 'free' | 'paid' | 'subject';

export default function AdminQuizManager() {
  const [category, setCategory] = useState<QuizCategory>('free');
  const [selectedClass, setSelectedClass] = useState<number>(6);
  const [selectedGroup, setSelectedGroup] = useState<AcademicGroup>('science');
  const [selectedSubject, setSelectedSubject] = useState<string>('বাংলা ১ম পত্র');

  const availableSubjects = useMemo(() => {
    return getSubjectsForClassAndGroup(selectedClass, selectedGroup);
  }, [selectedClass, selectedGroup]);

  // Keep selectedSubject in sync with available subjects
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.some((s) => s.name === selectedSubject)) {
      setSelectedSubject(availableSubjects[0].name);
    }
  }, [availableSubjects, selectedSubject]);

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'bulk' | 'prices'>('list');
  const [questions, setQuestions] = useState<RawQuestion[]>([]);

  // Quiz Pricing & Special Packages Management State (SSR safe)
  const [prices, setPrices] = useState<QuizPrices>(DEFAULT_QUIZ_PRICES);
  const [packages, setPackages] = useState<QuizPackageItem[]>(DEFAULT_QUIZ_PACKAGES);
  const [isSavingPrices, setIsSavingPrices] = useState<boolean>(false);

  // Add / Edit Form State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formQ, setFormQ] = useState<string>('');
  const [formA, setFormA] = useState<string>('');
  const [formB, setFormB] = useState<string>('');
  const [formC, setFormC] = useState<string>('');
  const [formD, setFormD] = useState<string>('');
  const [formAns, setFormAns] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState<string>('');

  // Bulk State
  const [bulkText, setBulkText] = useState<string>('');

  // Notification message
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

    fetch('/api/quiz/prices')
      .then((res) => res.json())
      .then((data) => {
        if (data?.prices) {
          setPrices(data.prices);
          saveStoredQuizPrices(data.prices);
        }
      })
      .catch(() => {});

    fetch('/api/quiz/packages')
      .then((res) => res.json())
      .then((data) => {
        if (data?.packages && Array.isArray(data.packages)) {
          setPackages(data.packages);
          saveStoredQuizPackages(data.packages);
        }
      })
      .catch(() => {});
  }, []);

  // Save Quiz Prices & Special Packages Handler with Instant Toast Feedback
  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrices(true);
    const saveToastId = toast.loading('সব মূল্য ও প্যাকেজ সংরক্ষণ করা হচ্ছে...');
    try {
      const [resPrices, resPackages] = await Promise.all([
        fetch('/api/quiz/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prices),
        }),
        fetch('/api/quiz/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packages }),
        }),
      ]);

      const dataPrices = await resPrices.json();
      const dataPackages = await resPackages.json();

      if (resPrices.ok && resPackages.ok) {
        saveStoredQuizPrices(prices);
        saveStoredQuizPackages(packages);
        toast.success(dataPackages.message || 'কুইজ ও স্পেশাল প্যাকেজ সফলভাবে সংরক্ষিত হয়েছে!', {
          id: saveToastId,
          duration: 4000,
        });
        setMsg({ text: 'কুইজের মূল্য ও স্পেশাল মডেল টেস্ট প্যাকেজ সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!', type: 'success' });
      } else {
        toast.error(dataPrices.error || dataPackages.error || 'মূল্য বা প্যাকেজ সংরক্ষণ ব্যর্থ হয়েছে।', {
          id: saveToastId,
        });
        setMsg({ text: dataPrices.error || dataPackages.error || 'সংরক্ষণ ব্যর্থ হয়েছে।', type: 'error' });
      }
    } catch (err: any) {
      toast.error(err.message || 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।', {
        id: saveToastId,
      });
      setMsg({ text: err.message || 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।', type: 'error' });
    } finally {
      setIsSavingPrices(false);
    }
  };

  // Reset Prices to Defaults with Toast
  const handleResetPricesToDefault = () => {
    if (!confirm('আপনি কি সকল কুইজ ও প্যাকেজের মূল্য মূল ডিফল্ট ফি-তে ফিরিয়ে নিতে চান?')) return;
    setPrices(DEFAULT_QUIZ_PRICES);
    saveStoredQuizPrices(DEFAULT_QUIZ_PRICES);
    toast.success('কুইজের মূল্য ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে। সংরক্ষণ করতে "সব মূল্য সংরক্ষণ করুন" বাটনে ক্লিক করুন।', {
      duration: 4000,
    });
    setMsg({ text: '🔄 কুইজের মূল্য ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে। সংরক্ষণ করতে "সব মূল্য সংরক্ষণ করুন" বাটনে ক্লিক করুন।', type: 'success' });
  };

  // Package Management Handlers
  const handleAddNewPackage = () => {
    const newPkg: QuizPackageItem = {
      id: `pkg_${Date.now()}`,
      title: 'নতুন স্পেশাল প্যাকেজ',
      badge: 'স্পেশাল অফার',
      tagline: 'মডেল টেস্ট ও পূর্ণাঙ্গ সমাধানের বিশেষ অফার।',
      price: 100,
      originalPrice: 180,
      features: [
        'পূর্ণাঙ্গ মডেল টেস্ট অ্যাক্সেস',
        'তাৎক্ষণিক স্কোর ও গ্রেড শিট',
        'ব্যাখ্যাসহ প্রতিটি প্রশ্নের সঠিক উত্তর',
      ],
      unlockScope: 'single_class',
      isPopular: false,
      isActive: true,
      accentColor: 'red',
    };
    setPackages((prev) => [...prev, newPkg]);
    toast.success('নতুন প্যাকেজ কার্ড যুক্ত করা হয়েছে! তথ্য পূরণ করে সংরক্ষণ বাটনে ক্লিক করুন।');
  };

  const handleUpdatePackage = (id: string, updates: Partial<QuizPackageItem>) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    );
  };

  const handleDeletePackage = (id: string) => {
    if (!confirm('আপনি কি এই প্যাকেজটি মুছে ফেলতে চান?')) return;
    setPackages((prev) => prev.filter((p) => p.id !== id));
    toast.success('প্যাকেজটি তালিকা থেকে মুছে ফেলা হয়েছে।');
  };

  const handleResetPackagesToDefault = () => {
    if (!confirm('আপনি কি স্পেশাল মডেল টেস্ট প্যাকেজসমূহ মূল ডিফল্ট তালিকায় ফিরিয়ে নিতে চান?')) return;
    setPackages(DEFAULT_QUIZ_PACKAGES);
    saveStoredQuizPackages(DEFAULT_QUIZ_PACKAGES);
    toast.success('প্যাকেজসমূহ ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে।');
  };

  // Load questions whenever category, class, or subject changes
  useEffect(() => {
    loadCurrentQuestions();
    setEditingIndex(null);
    resetForm();
  }, [category, selectedClass, selectedSubject]);

  const loadCurrentQuestions = () => {
    if (category === 'free') {
      setQuestions(getStoredFreeQuestions(selectedClass));
    } else if (category === 'paid') {
      setQuestions(getStoredPaidQuestions(selectedClass));
    } else {
      setQuestions(getStoredSubjectQuestions(selectedClass, selectedSubject));
    }
  };

  const persistQuestions = (updated: RawQuestion[]) => {
    setQuestions(updated);
    if (category === 'free') {
      saveStoredFreeQuestions(selectedClass, updated);
    } else if (category === 'paid') {
      saveStoredPaidQuestions(selectedClass, updated);
    } else {
      saveStoredSubjectQuestions(selectedClass, selectedSubject, updated);
    }
  };

  const resetForm = () => {
    setFormQ('');
    setFormA('');
    setFormB('');
    setFormC('');
    setFormD('');
    setFormAns(0);
    setFormExplanation('');
    setEditingIndex(null);
  };

  // Add / Update Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQ.trim() || !formA.trim() || !formB.trim() || !formC.trim() || !formD.trim()) {
      toast.error('অনুগ্রহ করে প্রশ্ন এবং ৪টি অপশন অবশ্যই পূরণ করুন।');
      setMsg({ text: 'অনুগ্রহ করে প্রশ্ন এবং ৪টি অপশন অবশ্যই পূরণ করুন।', type: 'error' });
      return;
    }

    const newQuestion: RawQuestion = {
      q: formQ.trim(),
      options: [formA.trim(), formB.trim(), formC.trim(), formD.trim()],
      ans: formAns,
      explanation: formExplanation.trim() || undefined,
      isPremium: category === 'paid',
    };

    let updatedList = [...questions];
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < updatedList.length) {
      updatedList[editingIndex] = newQuestion;
      toast.success('প্রশ্ন সফলভাবে আপডেট করা হয়েছে!');
      setMsg({ text: 'প্রশ্ন সফলভাবে আপডেট করা হয়েছে!', type: 'success' });
    } else {
      updatedList.push(newQuestion);
      toast.success('নতুন প্রশ্ন সফলভাবে যুক্ত করা হয়েছে!');
      setMsg({ text: 'নতুন প্রশ্ন সফলভাবে যুক্ত করা হয়েছে!', type: 'success' });
    }

    persistQuestions(updatedList);
    resetForm();
    setActiveTab('list');
  };

  // Start Edit
  const handleStartEdit = (index: number) => {
    const target = questions[index];
    if (!target) return;
    setEditingIndex(index);
    setFormQ(target.q);
    setFormA(target.options[0] || '');
    setFormB(target.options[1] || '');
    setFormC(target.options[2] || '');
    setFormD(target.options[3] || '');
    setFormAns(target.ans);
    setFormExplanation(target.explanation || '');
    setActiveTab('add');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Delete Question
  const handleDeleteQuestion = (index: number) => {
    if (!confirm(`আপনি কি ${index + 1} নম্বর প্রশ্নটি মুছে ফেলতে চান?`)) return;
    const updated = questions.filter((_, i) => i !== index);
    persistQuestions(updated);
    toast.success('প্রশ্ন মুছে ফেলা হয়েছে।');
    setMsg({ text: '🗑️ প্রশ্ন মুছে ফেলা হয়েছে।', type: 'success' });
  };

  // Reset to Factory Defaults
  const handleResetToDefault = () => {
    const confirmed = confirm(
      'সতর্কতা: এটি বর্তমান শ্রেণি ও ক্যাটাগরির সকল কাস্টম পরিবর্তন মুছে দিয়ে মূল ডিফল্ট প্রশ্নগুলো ফিরিয়ে আনবে। আপনি কি নিশ্চিত?'
    );
    if (!confirmed) return;

    let defaults: RawQuestion[] = [];
    if (category === 'free') {
      defaults = FREE_CLASS_QUESTIONS[selectedClass] || [];
    } else if (category === 'paid') {
      defaults = PAID_CLASS_QUESTIONS[selectedClass] || [];
    } else {
      defaults = SUBJECT_QUESTIONS[selectedSubject] || [];
    }

    persistQuestions(defaults);
    toast.success('ডিফল্ট প্রশ্ন সফলভাবে রিস্টোর হয়েছে।');
    setMsg({ text: '🔄 ডিফল্ট প্রশ্ন সফলভাবে রিস্টোর হয়েছে।', type: 'success' });
  };

  // Bulk Import
  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      toast.error('কোনো প্রশ্ন পাওয়া যায়নি। সঠিক ফরম্যাটে লিখুন।');
      setMsg({ text: 'কোনো প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে সঠিক ফরম্যাটে লিখুন।', type: 'error' });
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;
    const newItems: RawQuestion[] = [];

    lines.forEach((line) => {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 6) {
        const qText = parts[0];
        const ops: [string, string, string, string] = [parts[1], parts[2], parts[3], parts[4]];
        const ansChar = parts[5].toUpperCase();
        const ansIdx = ansChar === 'A' ? 0 : ansChar === 'B' ? 1 : ansChar === 'C' ? 2 : ansChar === 'D' ? 3 : 0;
        const exp = parts[6] ? parts[6] : undefined;

        newItems.push({
          q: qText,
          options: ops,
          ans: ansIdx,
          explanation: exp,
          isPremium: category === 'paid',
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    });

    const updated = [...questions, ...newItems];
    persistQuestions(updated);
    setBulkText('');
    toast.success(`${addedCount}টি প্রশ্ন সফলভাবে যোগ হয়েছে!`);
    setMsg({
      text: `${addedCount}টি প্রশ্ন সফলভাবে যোগ হয়েছে! ${skippedCount > 0 ? `(${skippedCount}টি লাইন সঠিক ছিল না)` : ''}`,
      type: 'success',
    });
    setActiveTab('list');
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
            শুধুমাত্র অ্যাডমিন প্যানেল থেকেই সকল শ্রেণির ফ্রি, পেইড এবং বিষয়ভিত্তিক মডেল টেস্টের MCQ প্রশ্ন যোগ, এডিট ও
            নিয়ন্ত্রণ করা যাবে।
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
                onClick={() => setCategory('free')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FaGift className="w-3 h-3" />
                <span>ফ্রি টেস্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('paid')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === 'paid'
                    ? 'bg-[#C8102E] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FaGem className="w-3 h-3" />
                <span>পেইড টেস্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('subject')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  category === 'subject'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FaBookOpen className="w-3 h-3" />
                <span>বিষয়ভিত্তিক</span>
              </button>
            </div>
          </div>

          {/* Class Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">শ্রেণি নির্বাচন</label>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1.5 rounded-2xl">
              {[5, 6, 7, 8, 9, 10].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedClass(c)}
                  className={`py-2 rounded-xl text-xs font-black transition ${
                    selectedClass === c
                      ? 'bg-gradient-to-tr from-[#9B0D23] via-[#C8102E] to-[#E5254A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
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
              {category === 'subject' ? 'বিষয় নির্বাচন করুন' : 'নির্বাচিত স্ট্যাটাস'}
            </label>
            {category === 'subject' ? (
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
          {category === 'subject' && (selectedClass === 9 || selectedClass === 10) && (
            <div className="col-span-1 md:col-span-3 pt-3 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>🎓 {toBengaliClass(selectedClass)} শ্রেণির বিভাগ নির্বাচন:</span>
                  <span className="text-[10px] bg-red-50 text-[#C8102E] font-bold px-2 py-0.5 rounded-full border border-red-200">
                    বিভাগভিত্তিক MCQ ম্যানেজমেন্ট
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  নির্বাচিত বিভাগের বিষয়গুলো পাশের ড্রপডাউনে স্বয়ংক্রিয়ভাবে লোড হবে
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroup('science')}
                  className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                    selectedGroup === 'science'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-200 border-slate-200'
                  }`}
                >
                  <span className="text-base">⚛️</span>
                  <span>বিজ্ঞান বিভাগ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('humanities')}
                  className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                    selectedGroup === 'humanities'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-amber-50 hover:border-amber-200 border-slate-200'
                  }`}
                >
                  <span className="text-base">📜</span>
                  <span>মানবিক বিভাগ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('commerce')}
                  className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                    selectedGroup === 'commerce'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200'
                  }`}
                >
                  <span className="text-base">💼</span>
                  <span>ব্যবসায় শিক্ষা</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('compulsory')}
                  className={`p-2.5 rounded-xl text-xs font-black transition border flex items-center justify-center gap-2 ${
                    selectedGroup === 'compulsory'
                      ? 'bg-[#0A1E3C] text-white border-[#0A1E3C] shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 border-slate-200'
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
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'list'
              ? 'bg-[#0A1E3C] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FaFileLines className="w-3.5 h-3.5" />
          <span>প্রশ্ন তালিকা ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveTab('add');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'add'
              ? 'bg-[#C8102E] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>{editingIndex !== null ? 'প্রশ্ন এডিট করুন' : 'একক MCQ যোগ'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'bulk'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FaBookOpen className="w-3.5 h-3.5" />
          <span>বাল্ক আপলোড (Bulk Import)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'prices'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FaCoins className="w-3.5 h-3.5 text-amber-400" />
          <span>কুইজ ফি ও মূল্য নিয়ন্ত্রণ (Pricing)</span>
        </button>
      </div>

      {/* Alert Message */}
      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="text-xs font-black">
            ✕
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE QUESTION LIST
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">
                {toBengaliClass(selectedClass)} শ্রেণি —{' '}
                {category === 'free'
                  ? 'ফ্রি মডেল টেস্ট প্রশ্নমালা'
                  : category === 'paid'
                  ? 'প্রিমিয়াম মডেল টেস্ট প্রশ্নমালা'
                  : `${selectedSubject} বিষয়ের প্রশ্নমালা ${
                      selectedClass >= 9
                        ? selectedGroup === 'science'
                          ? '(বিজ্ঞান বিভাগ)'
                          : selectedGroup === 'humanities'
                          ? '(মানবিক বিভাগ)'
                          : selectedGroup === 'commerce'
                          ? '(ব্যবসায় শিক্ষা)'
                          : '(আবশ্যিক বিষয়)'
                        : ''
                    }`}
              </h3>
              <p className="text-xs text-slate-500 font-medium">মোট প্রশ্ন সংখ্যা: {questions.length}টি</p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('add');
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
                onClick={() => setActiveTab('add')}
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
                      <p className="text-sm font-bold text-slate-900 leading-snug">{q.q}</p>
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
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
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
      {activeTab === 'add' && (
        <form
          onSubmit={handleSaveQuestion}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">
                {editingIndex !== null ? 'প্রশ্ন এডিট করুন' : 'নতুন MCQ প্রশ্ন যোগ করুন'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                নির্বাচিত শ্রেণি: <strong>{toBengaliClass(selectedClass)} শ্রেণি</strong> • ক্যাটাগরি:{' '}
                <strong>
                  {category === 'free' ? 'ফ্রি' : category === 'paid' ? 'পেইড' : selectedSubject}
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
              <label className="text-xs font-bold text-slate-700 block mb-1">অপশন A *</label>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">অপশন B *</label>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">অপশন C *</label>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">অপশন D *</label>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">সঠিক উত্তর নির্বাচন করুন *</label>
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
              {editingIndex !== null ? '💾 পরিবর্তন সংরক্ষণ করুন' : '➕ প্রশ্ন যুক্ত করুন'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('list')}
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
      {activeTab === 'bulk' && (
        <form
          onSubmit={handleBulkImport}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">📋 একসাথে অনেকগুলো MCQ আপলোড (Bulk Import)</h3>
              <p className="text-xs text-slate-500 font-medium">
                নোটপ্যাড বা ওয়ার্ড থেকে কপি করে এক ক্লিকে ডজনখানেক প্রশ্ন যুক্ত করুন।
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FaCircleInfo className="text-[#C8102E]" />
              <span>ফরম্যাট লেখার নিয়মাবলী:</span>
            </div>
            <p>
              প্রতি লাইনে একটি করে প্রশ্ন পাইপ (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold text-[#C8102E]">|</code>) চিহ্ন দিয়ে আলাদা করে লিখুন:
            </p>
            <p className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              প্রশ্ন | অপশন A | অপশন B | অপশন C | অপশন D | সঠিক উত্তর (A/B/C/D) | ব্যাখ্যা (ঐচ্ছিক)
            </p>
            <p className="text-[11px] text-slate-400">
              উদাহরণ: <span className="font-mono">বাংলাদেশের জাতীয় ফল কোনটি? | আম | কাঁঠাল | লিচু | পেয়ারা | B | কাঁঠাল বাংলাদেশের জাতীয় ফল।</span>
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
              📥 সব প্রশ্ন যোগ করুন (Import Now)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('list')}
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
      {activeTab === 'prices' && (
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
                অ্যাডমিন এখান থেকে যেকোনো সময় পরীক্ষার ফি বা প্যাকেজের মূল্য পরিবর্তন করতে পারবেন। পরিবর্তনটি সাথে সাথে কুইজ পেজে কার্যকর হবে।
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
                <span>{isSavingPrices ? 'সংরক্ষণ হচ্ছে...' : 'মূল্য সংরক্ষণ করুন'}</span>
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
                শিক্ষার্থীরা নির্দিষ্ট ক্লাসের মডেল টেস্ট আনলক করতে এই পরিমাণ টাকা প্রদান করবে।
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[5, 6, 7, 8, 9, 10].map((cls) => (
                <div
                  key={cls}
                  className="bg-slate-50/80 border border-slate-200 hover:border-[#C8102E]/40 p-3.5 rounded-2xl space-y-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">{toBengaliClass(cls)} শ্রেণি</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#C8102E]">
                      পেইড
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-black text-slate-400">৳</span>
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
                বাংলা, ইংরেজি, গণিত ইত্যাদি যেকোনো একটি নির্দিষ্ট বিষয়ের টেস্টের সাধারণ ফি।
              </p>
            </div>

            <div className="max-w-xs bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                একক বিষয়ের টেস্ট ফি (Single Subject Test)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-black text-slate-400">৳</span>
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
                  <span>স্পেশাল মডেল টেস্ট প্যাকেজসমূহ (Dynamic Package Manager)</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  কুইজ পেজের ৩টি বা ততোধিক স্পেশাল অফার প্যাকেজের নাম, মূল্য, ফিচার ও সক্রিয় অবস্থা ডাইনামিকভাবে ম্যানেজ করুন।
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
                        ? 'bg-red-50/40 border-[#C8102E] shadow-sm'
                        : 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50/70 border-dashed border-slate-300 opacity-70'
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
                          onChange={(e) => handleUpdatePackage(pkg.id, { isActive: e.target.checked })}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span className={pkg.isActive ? 'text-emerald-700' : 'text-slate-400'}>
                          {pkg.isActive ? 'সক্রিয় (Active)' : 'বন্ধ (Hidden)'}
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
                        onChange={(e) => handleUpdatePackage(pkg.id, { title: e.target.value })}
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
                        value={pkg.badge || ''}
                        onChange={(e) => handleUpdatePackage(pkg.id, { badge: e.target.value })}
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
                        <span className="absolute left-2.5 top-1.5 text-xs font-black text-slate-400">৳</span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          required
                          value={pkg.price}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
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
                        <span className="absolute left-2.5 top-1.5 text-xs font-black text-slate-400">৳</span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={pkg.originalPrice ?? ''}
                          onChange={(e) => {
                            const val = e.target.value ? Math.max(0, Number(e.target.value)) : undefined;
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
                      onChange={(e) => handleUpdatePackage(pkg.id, { tagline: e.target.value })}
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
                        onChange={(e) => handleUpdatePackage(pkg.id, { unlockScope: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      >
                        <option value="single_class">এক ক্লাসের সব বিষয়</option>
                        <option value="all_classes">৫ম-১০ম সকল ক্লাস (VIP)</option>
                        <option value="single_subject">একক বিষয়</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-4">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={pkg.isPopular}
                          onChange={(e) => handleUpdatePackage(pkg.id, { isPopular: e.target.checked })}
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
                      value={pkg.features.join('\n')}
                      onChange={(e) => {
                        const feats = e.target.value.split('\n').filter((l) => l.trim().length > 0);
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
              <span>{isSavingPrices ? 'সংরক্ষণ হচ্ছে...' : 'সব মূল্য ও প্যাকেজ সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

