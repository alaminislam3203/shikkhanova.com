'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaUserShield, FaArrowRight, FaLock } from 'react-icons/fa6';
import AdminAttendanceManager from '@/components/admin/AdminAttendanceManager';

export default function AttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Strictly block and redirect non-admin users
  useEffect(() => {
    if (status !== 'loading' && session?.user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="py-24 text-center text-sm font-bold text-slate-500">
        যাচাই করা হচ্ছে...
      </div>
    );
  }

  // Only Admin can access and take Roll Attendance
  if (session?.user?.role !== 'ADMIN') {
    return null;
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
