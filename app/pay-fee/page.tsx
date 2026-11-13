"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { toBengaliClass } from "@/lib/defaultQuizData";
import { CoachingFeeRecord, FeePaymentMethod } from "@/lib/coachingFeeStorage";
import {
  FaCopy,
  FaCheck,
  FaCircleCheck,
  FaClock,
  FaPrint,
  FaPhone,
  FaArrowLeft,
  FaMagnifyingGlass,
  FaFileInvoiceDollar,
  FaCalendarDays,
  FaShieldHalved,
  FaCircleInfo,
} from "react-icons/fa6";
import { TbCashBanknote } from "react-icons/tb";

const BKASH_NUMBER = "01712592519";
const NAGAD_NUMBER = "01712592519";
const ROCKET_NUMBER = "01712592519";
const UPAY_NUMBER = "01712592519";
const DEFAULT_FEE_AMOUNT = 1200;

const PAYMENT_METHODS_CONFIG = [
  {
    id: "BKASH" as FeePaymentMethod,
    name: "বিকাশ",
    englishName: "bKash",
    badge: "বিকাশ পার্সোনাল",
    number: BKASH_NUMBER,
    logo: "/assets/images/bkash.png",
    borderColor: "border-[#E2136E]",
    activeBg: "bg-pink-50/80",
    activeText: "text-[#E2136E]",
    cardBadgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    copyBtnClass: "bg-rose-50 hover:bg-rose-100 text-rose-700",
  },
  {
    id: "NAGAD" as FeePaymentMethod,
    name: "নগদ",
    englishName: "Nagad",
    badge: "নগদ পার্সোনাল",
    number: NAGAD_NUMBER,
    logo: "/assets/images/nagad.png",
    borderColor: "border-[#F7941D]",
    activeBg: "bg-orange-50/80",
    activeText: "text-[#F7941D]",
    cardBadgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    copyBtnClass: "bg-amber-50 hover:bg-amber-100 text-amber-800",
  },
  {
    id: "ROCKET" as FeePaymentMethod,
    name: "রকেট",
    englishName: "Rocket",
    badge: "রকেট পার্সোনাল",
    number: ROCKET_NUMBER,
    logo: "/assets/images/rocket.png",
    borderColor: "border-[#8C3494]",
    activeBg: "bg-purple-50/80",
    activeText: "text-[#8C3494]",
    cardBadgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    copyBtnClass: "bg-purple-50 hover:bg-purple-100 text-purple-800",
  },
  {
    id: "UPAY" as FeePaymentMethod,
    name: "উপায়",
    englishName: "Upay",
    badge: "উপায় পার্সোনাল",
    number: UPAY_NUMBER,
    logo: "/assets/images/upay.png",
    borderColor: "border-[#0081C9]",
    activeBg: "bg-sky-50/80",
    activeText: "text-[#0081C9]",
    cardBadgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    copyBtnClass: "bg-sky-50 hover:bg-sky-100 text-sky-800",
  },
];

const MONTH_OPTIONS = [
  "জানুয়ারি ২০২৬",
  "ফেব্রুয়ারি ২০২৬",
  "মার্চ ২০২৬",
  "এপ্রিল ২০২৬",
  "মে ২০২৬",
  "জুন ২০২৬",
  "জুলাই ২০২৬",
  "আগস্ট ২০২৬",
  "সেপ্টেম্বর ২০২৬",
  "অক্টোবর ২০২৬",
  "নভেম্বর ২০২৬",
  "ডিসেম্বর ২০২৬",
];

export default function PayFeePage() {
  const { data: session } = useSession();

  // Form State
  const [studentName, setStudentName] = useState<string>("");
  const [classGrade, setClassGrade] = useState<number>(6);
  const [rollNumber, setRollNumber] = useState<string>("");
  const [month, setMonth] = useState<string>("মার্চ ২০২৬");
  const [amount, setAmount] = useState<number>(DEFAULT_FEE_AMOUNT);
  const [paymentMethod, setPaymentMethod] = useState<FeePaymentMethod>("BKASH");
  const [senderPhone, setSenderPhone] = useState<string>("");
  const [studentPhone, setStudentPhone] = useState<string>("");
  const [trxId, setTrxId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Success Receipt State
  const [submittedReceipt, setSubmittedReceipt] =
    useState<CoachingFeeRecord | null>(null);

  // Track Payment State
  const [trackQuery, setTrackQuery] = useState<string>("");
  const [trackedRecord, setTrackedRecord] = useState<CoachingFeeRecord | null>(
    null,
  );
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [trackSearched, setTrackSearched] = useState<boolean>(false);

  // Autofill logged in user details if available
  useEffect(() => {
    if (session?.user?.name && !studentName) {
      setStudentName(session.user.name);
    }
    const userAny = session?.user as any;
    if (userAny?.classGrade) {
      setClassGrade(Number(userAny.classGrade));
    }
    if (userAny?.rollNumber && !rollNumber) {
      setRollNumber(String(userAny.rollNumber));
    }
    if (userAny?.phone && !studentPhone) {
      setStudentPhone(userAny.phone);
    }
  }, [session?.user]);

  const handleCopyNumber = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    toast.success(`${label} নম্বর (${num}) কপি হয়েছে!`);
  };

  const handleSubmitFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      toast.error("শিক্ষার্থীর নাম লিখুন।");
      return;
    }
    if (!senderPhone.trim()) {
      toast.error("যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন।");
      return;
    }
    if (!trxId.trim() || trxId.trim().length < 6) {
      toast.error("সঠিক Transaction ID (কমপক্ষে ৬ অক্ষর) লিখুন।");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("ফি সাবমিট করা হচ্ছে...");

    try {
      const res = await fetch("/api/coaching-fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentName.trim(),
          classGrade,
          rollNumber: rollNumber.trim() || undefined,
          month,
          amount,
          paymentMethod,
          senderPhone: senderPhone.trim(),
          studentPhone: studentPhone.trim() || undefined,
          trxId: trxId.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      toast.dismiss(loadingToastId);

      if (res.ok) {
        toast.success("🎉 কোচিং ফি সফলভাবে জমা দেওয়া হয়েছে!");
        setSubmittedReceipt(data.record);
        setTrxId("");
      } else {
        toast.error(data.error || "ফি সাবমিট ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.dismiss(loadingToastId);
      toast.error("নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) {
      toast.error("TrxID, রোল বা মোবাইল নম্বর লিখুন।");
      return;
    }

    setIsTracking(true);
    setTrackSearched(true);
    try {
      const res = await fetch(
        `/api/coaching-fees?search=${encodeURIComponent(trackQuery.trim())}`,
        {
          cache: "no-store",
        },
      );
      const data = await res.json();
      if (Array.isArray(data?.fees) && data.fees.length > 0) {
        setTrackedRecord(data.fees[0]);
      } else {
        setTrackedRecord(null);
      }
    } catch {
      toast.error("অনুসন্ধান ব্যর্থ হয়েছে।");
    } finally {
      setIsTracking(false);
    }
  };

  const activeConfig =
    PAYMENT_METHODS_CONFIG.find((c) => c.id === paymentMethod) ||
    PAYMENT_METHODS_CONFIG[0];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Container width matched to /about page (max-w-6xl xl:max-w-7xl) */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>হোমে ফিরে যান</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <FaPhone className="w-3 h-3 text-[#C8102E]" />
            <span>হেল্পলাইন:</span>
            <a
              href="tel:01712592519"
              className="text-[#C8102E] font-black hover:underline"
            >
              ০১৭১২৫৯২৫১৯
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
            <TbCashBanknote className="w-4 h-4" />
            <span>অনলাইন ফি পরিশোধ পোর্টাল</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
            শিক্ষানোভা একাডেমি — মাসিক কোচিং ফি
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
            ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের মাসিক কোচিং ফি বিকাশ, নগদ, রকেট বা
            উপায়ের মাধ্যমে পাঠিয়ে TrxID দিয়ে নিশ্চিত করুন। পেমেন্ট অনুমোদন শেষে
            ডিজিটাল মানি রসিদ ডাউনলোড ও প্রিন্ট করতে পারবেন।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-baseline gap-2">
              <span className="text-xs text-slate-300 font-bold">
                নির্ধারিত মাসিক ফি:
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                ৳১,২০০
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <FaCircleCheck className="w-3.5 h-3.5" />
              <span>নিরাপদ বিকাশ • নগদ • রকেট • উপায় পেমেন্ট</span>
            </div>
          </div>
        </div>

        {/* Payment Numbers & Logos Grid (4 Cards: bKash, Nagad, Rocket, Upay) */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>ফি পাঠানোর অফিশিয়াল পার্সোনাল নম্বরসমূহ</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              {" "}
              Send Money করুন
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {PAYMENT_METHODS_CONFIG.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-2.5 sm:space-y-3 relative overflow-hidden group"
              >
                {/* Brand Logo & Badge */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  <span
                    className={`text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full border whitespace-nowrap ${method.cardBadgeClass}`}
                  >
                    {method.badge}
                  </span>

                  {/* Actual Brand Logo Container */}
                  <div className="h-6 sm:h-8 w-11 sm:w-16 bg-white rounded-lg p-0.5 sm:p-1 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <img
                      src={method.logo}
                      alt={method.englishName}
                      className="h-full w-auto object-contain max-h-5 sm:max-h-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-base md:text-lg font-black font-mono text-slate-900 tracking-tight sm:tracking-wide">
                    {method.number}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    শিক্ষা নোভা একাডেমি ({method.name})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyNumber(method.number, method.name)}
                  className={`w-full py-1.5 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-xs transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${method.copyBtnClass}`}
                >
                  <FaCopy className="w-3 h-3 shrink-0" />
                  <span>কপি করুন</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-blue-50/70 border border-blue-200/90 rounded-3xl p-5 sm:p-6 space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-blue-950 flex items-center gap-2">
            <FaCircleInfo className="text-blue-700" />
            <span>ফি পরিশোধের সহজ ৪টি ধাপ:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-blue-900/90 font-medium">
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-2xs space-y-1">
              <div className="font-black text-blue-700">১. Send Money করুন</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                বিকাশ, নগদ, রকেট বা উপায় অ্যাপে গিয়ে পার্সোনাল নম্বরে{" "}
                <strong>১২০০ টাকা</strong> Send Money করুন।
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-2xs space-y-1">
              <div className="font-black text-blue-700">২. রেফারেন্স দিন</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                রেফারেন্স বক্সে শিক্ষার্থীর নাম বা শ্রেণি-রোল নম্বর লিখে পেমেন্ট
                নিশ্চিত করুন।
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-2xs space-y-1">
              <div className="font-black text-blue-700">
                ৩. TrxID সংগ্রহ করুন
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                লেনদেন সফল হওয়ার পর এসএমএস বা অ্যাপ থেকে প্রাপ্ত{" "}
                <strong>Transaction ID</strong> কপি করুন।
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-2xs space-y-1">
              <div className="font-black text-blue-700">
                ৪. ফর্মে সাবমিট করুন
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                নিচের ফর্মে TrxID ও তথ্য পূরণ করে সাবমিট করুন এবং তাৎক্ষণিক মানি
                রসিদ সংগ্রহ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Wide 12-Column Responsive Layout: Form (7 cols) + Tracking & Info (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Fee Payment Form (Col 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-200">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                কোচিং ফি সাবমিশন ফর্ম
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                টাকা পাঠানোর পর নিচের তথ্যগুলো সতর্কতার সাথে পূরণ করুন
              </p>
            </div>

            <form onSubmit={handleSubmitFee} className="space-y-5">
              {/* Payment Method Selector with Actual Brand Logos */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  পেমেন্ট মাধ্যম বেছে নিন *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PAYMENT_METHODS_CONFIG.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                          isSelected
                            ? `${method.borderColor} ${method.activeBg} shadow-sm ring-1 ${method.borderColor}`
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="h-8 w-14 bg-white rounded-lg p-1 flex items-center justify-center shadow-2xs border border-slate-200/80">
                          <img
                            src={method.logo}
                            alt={method.englishName}
                            className="h-full w-auto object-contain max-h-6"
                          />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-black ${isSelected ? method.activeText : "text-slate-800"}`}
                          >
                            {method.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Personal
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Method Instruction Box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeConfig.logo}
                      alt={activeConfig.englishName}
                      className="h-4 w-auto object-contain"
                    />
                    <span>{activeConfig.name} পার্সোনাল নম্বর:</span>
                    <strong className="font-mono text-slate-900 font-black">
                      {activeConfig.number}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyNumber(activeConfig.number, activeConfig.name)
                    }
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    কপি করুন
                  </button>
                </div>
              </div>

              {/* Student Name & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    শিক্ষার্থীর নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="যেমন: সাকিব আল হাসান"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    শ্রেণি নির্বাচন করুন *
                  </label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold outline-none cursor-pointer"
                  >
                    {[5, 6, 7, 8, 9, 10].map((cls) => (
                      <option key={cls} value={cls}>
                        {toBengaliClass(cls)} শ্রেণি
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Roll Number & Month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    রোল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="যেমন: ০৫"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    কোন মাসের ফি? *
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold outline-none cursor-pointer"
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount & Sender Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    টাকার পরিমাণ
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) =>
                        setAmount(Number(e.target.value) || DEFAULT_FEE_AMOUNT)
                      }
                      className="w-full bg-slate-100 border border-slate-300 rounded-2xl pl-8 pr-4 py-3 text-xs sm:text-sm text-[#C8102E] font-black outline-none"
                      readOnly
                    />
                    <span className="absolute left-3.5 top-3.5 text-xs font-black text-slate-500">
                      ৳
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Phone) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Transaction ID & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="যেমন: BL8A92K9XQ"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-mono font-black tracking-wider uppercase outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    অভিভাবকের যোগাযোগের নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="জরুরি যোগাযোগের নম্বর"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#9B0D23] via-[#C8102E] to-[#E5254A] hover:opacity-95 text-white font-black text-sm shadow-xl transition transform active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <TbCashBanknote className="w-5 h-5" />
                  <span>
                    {isSubmitting
                      ? "ফি জমা হচ্ছে..."
                      : "৳১,২০০ কোচিং ফি সাবমিট করুন"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Live Tracking Card & Helpline Guidance (Col 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Track Payment Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FaFileInvoiceDollar className="text-blue-600" />
                  <span>পূর্ববর্তী ফি জমার স্ট্যাটাস জানুন</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  TrxID, রোল বা মোবাইল নম্বর দিয়ে অনুমোদন স্ট্যাটাস ও রসিদ
                  খুঁজুন
                </p>
              </div>

              <form onSubmit={handleTrackPayment} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="TrxID, রোল বা মোবাইল নম্বর..."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#C8102E] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none"
                  />
                  <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  disabled={isTracking}
                  className="w-full py-2.5 rounded-xl bg-[#0A1E3C] hover:bg-black text-white font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  {isTracking ? "অনুসন্ধান চলছে..." : "স্ট্যাটাস যাচাই করুন"}
                </button>
              </form>

              {/* Track Result Card */}
              {trackSearched && (
                <div className="pt-2">
                  {trackedRecord ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">
                          {trackedRecord.studentName} (
                          {toBengaliClass(trackedRecord.classGrade)} শ্রেণি)
                        </span>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            trackedRecord.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : trackedRecord.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {trackedRecord.status === "APPROVED"
                            ? "✅ অনুমোদিত"
                            : trackedRecord.status === "PENDING"
                              ? "🟡 অপেক্ষমান"
                              : "❌ বাতিল"}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">
                            ফি এর মাস:
                          </span>
                          <span className="font-bold text-slate-800">
                            {trackedRecord.month}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">
                            টাকা:
                          </span>
                          <span className="font-black text-[#C8102E]">
                            ৳{trackedRecord.amount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">
                            মাধ্যম:
                          </span>
                          <span className="font-bold text-slate-800">
                            {trackedRecord.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">
                            TrxID:
                          </span>
                          <span className="font-mono font-black text-emerald-700">
                            {trackedRecord.trxId}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setSubmittedReceipt(trackedRecord)}
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>ডিজিটাল রসিদ দেখুন ও প্রিন্ট করুন</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center text-xs text-rose-700 font-bold">
                      উক্ত তথ্য দিয়ে কোনো ফি রেকর্ড পাওয়া যায়নি। সঠিক TrxID বা
                      মোবাইল নম্বর দিন।
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Notice & Instructions Card */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0A1E3C] text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <FaShieldHalved />
                <span>গুরুত্বপূর্ণ পেমেন্ট নীতিমালা</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  • প্রতি মাসের <strong>১ থেকে ১০ তারিখের</strong> মধ্যে উক্ত
                  মাসের কোচিং ফি পরিশোধ করার জন্য অনুরোধ করা যাচ্ছে।
                </p>
                <p>
                  • টাকা পাঠানোর পর TrxID টি সাবমিট করে রাখুন। সেন্টারের
                  অ্যাডমিন প্যানেল থেকে ব্যাংক স্টেটমেন্ট যাচাই করে সর্বোচ্চ{" "}
                  <strong>২ থেকে ৪ ঘণ্টার</strong> মধ্যে স্ট্যাটাস Approved করে
                  দেওয়া হবে।
                </p>
                <p>
                  • ফি পরিশোধ সংক্রান্ত যেকোনো জটিলতায় সরাসরি সেন্টারে যোগাযোগ
                  করুন অথবা হেল্পলাইনে কল করুন:
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  পরিচালক হেল্পলাইন:
                </span>
                <a
                  href="tel:01712592519"
                  className="font-mono text-sm font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <FaPhone className="w-3 h-3" />
                  <span>০১৭১২৫৯২৫১৯</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Money Receipt Modal */}
        {submittedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    ৳
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      মানি রসিদ (Money Receipt)
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      #{submittedReceipt.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmittedReceipt(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Receipt Content */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="text-center pb-2 border-b border-slate-200 space-y-0.5">
                  <h3 className="font-black text-base text-slate-800">
                    শিক্ষানোভা একাডেমি
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    মাসিক কোচিং ফি পরিশোধ রসিদ
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      শিক্ষার্থীর নাম:
                    </span>
                    <span className="font-black text-slate-900">
                      {submittedReceipt.studentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      শ্রেণি ও রোল:
                    </span>
                    <span className="font-bold text-slate-800">
                      {toBengaliClass(submittedReceipt.classGrade)} শ্রেণি{" "}
                      {submittedReceipt.rollNumber
                        ? `(রোল: ${submittedReceipt.rollNumber})`
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      ফি এর মাস:
                    </span>
                    <span className="font-black text-blue-700">
                      {submittedReceipt.month}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      টাকার পরিমাণ:
                    </span>
                    <span className="font-black text-base text-[#C8102E]">
                      ৳{submittedReceipt.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">
                      পেমেন্ট মাধ্যম:
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      {PAYMENT_METHODS_CONFIG.find(
                        (c) => c.id === submittedReceipt.paymentMethod,
                      )?.logo && (
                        <img
                          src={
                            PAYMENT_METHODS_CONFIG.find(
                              (c) => c.id === submittedReceipt.paymentMethod,
                            )?.logo
                          }
                          alt={submittedReceipt.paymentMethod}
                          className="h-4 w-auto object-contain"
                        />
                      )}
                      <span>{submittedReceipt.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      প্রেরকের নম্বর:
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {submittedReceipt.senderPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      Transaction ID:
                    </span>
                    <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {submittedReceipt.trxId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold">
                      স্ট্যাটাস:
                    </span>
                    <span
                      className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
                        submittedReceipt.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : submittedReceipt.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {submittedReceipt.status === "APPROVED"
                        ? "✅ অনুমোদিত (APPROVED)"
                        : submittedReceipt.status === "PENDING"
                          ? "🟡 অপেক্ষমান (PENDING)"
                          : "❌ বাতিল (REJECTED)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <FaPrint className="w-3.5 h-3.5" />
                  <span>প্রিন্ট রসিদ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmittedReceipt(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
