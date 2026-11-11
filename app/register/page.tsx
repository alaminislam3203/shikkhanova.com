'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaGraduationCap,
  FaHashtag,
  FaCircleCheck,
  FaCircleExclamation,
  FaRightToBracket,
  FaSchool,
  FaCalendarDays,
  FaUserTie,
  FaPersonBreastfeeding,
} from 'react-icons/fa6';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    schoolName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    phone: '',
    classGrade: '7',
    rollNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      setSuccess('রেজিস্ট্রেশন সফল হয়েছে! অ্যাকাউন্টে প্রবেশ করা হচ্ছে...');
      toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! শিক্ষানোভাতে স্বাগতম।');

      // Auto login student immediately after account creation
      const loginRes = await signIn('credentials', {
        redirect: false,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (loginRes?.error) {
        setTimeout(() => {
          router.push('/login');
        }, 1200);
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 space-y-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-900">
          শিক্ষার্থী <span className="text-nova-500">ভর্তি ও রেজিস্ট্রেশন</span>
        </h1>
        <p className="text-xs text-slate-500">
          ৫ম থেকে ১০ম শ্রেণি - অভিভাবক ও একাডেমিক তথ্য দিয়ে প্রোফাইল তৈরি করুন
        </p>
      </div>

      <div className="p-0 sm:p-2 space-y-5">
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
            <FaCircleExclamation className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
            <FaCircleCheck className="text-emerald-500 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Student Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="যেমন: মো: তানভীর হাসান"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <FaUser className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Father's Name & Mother's Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বাবার নাম (Father's Name)</label>
              <div className="relative">
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="যেমন: মো: রফিকুল ইসলাম"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <FaUserTie className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মায়ের নাম (Mother's Name)</label>
              <div className="relative">
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="যেমন: মোসা: রোকেয়া বেগম"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <FaPersonBreastfeeding className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* School Name & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বিদ্যালয়ের নাম (School Name)</label>
              <div className="relative">
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="যেমন: নীলফামারী সরকারি উচ্চ বিদ্যালয়"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <FaSchool className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">জন্ম তারিখ (Date of Birth)</label>
              <div className="relative">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <FaCalendarDays className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Class & Roll */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি (Class 5-10) *</label>
              <div className="relative">
                <select
                  name="classGrade"
                  value={formData.classGrade}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="5">৫ম শ্রেণি</option>
                  <option value="6">৬ষ্ঠ শ্রেণি</option>
                  <option value="7">৭ম শ্রেণি</option>
                  <option value="8">৮ম শ্রেণি</option>
                  <option value="9">৯ম শ্রেণি</option>
                  <option value="10">১০ম শ্রেণি</option>
                </select>
                <FaGraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">রোল নম্বর (Roll) *</label>
              <div className="relative">
                <input
                  type="number"
                  name="rollNumber"
                  required
                  min={1}
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="যেমন: 1, 5, 12"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <FaHashtag className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর (অভিভাবক/শিক্ষার্থী)</label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <FaPhone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <FaEnvelope className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড *</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <FaLock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-brand transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <FaRightToBracket className="w-4 h-4" />
            <span>{loading ? 'ভর্তি সম্পন্ন হচ্ছে...' : 'ভর্তি ও একাউন্ট তৈরি করুন'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-semibold">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-[#C8102E] font-bold hover:underline">
              লগইন করুন
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
