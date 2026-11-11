'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { confirmSignOut } from '@/lib/logout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaUser,
  FaGraduationCap,
  FaFilePdf,
  FaAward,
  FaPhone,
  FaEnvelope,
  FaHashtag,
  FaShieldHalved,
  FaGear,
  FaClock,
  FaArrowRightFromBracket,
  FaUserShield,
  FaCircleCheck,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [extraProfile, setExtraProfile] = useState<{
    fatherName?: string;
    motherName?: string;
    schoolName?: string;
    dateOfBirth?: string;
    religion?: string;
  }>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/profile')
        .then((r) => r.json())
        .then((d) => {
          if (d.user) {
            setExtraProfile({
              fatherName: d.user.fatherName,
              motherName: d.user.motherName,
              schoolName: d.user.schoolName,
              dateOfBirth: d.user.dateOfBirth,
              religion: d.user.religion,
            });
          }
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="py-24 text-center text-slate-500 font-bold space-y-2">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm">প্রোফাইল লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. Student Identity Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* User Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-white/30 overflow-hidden flex items-center justify-center shrink-0 shadow-xl ring-2 ring-brand-500/30">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {session.user.name ? session.user.name.charAt(0) : '🎓'}
                </span>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{session.user.name}</h1>
                <span className="bg-[#C8102E] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {session.user.role === 'ADMIN' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200">
                শিক্ষানোভা একাডেমি • জুম্মাপাড়া, নীলফামারী সদর
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-300">
                {session.user.classGrade && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-lg font-bold border border-white/10">
                    <FaGraduationCap className="text-nova-400" /> শ্রেণি {session.user.classGrade}
                  </span>
                )}
                {session.user.rollNumber && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-lg font-bold border border-white/10">
                    <FaHashtag className="text-nova-400" /> রোল {session.user.rollNumber}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-white/10">
                  <FaEnvelope className="text-nova-400" /> {session.user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Shortcut */}
          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/15 transition shadow-sm"
            >
              <FaGear className="text-nova-400" />
              <span>প্রোফাইল সেটিংস</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. Pure Student Profile Details Grid */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800">ব্যক্তিগত ও একাডেমিক প্রোফাইল</h2>
            <p className="text-xs text-slate-500">আপনার নিবন্ধিত শিক্ষার্থী প্রোফাইলের পূর্ণ বিবরণ</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <FaCircleCheck className="w-3.5 h-3.5" /> অ্যাক্টিভ প্রোফাইল
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs sm:text-sm">
          
          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">শিক্ষার্থীর পূর্ণ নাম</span>
            <p className="font-black text-slate-800 text-sm sm:text-base">{session.user.name}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">নিবন্ধিত ইমেইল</span>
            <p className="font-mono font-bold text-slate-800 text-xs sm:text-sm">{session.user.email}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">শ্রেণি (Class Grade)</span>
            <p className="font-black text-brand-700 text-sm sm:text-base">
              {session.user.classGrade ? `${session.user.classGrade}ম শ্রেণি` : 'নির্ধারিত নয়'}
            </p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">শ্রেণির রোল নম্বর</span>
            <p className="font-black text-brand-700 text-sm sm:text-base">
              {session.user.rollNumber ? `রোল: ${session.user.rollNumber}` : 'নির্ধারিত নয়'}
            </p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">মোবাইল নম্বর</span>
            <p className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
              {session.user.phone || 'যুক্ত করা হয়নি'}
            </p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">পিতার নাম</span>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">{extraProfile.fatherName || 'নির্ধারিত নয়'}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">মাতার নাম</span>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">{extraProfile.motherName || 'নির্ধারিত নয়'}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">বিদ্যালয়ের নাম</span>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">{extraProfile.schoolName || 'নির্ধারিত নয়'}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">জন্ম তারিখ</span>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">{extraProfile.dateOfBirth || 'নির্ধারিত নয়'}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">ধর্ম (Religion)</span>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">{extraProfile.religion || 'ইসলাম'}</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">কোচিং প্রতিষ্ঠান</span>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">শিক্ষানোভা একাডেমি (Shikkha Nova)</p>
          </div>

        </div>

        {/* Action Buttons inside Profile */}
        <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-brand transition active:scale-98"
          >
            <FaGear />
            <span>ছবি ও তথ্য পরিবর্তন করুন</span>
          </Link>

          <Link
            href="/password"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition active:scale-98"
          >
            <FaShieldHalved />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </Link>

          <Link
            href="/my-notes"
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-[#C8102E] font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-200 transition active:scale-98"
          >
            <FaFilePdf />
            <span>আমার সংগৃহীত শিট ও নোট</span>
          </Link>

          <Link
            href="/results"
            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-amber-200 transition active:scale-98"
          >
            <FaAward />
            <span>রেজাল্ট ও মার্কশিট</span>
          </Link>
        </div>
      </div>

      {/* 3. Logout Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-700">অ্যাকাউন্ট থেকে প্রস্থান করবেন?</p>
          <p className="text-[11px] text-slate-400">নিরাপদ লগআউটের মাধ্যমে অধিবেশন সমাপ্ত করুন</p>
        </div>

        <button
          type="button"
          onClick={() => confirmSignOut()}
          className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-200 transition active:scale-98 cursor-pointer"
        >
          <FaArrowRightFromBracket />
          <span>লগআউট করুন</span>
        </button>
      </div>

    </div>
  );
}
