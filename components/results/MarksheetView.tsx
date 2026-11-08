'use client';

import React from 'react';
import { FaPrint } from 'react-icons/fa6';
import { MarksheetData } from '@/types';

interface MarksheetViewProps {
  result: MarksheetData;
}

export default function MarksheetView({ result }: MarksheetViewProps) {
  return (
    <div id="printableArea" className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-slate-200 shadow-premium space-y-6 max-w-4xl mx-auto">
      
      {/* Institute Header */}
      <div className="text-center border-b-2 border-brand-800 pb-5 space-y-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center text-lg">
            🎓
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-800">শিক্ষানোভা কোচিং সেন্টার</h2>
        </div>
        <p className="text-xs uppercase tracking-widest font-black text-nova-600">
          SikkhaNova Coaching Center • sikkhanova.com
        </p>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          জুম্মাপাড়া, নীলফামারী সদর | মোবাইল: ০১৭১২৫৯২৫১৯
        </p>
        <div className="inline-block mt-2 bg-gradient-to-r from-brand-800 to-indigo-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase shadow-sm">
          শিক্ষার্থী একাডেমিক মার্কশিট ও ফলাফল
        </div>
      </div>

      {/* Student Profile Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-50/60 p-4 rounded-2xl border border-brand-200/80 text-xs sm:text-sm">
        <div>
          <span className="text-[11px] text-slate-500 block font-bold">শিক্ষার্থীর নাম:</span>
          <strong className="text-slate-900 text-base font-black">{result.studentName}</strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block font-bold">শ্রেণি:</span>
          <strong className="text-brand-700 font-black">Class {result.classGrade}</strong>
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-xs font-bold uppercase border-b border-slate-300">
              <th className="py-3 px-4 border border-slate-300">বিষয় (Subject)</th>
              <th className="py-3 px-4 border border-slate-300 text-center w-28">পূর্ণমান</th>
              <th className="py-3 px-4 border border-slate-300 text-center w-28">প্রাপ্ত নম্বর</th>
              <th className="py-3 px-4 border border-slate-300 text-center w-24">গ্রেড</th>
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
                <td className="py-3 px-4 border border-slate-300 text-center font-bold text-slate-900">
                  {sub.obtained}
                </td>
                <td className="py-3 px-4 border border-slate-300 text-center font-bold text-emerald-700">
                  {sub.grade}
                </td>
                <td className="py-3 px-4 border border-slate-300 text-center font-bold text-brand-700">
                  {sub.gpa.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-brand-50/80 font-bold text-slate-800 border-t-2 border-slate-400">
              <td className="py-3.5 px-4 border border-slate-300 text-base">সর্বমোট ফলাফল (Total)</td>
              <td className="py-3.5 px-4 border border-slate-300 text-center">{result.totalMarks}</td>
              <td className="py-3.5 px-4 border border-slate-300 text-center text-brand-700 font-black text-base">
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

      {/* Signatures */}
      <div className="pt-12 flex justify-between items-end text-center text-xs font-bold text-slate-700">
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
          <p>সেন্টার প্রধান / পরিচালক</p>
          <p className="text-[10px] text-slate-500 font-normal">শিক্ষানোভা, নীলফামারী সদর</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="pt-4 border-t border-slate-200 flex justify-end no-print">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow transition flex items-center gap-2"
        >
          <FaPrint className="w-4 h-4" />
          <span>মার্কশিট প্রিন্ট / PDF সংরক্ষণ করুন</span>
        </button>
      </div>

    </div>
  );
}

