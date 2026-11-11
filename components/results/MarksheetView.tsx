'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPrint, FaCircleCheck, FaCircleXmark, FaFileLines } from 'react-icons/fa6';
import Logo from '@/components/common/Logo';
import { MarksheetData } from '@/types';

interface MarksheetViewProps {
  result: MarksheetData;
}

export default function MarksheetView({ result }: MarksheetViewProps) {
  const isPassed = result.grade !== 'F' && result.gpa > 0;

  // Fully static A4 canvas (794px = 210mm at 96 DPI)
  // On mobile/tablet screens, auto-scales down proportionally so nothing ever breaks
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current || !sheetRef.current) return;
      const containerWidth = wrapperRef.current.clientWidth;
      const BASE_A4_WIDTH = 794;

      if (containerWidth < BASE_A4_WIDTH) {
        // Automatically shrink proportionally to fit mobile screen without any breaking
        const nextScale = Math.max(0.35, (containerWidth - 6) / BASE_A4_WIDTH);
        setScale(nextScale);
        setScaledHeight(sheetRef.current.scrollHeight * nextScale);
      } else {
        setScale(1);
        setScaledHeight(undefined);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(wrapperRef.current);
    }

    const onBefore = () => setIsPrinting(true);
    const onAfter = () => setIsPrinting(false);
    window.addEventListener('beforeprint', onBefore);
    window.addEventListener('afterprint', onAfter);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeprint', onBefore);
      window.removeEventListener('afterprint', onAfter);
      if (observer) observer.disconnect();
    };
  }, [result]);

  const handlePrint = () => {
    if (typeof document !== 'undefined') {
      document.body.click();
    }
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 150);
  };

  return (
    <div className="space-y-4">
      {/* Print Specific CSS: Ensures perfect full A4 single-page print on both desktop and mobile browsers */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html,
          body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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

      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print flex items-center justify-end sm:justify-between gap-3 max-w-[794px] mx-auto px-1">
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600">
          <FaFileLines className="w-4 h-4 text-brand-700" />
          <span>অফিশিয়াল A4 পেজ মার্কশিট (Portrait Format)</span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2.5 bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:from-[#050E1D] hover:to-[#A50D26] text-white font-bold text-xs sm:text-sm rounded-xl shadow-brand hover:shadow-xl transition flex items-center gap-2 transform active:scale-95 cursor-pointer"
        >
          <FaPrint className="w-3.5 h-3.5 text-amber-300" />
          <span>প্রিন্ট করুন</span>
        </button>
      </div>

      {/* Scaled Wrapper for Mobile / Tablet View (Maintains 100% Static A4 Canvas) */}
      <div
        ref={wrapperRef}
        className="w-full overflow-hidden flex justify-center items-start"
        style={{
          height: isPrinting ? 'auto' : scaledHeight ? `${scaledHeight}px` : 'auto',
        }}
      >
        {/* ============================================================== */}
        {/* STATIC A4 DOCUMENT CANVAS (794px Standard Width, 100% Static)  */}
        {/* ============================================================== */}
        <div
          id="printableArea"
          ref={sheetRef}
          style={
            isPrinting
              ? {
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '0',
                  transform: 'none',
                }
              : {
                  width: '794px',
                  minWidth: '794px',
                  maxWidth: '794px',
                  transform: scale !== 1 ? `scale(${scale})` : undefined,
                  transformOrigin: 'top center',
                }
          }
          className="bg-white p-8 border border-slate-300 shadow-2xl rounded-2xl relative overflow-hidden space-y-4 select-none print:w-full print:min-w-0 print:p-0 print:border-none print:shadow-none print:rounded-none"
        >
          {/* Subtle Institute Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <span className="text-8xl font-black text-brand-900 tracking-widest uppercase">
              SHIKKHANOVA
            </span>
          </div>

          {/* ============================================================ */}
          {/* INSTITUTE HEADER & GRADING SYSTEM (Unified Flex Row)         */}
          {/* Prevents any overlap on student details and avoids clipping   */}
          {/* ============================================================ */}
          <div className="flex items-start justify-between gap-4 border-b-2 border-[#C8102E] pb-3.5 relative z-10">
            {/* Center Area: Logo, Address, Helpline, Exam Title */}
            <div className="flex-1 text-center space-y-2 pt-0.5">
              <div className="flex items-center justify-center mb-1">
                <div className="bg-white px-3 py-1.5 rounded-2xl shadow-xs border border-slate-100">
                  <Logo size="md" clickable={false} />
                </div>
              </div>

              <p className="text-xs text-slate-600 font-semibold">
                জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী | হেল্পলাইন:{' '}
                <span className="font-bn-normal font-bold text-[#0A1E3C]">০১৭১২৫৯২৫১৯</span>
              </p>

              {/* Exam Title Pill */}
              <div className="pt-0.5">
                <div className="inline-flex items-center justify-center gap-2 bg-[#0A1E3C] border-b-2 border-[#C8102E] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase shadow-sm">
                  <span className="text-amber-300 font-black">{result.examTitle}</span>
                  <span className="text-slate-400">|</span>
                  <span>একাডেমিক ফলাফল ও অফিশিয়াল মার্কশিট</span>
                </div>
              </div>
            </div>

            {/* Right: Bangladesh Education Board Grading System Table Box */}
            <div className="w-[172px] shrink-0 pt-0.5">
              <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs text-[9px]">
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
          </div>

          {/* ============================================================ */}
          {/* STUDENT PROFILE INFO & STATUS (Unobstructed & Clean)          */}
          {/* ============================================================ */}
          <div className="p-4 rounded-xl border text-xs relative z-10 bg-slate-50 border-slate-200 space-y-3">
            {/* Top Section: ১টি কলামে উপর-নিচ (শিক্ষার্থীর নাম, পিতার নাম, মাতার নাম, বিদ্যালয়ের নাম) */}
            <div className="space-y-1.5 border-b border-slate-200/80 pb-2.5">
              <div className="flex items-start">
                <span className="w-32 shrink-0 text-slate-600 font-bold text-xs">
                  শিক্ষার্থীর নাম:
                </span>
                <span className="text-slate-900 text-sm font-black truncate">
                  {result.studentName}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-32 shrink-0 text-slate-600 font-bold text-xs">
                  পিতার নাম:
                </span>
                <span className="text-slate-800 text-xs font-bold truncate">
                  {result.fatherName || '—'}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-32 shrink-0 text-slate-600 font-bold text-xs">
                  মাতার নাম:
                </span>
                <span className="text-slate-800 text-xs font-bold truncate">
                  {result.motherName || '—'}
                </span>
              </div>

              <div className="flex items-start">
                <span className="w-32 shrink-0 text-slate-600 font-bold text-xs">
                  বিদ্যালয়ের নাম:
                </span>
                <span className="text-slate-800 text-xs font-bold">
                  {result.schoolName || '—'}
                </span>
              </div>
            </div>

            {/* Bottom Section: বিদ্যালয়ের নামের নিচে ৪টি কলামে (শ্রেণি, রোল নম্বর, জন্ম তারিখ, ফলাফল স্ট্যাটাস) */}
            <div className="grid grid-cols-4 gap-2.5 pt-0.5">
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">শ্রেণি:</span>
                <strong className="text-brand-700 font-black text-xs block">
                  Class {result.classGrade}
                </strong>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">রোল নম্বর:</span>
                <strong className="text-nova-600 font-black text-xs block">
                  রোল {result.rollNumber}
                </strong>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">জন্ম তারিখ:</span>
                <strong className="text-slate-800 font-bold text-xs block">
                  {result.dateOfBirth || '—'}
                </strong>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">ফলাফল স্ট্যাটাস:</span>
                <span
                  className={`inline-flex items-center gap-1 font-black text-[10px] px-2 py-0.5 rounded-full ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {isPassed ? (
                    <FaCircleCheck className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <FaCircleXmark className="w-2.5 h-2.5 text-rose-600" />
                  )}
                  {isPassed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SUBJECT MARKS TABLE (Static 100% Fixed Table)                 */}
          {/* ============================================================ */}
          <div className="relative z-10">
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="text-slate-800 text-[11px] font-bold uppercase border-b border-slate-300 bg-slate-100">
                  <th className="py-1.5 px-3 border border-slate-300 text-center w-16">কোড</th>
                  <th className="py-1.5 px-4 border border-slate-300">বিষয় (NCTB Subject)</th>
                  <th className="py-1.5 px-3 border border-slate-300 text-center w-20">পূর্ণমান</th>
                  <th className="py-1.5 px-3 border border-slate-300 text-center w-24">প্রাপ্ত নম্বর</th>
                  <th className="py-1.5 px-3 border border-slate-300 text-center w-24">লেটার গ্রেড</th>
                  <th className="py-1.5 px-3 border border-slate-300 text-center w-20">জিপিএ (GP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {result.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-3 border border-slate-300 text-center font-mono font-bold text-slate-600 text-xs">
                      {sub.code || `০${idx + 1}`}
                    </td>
                    <td className="py-1.5 px-4 border border-slate-300 font-bold text-slate-800">
                      <div className="flex items-center justify-between">
                        <span>{sub.subject}</span>
                        {sub.isFourthSubject && (
                          <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full ml-2">
                            ৪র্থ বিষয়
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-3 border border-slate-300 text-center text-slate-600 font-semibold">
                      {sub.fullMarks}
                    </td>
                    <td className="py-1.5 px-3 border border-slate-300 text-center font-black text-slate-900">
                      {sub.obtained}
                    </td>
                    <td className="py-1.5 px-3 border border-slate-300 text-center font-black">
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
                    <td className="py-1.5 px-3 border border-slate-300 text-center font-black text-brand-700">
                      {sub.gpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-slate-900 border-t-2 border-slate-400 bg-blue-50/80">
                  <td colSpan={2} className="py-2 px-4 border border-slate-300 text-xs font-black text-[#0A1E3C]">
                    সর্বমোট ফলাফল (Total Evaluation)
                  </td>
                  <td className="py-2 px-3 border border-slate-300 text-center text-slate-700 font-bold text-xs">
                    {result.totalMarks}
                  </td>
                  <td className="py-2 px-3 border border-slate-300 text-center text-brand-800 font-black text-sm">
                    {result.obtainedMarks}
                  </td>
                  <td className="py-2 px-3 border border-slate-300 text-center font-black text-sm">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-black ${
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
                  <td className="py-2 px-3 border border-slate-300 text-center text-brand-800 font-black text-sm">
                    {result.gpa.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ============================================================ */}
          {/* OFFICIAL SIGNATURES (Static 3-Column Parallel Placement)      */}
          {/* ============================================================ */}
          <div className="pt-6 flex justify-between items-end text-center text-xs font-bold text-slate-700 relative z-10">
            {/* 1. শ্রেণি শিক্ষকের স্বাক্ষর */}
            <div className="space-y-1 w-40">
              <div className="h-12 flex items-end justify-center"></div>
              <div className="w-36 border-b border-slate-400 mx-auto"></div>
              <p className="text-[11px] text-slate-800 font-bold">শ্রেণি শিক্ষকের স্বাক্ষর</p>
            </div>

            {/* 2. অভিভাবকের স্বাক্ষর */}
            <div className="space-y-1 w-40">
              <div className="h-12 flex items-end justify-center"></div>
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
