'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaUserCheck,
  FaAward,
  FaFilePdf,
  FaYoutube,
  FaArrowRight,
} from 'react-icons/fa6';

export default function FeaturesGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Feature 1: Notices & Academic Updates */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-xl shadow-inner">
            <FaUserCheck />
          </div>
          <h3 className="text-lg font-bold text-slate-800">অফিশিয়াল নোটিশ ও রুটিন</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ক্লাস ৫, ৬, ৭, ৮, ৯ ও ১০ম শ্রেণির সকল ব্যাচের পরীক্ষার সময়সূচি, ক্লাস রুটিন ও জরুরি একাডেমিক বিজ্ঞপ্তি দেখুন।
          </p>
        </div>
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 pt-2"
        >
          নোটিশ বোর্ডে যান <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Feature 2: Results */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-nova-600 flex items-center justify-center text-xl shadow-inner">
            <FaAward />
          </div>
          <h3 className="text-lg font-bold text-slate-800">কোচিং রেজাল্ট ও মার্কশিট</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            উইকলি, মান্থলি ও মডেল টেস্টের ফলাফল প্রকাশ। রোল নম্বর ও শ্রেণি সিলেক্ট করলেই স্বয়ংক্রিয় জিপিএ গ্রেড ও প্রিন্টযোগ্য মার্কশিট।
          </p>
        </div>
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-xs font-bold text-nova-600 hover:text-nova-700 pt-2"
        >
          ফলাফল অনুসন্ধান করুন <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Feature 3: PDF Handnotes */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-slogan-600 flex items-center justify-center text-xl shadow-inner">
            <FaFilePdf />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">পিডিএফ হ্যান্ডনোট</h3>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">TrxID পেমেন্ট</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            স্পেশাল লেকচার শিট ও বোর্ড সাজেশন। বিকাশ ও নগদে ফি পাঠিয়ে TrxID সাবমিট করলেই অ্যাডমিন অ্যাপ্রুভ করে পিডিএফ আনলক করবেন।
          </p>
        </div>
        <Link
          href="/pdfs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slogan-600 hover:text-slogan-700 pt-2"
        >
          পিডিএফ নোট দেখুন <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Feature 4: YouTube Lessons */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shadow-inner">
            <FaYoutube />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">ইউটিউব ক্লাস</h3>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">@ShikkhaNova</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            শিক্ষানোভার অফিসিয়াল ইউটিউব চ্যানেল থেকে বিষয়ভিত্তিক অভিজ্ঞ শিক্ষকদের রেকর্ডেড ক্লাস ও প্রশ্নের সমাধান সরাসরি ব্রাউজ করুন।
          </p>
        </div>
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 pt-2"
        >
          ভিডিও ক্লাস দেখুন <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </section>
  );
}

