'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { confirmSignOut } from '@/lib/logout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaHashtag,
  FaCheck,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
  FaShieldHalved,
  FaArrowRightFromBracket,
  FaUserShield,
  FaCloudArrowUp,
  FaFilePdf,
  FaArrowRight,
  FaLock,
  FaAward,
  FaBookOpen,
  FaChevronRight,
  FaGear,
  FaTrophy,
  FaCopy,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';
import { HiSparkles } from 'react-icons/hi2';

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    classGrade: '7',
    rollNumber: '',
    fatherName: '',
    motherName: '',
    schoolName: '',
    dateOfBirth: '',
    religion: 'ইসলাম',
    fourthSubject: 'উচ্চতর গণিত',
    image: '',
    role: 'STUDENT',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.user) {
        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          classGrade: data.user.classGrade ? data.user.classGrade.toString() : '7',
          rollNumber: data.user.rollNumber ? data.user.rollNumber.toString() : '',
          fatherName: data.user.fatherName || '',
          motherName: data.user.motherName || '',
          schoolName: data.user.schoolName || '',
          dateOfBirth: data.user.dateOfBirth || '',
          religion: data.user.religion || 'ইসলাম',
          fourthSubject: data.user.fourthSubject || 'উচ্চতর গণিত',
          image: data.user.image || session?.user?.image || '',
          role: data.user.role || 'STUDENT',
        });
      }
    } catch {
      if (session?.user) {
        setProfile({
          name: session.user.name || '',
          email: session.user.email || '',
          phone: session.user.phone || '',
          classGrade: session.user.classGrade ? session.user.classGrade.toString() : '7',
          rollNumber: session.user.rollNumber ? session.user.rollNumber.toString() : '',
          fatherName: '',
          motherName: '',
          schoolName: '',
          dateOfBirth: '',
          image: session.user.image || '',
          role: session.user.role || 'STUDENT',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Photo Upload (Cloudinary with Local Fallback)
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg({ text: 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: 'ছবি সর্বোচ্চ ৫ মেগাবাইট হতে পারবে', type: 'error' });
      return;
    }

    setUploading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/user/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ছবি আপলোড করা যায়নি');
      }

      setProfile((prev) => ({ ...prev, image: data.url }));

      if (update) {
        await update({
          user: {
            image: data.url,
          },
        });
      }

      setMsg({ text: 'প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err.message || 'ছবি আপলোডে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Profile Details Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMsg(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          classGrade: parseInt(profile.classGrade),
          rollNumber: profile.rollNumber ? parseInt(profile.rollNumber) : null,
          fatherName: profile.fatherName,
          motherName: profile.motherName,
          schoolName: profile.schoolName,
          dateOfBirth: profile.dateOfBirth,
          religion: profile.religion,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'তথ্য সংরক্ষণ করা যায়নি');
      }

      setMsg({ text: 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!', type: 'success' });

      if (update) {
        await update({
          user: {
            name: profile.name,
            phone: profile.phone,
            classGrade: parseInt(profile.classGrade),
            rollNumber: profile.rollNumber ? parseInt(profile.rollNumber) : null,
          },
        });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">অ্যাকাউন্ট তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  const sideMenuItems = [
    {
      id: 'profile',
      label: 'প্রোফাইল ও একাডেমিক তথ্য',
      sublabel: 'নাম, শ্রেণি, রোল ও মোবাইল আপডেট',
      href: '/account',
      icon: FaUser,
      active: true,
    },
    {
      id: 'security',
      label: 'নিরাপত্তা ও পাসওয়ার্ড',
      sublabel: 'পাসওয়ার্ড পরিবর্তন করুন',
      href: '/password',
      icon: FaShieldHalved,
      active: false,
    },
    {
      id: 'notes',
      label: 'আমার শিট ও ফলাফল',
      sublabel: 'সংগৃহীত শিট ও মার্কশিট',
      href: '/my-notes',
      icon: FaBookOpen,
      active: false,
    },
    {
      id: 'fee',
      label: 'কোচিং মাসিক ফি (৳১২০০)',
      sublabel: 'অনলাইন ফি জমা ও রসিদ ডাউনলোড',
      href: '/pay-fee',
      icon: TbCashBanknote,
      active: false,
    },
    {
      id: 'card',
      label: 'শিক্ষার্থী প্রোফাইল কার্ড',
      sublabel: 'অফিশিয়াল পরিচিতিপত্র দেখুন',
      href: '/profile',
      icon: FaGraduationCap,
      active: false,
    },
    {
      id: 'results',
      label: 'পরীক্ষার রেজাল্ট অনুসন্ধান',
      sublabel: 'রোল ও শ্রেণি অনুযায়ী গ্রেডশিট',
      href: '/results',
      icon: FaAward,
      active: false,
    },
    {
      id: 'leaderboard',
      label: 'কুইজ লিডারবোর্ড',
      sublabel: 'মেধাতালিকা ও সেরা র‍্যাঙ্কিং স্কোর',
      href: '/leaderboard',
      icon: FaTrophy,
      active: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Main Layout: Desktop 2-Column Side Menu System (lg:grid-cols-12) */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
        
        {/* ========================================================= */}
        {/* DESKTOP SIDE MENU (Hidden on Mobile, Visible on Desktop) */}
        {/* ========================================================= */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-24">
          
          {/* User Profile Summary Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 60%, #2A0B1E 100%)',
            }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-48 h-48 bg-nova-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              {/* Avatar with Camera Icon */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-brand-700 to-nova-500 p-1 shadow-xl border-2 border-white/30">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center relative">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-white">
                        {profile.name ? profile.name.charAt(0) : '🎓'}
                      </span>
                    )}

                    {uploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
                        <FaClock className="w-5 h-5 animate-spin text-nova-400" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition transform hover:scale-110 active:scale-95"
                  title="নতুন ছবি আপলোড করুন"
                >
                  <FaCamera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-black text-white truncate max-w-[220px]">
                    {profile.name}
                  </h2>
                  <span className="bg-[#C8102E] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    {profile.role === 'ADMIN' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                  </span>
                </div>

                <p className="text-xs text-blue-200 font-mono truncate">{profile.email}</p>

                <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-300">
                  {profile.classGrade && (
                    <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold border border-white/10">
                      শ্রেণি {profile.classGrade}
                    </span>
                  )}
                  {profile.rollNumber && (
                    <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-bold border border-white/10">
                      রোল {profile.rollNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Menu Navigation Links */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-3 py-1 block">
              অ্যাকাউন্ট মেনু
            </span>

            {sideMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-150 group ${
                    item.active
                      ? 'bg-[#0A1E3C] text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1E3C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                        item.active
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-[#C8102E]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${item.active ? 'text-white' : 'text-slate-800'}`}>
                        {item.label}
                      </p>
                      <p className={`text-[10px] truncate ${item.active ? 'text-blue-200' : 'text-slate-400'}`}>
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  <FaChevronRight
                    className={`w-3 h-3 shrink-0 transition-transform ${
                      item.active
                        ? 'text-white/70'
                        : 'text-slate-300 group-hover:text-[#0A1E3C] group-hover:translate-x-0.5'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Admin Link if role === 'ADMIN' */}
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 hover:border-emerald-300 text-emerald-800 transition group mt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FaUserShield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">অ্যাডমিন প্যানেল</p>
                    <p className="text-[10px] text-emerald-700">সকল মডিউল ও ডাটা ম্যানেজ</p>
                  </div>
                </div>
                <FaArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            {/* Logout Button */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => confirmSignOut()}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-600 text-xs font-bold transition active:scale-98 cursor-pointer"
              >
                <FaArrowRightFromBracket className="w-3.5 h-3.5" />
                <span>লগআউট করুন</span>
              </button>
            </div>
          </div>

          {/* Helpline Card in Side Menu */}
          <div className="bg-gradient-to-r from-slate-900 to-[#0A1E3C] rounded-2xl p-4 text-white shadow-xs border border-white/10 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0 border border-white/15">
                <FaPhone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-300">সাহায্য বা অনুসন্ধানের জন্য:</p>
                <a
                  href="tel:01712592519"
                  onClick={() => {
                    navigator.clipboard?.writeText("01712592519");
                    toast.success("হেল্পলাইন নম্বর (01712592519) কপি হয়েছে!");
                  }}
                  className="text-xs font-bold text-white hover:text-nova-400 font-mono transition cursor-pointer flex items-center gap-1.5"
                  title="কল করতে ও নম্বর কপি করতে ক্লিক করুন"
                >
                  <span>০১৭১২৫৯২৫১৯</span>
                  <FaCopy className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>

        </aside>

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA (Col 5-12)                               */}
        {/* ========================================================= */}
        <main className="lg:col-span-8 xl:col-span-8 space-y-5 sm:space-y-6">
          
          {/* Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
            }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
                  <FaGear className="w-3 h-3 text-amber-300" /> একাউন্ট সেটিংস
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  ব্যক্তিগত ও একাডেমিক তথ্য পরিবর্তন
                </h1>
                <p className="text-xs text-blue-200 mt-1 max-w-xl">
                  আপনার ছবি, মোবাইল নম্বর এবং শ্রেণি-রোল আপডেট করে সবসময় হালনাগাদ রাখুন।
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 flex-wrap">
                <Link
                  href="/pay-fee"
                  className="inline-flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#a00d24] active:scale-98 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  <TbCashBanknote className="w-3.5 h-3.5 text-amber-300" />
                  <span>কোচিং ফি জমা (৳১২০০)</span>
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/15 transition shadow-xs"
                >
                  <FaUser className="w-3 h-3 text-nova-400" />
                  <span>প্রোফাইল কার্ড</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Alert Message */}
          {msg && (
            <div
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
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

          {/* Main Profile Edit Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            
            {/* Photo Upload Box inside Form */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shadow-md shrink-0">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-brand-700">{profile.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">প্রোফাইল ছবি পরিবর্তন</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    JPG, PNG বা WebP ফরম্যাট (সর্বোচ্চ ৫ মেগাবাইট)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full sm:w-auto bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-brand transition flex items-center justify-center gap-2 shrink-0 active:scale-98 disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <FaClock className="w-3.5 h-3.5 animate-spin" />
                    <span>আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCloudArrowUp className="w-3.5 h-3.5 text-nova-400" />
                    <span>নতুন ছবি আপলোড</span>
                  </>
                )}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
            </div>

            {/* Profile Fields Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs sm:text-sm">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  নিবন্ধিত ইমেইল ঠিকানা <span className="text-slate-400 font-normal">(অপরিবর্তনযোগ্য)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">শ্রেণি (Class 5 - 10)</label>
                  <select
                    value={profile.classGrade}
                    onChange={(e) => setProfile({ ...profile, classGrade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  >
                    <option value="5">৫ম শ্রেণি</option>
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="10">১০ম শ্রেণি</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">শ্রেণির রোল নম্বর</label>
                  <input
                    type="number"
                    value={profile.rollNumber}
                    onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                    placeholder="যেমন: 1, 5, 12"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">ধর্ম (ধর্মীয় বই নির্ধারণ)</label>
                  <select
                    value={profile.religion || 'ইসলাম'}
                    onChange={(e) => setProfile({ ...profile, religion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  >
                    <option value="ইসলাম">ইসলাম</option>
                    <option value="হিন্দু">হিন্দু</option>
                  </select>
                </div>
              </div>

              {/* Parents Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    পিতার নাম (Father's Name)
                  </label>
                  <input
                    type="text"
                    value={profile.fatherName}
                    onChange={(e) => setProfile({ ...profile, fatherName: e.target.value })}
                    placeholder="যেমন: মো: রফিকুল ইসলাম"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    মাতার নাম (Mother's Name)
                  </label>
                  <input
                    type="text"
                    value={profile.motherName}
                    onChange={(e) => setProfile({ ...profile, motherName: e.target.value })}
                    placeholder="যেমন: মোসা: রোকেয়া বেগম"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* School & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    বিদ্যালয়ের নাম (School Name)
                  </label>
                  <input
                    type="text"
                    value={profile.schoolName}
                    onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                    placeholder="যেমন: নীলফামারী সরকারি উচ্চ বিদ্যালয়"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    জন্ম তারিখ (Date of Birth)
                  </label>
                  <input
                    type="text"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  মোবাইল নম্বর (অভিভাবক / শিক্ষার্থী)
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full sm:w-auto bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold px-8 py-2.5 sm:py-3 rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <FaClock className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4" />
                      <span>তথ্য সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* Quick Shortcuts Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            <Link
              href="/password"
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0A1E3C] shadow-xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 group-hover:bg-[#0A1E3C] group-hover:text-white transition">
                  <FaLock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#C8102E] transition">
                    পাসওয়ার্ড ও নিরাপত্তা
                  </p>
                  <p className="text-[10px] text-slate-500">পাসওয়ার্ড পরিবর্তন করুন</p>
                </div>
              </div>
              <FaArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/my-notes"
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#C8102E] shadow-xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#C8102E] flex items-center justify-center shrink-0 group-hover:bg-[#C8102E] group-hover:text-white transition">
                  <FaFilePdf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#C8102E] transition">
                    সংগৃহীত শিট ও নোট
                  </p>
                  <p className="text-[10px] text-slate-500">ক্রয়কৃত শিট ডাউনলোড</p>
                </div>
              </div>
              <FaArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/leaderboard"
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500 shadow-xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition">
                  <FaTrophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-amber-700 transition">
                    কুইজ লিডারবোর্ড
                  </p>
                  <p className="text-[10px] text-slate-500">মেধাতালিকা ও র‍্যাঙ্কিং</p>
                </div>
              </div>
              <FaArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>

        </main>

      </div>

    </div>
  );
}
