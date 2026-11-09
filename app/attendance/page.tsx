'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaUserShield, FaArrowRight, FaLock } from 'react-icons/fa6';
import AdminAttendanceManager from '@/components/admin/AdminAttendanceManager';

export default function AttendancePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="py-20 text-center text-sm font-bold text-slate-500">
        যাচাই করা হচ্ছে...
      </div>
    );
  }

  // Only Admin can access and take Roll Attendance
  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#C8102E] flex items-center justify-center mx-auto text-2xl">
          <FaLock />
        </div>
        <div className="space-y-2">
          <span className="inline-block text-[11px] font-bold bg-[#C8102E] text-white px-3 py-0.5 rounded-sm uppercase">
            শুধুমাত্র অ্যাডমিন (Admin Only)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0A1E3C]">
            রোল উপস্থিতি শুধুমাত্র অ্যাডমিন প্যানেল থেকে নিয়ন্ত্রিত
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            শিক্ষার্থীদের রোল উপস্থিতি গ্রহণ ও পরিবর্তনের অনুমতি শুধুমাত্র অ্যাডমিনের রয়েছে। আপনি অ্যাডমিন হলে লগইন করে অ্যাডমিন প্যানেলে প্রবেশ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-bold px-5 py-2.5 rounded-sm transition shadow-xs"
          >
            <FaUserShield />
            <span>অ্যাডমিন লগইন</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-sm transition"
          >
            <span>হোম পেজে ফিরে যান</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs">
        <span className="font-bold text-[#0A1E3C]">অ্যাডমিন রোল উপস্থিতি মডিউল</span>
        <Link
          href="/admin?tab=students"
          className="inline-flex items-center gap-1.5 text-[#C8102E] font-bold hover:underline"
        >
          <span>অ্যাডমিন প্যানেলে খুলুন</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <AdminAttendanceManager />
    </div>
  );
}
