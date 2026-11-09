'use client';

import React from 'react';
import Link from 'next/link';
import { TbFileDownload } from 'react-icons/tb';

export default function PaymentBanner() {
  return (
    <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-brand-700/60">
      <div className="space-y-2 max-w-xl">
        <span className="bg-nova-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          বিকাশ ও নগদ ম্যানুয়াল পেমেন্ট
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">
          পিডিএফ শিট পেতে বিকাশ বা নগদে ফি পাঠান
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
          পার্সোনাল নম্বর: <strong className="font-bn-normal text-white text-base">০১৭১২৫৯২৫১৯</strong> এ সেন্ড মানি করুন। তারপর পিডিএফ পেজে গিয়ে আপনার TrxID দিয়ে সাবমিট করুন। অ্যাডমিন ভেরিফাই করে ডাউনলোড লিংক ওপেন করে দেবে।
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-1.5 w-full sm:w-auto min-w-[170px] shadow-md">
          <div className="bg-white p-1 rounded-xl inline-flex items-center justify-center shadow-sm">
            <img src="/assets/images/bkash.png" alt="bKash" className="h-5 w-auto object-contain" />
          </div>
          <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">bKash Personal</p>
          <p className="text-base font-black font-bn-normal text-white">০১৭১২৫৯২৫১৯</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center space-y-1.5 w-full sm:w-auto min-w-[170px] shadow-md">
          <div className="bg-white p-1 rounded-xl inline-flex items-center justify-center shadow-sm">
            <img src="/assets/images/nagad.png" alt="Nagad" className="h-5 w-auto object-contain" />
          </div>
          <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Nagad Personal</p>
          <p className="text-base font-black font-bn-normal text-white">০১৭১২৫৯২৫১৯</p>
        </div>

        <Link
          href="/pdfs"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-nova-500 to-nova-600 hover:from-nova-600 hover:to-nova-700 text-white font-bold px-6 py-4 rounded-2xl text-sm shadow-md transition transform active:scale-95 w-full sm:w-auto whitespace-nowrap"
        >
          <TbFileDownload className="w-5 h-5" /> শিট কিনতে যান
        </Link>
      </div>
    </section>
  );
}
