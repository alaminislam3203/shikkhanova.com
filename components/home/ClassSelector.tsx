'use client';

import React from 'react';
import Link from 'next/link';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa6';

export default function ClassSelector() {
  const classes = [
    { grade: 5, bn: '৫ম শ্রেণি', name: 'Class 5', rolls: 'রোল ১-৫০' },
    { grade: 6, bn: '৬ষ্ঠ শ্রেণি', name: 'Class 6', rolls: 'রোল ১-৫০' },
    { grade: 7, bn: '৭ম শ্রেণি', name: 'Class 7', rolls: 'রোল ১-৫০' },
    { grade: 8, bn: '৮ম শ্রেণি', name: 'Class 8', rolls: 'রোল ১-৫০' },
    { grade: 9, bn: '৯ম শ্রেণি', name: 'Class 9', rolls: 'রোল ১-৫০' },
    { grade: 10, bn: '১০ম শ্রেণি', name: 'Class 10', rolls: 'রোল ১-৫০' },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaBookOpen className="text-brand-700" /> শ্রেণি নির্বাচন (Classes 5 - 10)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            আপনার শ্রেণি নির্বাচন করে সরাসরি রোল উপস্থিতি, ফলাফল বা ভিডিও ক্লাস দেখুন
          </p>
        </div>
        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          রোল নম্বর অনুযায়ী সাজানো
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {classes.map((c) => (
          <Link
            key={c.grade}
            href={`/attendance?classGrade=${c.grade}`}
            className="group bg-white hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 p-5 rounded-2xl text-center shadow-sm hover:shadow-brand transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-3xl font-black text-brand-700 group-hover:text-nova-600 transition-colors inline-block">
                {c.bn.split(' ')[0]}
              </span>
              <h3 className="text-sm font-bold text-slate-800">{c.name}</h3>
              <p className="text-[11px] font-medium text-slate-400">{c.rolls}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-brand-700 group-hover:text-nova-600">
              <span>হাজিরা দিন</span>
              <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

