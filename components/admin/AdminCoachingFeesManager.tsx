"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { CoachingFeeRecord, FeePaymentStatus } from "@/lib/coachingFeeStorage";
import { toBengaliClass } from "@/lib/defaultQuizData";
import { showConfirmToast } from "@/lib/confirmToast";
import {
  FaCheck,
  FaXmark,
  FaClock,
  FaRotate,
  FaMagnifyingGlass,
  FaFilter,
  FaPrint,
  FaTrash,
  FaCopy,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaCheckDouble,
  FaUserGraduate,
  FaCalendarDays,
  FaCircleCheck,
  FaCircleXmark,
  FaHandHoldingDollar,
} from "react-icons/fa6";
import { TbCashBanknote } from "react-icons/tb";

const MONTH_LIST = [
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

interface AdminCoachingFeesManagerProps {
  onUpdate?: () => void;
}

export default function AdminCoachingFeesManager({ onUpdate }: AdminCoachingFeesManagerProps = {}) {
  const [fees, setFees] = useState<CoachingFeeRecord[]>([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    approvedAmount: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [monthFilter, setMonthFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<CoachingFeeRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (classFilter !== "ALL") params.set("classGrade", classFilter);
      if (monthFilter !== "ALL") params.set("month", monthFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/coaching-fees?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (Array.isArray(data?.fees)) {
        setFees(data.fees);
      }
      if (data?.stats) {
        setStats(data.stats);
      }
      onUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, classFilter, monthFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCopyTrx = (trx: string) => {
    navigator.clipboard.writeText(trx);
    toast.success(`TrxID (${trx}) কপি হয়েছে!`);
  };

  // Approve Payment Action with Confirmation Toast
  const handleApprove = (record: CoachingFeeRecord) => {
    showConfirmToast({
      title: "কোচিং ফি অনুমোদন করবেন?",
      message: `আপনি কি "${record.studentName}" (রোল: ${record.rollNumber || "N/A"}, শ্রেণি: ${toBengaliClass(record.classGrade)}) এর ${record.month} মাসের ৳${record.amount} ফি অনুমোদন করতে চান? TrxID: ${record.trxId}`,
      confirmText: "হ্যাঁ, অনুমোদন করুন",
      cancelText: "বাতিল",
      confirmButtonClass: "bg-emerald-600 hover:bg-emerald-700",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/coaching-fees", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: record.id,
              status: "APPROVED",
            }),
          });
          const data = await res.json();
          if (res.ok) {
            toast.success(data.message || "পেমেন্ট সফলভাবে অনুমোদন করা হয়েছে!");
            loadData();
          } else {
            toast.error(data.error || "অনুমোদন ব্যর্থ হয়েছে।");
          }
        } catch {
          toast.error("নেটওয়ার্কে সমস্যা হয়েছে।");
        }
      },
    });
  };

  // Reject Payment Action with Confirmation Toast
  const handleReject = (record: CoachingFeeRecord) => {
    showConfirmToast({
      title: "পেমেন্ট বাতিল করবেন?",
      message: `আপনি কি "${record.studentName}" এর TrxID: ${record.trxId} পেমেন্ট রিকোয়েস্টটি বাতিল করতে চান?`,
      confirmText: "হ্যাঁ, বাতিল করুন",
      cancelText: "না, ফিরে যান",
      confirmButtonClass: "bg-rose-600 hover:bg-rose-700",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/coaching-fees", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: record.id,
              status: "REJECTED",
              note: "ভুল TrxID বা লেনদেন নিশ্চিত করা যায়নি",
            }),
          });
          if (res.ok) {
            toast.success("পেমেন্টটি বাতিল হিসেবে চিহ্নিত করা হয়েছে।");
            loadData();
          }
        } catch {
          toast.error("নেটওয়ার্কে সমস্যা হয়েছে।");
        }
      },
    });
  };

  // Delete Payment Record
  const handleDelete = (record: CoachingFeeRecord) => {
    showConfirmToast({
      title: "ফি রেকর্ড মুছে ফেলবেন?",
      message: `আপনি কি "${record.studentName}" (TrxID: ${record.trxId}) এর রেকর্ডটি সম্পূর্ণ মুছে ফেলতে চান?`,
      confirmText: "হ্যাঁ, মুছে ফেলুন",
      cancelText: "বাতিল",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/coaching-fees?id=${encodeURIComponent(record.id)}`, {
            method: "DELETE",
          });
          if (res.ok) {
            toast.success("রেকর্ড মুছে ফেলা হয়েছে।");
            loadData();
          }
        } catch {
          toast.error("মুছে ফেলা সম্ভব হয়নি।");
        }
      },
    });
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SUMMARY */}
      <div className="bg-gradient-to-r from-[#0A1E3C] via-[#0F2C59] to-[#200A18] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
            <TbCashBanknote className="w-4 h-4" />
            <span>কোচিং সেন্টার ফি ম্যানেজমেন্ট</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            শিক্ষার্থীদের মাসিক কোচিং ফি (৳১,২০০)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            বিকাশ ও নগদ TrxID মিলিয়ে অনলাইন ফি ভেরিফাই করুন, অনুমোদন দিন এবং মানি রসিদ প্রিন্ট করুন।
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
            onClick={handlePrintSummary}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <FaPrint className="w-3.5 h-3.5 text-amber-300" />
            <span>কালেকশন শিট প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
        {/* Approved Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <FaMoneyBillWave className="text-emerald-600" />
            <span>মোট সংগৃহীত ফি</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ৳{stats.approvedAmount.toLocaleString("bn-BD")}
          </div>
          <div className="text-[10px] text-slate-400">অনুমোদিত পেমেন্ট থেকে</div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <FaClock className="text-amber-500" />
            <span>অপেক্ষমান ভেরিফিকেশন</span>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {stats.pendingCount}টি
          </div>
          <div className="text-[10px] text-amber-600 font-semibold">TrxID যাচাই করুন</div>
        </div>

        {/* Approved Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <FaCircleCheck className="text-blue-600" />
            <span>অনুমোদিত শিক্ষার্থী</span>
          </div>
          <div className="text-2xl font-black text-blue-600">
            {stats.approvedCount} জন
          </div>
          <div className="text-[10px] text-slate-400">ফি সফলভাবে গৃহীত</div>
        </div>

        {/* Total Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <FaHandHoldingDollar className="text-[#C8102E]" />
            <span>মোট সাবমিশন</span>
          </div>
          <div className="text-2xl font-black text-[#C8102E]">
            {stats.totalRecords}টি
          </div>
          <div className="text-[10px] text-slate-400">সর্বমোট ট্রানজেকশন</div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 print:hidden">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {[
            { id: "ALL", label: "সকল রিকোয়েস্ট" },
            { id: "PENDING", label: `অপেক্ষমান (${stats.pendingCount})`, badgeClass: "bg-amber-100 text-amber-800" },
            { id: "APPROVED", label: `অনুমোদিত (${stats.approvedCount})`, badgeClass: "bg-emerald-100 text-emerald-800" },
            { id: "REJECTED", label: `বাতিল (${stats.rejectedCount})`, badgeClass: "bg-rose-100 text-rose-800" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#0A1E3C] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Dropdowns & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Class Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              শ্রেণি
            </label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#C8102E] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="ALL">সকল শ্রেণি</option>
              {[5, 6, 7, 8, 9, 10].map((c) => (
                <option key={c} value={c}>
                  {toBengaliClass(c)} শ্রেণি
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              মাসের নাম
            </label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#C8102E] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="ALL">সকল মাস</option>
              {MONTH_LIST.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Search by TrxID, Name, Roll, Phone */}
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              TrxID, শিক্ষার্থীর নাম বা রোল দিয়ে খুঁজুন
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="TrxID, নাম, রোল বা মোবাইল..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#C8102E] rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 outline-none"
                />
                <FaMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0A1E3C] hover:bg-black text-white text-xs font-bold transition cursor-pointer"
              >
                খুঁজুন
              </button>
              {(statusFilter !== "ALL" || classFilter !== "ALL" || monthFilter !== "ALL" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setClassFilter("ALL");
                    setMonthFilter("ALL");
                    setSearchQuery("");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  রিসেট
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* 4. DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Printable Header */}
        <div className="hidden print:block p-6 border-b border-slate-200 text-center space-y-1">
          <h1 className="text-xl font-black text-slate-900">শিক্ষানোভা একাডেমি</h1>
          <p className="text-xs text-slate-600">মাসিক কোচিং ফি কালেকশন রিপোর্ট</p>
          <div className="text-[10px] text-slate-400 pt-1">
            মুদ্রণ তারিখ: {new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-4">TrxID ও মাধ্যম</th>
                <th className="py-3 px-4">শিক্ষার্থী ও রোল</th>
                <th className="py-3 px-4">শ্রেণি ও মাস</th>
                <th className="py-3 px-4 text-center">টাকার পরিমাণ</th>
                <th className="py-3 px-4">প্রেরকের নম্বর</th>
                <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4">জমার তারিখ</th>
                <th className="py-3 px-4 text-center print:hidden">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                    ফি তথ্য লোড হচ্ছে...
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    কোনো ফি রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                fees.map((record) => {
                  const isApproved = record.status === "APPROVED";
                  const isPending = record.status === "PENDING";
                  const isRejected = record.status === "REJECTED";

                  const formattedDate = new Date(record.createdAt).toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-slate-50/70 transition ${
                        isPending ? "bg-amber-50/30 font-medium" : ""
                      }`}
                    >
                      {/* TrxID & Method */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                            {record.trxId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyTrx(record.trxId)}
                            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="TrxID কপি করুন"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <img
                            src={
                              record.paymentMethod === "BKASH"
                                ? "/assets/images/bkash.png"
                                : record.paymentMethod === "NAGAD"
                                ? "/assets/images/nagad.png"
                                : record.paymentMethod === "ROCKET"
                                ? "/assets/images/rocket.png"
                                : "/assets/images/upay.png"
                            }
                            alt={record.paymentMethod}
                            className="h-3.5 w-auto object-contain"
                          />
                          <span
                            className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded inline-block ${
                              record.paymentMethod === "BKASH"
                                ? "bg-rose-100 text-rose-800"
                                : record.paymentMethod === "NAGAD"
                                ? "bg-amber-100 text-amber-800"
                                : record.paymentMethod === "ROCKET"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {record.paymentMethod}
                          </span>
                        </div>
                      </td>

                      {/* Student & Roll */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <FaUserGraduate className="w-3 h-3 text-slate-400" />
                          <span>{record.studentName}</span>
                        </div>
                        {record.rollNumber && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            রোল: <span className="font-bold text-slate-700">{record.rollNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* Class & Month */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-black border border-blue-200">
                          {toBengaliClass(record.classGrade)} শ্রেণি
                        </span>
                        <div className="text-xs font-bold text-slate-700 mt-1">
                          {record.month}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-center">
                        <div className="font-black text-sm text-[#C8102E]">
                          ৳{record.amount}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">কোচিং ফি</div>
                      </td>

                      {/* Sender Phone */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs font-bold text-slate-800">
                          {record.senderPhone}
                        </div>
                        {record.studentPhone && record.studentPhone !== record.senderPhone && (
                          <div className="text-[10px] text-slate-400">
                            যোগাযোগ: {record.studentPhone}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                            <FaCircleCheck className="w-3 h-3 text-emerald-600" />
                            <span>অনুমোদিত</span>
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[11px] animate-pulse">
                            <FaClock className="w-3 h-3 text-amber-600" />
                            <span>অপেক্ষমান</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-bold text-[11px]">
                            <FaCircleXmark className="w-3 h-3 text-rose-600" />
                            <span>বাতিল</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FaCalendarDays className="w-2.5 h-2.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Approve Button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleApprove(record)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                              title="অনুমোদন করুন"
                            >
                              <FaCheck className="w-3 h-3" />
                              <span>অনুমোদন</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleReject(record)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="বাতিল করুন"
                            >
                              <FaXmark className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Money Receipt Modal Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="মানি রসিদ দেখুন"
                          >
                            <FaFileInvoiceDollar className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(record)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="রেকর্ড মুছে ফেলুন"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MONEY RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Receipt Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  ৳
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">মানি রসিদ (Money Receipt)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">#{selectedReceipt.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="text-center pb-2 border-b border-slate-200 space-y-0.5">
                <h3 className="font-black text-base text-slate-800">শিক্ষানোভা একাডেমি</h3>
                <p className="text-[10px] text-slate-500">মাসিক কোচিং ফি পরিশোধের রসিদ</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">শিক্ষার্থীর নাম:</span>
                  <span className="font-black text-slate-900">{selectedReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">শ্রেণি ও রোল:</span>
                  <span className="font-bold text-slate-800">
                    {toBengaliClass(selectedReceipt.classGrade)} শ্রেণি {selectedReceipt.rollNumber ? `(রোল: ${selectedReceipt.rollNumber})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">ফি এর মাস:</span>
                  <span className="font-black text-blue-700">{selectedReceipt.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">টাকার পরিমাণ:</span>
                  <span className="font-black text-base text-[#C8102E]">৳{selectedReceipt.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">পেমেন্ট মাধ্যম:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <img
                      src={
                        selectedReceipt.paymentMethod === "BKASH"
                          ? "/assets/images/bkash.png"
                          : selectedReceipt.paymentMethod === "NAGAD"
                          ? "/assets/images/nagad.png"
                          : selectedReceipt.paymentMethod === "ROCKET"
                          ? "/assets/images/rocket.png"
                          : "/assets/images/upay.png"
                      }
                      alt={selectedReceipt.paymentMethod}
                      className="h-4 w-auto object-contain"
                    />
                    <span>{selectedReceipt.paymentMethod}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">প্রেরকের নম্বর:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReceipt.senderPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Transaction ID:</span>
                  <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedReceipt.trxId}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">স্ট্যাটাস:</span>
                  <span
                    className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
                      selectedReceipt.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedReceipt.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {selectedReceipt.status === "APPROVED" ? "পরিশোধিত (APPROVED)" : selectedReceipt.status === "PENDING" ? "অপেক্ষমান (PENDING)" : "বাতিল (REJECTED)"}
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
                onClick={() => setSelectedReceipt(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
