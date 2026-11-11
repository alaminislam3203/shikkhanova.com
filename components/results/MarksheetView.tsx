'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FaPrint,
  FaCircleCheck,
  FaCircleXmark,
  FaExpand,
  FaCompress,
  FaFileLines,
} from 'react-icons/fa6';
import Logo from '@/components/common/Logo';
import { MarksheetData } from '@/types';

interface MarksheetViewProps {
  result: MarksheetData;
}

export default function MarksheetView({ result }: MarksheetViewProps) {
  const isPassed = result.grade !== 'F' && result.gpa > 0;
  
  // Mobile View Mode: 'fit' (scales to fit phone screen width) or 'full' (100% A4 size with scroll)
  const [viewMode, setViewMode] = useState<'fit' | 'full'>('full');
  const [scale, setScale] = useState<number>(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  // Auto-calculate scale when in 'fit' mode on mobile/tablet
  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current || !sheetRef.current) return;
      const containerWidth = wrapperRef.current.clientWidth;
      const BASE_A4_WIDTH = 794; // Exact standard 210mm A4 width in pixels at 96 DPI

      if (containerWidth < BASE_A4_WIDTH && viewMode === 'fit') {
        const nextScale = containerWidth / BASE_A4_WIDTH;
        setScale(nextScale);
        setScaledHeight(sheetRef.current.scrollHeight * nextScale);
      } else {
        setScale(1);
        setScaledHeight(undefined);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [viewMode, result]);

  const handlePrint = () => {
    // Close any open dropdowns before printing
    if (typeof document !== 'undefined') {
      document.body.click();
    }
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* Print Specific CSS to guarantee 1-page A4 print output without breaks */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          header,
          nav,
          footer,
          .no-print {
            display: none !important;
          }
          #printableArea {
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Control Bar: Mode Toggle & Print Button (Hidden on Print) */}
      <div className="no-print bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 max-w-[794px] mx-auto border border-slate-800">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200">
          <FaFileLines className="w-4 h-4 text-amber-400" />
          <span>অফিশিয়াল A4 পেজ ফরম্যাট (Portrait)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Screen Fit Toggle */}
          <div className="sm:hidden flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('fit')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'fit'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="স্ক্রিনে সম্পূর্ণ পেজ ফিট করুন"
            >
              <FaCompress className="w-3 h-3" />
              <span>ফিট</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'full'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="আসল ১০০% A4 সাইজে দেখুন"
            >
              <FaExpand className="w-3 h-3" />
              <span>১০০%</span>
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#C8102E] to-[#A50D26] hover:from-[#A50D26] hover:to-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <FaPrint className="w-3.5 h-3.5" />
            <span>প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container Wrapper (Ensures No Elements Ever Break on Mobile or Desktop) */}
      <div
        ref={wrapperRef}
        className="w-full overflow-x-auto pb-6 scrollbar-thin flex justify-center"
        style={{
          height: scaledHeight ? `${scaledHeight}px` : 'auto',
        }}
      >
        <div
          id="printableArea"
          ref={sheetRef}
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
          className="w-[794px] min-w-[794px] min-h-[1080px] bg-white p-8 sm:p-10 border border-slate-300 shadow-2xl rounded-2xl relative overflow-hidden space-y-5 print:w-full print:min-w-0 print:min-h-0 print:p-0 print:border-none print:shadow-none print:rounded-none"
        >
          {/* Subtle Institute Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <span className="text-8xl font-black text-brand-900 tracking-widest uppercase">
              SHIKKHANOVA
            </span>
          </div>

          {/* Top-Right Corner: Bangladesh Education Board Grading System Table Box */}
          <div className="absolute top-8 right-8 z-20 print:top-6 print:right-6">
            <div className="w-[164px] bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs text-[9px]">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-[#0A1E3C] text-white font-bold border-b border-slate-300">
                    <th className="py-1 px-1 border-r border-slate-400/30 text-[8.5px] leading-tight">
                      Letter<br />Grade
                    </th>
                    <th className="py-1 px-1 border-r border-slate-400/30 text-[8.5px] leading-tight">
                      Class<br />Interval (%)
                    </th>
                    <th className="py-1 px-1 text-[8.5px] leading-tight">
                      Grade<br />Point
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-semibold">
                  <tr className="hover:bg-slate-50">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-emerald-700">A+</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">80-100</td>
                    <td className="py-0.5 px-1 font-bold">5</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-emerald-600">A</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">70-79</td>
                    <td className="py-0.5 px-1 font-bold">4</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-blue-600">A-</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">60-69</td>
                    <td className="py-0.5 px-1 font-bold">3.5</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-amber-600">B</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">50-59</td>
                    <td className="py-0.5 px-1 font-bold">3</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-orange-600">C</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">40-49</td>
                    <td className="py-0.5 px-1 font-bold">2</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-amber-800">D</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">33-39</td>
                    <td className="py-0.5 px-1 font-bold">1</td>
                  </tr>
                  <tr className="hover:bg-rose-50/50 bg-rose-50/30">
                    <td className="py-0.5 px-1 border-r border-slate-200 font-black text-rose-600">F</td>
                    <td className="py-0.5 px-1 border-r border-slate-200">00-32</td>
                    <td className="py-0.5 px-1 font-bold text-rose-600">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Institute Header */}
          <div className="text-center border-b-2 border-[#C8102E] pb-4 space-y-2 relative z-10 pr-40">
            <div className="flex items-center justify-center mb-1">
              <div className="bg-white px-3 py-1.5 rounded-2xl shadow-xs border border-slate-100">
                <Logo size="md" clickable={false} />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী | হেল্পলাইন:{' '}
              <span className="font-bn-normal font-bold text-[#0A1E3C]">০১৭১২৫৯২৫১৯</span>
            </p>

            {/* Exam Title Set Prominently in Header */}
            <div className="pt-0.5">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[#0A1E3C] border-b-2 border-[#C8102E] text-white text-[11px] sm:text-xs font-bold px-4 sm:px-5 py-1 sm:py-1.5 rounded-full uppercase shadow-sm">
                <span className="text-amber-300 font-black">{result.examTitle}</span>
                <span className="text-slate-400">|</span>
                <span>একাডেমিক ফলাফল ও অফিশিয়াল মার্কশিট</span>
              </div>
            </div>
          </div>

          {/* Student Profile Info & Status */}
          <div className="p-4 rounded-2xl border text-xs sm:text-sm relative z-10 bg-slate-50 border-slate-200 space-y-3.5">
            {/* Top Section: ১টি কলামে উপর-নিচ (শিক্ষার্থীর নাম, পিতার নাম, মাতার নাম, বিদ্যালয়ের নাম) */}
            <div className="space-y-2 border-b border-slate-200/80 pb-3">
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

            {/* Bottom Section: বিদ্যালয়ের নামের নিচে ৪টি কলামে (শ্রেণি, রোল নম্বর, জন্ম তারিখ, ফলাফল স্ট্যাটাস) */}
            <div className="grid grid-cols-4 gap-3 pt-0.5">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block mb-0.5">শ্রেণি:</span>
                <strong className="text-brand-700 font-black text-sm block">
                  Class {result.classGrade}
                </strong>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block mb-0.5">রোল নম্বর:</span>
                <strong className="text-nova-600 font-black text-sm block">
                  রোল {result.rollNumber}
                </strong>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block mb-0.5">জন্ম তারিখ:</span>
                <strong className="text-slate-800 font-bold text-xs block">
                  {result.dateOfBirth || '—'}
                </strong>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">ফলাফল স্ট্যাটাস:</span>
                <span
                  className={`inline-flex items-center gap-1 font-black text-[11px] px-2 py-0.5 rounded-full ${
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
                  {isPassed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                </span>
              </div>
            </div>
          </div>

          {/* Subject-by-Subject Marks Table */}
          <div className="relative z-10">
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="text-slate-800 text-xs font-bold uppercase border-b border-slate-300 bg-slate-100">
                  <th className="py-2 px-3 border border-slate-300 text-center w-16">কোড</th>
                  <th className="py-2 px-4 border border-slate-300">বিষয় (NCTB Subject)</th>
                  <th className="py-2 px-3 border border-slate-300 text-center w-20">পূর্ণমান</th>
                  <th className="py-2 px-3 border border-slate-300 text-center w-24">প্রাপ্ত নম্বর</th>
                  <th className="py-2 px-3 border border-slate-300 text-center w-24">লেটার গ্রেড</th>
                  <th className="py-2 px-3 border border-slate-300 text-center w-20">জিপিএ (GP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {result.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold text-slate-600 text-xs">
                      {sub.code || `০${idx + 1}`}
                    </td>
                    <td className="py-2 px-4 border border-slate-300 font-bold text-slate-800">
                      <div className="flex items-center justify-between">
                        <span>{sub.subject}</span>
                        {sub.isFourthSubject && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full ml-2">
                            ৪র্থ বিষয়
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-center text-slate-600 font-semibold">
                      {sub.fullMarks}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-center font-black text-slate-900">
                      {sub.obtained}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-center font-black">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs ${
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
                    <td className="py-2 px-3 border border-slate-300 text-center font-black text-brand-700">
                      {sub.gpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-slate-900 border-t-2 border-slate-400 bg-blue-50/80">
                  <td colSpan={2} className="py-2.5 px-4 border border-slate-300 text-xs font-black text-[#0A1E3C]">
                    সর্বমোট ফলাফল (Total Evaluation)
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-700 font-bold text-xs">
                    {result.totalMarks}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-brand-800 font-black text-sm">
                    {result.obtainedMarks}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-black text-sm">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-md text-xs font-black ${
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
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-brand-800 font-black text-sm">
                    {result.gpa.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Signatures with signature.png */}
          <div className="pt-8 flex justify-between items-end text-center text-xs font-bold text-slate-700 relative z-10">
            {/* 1. শ্রেণি শিক্ষকের স্বাক্ষর */}
            <div className="space-y-1 w-40">
              <div className="h-12 flex items-end justify-center">
                {/* Space holder so lines align horizontally */}
              </div>
              <div className="w-36 border-b border-slate-400 mx-auto"></div>
              <p className="text-[11px] text-slate-800 font-bold">শ্রেণি শিক্ষকের স্বাক্ষর</p>
            </div>

            {/* 2. অভিভাবকের স্বাক্ষর */}
            <div className="space-y-1 w-40">
              <div className="h-12 flex items-end justify-center">
                {/* Space holder so lines align horizontally */}
              </div>
              <div className="w-36 border-b border-slate-400 mx-auto"></div>
              <p className="text-[11px] text-slate-800 font-bold">অভিভাবকের স্বাক্ষর</p>
            </div>

            {/* 3. সেন্টার প্রধান / পরিচালক স্বাক্ষর (signature.png Set Prominently) */}
            <div className="space-y-1 w-48">
              <div className="h-12 flex items-end justify-center">
                <img
                  src="/signature.png"
                  alt="সেন্টার প্রধান / পরিচালক স্বাক্ষর"
                  className="h-12 w-auto max-w-[130px] object-contain drop-shadow-xs"
                />
              </div>
              <div className="w-44 border-b-2 border-slate-800 mx-auto"></div>
              <p className="text-brand-900 font-black text-xs">সেন্টার প্রধান / পরিচালক</p>
              <p className="text-[10px] text-slate-500 font-normal">শিক্ষানোভা একাডেমি, নীলফামারী সদর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
