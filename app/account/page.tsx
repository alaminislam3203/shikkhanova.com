'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaUser,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaHashtag,
  FaLock,
  FaCheck,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
  FaFilePdf,
  FaAward,
  FaArrowRight,
  FaArrowRightFromBracket,
  FaShieldHalved,
  FaUserShield,
  FaBars,
  FaCloudArrowUp,
  FaGear,
  FaBookOpen,
  FaUserCheck,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

type AccountTab = 'profile' | 'security' | 'activity';

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    classGrade: '7',
    rollNumber: '',
    image: '',
    role: 'STUDENT',
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
      setMsg({ text: 'দয়া করে একটি সঠিক ছবি (JPG, PNG, WebP) নির্বাচন করুন', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: 'ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে', type: 'error' });
      return;
    }

    setUploading(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/user/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ছবি আপলোড ব্যর্থ হয়েছে');
      }

      setProfile((prev) => ({ ...prev, image: data.imageUrl }));
      setMsg({
        text: data.isCloudinary
          ? 'ছবি সফলভাবে আপলোড ও সংরক্ষিত হয়েছে! ☁️'
          : 'প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!',
        type: 'success',
      });

      // Update NextAuth session in real-time
      if (update) {
        await update({
          user: { image: data.imageUrl },
        });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'ছবি আপলোডে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  // Handle Profile Update
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

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

    setChangingPassword(true);

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

      setMsg({ text: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!', type: 'success' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMsg({ text: err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', type: 'error' });
    } finally {
      setChangingPassword(false);
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

  const sidebarTabs = [
    {
      id: 'profile' as AccountTab,
      label: 'একাউন্ট',
      sublabel: 'ছবি, নাম, মোবাইল ও রোল',
      icon: FaUser,
    },
    {
      id: 'security' as AccountTab,
      label: 'নিরাপত্তা ও পাসওয়ার্ড',
      sublabel: 'পাসওয়ার্ড ও নিরাপত্তা',
      icon: FaShieldHalved,
    },
    {
      id: 'activity' as AccountTab,
      label: 'আমার শিট ও ফলাফল',
      sublabel: 'ডাউনলোড ও মার্কশিট',
      icon: FaBookOpen,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Top Banner with Compact Profile Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 text-white shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-row items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
            {/* Avatar with Camera Icon */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-700 to-nova-500 p-1 shadow-xl border-2 border-white/30">
                <div className="w-full h-full rounded-[14px] sm:rounded-[20px] overflow-hidden bg-slate-900 flex items-center justify-center relative">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl sm:text-4xl font-black text-white">
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
                className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition transform hover:scale-110 active:scale-95"
                title="নতুন ছবি আপলোড করুন"
              >
                <FaCamera className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
            </div>

            {/* Profile Brief Info */}
            <div className="space-y-1 text-left min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-2xl font-black text-white truncate max-w-[200px] sm:max-w-none">{profile.name}</h1>
                <span className="bg-nova-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  {profile.role === 'ADMIN' ? 'অ্যাডমিন' : profile.role === 'TEACHER' ? 'শিক্ষক' : 'শিক্ষার্থী'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-200 line-clamp-1">
                শিক্ষানোভা একাডেমি • জুম্মাপাড়া, নীলফামারী সদর
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] sm:text-xs text-slate-300">
                {profile.classGrade && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg font-bold border border-white/10 shrink-0">
                    <FaGraduationCap className="text-nova-400" /> শ্রেণি {profile.classGrade}
                  </span>
                )}
                {profile.rollNumber && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg font-bold border border-white/10 shrink-0">
                    <FaHashtag className="text-nova-400" /> রোল {profile.rollNumber}
                  </span>
                )}
                <span className="hidden sm:inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg font-mono text-[11px] border border-white/10 truncate">
                  <FaEnvelope className="text-nova-400" /> {profile.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action in Header (Helpline on mobile + Upload Button on desktop) */}
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-2 border-t border-white/10 pt-2.5 sm:border-t-0 sm:pt-0">
            <a
              href="tel:01712592519"
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-blue-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 font-bold transition"
            >
              <FaPhone className="w-3 h-3 text-emerald-400" />
              <span>হেল্পলাইন: ০১৭১২৫৯২৫১৯</span>
            </a>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition backdrop-blur-md shadow-sm"
            >
              <FaCloudArrowUp className="text-nova-400 w-4 h-4" />
              <span>{uploading ? 'আপলোড হচ্ছে...' : 'নতুন ছবি আপলোড'}</span>
            </button>
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

      {/* Mobile Navigation Segmented Tabs (Visible on Mobile Screens Only) */}
      <div className="lg:hidden bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm grid grid-cols-3 gap-1">
        {sidebarTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                active
                  ? 'bg-gradient-to-r from-brand-700 to-brand-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate text-[11px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Layout: Left Sidebar (Desktop) + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        
        {/* ================= LEFT SIDEBAR (Desktop Only: 4 Cols) ================= */}
        <aside className="hidden lg:block lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 lg:sticky lg:top-28">
          
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">অ্যাকাউন্ট মেনু</h2>
          </div>

          {/* Sidebar Navigation Tabs */}
          <nav className="space-y-1.5">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 group ${
                    active
                      ? 'bg-gradient-to-r from-brand-700 to-brand-800 text-white shadow-brand scale-101 border border-brand-600'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-brand-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                      active
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight truncate">{tab.label}</p>
                    <p className={`text-[10px] font-normal leading-tight mt-0.5 truncate ${
                      active ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {tab.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Additional Quick Action Links */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            
            {/* If Admin: Direct shortcut to Admin Panel */}
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="w-full p-3 rounded-2xl text-xs font-bold text-brand-800 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/60 transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FaUserShield className="w-4 h-4" />
                </div>
                <div>
                  <p className="leading-tight">অ্যাডমিন কন্ট্রোল প্যানেল</p>
                  <p className="text-[10px] text-brand-600 font-normal mt-0.5">ম্যানেজমেন্ট ড্যাশবোর্ড</p>
                </div>
              </Link>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full p-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
                <FaArrowRightFromBracket className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight">লগআউট করুন</p>
                <p className="text-[10px] text-rose-400 font-normal mt-0.5">অ্যাকাউন্ট থেকে প্রস্থান</p>
              </div>
            </button>

          </div>

          {/* Center Info Box */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">সহায়তা কেন্দ্র:</p>
            <p className="font-bn-normal text-brand-800 font-bold">০১৭১২৫৯২৫১৯</p>
            <p className="text-[10px]">জুম্মাপাড়া, নীলফামারী সদর</p>
          </div>

        </aside>

        {/* ================= RIGHT CONTENT AREA (8 Cols on Desktop / Full Width on Mobile) ================= */}
        <main className="lg:col-span-8 space-y-4 sm:space-y-6">
          
          {/* TAB 1: Profile & Photo */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm space-y-5 sm:space-y-6 animate-in fade-in duration-150">
              
              <div className="border-b border-slate-100 pb-3 sm:pb-4">
                <h2 className="text-base sm:text-lg font-black text-slate-800">ব্যক্তিগত ও একাডেমিক তথ্য</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার ছবি, পুরো নাম, মোবাইল নম্বর এবং শ্রেণি-রোল আপডেট করুন।
                </p>
              </div>

              {/* Photo Upload Card Section */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shadow-md shrink-0">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-black text-brand-700">{profile.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-800">প্রোফাইল ছবি</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                      JPG, PNG বা WebP ফরম্যাট (সর্বোচ্চ ৫MB)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-brand-700 hover:bg-brand-800 text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-brand transition flex items-center gap-1.5 shrink-0"
                >
                  <FaCamera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{uploading ? 'আপলোড হচ্ছে...' : 'ছবি পরিবর্তন'}</span>
                </button>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 sm:py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ইমেইল ঠিকানা <span className="text-slate-400 font-normal">(অপরিবর্তনযোগ্য)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 sm:py-2.5 text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শ্রেণি (Class 5 - 10)</label>
                    <select
                      value={profile.classGrade}
                      onChange={(e) => setProfile({ ...profile, classGrade: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
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
                    <label className="block font-bold text-slate-700 mb-1">রোল নম্বর</label>
                    <input
                      type="number"
                      value={profile.rollNumber}
                      onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                      placeholder="যেমন: 1, 5"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর (অভিভাবক / শিক্ষার্থী)</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 sm:py-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full sm:w-auto bg-brand-700 hover:bg-brand-800 text-white font-bold px-8 py-2.5 sm:py-3 rounded-xl shadow-brand transition active:scale-[0.99] flex items-center justify-center gap-2"
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
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm space-y-5 sm:space-y-6 animate-in fade-in duration-150">
              
              <div className="border-b border-slate-100 pb-3 sm:pb-4">
                <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <FaShieldHalved className="text-brand-700" /> অ্যাকাউন্ট নিরাপত্তা ও পাসওয়ার্ড পরিবর্তন
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার অ্যাকাউন্টের নিরাপত্তা সুনিশ্চিত রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 sm:space-y-4 max-w-lg text-xs sm:text-sm">
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বর্তমান পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    placeholder="আপনার বর্তমান পাসওয়ার্ড দিন"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 sm:py-2.5 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 sm:py-2.5 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 sm:py-2.5 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-bold px-8 py-2.5 sm:py-3 rounded-xl shadow transition active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {changingPassword ? (
                      <>
                        <FaClock className="w-4 h-4 animate-spin" />
                        <span>আপডেট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="w-4 h-4" />
                        <span>পাসওয়ার্ড আপডেট করুন</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

              <div className="bg-amber-50 p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <HiSparkles className="text-amber-600" /> নিরাপত্তা টিপস:
                </p>
                <p>পাসওয়ার্ডে ইংরেজি বড়-ছোট অক্ষর ও সংখ্যা ব্যবহার করুন। আপনার পাসওয়ার্ড অন্য কারো সাথে শেয়ার করবেন না।</p>
              </div>

            </div>
          )}

          {/* TAB 3: Activity & Shortcuts (2 CARDS PER ROW ON MOBILE) */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm space-y-5 sm:space-y-6 animate-in fade-in duration-150">
              
              <div className="border-b border-slate-100 pb-3 sm:pb-4">
                <h2 className="text-base sm:text-lg font-black text-slate-800">আমার একাডেমিক কার্যক্রম ও শিটসমূহ</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার সংগৃহীত পিডিএফ হ্যান্ডনোট, পরীক্ষার রেজাল্ট ও দৈনিক উপস্থিতি চেক করুন।
                </p>
              </div>

              {/* 2 Cards Per Row on Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
                
                {/* PDF Materials Shortcut */}
                <Link
                  href="/profile"
                  className="p-3 sm:p-5 rounded-2xl border border-slate-200 hover:border-brand-500 bg-slate-50/60 hover:bg-white transition shadow-xs hover:shadow-md group flex flex-col justify-between space-y-2.5 sm:space-y-4"
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <FaFilePdf className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-xs sm:text-base font-black text-slate-800 group-hover:text-brand-700 transition truncate sm:line-clamp-none">
                      সংগৃহীত পিডিএফ নোট
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500">
                      আপনার বিকাশ বা নগদ পেমেন্টে অনুমোদিত সকল শিট ও হ্যান্ডনোট ডাউনলোড করুন।
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-brand-700 pt-1.5 sm:pt-2 border-t border-slate-100">
                    <span>ডাউনলোড পেইজ</span>
                    <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Exam Result Shortcut */}
                <Link
                  href="/results"
                  className="p-3 sm:p-5 rounded-2xl border border-slate-200 hover:border-brand-500 bg-slate-50/60 hover:bg-white transition shadow-xs hover:shadow-md group flex flex-col justify-between space-y-2.5 sm:space-y-4"
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <FaAward className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-xs sm:text-base font-black text-slate-800 group-hover:text-brand-700 transition truncate sm:line-clamp-none">
                     রেজাল্ট ও মার্কশিট
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500">
                      ক্লাস ও রোল নম্বর দিয়ে অফিশিয়াল গ্রেডশিট, জিপিএ ও সাবজেক্ট মার্কস দেখুন।
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-brand-700 pt-1.5 sm:pt-2 border-t border-slate-100">
                    <span>মার্কশিট দেখুন</span>
                    <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Daily Attendance Shortcut */}
                <Link
                  href="/attendance"
                  className="p-3 sm:p-5 rounded-2xl border border-slate-200 hover:border-brand-500 bg-slate-50/60 hover:bg-white transition shadow-xs hover:shadow-md group flex flex-col justify-between space-y-2.5 sm:space-y-4"
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FaUserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-xs sm:text-base font-black text-slate-800 group-hover:text-brand-700 transition truncate sm:line-clamp-none">
                      দৈনিক রোল উপস্থিতি
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500">
                      ৫ম থেকে ১০ম শ্রেণি পর্যন্ত তারিখ অনুযায়ী ক্লাসের উপস্থিতি ও অনুপস্থিতি দেখুন।
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-brand-700 pt-1.5 sm:pt-2 border-t border-slate-100">
                    <span>হাজিরা চেক করুন</span>
                    <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* PDFs Shop Shortcut */}
                <Link
                  href="/pdfs"
                  className="p-3 sm:p-5 rounded-2xl border border-slate-200 hover:border-brand-500 bg-slate-50/60 hover:bg-white transition shadow-xs hover:shadow-md group flex flex-col justify-between space-y-2.5 sm:space-y-4"
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center">
                      <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-xs sm:text-base font-black text-slate-800 group-hover:text-brand-700 transition truncate sm:line-clamp-none">
                      নোট ও সাজেশন শপ
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500">
                      অভিজ্ঞ শিক্ষকদের তৈরি ১০০% কমন উপযোগী রঙিন অধ্যায়ভিত্তিক হ্যান্ডনোট।
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-brand-700 pt-1.5 sm:pt-2 border-t border-slate-100">
                    <span>নোট শপে যান</span>
                    <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

              </div>

            </div>
          )}

          {/* Mobile Quick Action Buttons (Admin & Logout) */}
          <div className="lg:hidden grid grid-cols-2 gap-2.5 pt-1">
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="p-3 rounded-2xl text-xs font-bold text-brand-800 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/60 transition flex items-center justify-center gap-2"
              >
                <FaUserShield className="w-4 h-4 text-brand-700 shrink-0" />
                <span>অ্যাডমিন প্যানেল</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`p-3 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center justify-center gap-2 ${
                session.user.role === 'ADMIN' ? '' : 'col-span-2'
              }`}
            >
              <FaArrowRightFromBracket className="w-4 h-4 shrink-0" />
              <span>লগআউট করুন</span>
            </button>
          </div>

        </main>

      </div>

    </div>
  );
}
