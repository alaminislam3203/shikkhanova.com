'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'react-icons/fa6';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
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

      setSuccess('রেজিস্ট্রেশন সফল হয়েছে! লগইন পেজে নিয়ে যাওয়া হচ্ছে...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-6 space-y-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-brand-900">
          শিক্ষার্থী <span className="text-nova-500">রেজিস্ট্রেশন</span>
        </h1>
        <p className="text-xs text-slate-500">
          ৫ম থেকে ১০ম শ্রেণি - রোল অনুযায়ী প্রোফাইল তৈরি করুন
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-premium space-y-5">
        
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
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর পুরো নাম</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="যেমন: সাকিবুল ইসলাম"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
              />
              <FaUser className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি (Class 5-10)</label>
              <div className="relative">
                <select
                  name="classGrade"
                  value={formData.classGrade}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="5">Class 5 (৫ম)</option>
                  <option value="6">Class 6 (৬ষ্ঠ)</option>
                  <option value="7">Class 7 (৭ম)</option>
                  <option value="8">Class 8 (৮ম)</option>
                  <option value="9">Class 9 (৯ম)</option>
                  <option value="10">Class 10 (১০ম)</option>
                </select>
                <FaGraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">রোল নম্বর (Roll)</label>
              <div className="relative">
                <input
                  type="number"
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="যেমন: 1, 5, 12"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <FaHashtag className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড নির্ধারণ করুন</label>
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
            className="w-full bg-gradient-to-r from-nova-500 to-nova-600 hover:from-nova-600 hover:to-nova-700 text-white font-bold py-3 rounded-xl text-sm shadow-nova transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <span>{loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="font-bold text-brand-700 hover:underline">
            লগইন করুন
          </Link>
        </div>

      </div>

    </div>
  );
}
