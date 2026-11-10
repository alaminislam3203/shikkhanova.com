'use client';

import React from 'react';
import { FaPrint, FaAward, FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import Logo from '@/components/common/Logo';
import { MarksheetData } from '@/types';

interface MarksheetViewProps {
  result: MarksheetData;
}

export default function MarksheetView({ result }: MarksheetViewProps) {
  const isPassed = result.grade !== 'F' && result.gpa > 0;

  const handlePrint = () => {
    // Close any open dropdowns/menus before printing
    if (typeof document !== 'undefined') {
      document.body.click();
    }
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* Printable Sheet */}
      <div
        id="printableArea"
        className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-xl space-y-6 max-w-4xl mx-auto relative overflow-hidden print:p-6 print:border-none print:shadow-none"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-9xl font-black text-brand-900 tracking-widest">SHIKKHANOVA</span>
        </div>

        {/* Institute Header */}
        <div className="text-center border-b-2 border-[#C8102E] pb-5 space-y-2 relative z-10">
          <div className="flex items-center justify-center mb-1">
            <div className="bg-white px-3 py-1.5 rounded-2xl shadow-xs border border-slate-100">
              <Logo size="md" clickable={false} />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী | হেল্পলাইন: <span className="font-bn-normal font-bold text-[#0A1E3C]">০১৭১২৫৯২৫১৯</span>
          </p>

          {/* Exam Title Set Prominently in Header */}
          <div className="pt-1">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-[#0A1E3C] border-b-2 border-[#C8102E] text-white text-xs sm:text-sm font-bold px-6 py-2 rounded-full uppercase shadow-md">
              <span className="text-amber-300 font-black">{result.examTitle}</span>
              <span className="text-slate-400">|</span>
              <span>একাডেমিক ফলাফল ও অফিশিয়াল মার্কশিট</span>
            </div>
          </div>
        </div>

        {/* Student Profile Info & Status */}
        <div className="p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm relative z-10 bg-slate-50 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Column 1: শিক্ষার্থীর নাম, পিতার নাম, মাতার নাম, বিদ্যালয়ের নাম (সবগুলো ১ কলামে) */}
            <div className="space-y-2.5">
              <div className="flex items-start">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  শিক্ষার্থীর নাম:
                </span>
                <span className="text-slate-900 text-sm sm:text-base font-black truncate">
                  {result.studentName}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  পিতার নাম:
                </span>
                <span className="text-slate-800 text-xs sm:text-sm font-bold truncate">
                  {result.fatherName || '—'}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  মাতার নাম:
                </span>
                <span className="text-slate-800 text-xs sm:text-sm font-bold truncate">
                  {result.motherName || '—'}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  বিদ্যালয়ের নাম:
                </span>
                <span className="text-slate-800 text-xs sm:text-sm font-bold">
                  {result.schoolName || '—'}
                </span>
              </div>
            </div>

            {/* Column 2: শ্রেণি, রোল নম্বর, জন্ম তারিখ, ফলাফল স্ট্যাটাস */}
            <div className="space-y-2.5 md:border-l md:border-slate-200 md:pl-6 print:border-l print:border-slate-200 print:pl-6">
              <div className="flex items-center">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  শ্রেণি:
                </span>
                <span className="text-brand-700 font-black text-sm sm:text-base">
                  Class {result.classGrade}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  রোল নম্বর:
                </span>
                <span className="text-nova-600 font-black text-sm sm:text-base">
                  রোল {result.rollNumber}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  জন্ম তারিখ:
                </span>
                <span className="text-slate-800 text-xs sm:text-sm font-bold">
                  {result.dateOfBirth || '—'}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-28 sm:w-32 shrink-0 text-slate-600 font-bold text-xs sm:text-sm">
                  ফলাফল স্ট্যাটাস:
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-black text-xs px-2.5 py-1 rounded-full ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {isPassed ? (
                    <FaCircleCheck className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <FaCircleXmark className="w-3 h-3 text-rose-600" />
                  )}
                  {isPassed ? 'উত্তীর্ণ (PASSED)' : 'অনুত্তীর্ণ (FAILED)'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Subject-by-Subject Marks Table */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="text-slate-800 text-xs font-bold uppercase border-b border-slate-300 bg-slate-100">
                <th className="py-2.5 px-3 border border-slate-300 text-center w-16">কোড</th>
                <th className="py-2.5 px-4 border border-slate-300">বিষয় (NCTB Subject)</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-20">পূর্ণমান</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-24">প্রাপ্ত নম্বর</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-24">লেটার গ্রেড</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-20">জিপিএ (GP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {result.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-mono font-bold text-slate-600 text-xs">
                    {sub.code || `০${idx + 1}`}
                  </td>
                  <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-800">
                    <div className="flex items-center justify-between">
                      <span>{sub.subject}</span>
                      {sub.isFourthSubject && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full ml-2">
                          ৪র্থ বিষয়
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-600 font-semibold">
                    {sub.fullMarks}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-black text-slate-900">
                    {sub.obtained}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-black">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        sub.grade === 'A+'
                          ? 'bg-emerald-100 text-emerald-800 font-black'
                          : sub.grade === 'F'
                          ? 'bg-rose-100 text-rose-800 font-black'
                          : 'text-slate-800 font-bold'
                      }`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-black text-brand-700">
                    {sub.gpa.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold text-slate-900 border-t-2 border-slate-400 bg-blue-50/80">
                <td colSpan={2} className="py-3 px-4 border border-slate-300 text-sm font-black text-[#0A1E3C]">
                  সর্বমোট ফলাফল (Total Evaluation)
                </td>
                <td className="py-3 px-3 border border-slate-300 text-center text-slate-700 font-bold">
                  {result.totalMarks}
                </td>
                <td className="py-3 px-3 border border-slate-300 text-center text-brand-800 font-black text-base">
                  {result.obtainedMarks}
                </td>
                <td className="py-3 px-3 border border-slate-300 text-center font-black text-base">
                  <span
                    className={`inline-block px-3 py-0.5 rounded-md text-sm font-black ${
                      result.grade === 'A+'
                        ? 'bg-emerald-600 text-white'
                        : result.grade === 'F'
                        ? 'bg-rose-600 text-white'
                        : 'bg-brand-800 text-white'
                    }`}
                  >
                    {result.grade}
                  </span>
                </td>
                <td className="py-3 px-3 border border-slate-300 text-center text-brand-800 font-black text-base">
                  {result.gpa.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bangladesh Education Board Grading Scale */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
            <span>বাংলাদেশ শিক্ষা বোর্ড গ্রেডিং স্কেল (National Grading System):</span>
            <span className="text-slate-400">পাস মার্ক: ৩৩%</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 p-2.5 rounded-xl border border-slate-200 text-[10px] text-center font-semibold text-slate-600 bg-slate-50">
            <div className="p-1 rounded bg-white border border-slate-100">৮০-১০০ = <span className="font-bold text-emerald-700">A+ (5.00)</span></div>
            <div className="p-1 rounded bg-white border border-slate-100">৭০-৭৯ = <span className="font-bold text-emerald-600">A (4.00)</span></div>
            <div className="p-1 rounded bg-white border border-slate-100">৬০-৬৯ = <span className="font-bold text-blue-600">A- (3.50)</span></div>
            <div className="p-1 rounded bg-white border border-slate-100">৫০-৫৯ = <span className="font-bold text-amber-600">B (3.00)</span></div>
            <div className="p-1 rounded bg-white border border-slate-100">৪০-৪৯ = <span className="font-bold text-orange-600">C (2.00)</span></div>
            <div className="p-1 rounded bg-white border border-slate-100">৩৩-৩৯ = <span className="font-bold text-amber-800">D (1.00)</span></div>
            <div className="p-1 rounded bg-rose-50 border border-rose-200">০০-৩২ = <span className="font-bold text-rose-600">F (0.00)</span></div>
          </div>
        </div>

        {/* Official Signatures */}
        <div className="pt-10 flex justify-between items-end text-center text-xs font-bold text-slate-700 relative z-10">
          <div className="space-y-1">
            <div className="w-36 border-b border-slate-400 mx-auto"></div>
            <p>শ্রেণি শিক্ষকের স্বাক্ষর</p>
          </div>
          <div className="space-y-1">
            <div className="w-36 border-b border-slate-400 mx-auto"></div>
            <p>অভিভাবকের স্বাক্ষর</p>
          </div>
          <div className="space-y-1">
            <div className="w-44 border-b-2 border-slate-800 mx-auto"></div>
            <p className="text-brand-900 font-black">সেন্টার প্রধান / পরিচালক</p>
            <p className="text-[10px] text-slate-500 font-normal">শিক্ষানোভা একাডেমি, নীলফামারী সদর</p>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end max-w-4xl mx-auto no-print">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-brand-700 to-indigo-900 hover:from-brand-800 hover:to-black text-white font-bold text-xs sm:text-sm rounded-2xl shadow-brand hover:shadow-xl transition flex items-center gap-2 transform active:scale-95"
        >
          <FaPrint className="w-4 h-4 text-nova-300" />
          <span>অফিশিয়াল মার্কশিট প্রিন্ট / PDF সংরক্ষণ করুন</span>
        </button>
      </div>
    </div>
  );
}
