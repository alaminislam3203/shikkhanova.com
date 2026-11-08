'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
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
  FaTrashCan,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  }, [session]);

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

  // Handle Photo Upload
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
          ? 'ছবি সফলভাবে Cloudinary ক্লাউডে আপলোড ও সংরক্ষিত হয়েছে! ☁️'
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
          classGrade: profile.classGrade,
          rollNumber: profile.rollNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে');
      }

      setMsg({ text: 'আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে!', type: 'success' });

      if (update) {
        await update({
          user: {
            name: profile.name,
            phone: profile.phone,
            classGrade: parseInt(profile.classGrade),
            rollNumber: parseInt(profile.rollNumber),
          },
        });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'তথ্য সংরক্ষণ করা যায়নি', type: 'error' });
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Top Welcome Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #020D24 0%, #082C6D 50%, #001A4D 100%)',
        }}
        className="rounded-3xl p-6 sm:p-10 text-white shadow-premium border border-brand-800/60 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-700 to-nova-500 p-1 shadow-2xl border-2 border-white/30">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-900 flex items-center justify-center relative">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {profile.name ? profile.name.charAt(0) : '🎓'}
                  </span>
                )}

                {/* Loading overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
                    <FaClock className="w-6 h-6 animate-spin text-nova-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition transform hover:scale-110 active:scale-95"
              title="নতুন প্রোফাইল ছবি আপলোড করুন"
            >
              <FaCamera className="w-4 h-4" />
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>

          {/* User Basic Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
              <span className="bg-nova-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {profile.role}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-blue-200">
              শিক্ষানোভা একাডেমি • জুম্মাপাড়া, নীলফামারী সদর
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-300">
              {profile.classGrade && (
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl font-bold border border-white/10">
                  <FaGraduationCap className="text-nova-400" /> শ্রেণি {profile.classGrade}
                </span>
              )}
              {profile.rollNumber && (
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl font-bold border border-white/10">
                  <FaHashtag className="text-nova-400" /> রোল {profile.rollNumber}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl font-mono text-[11px] border border-white/10">
                <FaEnvelope className="text-nova-400" /> {profile.email}
              </span>
            </div>

            <p className="text-[11px] text-blue-200/80 pt-1">
              💡 প্রোফাইল ছবির ক্যামেরায় ক্লিক করে যেকোনো সময় আপনার ছবি পরিবর্তন করতে পারেন।
            </p>
          </div>

        </div>
      </div>

      {/* Alert Message */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-between shadow-sm ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? (
              <FaCircleCheck className="text-emerald-600 shrink-0" />
            ) : (
              <FaCircleExclamation className="text-rose-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Edit Profile (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-800">ব্যক্তিগত ও একাডেমিক তথ্য</h2>
            <p className="text-xs text-slate-500">আপনার নাম, মোবাইল নম্বর এবং শ্রেণি-রোল আপডেট করুন।</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (পরিবর্তনযোগ্য নয়)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্রেণি (Class 5 - 10)</label>
                <select
                  value={profile.classGrade}
                  onChange={(e) => setProfile({ ...profile, classGrade: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="5">Class 5 (৫ম)</option>
                  <option value="6">Class 6 (৬ষ্ঠ)</option>
                  <option value="7">Class 7 (৭ম)</option>
                  <option value="8">Class 8 (৮ম)</option>
                  <option value="9">Class 9 (৯ম)</option>
                  <option value="10">Class 10 (১০ম)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">রোল নম্বর</label>
                <input
                  type="number"
                  value={profile.rollNumber}
                  onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                  placeholder="যেমন: 1, 5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl shadow-brand transition active:scale-[0.99] flex items-center justify-center gap-2"
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
          </form>
        </div>

        {/* Right Column: Password & Shortcuts (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <FaLock className="text-nova-500" /> পাসওয়ার্ড পরিবর্তন
              </h2>
              <p className="text-xs text-slate-500">আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="পুনরায় নতুন পাসওয়ার্ড দিন"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl shadow transition text-xs"
              >
                {changingPassword ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}
              </button>
            </form>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-brand-50 to-indigo-50/50 rounded-3xl p-6 border border-brand-200/80 space-y-3 text-xs sm:text-sm">
            <h3 className="font-bold text-brand-900 flex items-center gap-2">
              <HiSparkles className="text-nova-500" /> গুরুত্বপূর্ণ লিংকসমূহ
            </h3>

            <div className="space-y-2">
              <Link
                href="/profile"
                className="w-full bg-white p-3 rounded-2xl border border-brand-100 flex items-center justify-between font-bold text-slate-800 hover:text-brand-700 hover:border-brand-300 transition shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FaFilePdf className="text-slogan-600" />
                  <span>আমার সংগৃহীত পিডিএফ হ্যান্ডনোট</span>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400" />
              </Link>

              <Link
                href="/results"
                className="w-full bg-white p-3 rounded-2xl border border-brand-100 flex items-center justify-between font-bold text-slate-800 hover:text-brand-700 hover:border-brand-300 transition shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FaAward className="text-nova-500" />
                  <span>কোচিং পরীক্ষার ফলাফল ও মার্কশিট</span>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

