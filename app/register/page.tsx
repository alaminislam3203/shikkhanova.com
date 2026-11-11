'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiBook,
  FiCalendar,
  FiHome,
  FiUsers,
} from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If already logged in, block entry to /register and redirect
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classGrade: '7',
    rollNumber: '',
    schoolName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Password strength calculation matching Merxo Hub
  const passScore = useMemo(() => {
    let s = 0;
    if (formData.password.length >= 6) s++;
    if (/[A-Z]/.test(formData.password)) s++;
    if (/\d/.test(formData.password)) s++;
    if (/[^A-Za-z0-9]/.test(formData.password)) s++;
    return s;
  }, [formData.password]);

  const scoreLabel = ['দুর্বল', 'মোটামুটি', 'ভালো', 'শক্তিশালী', 'অত্যন্ত শক্তিশালী'][
    passScore
  ] || 'দুর্বল';

  const canSubmit = useMemo(() => {
    const validEmail = /\S+@\S+\.\S+/.test(formData.email);
    const strongPass = formData.password.length >= 6;
    const match = formData.password && formData.password === formData.confirmPassword;
    return (
      !!formData.name.trim() &&
      validEmail &&
      !!formData.phone.trim() &&
      !!formData.rollNumber &&
      !!formData.schoolName.trim() &&
      !!formData.fatherName.trim() &&
      !!formData.motherName.trim() &&
      !!formData.dateOfBirth &&
      strongPass &&
      match &&
      !loading
    );
  }, [formData, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Strict validation for all required fields
    if (!formData.name.trim()) {
      setError('শিক্ষার্থীর পূর্ণ নাম আবশ্যক');
      toast.error('শিক্ষার্থীর পূর্ণ নাম আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('সঠিক ইমেইল ঠিকানা আবশ্যক');
      toast.error('সঠিক ইমেইল ঠিকানা আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('অভিভাবক / শিক্ষার্থীর মোবাইল নম্বর আবশ্যক');
      toast.error('মোবাইল নম্বর আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.rollNumber) {
      setError('শ্রেণির রোল নম্বর আবশ্যক');
      toast.error('রোল নম্বর আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.schoolName.trim()) {
      setError('অধ্যয়নরত বিদ্যালয়ের নাম আবশ্যক');
      toast.error('বিদ্যালয়ের নাম আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.fatherName.trim()) {
      setError('পিতার নাম আবশ্যক');
      toast.error('পিতার নাম আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.motherName.trim()) {
      setError('মাতার নাম আবশ্যক');
      toast.error('মাতার নাম আবশ্যক');
      setLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      setError('শিক্ষার্থীর জন্ম তারিখ আবশ্যক');
      toast.error('জন্ম তারিখ আবশ্যক');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না');
      toast.error('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না');
      setLoading(false);
      return;
    }

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

      toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম।');

      // Auto login student immediately after registration
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
      toast.error(err.message || 'সমস্যা হয়েছে');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Merxo-Hub style container with Shikkha Nova Theme */}
        <div className="max-w-[550px] mx-auto overflow-hidden">
          
          {/* Card Header matching Merxo Hub */}
          <div className="px-6 pt-6 text-center">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold tracking-widest text-white px-4 py-2 rounded-full bg-[#0F2C59]">
                রেজিস্ট্রেশন
              </span>
            </div>
            <h2 className="text-3xl font-black text-[#0F2C59]">
              শিক্ষার্থী নিবন্ধন
            </h2>
            <p className="text-sm text-gray-600 text-center mt-1">
              ৫ম থেকে ১০ম শ্রেণি • সকল তথ্য আবশ্যক
            </p>
          </div>

          {/* Form Body matching Merxo Hub layout */}
          <div className="p-6 sm:p-8 border-t border-gray-100">
            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-[5px] px-3.5 py-2.5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Section 1: Academic & Contact Details */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  ১. শিক্ষার্থীর বিবরণ
                </span>

                {/* Full Name with FiUser */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="শিক্ষার্থীর পূর্ণ নাম *"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                    style={{ paddingLeft: '34px' }}
                  />
                </div>

                {/* Email with FiMail */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ইমেইল ঠিকানা *"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                    style={{ paddingLeft: '34px' }}
                  />
                </div>

                {/* Mobile Phone with FiPhone */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiPhone />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="মোবাইল নম্বর *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition font-mono"
                    style={{ paddingLeft: '34px' }}
                  />
                </div>

                {/* Class & Roll Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiBook />
                    </span>
                    <select
                      name="classGrade"
                      required
                      value={formData.classGrade}
                      onChange={handleChange}
                      className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-white focus:outline-none focus:border-[#0F2C59] transition"
                      style={{ paddingLeft: '34px' }}
                    >
                      <option value="5">৫ম শ্রেণি</option>
                      <option value="6">৬ষ্ঠ শ্রেণি</option>
                      <option value="7">৭ম শ্রেণি</option>
                      <option value="8">৮ম শ্রেণি</option>
                      <option value="9">৯ম শ্রেণি</option>
                      <option value="10">১০ম শ্রেণি</option>
                    </select>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs pointer-events-none">
                      #
                    </span>
                    <input
                      type="number"
                      name="rollNumber"
                      required
                      placeholder="রোল নম্বর *"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition font-mono"
                      style={{ paddingLeft: '28px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Guardian & School Info (Mandatory) */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  ২. অভিভাবক ও বিদ্যালয়ের বিবরণ (আবশ্যক)
                </span>

                {/* School Name with FiHome */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiHome />
                  </span>
                  <input
                    type="text"
                    name="schoolName"
                    required
                    placeholder="বর্তমান বিদ্যালয়ের নাম *"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                    style={{ paddingLeft: '34px' }}
                  />
                </div>

                {/* Father & Mother Name in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiUsers />
                    </span>
                    <input
                      type="text"
                      name="fatherName"
                      required
                      placeholder="পিতার নাম *"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                      style={{ paddingLeft: '34px' }}
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FiUsers />
                    </span>
                    <input
                      type="text"
                      name="motherName"
                      required
                      placeholder="মাতার নাম *"
                      value={formData.motherName}
                      onChange={handleChange}
                      className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                      style={{ paddingLeft: '34px' }}
                    />
                  </div>
                </div>

                {/* Date of Birth with FiCalendar */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiCalendar />
                  </span>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    placeholder="জন্ম তারিখ *"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-white focus:outline-none focus:border-[#0F2C59] transition text-slate-800"
                    style={{ paddingLeft: '34px' }}
                  />
                </div>
              </div>

              {/* Section 3: Password & Security */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  ৩. একাউন্ট পাসওয়ার্ড
                </span>

                {/* Password with FiLock & strength bar */}
                <div className="relative">
                  <span className="absolute left-3 top-[22px] -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiLock />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                    style={{ paddingLeft: '34px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[22px] -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>

                  {formData.password && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded">
                        <div
                          className="h-1.5 rounded bg-[#0F2C59] transition-all duration-300"
                          style={{ width: `${(passScore / 4) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        পাসওয়ার্ডের শক্তি: <span className="font-semibold text-slate-700">{scoreLabel}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password with FiLock */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <FiLock />
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="কনফার্ম পাসওয়ার্ড *"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                    style={{ paddingLeft: '34px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="bg-[#0F2C59] hover:bg-[#0A1E3C] p-3 rounded-[5px] text-white w-full disabled:opacity-50 font-semibold transition cursor-pointer disabled:cursor-not-allowed mt-2 shadow-xs"
              >
                {loading ? 'নিবন্ধন সম্পন্ন হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-500">অথবা</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login Link */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
              <p>ইতোমধ্যে অ্যাকাউন্ট রয়েছে?</p>
              <Link href="/login" className="text-[#C8102E] font-semibold hover:underline">
                লগইন করুন
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
