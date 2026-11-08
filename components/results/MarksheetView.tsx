'use client';

import React from 'react';
import { FaPrint, FaAward } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import Logo from '@/components/common/Logo';
import { MarksheetData } from '@/types';

interface MarksheetViewProps {
  result: MarksheetData;
}

export default function MarksheetView({ result }: MarksheetViewProps) {
  return (
    <div className="space-y-4">
      {/* Printable Sheet */}
      <div
        id="printableArea"
        className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-slate-200/90 shadow-2xl space-y-6 max-w-4xl mx-auto relative overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-9xl font-black text-brand-900">SIKKHANOVA</span>
        </div>

        {/* Institute Header */}
        <div className="text-center border-b-2 border-brand-800 pb-5 space-y-1 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-white p-1 rounded-2xl shadow-sm">
              <Logo size="sm" clickable={false} />
            </div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-black text-brand-900 leading-tight">
                শিক্ষানোভা কোচিং সেন্টার
              </h2>
              <p className="text-[11px] uppercase tracking-widest font-black text-nova-600">
                SikkhaNova Coaching Center • sikkhanova.com
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী | হেল্পলাইন: ০১৭১২৫৯২৫১৯
          </p>

          <div className="inline-block mt-2 bg-gradient-to-r from-brand-800 via-brand-700 to-indigo-900 text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase shadow-sm">
            শিক্ষার্থী একাডেমিক ফলাফল ও মার্কশিট
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-50/70 p-4 rounded-2xl border border-brand-200 text-xs sm:text-sm relative z-10">
          <div>
            <span className="text-[11px] text-slate-500 block font-bold">শিক্ষার্থীর নাম:</span>
            <strong className="text-slate-900 text-base font-black">{result.studentName}</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-bold">শ্রেণি:</span>
            <strong className="text-brand-700 font-black text-base">Class {result.classGrade}</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-bold">রোল নম্বর:</span>
            <strong className="text-nova-600 font-black text-base">রোল {result.rollNumber}</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-bold">পরীক্ষার নাম:</span>
            <strong className="text-slate-800 font-bold">{result.examTitle}</strong>
          </div>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100/90 text-slate-800 text-xs font-bold uppercase border-b border-slate-300">
                <th className="py-3 px-4 border border-slate-300">বিষয় (Subject)</th>
                <th className="py-3 px-4 border border-slate-300 text-center w-24">পূর্ণমান</th>
                <th className="py-3 px-4 border border-slate-300 text-center w-28">প্রাপ্ত নম্বর</th>
                <th className="py-3 px-4 border border-slate-300 text-center w-24">লেটার গ্রেড</th>
                <th className="py-3 px-4 border border-slate-300 text-center w-24">জিপিএ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {result.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 border border-slate-300 font-bold text-slate-800">
                    {sub.subject}
                  </td>
                  <td className="py-3 px-4 border border-slate-300 text-center text-slate-600 font-semibold">
                    {sub.fullMarks}
                  </td>
                  <td className="py-3 px-4 border border-slate-300 text-center font-black text-slate-900">
                    {sub.obtained}
                  </td>
                  <td className="py-3 px-4 border border-slate-300 text-center font-black text-emerald-700">
                    {sub.grade}
                  </td>
                  <td className="py-3 px-4 border border-slate-300 text-center font-black text-brand-700">
                    {sub.gpa.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-50/90 font-bold text-slate-800 border-t-2 border-slate-400">
                <td className="py-3.5 px-4 border border-slate-300 text-base">সর্বমোট ফলাফল (Total)</td>
                <td className="py-3.5 px-4 border border-slate-300 text-center">{result.totalMarks}</td>
                <td className="py-3.5 px-4 border border-slate-300 text-center text-brand-800 font-black text-base">
                  {result.obtainedMarks}
                </td>
                <td className="py-3.5 px-4 border border-slate-300 text-center text-emerald-700 font-black text-base">
                  {result.grade}
                </td>
                <td className="py-3.5 px-4 border border-slate-300 text-center text-emerald-700 font-black text-base">
                  {result.gpa.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Grading Scale & Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-center font-semibold text-slate-600 relative z-10">
          <div>৮০-১০০ = <span className="font-bold text-emerald-700">A+ (5.00)</span></div>
          <div>৭০-৭৯ = <span className="font-bold text-emerald-600">A (4.00)</span></div>
          <div>৬০-৬৯ = <span className="font-bold text-blue-600">A- (3.50)</span></div>
          <div>৫০-৫৯ = <span className="font-bold text-amber-600">B (3.00)</span></div>
          <div>৪০-৪৯ = <span className="font-bold text-orange-600">C (2.00)</span></div>
          <div>০০-৩৯ = <span className="font-bold text-rose-600">F (0.00)</span></div>
        </div>

        {/* Signatures */}
        <div className="pt-10 flex justify-between items-end text-center text-xs font-bold text-slate-700 relative z-10">
          <div className="space-y-1">
            <div className="w-36 border-b border-slate-400"></div>
            <p>অভিভাবকের স্বাক্ষর</p>
          </div>
          <div className="space-y-1">
            <div className="w-36 border-b border-slate-400"></div>
            <p>শ্রেণি শিক্ষকের স্বাক্ষর</p>
          </div>
          <div className="space-y-1">
            <div className="w-40 border-b-2 border-slate-800"></div>
            <p className="text-brand-900 font-black">সেন্টার প্রধান / পরিচালক</p>
            <p className="text-[10px] text-slate-500 font-normal">শিক্ষানোভা, নীলফামারী সদর</p>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end max-w-4xl mx-auto no-print">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gradient-to-r from-brand-700 to-indigo-900 hover:from-brand-800 hover:to-black text-white font-bold text-xs sm:text-sm rounded-2xl shadow-brand hover:shadow-xl transition flex items-center gap-2 transform active:scale-95"
        >
          <FaPrint className="w-4 h-4 text-nova-300" />
          <span>অফিশিয়াল মার্কশিট প্রিন্ট / PDF সংরক্ষণ করুন</span>
        </button>
      </div>
    </div>
  );
}
