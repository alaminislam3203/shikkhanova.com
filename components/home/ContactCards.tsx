'use client';

import React from 'react';
import { FaLocationDot, FaPhone, FaFacebook } from 'react-icons/fa6';

export default function ContactCards() {
  return (
    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-xl flex-shrink-0">
          <FaLocationDot />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">অফিসের ঠিকানা</h4>
          <p className="text-xs text-slate-500">জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
          <FaPhone />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">হেল্পলাইন ও যোগাযোগ</h4>
          <p className="text-xs text-slate-500"><span className="font-bn-normal font-bold text-slate-700">০১৭১২৫৯২৫১৯</span> (কল ও হোয়াটসঅ্যাপ)</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
          <FaFacebook />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">ফেসবুক পেজ</h4>
          <a
            href="https://facebook.com/ShikkhaNova"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand-600 hover:underline"
          >
            facebook.com/ShikkhaNova
          </a>
        </div>
      </div>
    </section>
  );
}

