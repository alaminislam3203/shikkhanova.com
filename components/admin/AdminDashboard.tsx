'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminTab } from '@/components/admin/AdminSidebar';
import {
  FaFilePdf,
  FaUsers,
  FaAward,
  FaUserCheck,
  FaClock,
  FaCircleCheck,
  FaPlus,
  FaArrowRight,
  FaArrowsRotate,
  FaCheck,
  FaXmark,
  FaLayerGroup,
  FaEye,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';
import { HiSparkles } from 'react-icons/hi2';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
  onStatusUpdated?: () => void;
}

export default function AdminDashboard({
  onNavigateTab,
  onStatusUpdated,
}: AdminDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.kpis) {
        setData(json);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleQuickPurchaseAction = async (
    purchaseId: string,
    newStatus: 'APPROVED' | 'REJECTED'
  ) => {
    setUpdatingId(purchaseId);
    try {
      const res = await fetch('/api/admin/purchases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId, status: newStatus }),
      });
      if (res.ok) {
        await fetchDashboardStats(true);
        if (onStatusUpdated) onStatusUpdated();
      }
    } catch (err) {
      console.error('Failed to update purchase:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-3">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">
          লাইভ ড্যাশবোর্ড পরিসংখ্যান লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalUsers: 0,
    totalStudents: 0,
    totalPdfs: 0,
    freePdfs: 0,
    paidPdfs: 0,
    totalPurchases: 0,
    pendingPurchasesCount: 0,
    approvedPurchasesCount: 0,
    rejectedPurchasesCount: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    bkashRevenue: 0,
    nagadRevenue: 0,
    totalResults: 0,
    totalAttendanceCount: 0,
    todayAttendance: { present: 0, absent: 0, late: 0, total: 0 },
  };

  const classes = data?.classes || [];
  const recentPurchases = data?.recentPurchases || [];
  const recentPdfs = data?.recentPdfs || [];
  const recentResults = data?.recentResults || [];

  const todayFormatted = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Hero Welcome & Quick Actions Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #020D24 0%, #082C6D 55%, #001A4D 100%)',
        }}
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-800/60 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-nova-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <HiSparkles /> রিয়েল-টাইম ডেটাবেজ ড্যাশবোর্ড
              </span>
              <span className="text-xs text-blue-200 bg-white/10 px-3 py-0.5 rounded-full border border-white/10">
                {todayFormatted}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              স্বাগতম, শিক্ষানোভা কন্ট্রোল সেন্টারে!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
              এখান থেকে সরাসরি পিডিএফ হ্যান্ডনোট আপলোড, বিকাশ/নগদ পেমেন্ট অনুমোদন, পরীক্ষার ফলাফল ও প্রতিদিনের হাজিরা লাইভ মনিটর করুন।
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('addPdf')}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg transition transform hover:-translate-y-0.5"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>নতুন PDF শিট আপলোড</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('addResult')}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2.5 rounded-2xl text-xs border border-white/20 transition"
            >
              <FaAward className="w-3.5 h-3.5 text-amber-300" />
              <span>রেজাল্ট যুক্ত করুন</span>
            </button>

            <button
              type="button"
              onClick={() => fetchDashboardStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-blue-100 font-bold px-3.5 py-2.5 rounded-2xl text-xs border border-white/15 transition"
              title="ডাটা রিফ্রেশ করুন"
            >
              <FaArrowsRotate className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'আপডেট হচ্ছে...' : 'রিফ্রেশ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Dynamic KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* KPI 1: Total Revenue */}
        <div
          onClick={() => onNavigateTab('purchases')}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                মোট অনুমোদিত আয়
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                ৳{kpis.totalRevenue}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <TbCashBanknote className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-lg">
              বিকাশ: ৳{kpis.bkashRevenue}
            </span>
            <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg">
              নগদ: ৳{kpis.nagadRevenue}
            </span>
          </div>
        </div>

        {/* KPI 2: Pending Payment Requests */}
        <div
          onClick={() => onNavigateTab('purchases')}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                অপেক্ষমাণ পেমেন্ট (TrxID)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {kpis.pendingPurchasesCount}টি রিকোয়েস্ট
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
              <FaClock className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>অপেক্ষমাণ অ্যামাউন্ট: <strong className="text-slate-800">৳{kpis.pendingRevenue}</strong></span>
            <span className="text-emerald-600 font-bold">
              অনুমোদিত: {kpis.approvedPurchasesCount}টি
            </span>
          </div>
        </div>

        {/* KPI 3: Published PDF Materials */}
        <div
          onClick={() => onNavigateTab('addPdf')}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-300 transition cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                প্রকাশিত পিডিএফ শিট
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-700 mt-1">
                {kpis.totalPdfs}টি কার্ড
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center justify-center shrink-0">
              <FaFilePdf className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg">
              পেইড: {kpis.paidPdfs}টি
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              ফ্রি শিট: {kpis.freePdfs}টি
            </span>
          </div>
        </div>

        {/* KPI 4: Registered Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                নিবন্ধিত শিক্ষার্থী
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                {kpis.totalStudents} জন
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
              <FaUsers className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>মোট অ্যাকাউন্ট: <strong className="text-slate-800">{kpis.totalUsers}টি</strong></span>
            <span className="text-brand-700 font-bold">শ্রেণি ৫ - ১০</span>
          </div>
        </div>

        {/* KPI 5: Uploaded Exam Results */}
        <div
          onClick={() => onNavigateTab('addResult')}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                প্রকাশিত পরীক্ষার রেজাল্ট
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                {kpis.totalResults}টি মার্কশিট
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0">
              <FaAward className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>অনলাইন গ্রেডশিট সক্রিয়</span>
            <span className="text-purple-700 font-bold">+ নতুন যোগ করুন →</span>
          </div>
        </div>

        {/* KPI 6: Today's Attendance */}
        <Link
          href="/attendance"
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                আজকের হাজিরা সারাংশ
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-teal-700 mt-1">
                {kpis.todayAttendance.present} জন উপস্থিত
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center shrink-0">
              <FaUserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>আজ মোট এন্ট্রি: <strong className="text-slate-800">{kpis.todayAttendance.total}</strong></span>
            <span className="text-teal-700 font-bold">সর্বমোট: {kpis.totalAttendanceCount}</span>
          </div>
        </Link>

      </div>

      {/* Class-wise Dynamic Analytics Breakdown (Classes 5 to 10) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              শ্রেণিভিত্তিক ডায়নামিক রিপোর্ট (Class 5 – Class 10)
            </h3>
            <p className="text-xs text-slate-500">
              প্রতিটি শ্রেণির শিক্ষার্থী, প্রকাশিত পিডিএফ নোট, রেজাল্ট ও আজকের উপস্থিতির লাইভ হিসাব
            </p>
          </div>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
          >
            <span>হাজিরা শিটে যান</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {classes.map((cls: any) => (
            <div
              key={cls.classGrade}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-brand-300 hover:shadow-sm p-4 space-y-3 transition"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-brand-700 text-white text-xs font-black px-2.5 py-0.5 rounded-lg">
                  <FaLayerGroup className="w-3 h-3" /> Class {cls.classGrade}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {cls.classGrade}ম শ্রেণি
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">পিডিএফ শিট:</span>
                  <strong className="text-brand-700 font-black">{cls.pdfs}টি</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">রেজাল্ট:</span>
                  <strong className="text-purple-700 font-black">{cls.results}টি</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">শিক্ষার্থী:</span>
                  <strong className="text-slate-800 font-black">{cls.students} জন</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/70">
                  <span className="text-slate-500">আজ উপস্থিত:</span>
                  <strong className="text-emerald-600 font-black">
                    {cls.todayPresent}/{cls.todayTotal}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-Column Live Feeds: Recent Payment Requests + Recent Published PDFs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Cols: Recent Payment Requests (With Instant Approve/Reject) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                সাম্প্রতিক পেমেন্ট ও TrxID রিকোয়েস্ট
              </h3>
              <p className="text-xs text-slate-500">
                ড্যাশবোর্ড থেকেই সরাসরি ১-ক্লিকে পেমেন্ট অনুমোদন বা বাতিল করুন
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('purchases')}
              className="text-xs font-bold text-brand-700 hover:underline shrink-0"
            >
              সব দেখুন ({kpis.totalPurchases}) →
            </button>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-600">কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি</p>
              <p>শিক্ষার্থীরা পিডিএফ শিট কিনতে TrxID সাবমিট করলে এখানে তাৎক্ষণিক দেখা যাবে।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPurchases.map((pur: any) => (
                <div
                  key={pur.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          pur.paymentMethod === 'BKASH'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {pur.paymentMethod}
                      </span>
                      <span className="font-mono text-xs font-black text-slate-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        TrxID: {pur.trxId}
                      </span>
                      <span className="text-xs font-black text-brand-700">৳{pur.amount}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 truncate">
                      {pur.pdf?.title || 'পিডিএফ হ্যান্ডনোট'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      শিক্ষার্থী: <strong>{pur.student?.name}</strong> • প্রেরক:{' '}
                      <span className="font-mono">{pur.senderPhone}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {pur.status === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === pur.id}
                          onClick={() => handleQuickPurchaseAction(pur.id, 'APPROVED')}
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition disabled:opacity-50"
                        >
                          <FaCheck className="w-3 h-3" /> অনুমোদন
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === pur.id}
                          onClick={() => handleQuickPurchaseAction(pur.id, 'REJECTED')}
                          className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-2.5 py-1.5 rounded-xl transition disabled:opacity-50"
                        >
                          <FaXmark className="w-3 h-3" /> বাতিল
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-[11px] font-black px-2.5 py-1 rounded-xl ${
                          pur.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {pur.status === 'APPROVED' ? '✓ অনুমোদিত' : '✕ বাতিল'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Recent Published PDFs & Latest Results */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Latest PDFs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800">
                সর্বশেষ প্রকাশিত পিডিএফ কার্ড
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('addPdf')}
                className="text-xs font-bold text-brand-700 hover:underline"
              >
                ম্যানেজ করুন →
              </button>
            </div>

            {recentPdfs.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                এখনও কোনো পিডিএফ শিট যুক্ত করা হয়নি।
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentPdfs.map((pdf: any) => (
                  <div
                    key={pdf.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md">
                          Class {pdf.classGrade}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 truncate">
                          {pdf.subject}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate mt-1">
                        {pdf.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black text-brand-700">
                        {pdf.isFree || pdf.price <= 0 ? 'ফ্রি' : `৳${pdf.price}`}
                      </span>
                      <a
                        href={pdf.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-700"
                        title="পিডিএফ দেখুন"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Exam Results */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800">
                সর্বশেষ আপলোডকৃত ফলাফল
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('addResult')}
                className="text-xs font-bold text-brand-700 hover:underline"
              >
                + রেজাল্ট যোগ →
              </button>
            </div>

            {recentResults.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                এখনও কোনো পরীক্ষার ফলাফল আপলোড করা হয়নি।
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentResults.map((res: any) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">
                        {res.studentName} (রোল: {res.rollNumber})
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Class {res.classGrade} • {res.examTitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg">
                        {res.grade} (GPA {res.gpa})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

