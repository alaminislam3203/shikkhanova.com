'use client';

import React from 'react';
import Link from 'next/link';
import { TbFileDownload } from 'react-icons/tb';

export default function PaymentBanner() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
      }}
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3.5 sm:gap-6 border-b-4 border-[#C8102E]"
    >
      <div className="space-y-1.5 sm:space-y-2 max-w-xl">
        <span className="bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
          বিকাশ ও নগদ ম্যানুয়াল পেমেন্ট
        </span>
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-black leading-snug sm:leading-tight">
          পিডিএফ শিট পেতে বিকাশ বা নগদে ফি পাঠান
        </h2>
        <p className="text-[11px] sm:text-sm text-blue-100 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
          পার্সোনাল নম্বর: <strong className="font-bn-normal text-white text-xs sm:text-base">০১৭১২৫৯২৫১৯</strong> এ সেন্ড মানি করুন। তারপর পিডিএফ পেজে গিয়ে আপনার TrxID দিয়ে সাবমিট করুন। অ্যাডমিন ভেরিফাই করে ডাউনলোড লিংক ওপেন করে দেবে।
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
        {/* 2-Column Grid on Mobile for bKash & Nagad */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-4 rounded-xl sm:rounded-2xl text-center space-y-1 sm:space-y-1.5 shadow-md">
            <div className="bg-white p-1 rounded-sm sm:rounded-sm inline-flex items-center justify-center shadow-xs">
              <img src="/assets/images/bkash.png" alt="bKash" className="h-4 sm:h-5 w-auto object-contain" />
            </div>
            <p className="text-[9px] sm:text-[10px] text-blue-200 font-bold uppercase tracking-wider truncate">bKash Personal</p>
            <p className="text-xs sm:text-base font-black font-bn-normal text-white truncate">০১৭১২৫৯২৫১৯</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-4 rounded-xl sm:rounded-2xl text-center space-y-1 sm:space-y-1.5 shadow-md">
            <div className="bg-white p-1 rounded-sm sm:rounded-sm inline-flex items-center justify-center shadow-xs">
              <img src="/assets/images/nagad.png" alt="Nagad" className="h-4 sm:h-5 w-auto object-contain" />
            </div>
            <p className="text-[9px] sm:text-[10px] text-blue-200 font-bold uppercase tracking-wider truncate">Nagad Personal</p>
            <p className="text-xs sm:text-base font-black font-bn-normal text-white truncate">০১৭১২৫৯২৫১৯</p>
          </div>
        </div>

        <Link
          href="/pdfs"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-nova-500 to-nova-600 hover:from-nova-600 hover:to-nova-700 text-white font-bold px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition transform active:scale-95 w-full sm:w-auto whitespace-nowrap shrink-0"
        >
          <TbFileDownload className="w-4 h-4 sm:w-5 sm:h-5" /> শিট কিনতে যান
        </Link>
      </div>
    </section>
  );
}
