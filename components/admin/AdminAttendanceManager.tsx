'use client';

import React, { useState, useEffect } from 'react';
import {
  FaUserCheck,
  FaFloppyDisk,
  FaCalendarDay,
  FaMagnifyingGlass,
  FaGraduationCap,
  FaCircleCheck,
  FaCircleExclamation,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { StudentRollItem } from '@/types';

export default function AdminAttendanceManager() {
  const [selectedClass, setSelectedClass] = useState<number>(7);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchRoll, setSearchRoll] = useState<string>('');
  const [students, setStudents] = useState<StudentRollItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAttendanceList();
  }, [selectedClass, selectedDate]);

  const getBengaliName = (roll: number) => {
    const names = [
      'রাকিবুল হাসান', 'সাদিয়া সুলতানা', 'আরিফুল ইসলাম', 'তানজিলা আক্তার',
      'মাহমুদুল করিম', 'ফারহানা ইয়াসমিন', 'নাজমুল হুদা', 'সুমাইয়া জাহান',
      'জাহিদ হাসান', 'ফাতেমা তুজ জোহরা', 'হাসিবুর রহমান', 'নুসরাত জাহান',
      'ইমরান হোসেন', 'রুমানা আফরোজ', 'মেহেদী হাসান', 'জান্নাতুল ফেরদৌস',
      'শাকিল আহমেদ', 'তাসনিম আক্তার', 'রায়হান কবীর', 'আয়েশা সিদ্দিকা',
    ];
    return names[(roll - 1) % names.length];
  };

  const fetchAttendanceList = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/attendance?classGrade=${selectedClass}&date=${selectedDate}`);
      const data = await res.json();

      if (data.records && data.records.length > 0) {
        setStudents(
          data.records.map((r: any) => ({
            rollNumber: r.rollNumber,
            studentName: r.studentName || `শিক্ষার্থী রোল ${r.rollNumber}`,
            classGrade: r.classGrade || selectedClass,
            status: r.status,
          }))
        );
      } else {
        const defaultList: StudentRollItem[] = Array.from({ length: 20 }, (_, i) => ({
          rollNumber: i + 1,
          studentName: getBengaliName(i + 1),
          classGrade: selectedClass,
          status: 'PRESENT',
        }));
        setStudents(defaultList);
      }
    } catch {
      const defaultList: StudentRollItem[] = Array.from({ length: 20 }, (_, i) => ({
        rollNumber: i + 1,
        studentName: getBengaliName(i + 1),
        classGrade: selectedClass,
        status: 'PRESENT',
      }));
      setStudents(defaultList);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (rollNumber: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNumber === rollNumber ? { ...s, status } : s))
    );
  };

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classGrade: selectedClass,
          date: selectedDate,
          records: students,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }

      setMessage({ text: 'হাজিরা সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে!', type: 'success' });
      toast.success('রোল উপস্থিতি সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err: any) {
      setMessage({
        text: err.message || 'হাজিরা সংরক্ষণ ব্যর্থ হয়েছে',
        type: 'error',
      });
      toast.error(err.message || 'হাজিরা সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    searchRoll
      ? s.rollNumber.toString().includes(searchRoll) || s.studentName.includes(searchRoll)
      : true
  );

  const totalCount = students.length;
  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const absentCount = students.filter((s) => s.status === 'ABSENT').length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-red-50 text-[#C8102E] flex items-center justify-center font-bold">
                <FaUserCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A1E3C]">
                রোল উপস্থিতি ও হাজিরা শিট <span className="text-[#C8102E]">(Admin Only)</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ৫ম থেকে ১০ম শ্রেণি — শুধুমাত্র অ্যাডমিন প্যানেল থেকে প্রতিদিনের রোল ভিত্তিক হাজিরা এন্ট্রি ও সংরক্ষণ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => markAll('PRESENT')}
              className="px-3.5 py-2 text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-sm transition"
            >
              সবাইকে Present
            </button>
            <button
              type="button"
              onClick={() => markAll('ABSENT')}
              className="px-3.5 py-2 text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-sm transition"
            >
              সবাইকে Absent
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="px-4 py-2.5 bg-[#C8102E] hover:bg-[#A50D26] text-white font-bold text-xs rounded-sm shadow-sm transition flex items-center gap-2 disabled:opacity-70"
            >
              <FaFloppyDisk className="w-3.5 h-3.5" />
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'হাজিরা সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </div>

        {/* Class Quick Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[5, 6, 7, 8, 9, 10].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-sm text-xs font-bold transition whitespace-nowrap ${
                selectedClass === cls
                  ? 'bg-[#C8102E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FaGraduationCap className="text-[#0A1E3C]" /> শ্রেণি নির্বাচন (Class 5-10)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(parseInt(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
            >
              <option value={5}>৫ম শ্রেণি</option>
              <option value={6}>৬ষ্ঠ শ্রেণি</option>
              <option value={7}>৭ম শ্রেণি</option>
              <option value={8}>৮ম শ্রেণি</option>
              <option value={9}>৯ম শ্রেণি</option>
              <option value={10}>১০ম শ্রেণি</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FaCalendarDay className="text-[#C8102E]" /> তারিখ (Attendance Date)
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FaMagnifyingGlass className="text-slate-400" /> রোল বা নাম দিয়ে সার্চ
            </label>
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder="যেমন: 1, 5, রাকিবুল..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <FaCircleCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <FaCircleExclamation className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-400 font-bold uppercase">মোট শিক্ষার্থী</span>
          <h4 className="text-2xl font-black text-slate-800">{totalCount}</h4>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-xs text-emerald-600 font-bold uppercase">উপস্থিত (Present)</span>
          <h4 className="text-2xl font-black text-emerald-700">{presentCount}</h4>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-xs text-rose-600 font-bold uppercase">অনুপস্থিত (Absent)</span>
          <h4 className="text-2xl font-black text-rose-700">{absentCount}</h4>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl shadow-xs text-center">
          <span className="text-xs text-[#C8102E] font-bold uppercase">উপস্থিতির হার</span>
          <h4 className="text-2xl font-black text-[#C8102E]">{percentage}%</h4>
        </div>
      </div>

      {/* Roll List Table Component */}
      <AttendanceTable
        students={filteredStudents as any}
        selectedClass={selectedClass}
        onStatusChange={setStatus}
      />
    </div>
  );
}
