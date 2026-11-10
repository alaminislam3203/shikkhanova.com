'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaEnvelope,
  FaLock,
  FaRightToBracket,
  FaUserShield,
  FaCircleExclamation,
  FaGraduationCap,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'লগইন করতে সমস্যা হয়েছে');
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('robiulnil101@gmail.com');
    setPassword('RABIUL@20');
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-900">
          শিক্ষানোভা <span className="text-nova-500">লগইন</span>
        </h1>
        <p className="text-xs text-slogan-600 font-bold inline-flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          <HiSparkles /> "শিখবো, জিতবো" • শিক্ষার্থী ও অ্যাডমিন পোর্টাল
        </p>
      </div>

      {/* Login Card */}
   <div className="p-0 sm:p-2 space-y-6">
        
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
            <FaCircleExclamation className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ইমেইল ঠিকানা</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="যেমন: robiulnil101@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition"
              />
              <FaEnvelope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition"
              />
              <FaLock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <FaRightToBracket className="w-4 h-4" />
            )}
            <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
          </button>
        </form>

        {/* Quick Fill for Admin */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={autofillAdmin}
            className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-center gap-2 transition"
          >
            <FaUserShield className="text-nova-600" />
            <span>অ্যাডমিন ডেমো অটোফিল (robiulnil101@gmail.com / RABIUL@20)</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center pt-2 text-xs text-slate-500">
          কোনো অ্যাকাউন্ট নেই?{' '}
          <Link href="/register" className="font-bold text-brand-700 hover:underline">
            নতুন শিক্ষার্থী রেজিস্ট্রেশন করুন
          </Link>
        </div>

      </div>

    </div>
  );
}

