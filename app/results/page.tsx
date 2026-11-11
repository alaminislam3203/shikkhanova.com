'use client';

import React, { useState, useEffect } from 'react';
import {
  FaAward,
  FaMagnifyingGlass,
  FaGraduationCap,
  FaHashtag,
  FaCircleCheck,
  FaCircleExclamation,
  FaBookOpen,
  FaArrowsRotate,
  FaCalculator,
  FaClipboardList,
} from 'react-icons/fa6';
import MarksheetView from '@/components/results/MarksheetView';
import { MarksheetData, SubjectMark } from '@/types';

const EXAM_OPTIONS = [
  '১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬',
  'অর্ধ-বার্ষিক পরীক্ষা ২০২৬',
  'মাসিক মডেল টেস্ট ২০২৬',
  'নির্বাচনী পরীক্ষা (Test Exam)',
  'বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬',
];

export default function ResultsPage() {
  const [examTitle, setExamTitle] = useState<string>('১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬');
  const [classGrade, setClassGrade] = useState<number>(7);
  const [rollNumber, setRollNumber] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MarksheetData | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Math Captcha State
  const [captchaNum1, setCaptchaNum1] = useState<number>(7);
  const [captchaNum2, setCaptchaNum2] = useState<number>(5);
  const [userCaptcha, setUserCaptcha] = useState<string>('');
  const [captchaError, setCaptchaError] = useState<string>('');

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const n2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setUserCaptcha('');
    setCaptchaError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber) return;

    // Validate Math Captcha
    const expected = captchaNum1 + captchaNum2;
    if (parseInt(userCaptcha.trim()) !== expected) {
      setCaptchaError(`ক্যাপচা উত্তর ভুল হয়েছে! ${captchaNum1} + ${captchaNum2} = ${expected} হবে। আবার চেষ্টা করুন।`);
      generateCaptcha();
      return;
    }

    setLoading(true);
    setSearched(true);
    setSearchError(null);
    setResult(null);

    const rollInt = parseInt(rollNumber) || 1;

    try {
      const res = await fetch(
        `/api/results?classGrade=${classGrade}&rollNumber=${rollInt}&examTitle=${encodeURIComponent(examTitle)}`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        let subs: SubjectMark[] = [];
        try {
          if (item.subjectMarks) {
            const parsed = typeof item.subjectMarks === 'string' ? JSON.parse(item.subjectMarks) : item.subjectMarks;
            subs = parsed.map((p: any) => ({
              code: p.code || p.subjectCode,
              subject: p.subject || p.subjectName,
              fullMarks: p.fullMarks || 100,
              obtained: p.obtained ?? p.obtainedMarks ?? 0,
              grade: p.grade || 'F',
              gpa: typeof p.gpa === 'number' ? p.gpa : parseFloat(p.gpa) || 0,
              isFourthSubject: Boolean(p.isFourthSubject),
            }));
          }
        } catch {
          subs = [];
        }

        setResult({
          studentName: item.studentName,
          fatherName: item.fatherName,
          motherName: item.motherName,
          schoolName: item.schoolName,
          dateOfBirth: item.dateOfBirth,
          classGrade: item.classGrade,
          rollNumber: item.rollNumber,
          examTitle: item.examTitle || examTitle,
          totalMarks: item.totalMarks,
          obtainedMarks: item.obtainedMarks,
          grade: item.grade,
          gpa: item.gpa,
          subjects: subs,
        });
      } else {
        setResult(null);
        setSearchError(
          `শ্রেণি ${classGrade}, রোল ${rollInt} এবং "${examTitle}"-এর কোনো ফলাফল ডাটাবেজে পাওয়া যায়নি।`
        );
      }
    } catch {
      setResult(null);
      setSearchError('ফলাফল অনুসন্ধানে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setLoading(false);
      // Generate fresh captcha for next attempt
      generateCaptcha();
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-nova-600 flex items-center justify-center text-xl shadow-inner">
            <FaAward />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-900">
              কোচিং রেজাল্ট ও মার্কশিট (NCTB)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              পরীক্ষা, শ্রেণি ও রোল নম্বর দিয়ে তাৎক্ষণিক অফিশিয়াল গ্রেডশিট অনুসন্ধান করুন
            </p>
          </div>
        </div>

        {captchaError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
            <FaCircleExclamation className="text-rose-500 shrink-0 w-4 h-4" />
            <span>{captchaError}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4 pt-4 border-t border-slate-100">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Exam Title Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FaClipboardList className="text-[#C8102E]" /> পরীক্ষার নাম নির্বাচন করুন
              </label>
              <select
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#C8102E] focus:outline-none"
              >
                {EXAM_OPTIONS.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Grade Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FaGraduationCap className="text-brand-700" /> শ্রেণি নির্বাচন করুন
              </label>
              <select
                value={classGrade}
                onChange={(e) => setClassGrade(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#C8102E] focus:outline-none"
              >
                <option value={5}>৫ম শ্রেণি (Class 5 - NCTB)</option>
                <option value={6}>৬ষ্ঠ শ্রেণি (Class 6 - NCTB)</option>
                <option value={7}>৭ম শ্রেণি (Class 7 - NCTB)</option>
                <option value={8}>৮ম শ্রেণি (Class 8 - NCTB)</option>
                <option value={9}>৯ম শ্রেণি (Class 9 - NCTB)</option>
                <option value={10}>১০ম শ্রেণি (Class 10 / SSC - NCTB)</option>
              </select>
            </div>

            {/* Roll Number Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FaHashtag className="text-nova-500" /> শিক্ষার্থীর রোল নম্বর (Roll)
              </label>
              <input
                type="number"
                required
                min={1}
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="যেমন: 1, 2, 3, 5..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#C8102E] focus:outline-none"
              />
            </div>

          </div>

          {/* Math Captcha Verification Row & Search Action */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Math Problem Box */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FaCalculator className="text-[#0A1E3C]" />
                নিরাপত্তা যাচাই (গণিত সমাধান):
              </span>

              <div className="flex items-center gap-2">
                <div className="bg-white border-2 border-slate-300 px-3.5 py-1.5 rounded-xl font-mono text-base font-black text-[#0A1E3C] shadow-inner select-none tracking-wider">
                  {captchaNum1} + {captchaNum2} = ?
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 rounded-xl bg-white border border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shadow-xs"
                  title="নতুন গণিত প্রশ্ন লোড করুন"
                >
                  <FaArrowsRotate className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-32">
                <input
                  type="number"
                  required
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="উত্তর লিখুন"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#C8102E] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:from-[#050E1D] hover:to-[#A50D26] text-white font-black py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-brand transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <FaMagnifyingGlass className="w-3.5 h-3.5 text-amber-300" />
                <span>{loading ? 'অনুসন্ধান হচ্ছে...' : 'রেজাল্ট দেখুন'}</span>
              </button>
            </div>

          </div>

        </form>
      </div>

      {/* Marksheet Container Component */}
      {result && <MarksheetView result={result} />}

      {/* If Search Failed / No Result in Database */}
      {!result && searched && searchError && (
        <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-dashed border-rose-200 space-y-3">
          <FaCircleExclamation className="w-12 h-12 text-rose-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">{searchError}</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ডাটাবেজে সংরক্ষিত ফলাফল দেখতে পারেন: <strong>১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬</strong> নির্বাচন করে শ্রেণি ৫ থেকে ১০ এবং রোল ১ (A+), রোল ২ (A), বা রোল ৫ (F ফেল) সার্চ করুন।
          </p>
        </div>
      )}

      {/* If Not Searched Yet */}
      {!result && !searched && (
        <div className="p-10 sm:p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <FaBookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-700">উপরে পরীক্ষা, শ্রেণি এবং রোল নম্বর দিয়ে সার্চ করুন</h4>
            <p className="text-xs text-slate-400">
              উদাহরণ: "১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬", শ্রেণি ৭, রোল ১ এবং গণিত ক্যাপচা সমাধান করে বাটনে চাপুন।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
