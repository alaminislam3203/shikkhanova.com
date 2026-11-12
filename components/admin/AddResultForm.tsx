'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FaUserGraduate,
  FaAward,
  FaBookOpen,
  FaCheck,
  FaClock,
  FaTrash,
  FaPenToSquare,
  FaPlus,
  FaArrowRight,
  FaForwardStep,
  FaCircleCheck,
  FaCircleExclamation,
  FaMagnifyingGlass,
  FaLayerGroup,
  FaPercent,
  FaCalculator,
  FaXmark,
} from 'react-icons/fa6';
import { DEFAULT_NCTB_SUBJECTS, NctbSubjectItem } from '@/lib/nctbSubjects';
import {
  SubjectMarkEntry,
  calculateSubjectGradeAndGpa,
  calculateOverallResult,
} from '@/lib/gradingUtils';

export interface ResultFormData {
  examTitle: string;
  classGrade: number;
  rollNumber: string;
  studentName: string;
  totalMarks: string;
  obtainedMarks: string;
  grade: string;
  gpa: string;
  subjectMarks?: string;
}

interface AddResultFormProps {
  formData?: ResultFormData;
  onChange?: (data: ResultFormData) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

const EXAM_PRESETS = [
  '১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬',
  'অর্ধ-বার্ষিক পরীক্ষা ২০২৬',
  'মাসিক মডেল টেস্ট ২০২৬',
  'নির্বাচনী পরীক্ষা (Test Exam)',
  'বার্ষিক মূল্যায়ন পরীক্ষা ২০২৬',
];

const GROUP_OPTIONS = [
  { id: 'সকল বিভাগ', label: 'সকল বিভাগ (Common)' },
  { id: 'বিজ্ঞান', label: 'বিজ্ঞান বিভাগ (Science)' },
  { id: 'ব্যবসায় শিক্ষা', label: 'ব্যবসায় শিক্ষা (Business)' },
  { id: 'মানবিক', label: 'মানবিক বিভাগ (Humanities)' },
];

export default function AddResultForm({ formData, onChange, onSubmit }: AddResultFormProps) {
  // Main Configuration States
  const [examTitle, setExamTitle] = useState<string>(formData?.examTitle || EXAM_PRESETS[0]);
  const [classGrade, setClassGrade] = useState<number>(formData?.classGrade || 7);
  const [group, setGroup] = useState<string>('সকল বিভাগ');
  const [rollNumber, setRollNumber] = useState<string>(formData?.rollNumber || '1');
  const [studentName, setStudentName] = useState<string>(formData?.studentName || '');
  const [religion, setReligion] = useState<'ইসলাম' | 'হিন্দু'>('ইসলাম');
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [sendResultSms, setSendResultSms] = useState<boolean>(true);

  // Class Students from Database / Local
  const [classStudents, setClassStudents] = useState<
    Array<{
      id: string;
      rollNumber: number;
      name: string;
      fatherName?: string;
      motherName?: string;
      schoolName?: string;
      dateOfBirth?: string;
      religion?: string;
    }>
  >([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Filter students based on search query (by roll or name)
  const filteredClassStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return classStudents;
    const q = studentSearchQuery.toLowerCase().trim();
    return classStudents.filter(
      (std) =>
        std.name.toLowerCase().includes(q) ||
        String(std.rollNumber).includes(q)
    );
  }, [classStudents, studentSearchQuery]);

  // Subject Marks Table state
  const [subjectRows, setSubjectRows] = useState<SubjectMarkEntry[]>([]);

  // Existing Results List State
  const [existingResults, setExistingResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load students for the selected class
  useEffect(() => {
    const loadClassStudents = async () => {
      try {
        const res = await fetch(`/api/admin/students?classGrade=${classGrade}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.students && Array.isArray(data.students)) {
          setClassStudents(data.students);
        } else {
          setClassStudents([]);
        }
      } catch {
        setClassStudents([]);
      }
    };
    loadClassStudents();
    loadExistingResults();
  }, [classGrade]);

  // Load existing results for the class
  const loadExistingResults = async () => {
    setLoadingResults(true);
    try {
      const res = await fetch(`/api/results?classGrade=${classGrade}&all=true`, { cache: 'no-store' });
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        setExistingResults(data.results);
      } else {
        setExistingResults([]);
      }
    } catch {
      setExistingResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  // Re-generate NCTB subject rows whenever class, group, or religion changes
  useEffect(() => {
    if (editingResultId) return; // Do not overwrite if currently editing an existing record

    const availableNctb = DEFAULT_NCTB_SUBJECTS.filter((s) => {
      if (s.classGrade !== classGrade) return false;
      if (classGrade >= 9) {
        if (s.group !== 'সকল বিভাগ' && s.group !== group) return false;
      }
      if (s.religion) {
        return s.religion === religion;
      }
      return true;
    });

    const rows: SubjectMarkEntry[] = availableNctb.map((sub) => {
      const full = sub.fullMarks || 100;
      const initialObtained = 0;
      const { grade, gpa } = calculateSubjectGradeAndGpa(initialObtained, full);
      return {
        code: sub.subjectCode,
        subject: sub.subjectName,
        fullMarks: full,
        obtained: initialObtained,
        grade,
        gpa,
        isOptional: sub.subjectName.includes('উচ্চতর গণিত') || sub.subjectName.includes('কৃষি শিক্ষা'),
      };
    });

    setSubjectRows(rows);
  }, [classGrade, group, religion, editingResultId]);

  // Match student name and religion on roll number change
  const handleRollChange = (rollVal: string) => {
    setRollNumber(rollVal);
    const matched = classStudents.find((s) => String(s.rollNumber) === rollVal.trim());
    if (matched) {
      setStudentName(matched.name);
      if (matched.religion) {
        setReligion(matched.religion === 'হিন্দু' ? 'হিন্দু' : 'ইসলাম');
      }
    }
  };

  // Handle CQ (সৃজনশীল) mark change
  const handleCqChange = (index: number, val: string) => {
    const numericCq = val === '' ? undefined : Math.max(0, parseFloat(val) || 0);
    setSubjectRows((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const isBangla2nd = target.subject.includes('বাংলা ২য় পত্র');
      const maxCq = target.fullMarks === 100 ? 70 : target.fullMarks === 50 ? (isBangla2nd ? 30 : 25) : target.fullMarks;
      const cappedCq = numericCq !== undefined ? Math.min(maxCq, numericCq) : undefined;
      const mcqVal = target.mcq || 0;
      const totalObtained = Math.min(target.fullMarks, (cappedCq || 0) + mcqVal);
      const { grade, gpa } = calculateSubjectGradeAndGpa(totalObtained, target.fullMarks);
      updated[index] = {
        ...target,
        cq: cappedCq,
        obtained: totalObtained,
        grade,
        gpa,
      };
      return updated;
    });
  };

  // Handle MCQ (নৈর্ব্যক্তিক) mark change
  const handleMcqChange = (index: number, val: string) => {
    const numericMcq = val === '' ? undefined : Math.max(0, parseFloat(val) || 0);
    setSubjectRows((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const isBangla2nd = target.subject.includes('বাংলা ২য় পত্র');
      const maxMcq = target.fullMarks === 100 ? 30 : target.fullMarks === 50 ? (isBangla2nd ? 20 : 25) : Math.round(target.fullMarks * 0.3);
      const cappedMcq = numericMcq !== undefined ? Math.min(maxMcq, numericMcq) : undefined;
      const cqVal = target.cq || 0;
      const totalObtained = Math.min(target.fullMarks, cqVal + (cappedMcq || 0));
      const { grade, gpa } = calculateSubjectGradeAndGpa(totalObtained, target.fullMarks);
      updated[index] = {
        ...target,
        mcq: cappedMcq,
        obtained: totalObtained,
        grade,
        gpa,
      };
      return updated;
    });
  };

  // Handle single subject obtained mark change (direct override)
  const handleSubjectMarkChange = (index: number, val: string) => {
    const numericVal = Math.max(0, parseFloat(val) || 0);
    setSubjectRows((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const cappedVal = Math.min(target.fullMarks, numericVal);
      const { grade, gpa } = calculateSubjectGradeAndGpa(cappedVal, target.fullMarks);
      updated[index] = {
        ...target,
        obtained: cappedVal,
        grade,
        gpa,
      };
      return updated;
    });
  };

  // Realtime calculated summary
  const summary = useMemo(() => {
    return calculateOverallResult(subjectRows);
  }, [subjectRows]);

  // Sync with parent formData if provided
  useEffect(() => {
    if (onChange) {
      onChange({
        examTitle,
        classGrade,
        rollNumber,
        studentName,
        totalMarks: String(summary.totalFullMarks),
        obtainedMarks: String(summary.totalObtainedMarks),
        grade: summary.grade,
        gpa: summary.gpa.toFixed(2),
        subjectMarks: JSON.stringify(subjectRows),
      });
    }
  }, [summary, examTitle, classGrade, rollNumber, studentName, subjectRows, onChange]);

  // Save Result to Database / API
  const handleSaveResult = async (advanceNextRoll: boolean = false) => {
    if (!examTitle.trim() || !rollNumber.trim() || !studentName.trim()) {
      setMsg({ text: 'পরীক্ষার নাম, রোল নম্বর এবং শিক্ষার্থীর নাম আবশ্যক', type: 'error' });
      return;
    }

    setSaving(true);
    setMsg(null);

    const payload = {
      id: editingResultId || undefined,
      examTitle: examTitle.trim(),
      classGrade,
      rollNumber: parseInt(rollNumber),
      studentName: studentName.trim(),
      totalMarks: summary.totalFullMarks,
      obtainedMarks: summary.totalObtainedMarks,
      grade: summary.grade,
      gpa: summary.gpa,
      subjectMarks: subjectRows,
      sendResultSms,
    };

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ফলাফল সংরক্ষণ ব্যর্থ হয়েছে');
      }

      setMsg({
        text: `রোল ${rollNumber} (${studentName})-এর ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে! GPA: ${summary.gpa.toFixed(2)} (${summary.grade})`,
        type: 'success',
      });

      setEditingResultId(null);
      await loadExistingResults();

      if (advanceNextRoll) {
        // Increment roll number for next entry
        const nextRoll = parseInt(rollNumber) + 1;
        setRollNumber(String(nextRoll));
        const nextMatched = classStudents.find((s) => s.rollNumber === nextRoll);
        setStudentName(nextMatched ? nextMatched.name : '');

        // Reset obtained marks for next student
        setSubjectRows((prev) =>
          prev.map((r) => {
            const { grade, gpa } = calculateSubjectGradeAndGpa(0, r.fullMarks);
            return { ...r, obtained: 0, grade, gpa };
          })
        );
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Edit existing result
  const handleEditClick = (resItem: any) => {
    setEditingResultId(resItem.id);
    setExamTitle(resItem.examTitle);
    setClassGrade(resItem.classGrade);
    setRollNumber(String(resItem.rollNumber));
    setStudentName(resItem.studentName);

    try {
      const parsedSubs: SubjectMarkEntry[] = typeof resItem.subjectMarks === 'string'
        ? JSON.parse(resItem.subjectMarks)
        : resItem.subjectMarks;
      if (Array.isArray(parsedSubs) && parsedSubs.length > 0) {
        setSubjectRows(parsedSubs);
      }
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMsg({ text: `রোল ${resItem.rollNumber} (${resItem.studentName})-এর ফলাফল সম্পাদনা করা হচ্ছে...`, type: 'success' });
  };

  // Delete result
  const handleDeleteClick = async (id: string, name: string, roll: number) => {
    if (!confirm(`আপনি কি নিশ্চিত যে রোল ${roll} (${name})-এর ফলাফল মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/results?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'মুছে ফেলা সম্ভব হয়নি');
      setMsg({ text: `রোল ${roll}-এর ফলাফল মুছে ফেলা হয়েছে`, type: 'success' });
      await loadExistingResults();
    } catch (err: any) {
      setMsg({ text: err.message || 'মুছতে সমস্যা হয়েছে', type: 'error' });
    }
  };

  return (
    <div suppressHydrationWarning className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs mb-2">
            <FaAward />
            <span>NCTB কারিকুলাম রেজাল্ট সিস্টেম</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            শিক্ষার্থীর বিষয়ভিত্তিক ফলাফল ও মার্কশিট এন্ট্রি
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            শ্রেণি অনুযায়ী স্বয়ংক্রিয় NCTB বিষয় লোড, প্রাপ্ত নম্বর ইনপুট এবং স্বয়ংক্রিয় GPA ও লেটার গ্রেড ক্যালকুলেশন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            শ্রেণি {classGrade}
          </span>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200">
            {existingResults.length}টি সংরক্ষিত
          </span>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs transition animate-in fade-in duration-200 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? (
              <FaCircleCheck className="text-emerald-600 shrink-0 w-4 h-4" />
            ) : (
              <FaCircleExclamation className="text-rose-600 shrink-0 w-4 h-4" />
            )}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-xs opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. EXAM & STUDENT CONFIGURATION CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
        
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <FaLayerGroup className="text-[#C8102E]" />
            <span>ধাপ ১: পরীক্ষা ও শিক্ষার্থীর বিবরণ</span>
          </h3>
          {editingResultId && (
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
              এডিট মোড সক্রিয়
            </span>
          )}
        </div>

        {/* Exam Title Input & Quick Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            পরীক্ষার নাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="যেমন: ১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
          />

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 font-bold">কুইক সিলেক্ট:</span>
            {EXAM_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setExamTitle(preset)}
                className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-lg font-semibold transition border ${
                  examTitle === preset
                    ? 'bg-[#C8102E] text-white border-[#C8102E]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Class, Group, Religion, Roll, and Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Class Grade */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">শ্রেণি</label>
            <select
              value={classGrade}
              onChange={(e) => {
                setClassGrade(parseInt(e.target.value));
                setEditingResultId(null);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:border-[#C8102E] focus:outline-none"
            >
              <option value={5}>৫ম শ্রেণি (Class 5)</option>
              <option value={6}>৬ষ্ঠ শ্রেণি (Class 6)</option>
              <option value={7}>৭ম শ্রেণি (Class 7)</option>
              <option value={8}>৮ম শ্রেণি (Class 8)</option>
              <option value={9}>৯ম শ্রেণি (Class 9)</option>
              <option value={10}>১০ম শ্রেণি (SSC)</option>
            </select>
          </div>

          {/* Group (Only for Class 9 and 10) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              বিভাগ / গ্রুপ {classGrade < 9 && <span className="text-slate-400 font-normal">(প্রযোজ্য নয়)</span>}
            </label>
            <select
              disabled={classGrade < 9}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:border-[#C8102E] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
            >
              {GROUP_OPTIONS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Religion (ধর্ম) Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              ধর্ম (Religion)
            </label>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value as 'ইসলাম' | 'হিন্দু')}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:border-[#C8102E] focus:outline-none text-slate-800"
            >
              <option value="ইসলাম">ইসলাম</option>
              <option value="হিন্দু">হিন্দু</option>
            </select>
          </div>

          {/* Roll Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              রোল নম্বর <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              value={rollNumber}
              onChange={(e) => handleRollChange(e.target.value)}
              placeholder="যেমন: 1, 5"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold focus:border-[#C8102E] focus:outline-none"
            />
          </div>

          {/* Student Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              শিক্ষার্থীর নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="শিক্ষার্থীর পূর্ণ নাম"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold focus:border-[#C8102E] focus:outline-none"
            />
          </div>

        </div>

        {/* Quick Student Selection & Search from Class Roster */}
        {classStudents.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <FaUserGraduate className="text-[#C8102E]" />
                <span>শ্রেণি {classGrade}-এর শিক্ষার্থী তালিকা থেকে সার্চ বা দ্রুত নির্বাচন:</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full">
                  মোট {classStudents.length} জন
                </span>
              </span>

              {/* Live Search Input */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <FaMagnifyingGlass className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder="নাম বা রোল লিখে খুঁজুন..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C8102E] focus:border-[#C8102E]"
                />
                {studentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStudentSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    title="সার্চ মুছুন"
                  >
                    <FaXmark className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtered Students Chips */}
            {filteredClassStudents.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap max-h-32 overflow-y-auto pt-1 pr-1">
                {filteredClassStudents.map((std) => {
                  const isSelected = String(rollNumber) === String(std.rollNumber);
                  return (
                    <button
                      key={std.id}
                      type="button"
                      onClick={() => {
                        setRollNumber(String(std.rollNumber));
                        setStudentName(std.name);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-red-50 hover:border-red-200 border-slate-200'
                      }`}
                    >
                      <span className="font-mono">রোল {std.rollNumber}:</span>
                      <span>{std.name}</span>
                      {std.schoolName && (
                        <span className="text-[9px] text-slate-400 font-normal hidden md:inline">
                          • {std.schoolName}
                        </span>
                      )}
                      {isSelected && <FaCheck className="w-2.5 h-2.5 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-2.5 px-3 bg-white rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-semibold">
                  &ldquo;<span className="text-rose-600 font-bold">{studentSearchQuery}</span>&rdquo; দিয়ে কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি।
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  আপনি উপরের বক্সে সরাসরি যেকোনো নাম ও রোল লিখে রেজাল্ট যোগ করতে পারবেন।
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. DYNAMIC NCTB SUBJECT-BY-SUBJECT MARKS INPUT TABLE
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-7">
        
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <FaBookOpen className="text-[#C8102E]" />
              <span>ধাপ ২: NCTB বিষয়ভিত্তিক প্রাপ্ত নম্বর ইনপুট</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              প্রতিটি বিষয়ের নম্বর লিখলে পাশে স্বয়ংক্রিয়ভাবে লেটার গ্রেড ও জিপিএ হিসাব হবে।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ ৩৩% এ পাস
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              ★ ৮০% এ A+ (5.00)
            </span>
          </div>
        </div>

        {/* Subjects Marks Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-3 w-14 text-center">কোড</th>
                <th className="py-3 px-3.5">বিষয় (NCTB Subject)</th>
                <th className="py-3 px-2 text-center w-16">পূর্ণমান</th>
                {classGrade !== 5 && (
                  <>
                    <th className="py-3 px-2 text-center w-24 bg-amber-50/70 text-amber-950 font-black">
                      CQ (সৃজনশীল)
                    </th>
                    <th className="py-3 px-2 text-center w-24 bg-blue-50/70 text-blue-950 font-black">
                      MCQ (নৈর্ব্যক্তিক)
                    </th>
                  </>
                )}
                <th className="py-3 px-2 text-center w-28 bg-emerald-50/70 text-emerald-950 font-black">
                  {classGrade === 5 ? 'প্রাপ্ত নম্বর' : 'মোট প্রাপ্ত'}
                </th>
                <th className="py-3 px-2.5 text-center w-20">গ্রেড</th>
                <th className="py-3 px-2.5 text-center w-20">জিপিএ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectRows.map((row, idx) => {
                const isFailed = row.obtained > 0 && row.grade === 'F';
                const isClass5 = classGrade === 5;
                const isEnglish = row.subject.toLowerCase().includes('english') || row.subject.toLowerCase().includes('ইংরেজি');
                const noCqMcq = isClass5 || isEnglish;
                const isBangla2nd50 = row.subject.includes('বাংলা') && row.fullMarks === 50;
                const maxCq = row.fullMarks === 100 ? 70 : isBangla2nd50 ? 30 : row.fullMarks === 50 ? 25 : row.fullMarks;
                const maxMcq = row.fullMarks === 100 ? 30 : isBangla2nd50 ? 20 : row.fullMarks === 50 ? 25 : Math.round(row.fullMarks * 0.3);

                return (
                  <tr
                    key={row.code || idx}
                    className={`hover:bg-slate-50/70 transition ${isFailed ? 'bg-rose-50/40' : ''}`}
                  >
                    {/* Subject Code */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">
                      {row.code || `${idx + 1}`}
                    </td>

                    {/* Subject Name */}
                    <td className="py-2.5 px-3.5 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{row.subject}</span>
                        {row.isOptional && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            ৪র্থ বিষয়
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Full Marks */}
                    <td className="py-2.5 px-2 text-center font-bold text-slate-500">
                      {row.fullMarks}
                    </td>

                    {/* CQ & MCQ Inputs (Class 6-10 Only) */}
                    {!isClass5 && (
                      <>
                        <td className="py-2 px-2 text-center">
                          {noCqMcq ? (
                            <span className="text-slate-400 font-bold text-xs" title="ইংরেজি বিষয়ের ক্ষেত্রে পৃথক CQ/MCQ প্রযোজ্য নয়">—</span>
                          ) : (
                            <div className="relative inline-block w-20">
                              <input
                                type="number"
                                min="0"
                                max={maxCq}
                                value={row.cq === undefined || row.cq === 0 ? '' : row.cq}
                                onChange={(e) => handleCqChange(idx, e.target.value)}
                                placeholder={`max ${maxCq}`}
                                className="w-full px-2 py-1.5 rounded-lg border border-amber-300 bg-amber-50/40 text-slate-900 text-center font-black text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                            </div>
                          )}
                        </td>

                        <td className="py-2 px-2 text-center">
                          {noCqMcq ? (
                            <span className="text-slate-400 font-bold text-xs" title="ইংরেজি বিষয়ের ক্ষেত্রে পৃথক CQ/MCQ প্রযোজ্য নয়">—</span>
                          ) : (
                            <div className="relative inline-block w-20">
                              <input
                                type="number"
                                min="0"
                                max={maxMcq}
                                value={row.mcq === undefined || row.mcq === 0 ? '' : row.mcq}
                                onChange={(e) => handleMcqChange(idx, e.target.value)}
                                placeholder={`max ${maxMcq}`}
                                className="w-full px-2 py-1.5 rounded-lg border border-blue-300 bg-blue-50/40 text-slate-900 text-center font-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                          )}
                        </td>
                      </>
                    )}

                    {/* Total Obtained Marks Input */}
                    <td className="py-2 px-2 text-center">
                      <div className="relative inline-block w-20">
                        <input
                          type="number"
                          min="0"
                          max={row.fullMarks}
                          value={row.obtained === 0 ? '' : row.obtained}
                          onChange={(e) => handleSubjectMarkChange(idx, e.target.value)}
                          placeholder="0"
                          className={`w-full px-2 py-1.5 rounded-lg border text-center font-black text-xs transition focus:outline-none ${
                            row.obtained > 0 && row.grade === 'F'
                              ? 'border-rose-400 bg-rose-50 text-rose-700 focus:ring-2 focus:ring-rose-200'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Letter Grade */}
                    <td className="py-2.5 px-2.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md font-black text-xs ${
                          row.grade === 'A+'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.grade === 'A'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.grade === 'A-'
                            ? 'bg-blue-50 text-blue-700'
                            : row.grade === 'B'
                            ? 'bg-amber-50 text-amber-800'
                            : row.grade === 'C'
                            ? 'bg-orange-50 text-orange-800'
                            : row.grade === 'D'
                            ? 'bg-purple-50 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {row.grade}
                      </span>
                    </td>

                    {/* GPA Point */}
                    <td className="py-2.5 px-2.5 text-center font-black text-slate-700">
                      {row.gpa.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. REALTIME RESULT SUMMARY BOX (Live Instant Calculations)
        ───────────────────────────────────────────────────────────── */}
        <div
          style={{
            background: summary.hasFailedSubject
              ? 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)'
              : 'linear-gradient(135deg, #071426 0%, #0A1E3C 60%, #1A0A16 100%)',
          }}
          className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-md ${
            summary.hasFailedSubject
              ? 'border-rose-300 text-rose-950'
              : 'border-[#C8102E] text-white'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FaCalculator className={summary.hasFailedSubject ? 'text-rose-600' : 'text-amber-400'} />
                <h4 className="text-sm font-black uppercase tracking-wider">
                  {summary.hasFailedSubject ? 'ফলাফল অবস্থা: অনুত্তীর্ণ (Failed)' : 'স্বয়ংক্রিয় সার্বিক ফলাফল সামারি'}
                </h4>
              </div>

              {summary.hasFailedSubject ? (
                <p className="text-xs text-rose-700 font-semibold">
                  ⚠️ {summary.failedCount}টি আবশ্যিক বিষয়ে ৩৩ নম্বরের নিচে পাওয়ার কারণে ওভারঅল গ্রেড F (০.০০) নির্ধারিত হয়েছে।
                </p>
              ) : (
                <p className="text-xs text-blue-200">
                  বাংলাদেশ শিক্ষা বোর্ডের নিয়মানুযায়ী জিপিএ ও লেটার গ্রেড নির্ধারিত হয়েছে।
                </p>
              )}
            </div>

            {/* 4 Stats Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
              
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center border border-white/15">
                <span className="text-[10px] uppercase font-bold opacity-75 block">মোট নম্বর</span>
                <span className="text-sm sm:text-base font-black">
                  {summary.totalObtainedMarks} / {summary.totalFullMarks}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center border border-white/15">
                <span className="text-[10px] uppercase font-bold opacity-75 block">শতকরা</span>
                <span className="text-sm sm:text-base font-black">
                  {summary.percentage}%
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center border border-white/15">
                <span className="text-[10px] uppercase font-bold opacity-75 block">গ্রেড</span>
                <span className={`text-sm sm:text-base font-black ${summary.grade === 'A+' ? 'text-amber-300' : ''}`}>
                  {summary.grade}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center border border-white/15">
                <span className="text-[10px] uppercase font-bold opacity-75 block">জিপিএ (GPA)</span>
                <span className={`text-base sm:text-lg font-black ${summary.gpa === 5 ? 'text-amber-300' : ''}`}>
                  {summary.gpa.toFixed(2)}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. SUBMISSION ACTION BUTTONS
        ───────────────────────────────────────────────────────────── */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-xs font-bold text-slate-800 border border-red-200 cursor-pointer hover:bg-red-100/70 transition">
            <input
              type="checkbox"
              checked={sendResultSms}
              onChange={(e) => setSendResultSms(e.target.checked)}
              className="accent-[#C8102E] w-3.5 h-3.5"
            />
            <span>ফলাফল SMS পাঠান</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          
          {editingResultId && (
            <button
              type="button"
              onClick={() => {
                setEditingResultId(null);
                setRollNumber('1');
                setStudentName('');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              এডিট বাতিল করুন
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveResult(false)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <FaClock className="w-4 h-4 animate-spin text-amber-300" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4 text-emerald-400" />
                <span>{editingResultId ? 'আপডেট সম্পন্ন করুন' : 'ফলাফল সংরক্ষণ করুন'}</span>
              </>
            )}
          </button>

          {!editingResultId && (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveResult(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C8102E] hover:bg-[#A00D24] text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              title="বর্তমান শিক্ষার্থীর নম্বর সেভ করে স্বয়ংক্রিয়ভাবে পরবর্তী রোলে এগিয়ে যান"
            >
              <FaForwardStep className="w-4 h-4 text-white" />
              <span>সংরক্ষণ ও পরবর্তী রোল (Save & Next)</span>
            </button>
          )}

          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. SAVED RESULTS MANAGEMENT TABLE FOR SELECTED CLASS
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-800">
              শ্রেণি {classGrade}-এর সংরক্ষিত ফলাফল তালিকা ({existingResults.length} জন)
            </h3>
            <p className="text-xs text-slate-400">
              শিক্ষার্থীদের মার্কশিট ও নম্বর পরিবর্তনের জন্য এডিট বা ডিলিট অপশন ব্যবহার করুন
            </p>
          </div>

          <button
            type="button"
            onClick={loadExistingResults}
            className="text-xs font-bold text-brand-700 hover:underline"
          >
            ↻ রিফ্রেশ
          </button>
        </div>

        {loadingResults ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FaClock className="w-6 h-6 animate-spin mx-auto text-brand-600" />
            <p className="text-xs font-bold">ফলাফল তালিকা লোড হচ্ছে...</p>
          </div>
        ) : existingResults.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FaAward className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold">এই শ্রেণিতে এখনো কোনো ফলাফল সংরক্ষণ করা হয়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <th className="py-3 px-3.5 w-16 text-center">রোল</th>
                  <th className="py-3 px-3.5">শিক্ষার্থীর নাম</th>
                  <th className="py-3 px-3.5">পরীক্ষার নাম</th>
                  <th className="py-3 px-3.5 text-center">মোট নম্বর</th>
                  <th className="py-3 px-3.5 text-center">গ্রেড</th>
                  <th className="py-3 px-3.5 text-center">GPA</th>
                  <th className="py-3 px-3.5 text-right w-28">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {existingResults.map((rItem) => (
                  <tr key={rItem.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3.5 text-center font-black text-slate-800">
                      রোল {rItem.rollNumber}
                    </td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">
                      {rItem.studentName}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 truncate max-w-[160px]">
                      {rItem.examTitle}
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-bold text-slate-700">
                      {rItem.obtainedMarks} / {rItem.totalMarks}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-black text-[11px] ${
                          rItem.grade === 'A+'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rItem.grade === 'F'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {rItem.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-black text-brand-700 text-sm">
                      {parseFloat(rItem.gpa || 0).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditClick(rItem)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-700 transition"
                          title="সম্পাদনা করুন"
                        >
                          <FaPenToSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(rItem.id, rItem.studentName, rItem.rollNumber)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
