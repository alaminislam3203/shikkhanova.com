'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccountNavTabs from '@/components/account/AccountNavTabs';
import {
import {
  FaLock,
  FaShieldHalved,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
  FaArrowLeft,
  FaUser,
  FaKey,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function PasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMsg({ text: 'নতুন পাসওয়ার্ড দুটি মিলছে না', type: 'error' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMsg({ text: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে');
      }

      setMsg({ text: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! 🎉', type: 'success' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMsg({ text: err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="py-24 text-center text-slate-500 font-bold space-y-2">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Account Navigation Tabs */}
      <AccountNavTabs activeTab="security" />

      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-200 border border-white/10">
              <FaShieldHalved className="text-rose-400" /> নিরাপত্তা ব্যবস্থাপনা
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              পাসওয়ার্ড ও অ্যাকাউন্ট নিরাপত্তা
            </h1>
            <p className="text-xs text-blue-100 max-w-md">
              আপনার অ্যাকাউন্টের নিরাপত্তা সুনিশ্চিত রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।
            </p>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/15 transition shrink-0"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>একাউন্ট পেইজ</span>
          </Link>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? (
              <FaCircleCheck className="text-emerald-600 shrink-0 w-4 h-4" />
            ) : (
              <FaCircleExclamation className="text-rose-600 shrink-0 w-4 h-4" />
            )}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Password Change Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <FaKey className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800">পাসওয়ার্ড পরিবর্তন করুন</h2>
            <p className="text-xs text-slate-500">বর্তমান পাসওয়ার্ড যাচাই করে নতুন পাসওয়ার্ড সেট করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              বর্তমান পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="আপনার বর্তমান পাসওয়ার্ড দিন"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড লিখুন"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl shadow transition active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaClock className="w-4 h-4 animate-spin" />
                  <span>আপডেট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaLock className="w-3.5 h-3.5" />
                  <span>পাসওয়ার্ড আপডেট করুন</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Security Tips */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <HiSparkles className="text-amber-600" /> নিরাপত্তা টিপস:
          </p>
          <p>পাসওয়ার্ডে ইংরেজি বড়-ছোট অক্ষর ও সংখ্যা ব্যবহার করুন। আপনার পাসওয়ার্ড অন্য কারো সাথে শেয়ার করবেন না।</p>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/account"
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 shadow-xs flex items-center gap-2.5 transition text-xs font-bold text-slate-700 hover:text-brand-700"
        >
          <FaUser className="text-brand-600 shrink-0" />
          <span>একাউন্ট প্রোফাইল</span>
        </Link>
        <Link
          href="/my-notes"
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 shadow-xs flex items-center gap-2.5 transition text-xs font-bold text-slate-700 hover:text-brand-700"
        >
          <span className="shrink-0">📄</span>
          <span>সংগৃহীত শিট ও নোট</span>
        </Link>
      </div>

    </div>
  );
}

