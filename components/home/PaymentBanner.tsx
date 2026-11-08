'use client';

import React from 'react';
import Link from 'next/link';
import { TbFileDownload } from 'react-icons/tb';

export default function PaymentBanner() {
  return (
    <section className="bg-gradient-to-r from-brand-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div className="space-y-2 max-w-xl">
        <span className="bg-nova-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          বিকাশ ও নগদ ম্যানুয়াল পেমেন্ট
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">
          পিডিএফ শিট পেতে বিকাশ বা নগদে ফি পাঠান
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
          পার্সোনাল নম্বর: <strong className="font-mono text-white text-base">01712592519</strong> এ সেন্ড মানি করুন। তারপর পিডিএফ পেজে গিয়ে আপনার TrxID দিয়ে সাবমিট করুন। অ্যাডমিন ভেরিফাই করে ডাউনলোড লিংক ওপেন করে দিবে।
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-1">
          <span className="text-[11px] font-bold text-bkash bg-white px-2 py-0.5 rounded-full">bKash Personal</span>
          <p className="text-base font-black font-mono">01712592519</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-1">
          <span className="text-[11px] font-bold text-nagad bg-white px-2 py-0.5 rounded-full">Nagad Personal</span>
          <p className="text-base font-black font-mono">01712592519</p>
        </div>
        <Link
          href="/pdfs"
          className="inline-flex items-center justify-center gap-2 bg-nova-500 hover:bg-nova-600 text-white font-bold px-6 py-4 rounded-2xl text-sm shadow transition"
        >
          <TbFileDownload className="w-5 h-5" /> শিট কিনতে যান
        </Link>
      </div>
    </section>
  );
}

