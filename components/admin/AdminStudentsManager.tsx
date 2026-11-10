'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FaUserPlus,
  FaUsers,
  FaGraduationCap,
  FaPenToSquare,
  FaTrashCan,
  FaMagnifyingGlass,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaXmark,
  FaClock,
  FaUserCheck,
  FaIdBadge,
} from 'react-icons/fa6';
import AdminAttendanceManager from '@/components/admin/AdminAttendanceManager';

export interface StudentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  classGrade: number;
  rollNumber: number;
  fatherName?: string;
  motherName?: string;
  schoolName?: string;
  dateOfBirth?: string;
}

const CLASS_LABELS: Record<number, string> = {
  5: '৫ম শ্রেণি',
  6: '৬ষ্ঠ শ্রেণি',
  7: '৭ম শ্রেণি',
  8: '৮ম শ্রেণি',
  9: '৯ম শ্রেণি',
  10: '১০ম শ্রেণি',
};

export default function AdminStudentsManager() {
  const [subView, setSubView] = useState<'students' | 'attendance'>('students');
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    classGrade: 7,
    rollNumber: '1',
    phone: '',
    email: '',
    password: '',
    fatherName: '',
    motherName: '',
    schoolName: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students', { cache: 'no-store' });
      const data = await res.json();
      if (data.students && Array.isArray(data.students)) {
        setStudents(data.students);
      }
    } catch (err) {
      toast.error('শিক্ষার্থীদের তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate next roll number when class changes (only when adding new student)
  useEffect(() => {
    if (!editingId) {
      const classStudents = students.filter(
        (s) => Number(s.classGrade) === Number(formData.classGrade)
      );
      const maxRoll = classStudents.reduce(
        (max, s) => (Number(s.rollNumber) > max ? Number(s.rollNumber) : max),
        0
      );
      setFormData((prev) => ({
        ...prev,
        rollNumber: String(maxRoll + 1),
      }));
    }
  }, [formData.classGrade, students.length, editingId]);

  const resetForm = () => {
    setEditingId(null);
    const classStudents = students.filter((s) => Number(s.classGrade) === 7);
    const maxRoll = classStudents.reduce(
      (max, s) => (Number(s.rollNumber) > max ? Number(s.rollNumber) : max),
      0
    );
    setFormData({
      name: '',
      classGrade: 7,
      rollNumber: String(maxRoll + 1),
      phone: '',
      email: '',
      password: '',
      fatherName: '',
      motherName: '',
      schoolName: '',
      dateOfBirth: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('শিক্ষার্থীর নাম লিখুন');
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(editingId);
      const res = await fetch('/api/admin/students', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          name: formData.name.trim(),
          classGrade: Number(formData.classGrade),
          rollNumber: Number(formData.rollNumber) || 1,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          fatherName: formData.fatherName.trim(),
          motherName: formData.motherName.trim(),
          schoolName: formData.schoolName.trim(),
          dateOfBirth: formData.dateOfBirth.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }

      toast.success(
        isEditing
          ? `"${formData.name}" এর তথ্য সফলভাবে আপডেট করা হয়েছে!`
          : `নতুন শিক্ষার্থী "${formData.name}" (শ্রেণি ${formData.classGrade}, রোল ${formData.rollNumber}) সফলভাবে যোগ হয়েছে!`
      );

      await fetchStudents();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (student: StudentItem) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      classGrade: Number(student.classGrade),
      rollNumber: String(student.rollNumber),
      phone: student.phone || '',
      email: student.email || '',
      password: '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      schoolName: student.schoolName || '',
      dateOfBirth: student.dateOfBirth || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (student: StudentItem) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-rose-500 p-5 max-w-sm w-full space-y-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <FaTrashCan className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">শিক্ষার্থী মুছে ফেলবেন?</h4>
              <p className="text-xs text-slate-500">
                {student.name} (শ্রেণি {student.classGrade}, রোল {student.rollNumber})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await fetch(
                    `/api/admin/students?id=${encodeURIComponent(student.id)}`,
                    { method: 'DELETE' }
                  );
                  if (!res.ok) throw new Error('ডিলিট ব্যর্থ হয়েছে');
                  setStudents((prev) => prev.filter((s) => s.id !== student.id));
                  if (editingId === student.id) resetForm();
                  toast.success(`"${student.name}" কে তালিকা থেকে মুছে ফেলা হয়েছে`);
                } catch {
                  toast.error('ডিলিট করতে সমস্যা হয়েছে');
                }
              }}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition"
            >
              হ্যাঁ, ডিলিট করুন
            </button>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
            >
              বাতিল
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const filteredStudents = students.filter((s) => {
    const matchClass =
      selectedClassFilter === 'all' ||
      Number(s.classGrade) === Number(selectedClassFilter);
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      String(s.rollNumber).includes(q) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q));
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Mode Switcher: Student Management vs Roll Attendance */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0A1E3C] text-white flex items-center justify-center shrink-0 shadow-sm">
            <FaUsers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0A1E3C]">
              শিক্ষার্থী ভর্তি, তালিকা ও রোল উপস্থিতি ম্যানেজমেন্ট
            </h2>
            <p className="text-xs text-slate-500">
              ৫ম থেকে ১০ম শ্রেণি — নতুন শিক্ষার্থী যোগ, সম্পাদনা এবং প্রতিদিনের রোল হাজিরা
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setSubView('students')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition ${
              subView === 'students'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0A1E3C]'
            }`}
          >
            <FaUserPlus className="w-3.5 h-3.5" />
            <span>শিক্ষার্থী যোগ ও তালিকা ({students.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubView('attendance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition ${
              subView === 'attendance'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0A1E3C]'
            }`}
          >
            <FaUserCheck className="w-3.5 h-3.5" />
            <span>রোল উপস্থিতি শিট</span>
          </button>
        </div>
      </div>

      {subView === 'attendance' ? (
        <AdminAttendanceManager />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Cols: Add / Edit Student Form */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-full mb-1">
                  <FaUserPlus /> {editingId ? 'শিক্ষার্থী এডিট মোড' : 'নতুন শিক্ষার্থী ভর্তি'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
                  {editingId ? 'শিক্ষার্থীর তথ্য আপডেট করুন' : 'নতুন শিক্ষার্থী যোগ করুন'}
                </h3>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl flex items-center gap-1"
                >
                  <FaXmark /> বাতিল
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: মো: তানভীর হাসান"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    শ্রেণি (Class 5–10) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.classGrade}
                    onChange={(e) =>
                      setFormData({ ...formData, classGrade: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                  >
                    {[5, 6, 7, 8, 9, 10].map((cls) => (
                      <option key={cls} value={cls}>
                        {CLASS_LABELS[cls]} (Class {cls})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    রোল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.rollNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNumber: e.target.value })
                    }
                    placeholder="যেমন: 1"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-black text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                  />
                </div>
              </div>

              {/* Parents Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পিতার নাম (Father's Name)
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="যেমন: মো: রফিকুল ইসলাম"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    মাতার নাম (Mother's Name)
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="যেমন: মোসা: রোকেয়া বেগম"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* School Name & Date of Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    বিদ্যালয়ের নাম (School)
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="যেমন: নীলফামারী সরকারি উচ্চ বিদ্যালয়"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    জন্ম তারিখ (DOB)
                  </label>
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর (শিক্ষার্থী / অভিভাবক)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="যেমন: 01712XXXXXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ইমেইল আইডি <span className="text-[11px] font-normal text-slate-400">(ঐচ্ছিক)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ফাঁকা রাখলে অটো জেনারেট হবে"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-700 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  লগইন পাসওয়ার্ড{' '}
                  <span className="text-[11px] font-normal text-slate-400">
                    ({editingId ? 'পরিবর্তন করতে চাইলে লিখুন' : 'ডিফল্ট: 123456'})
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingId ? 'অপরিবর্তিত রাখতে ফাঁকা রাখুন' : '123456'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-700 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#C8102E] hover:bg-[#A50D26] text-white font-black py-3 px-5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <FaClock className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : editingId ? (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span>শিক্ষার্থীর তথ্য আপডেট করুন</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="w-4 h-4" />
                    <span>শিক্ষার্থী যোগ করুন</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right 8 Cols: Student List & Class Filters */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Class Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
                  শ্রেণিভিত্তিক শিক্ষার্থীদের তালিকা ({filteredStudents.length} জন)
                </h3>
                <p className="text-xs text-slate-500">
                  যেকোনো শিক্ষার্থীর নাম, রোল বা মোবাইল নম্বর এডিট কিংবা ডিলিট করতে পারবেন
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, রোল বা ফোন দিয়ে খুঁজুন..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>
            </div>

            {/* Class Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedClassFilter('all')}
                className={`px-3.5 py-2 rounded-sm text-xs font-bold transition whitespace-nowrap ${
                  selectedClassFilter === 'all'
                    ? 'bg-[#C8102E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]'
                }`}
              >
                সকল শ্রেণি ({students.length})
              </button>
              {[5, 6, 7, 8, 9, 10].map((cls) => {
                const count = students.filter((s) => Number(s.classGrade) === cls).length;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClassFilter(String(cls))}
                    className={`px-3.5 py-2 rounded-sm text-xs font-bold transition whitespace-nowrap ${
                      selectedClassFilter === String(cls)
                        ? 'bg-[#C8102E] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]'
                    }`}
                  >
                    {CLASS_LABELS[cls]} ({count})
                  </button>
                );
              })}
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="py-14 text-center space-y-2">
                <FaClock className="w-6 h-6 text-[#C8102E] animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">
                  শিক্ষার্থীদের তালিকা লোড হচ্ছে...
                </p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <FaGraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  এই শ্রেণিতে কোনো শিক্ষার্থী পাওয়া যায়নি
                </p>
                <p className="text-xs text-slate-500">
                  বাম পাশের ফর্ম থেকে নতুন শিক্ষার্থী যোগ করুন।
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0A1E3C] text-white text-xs uppercase">
                      <th className="py-3.5 px-4 font-bold">রোল</th>
                      <th className="py-3.5 px-4 font-bold">শিক্ষার্থীর নাম</th>
                      <th className="py-3.5 px-4 font-bold">শ্রেণি</th>
                      <th className="py-3.5 px-4 font-bold">মোবাইল ও ইমেইল</th>
                      <th className="py-3.5 px-4 font-bold text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`transition ${
                          editingId === student.id
                            ? 'bg-red-50/60'
                            : 'hover:bg-slate-50/90'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 font-black text-[#0A1E3C]">
                            {student.rollNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-black text-slate-800">{student.name}</p>
                          {(student.schoolName || student.fatherName) && (
                            <p className="text-[11px] text-slate-500 font-semibold truncate max-w-xs">
                              {student.schoolName || ''}{student.schoolName && student.fatherName ? ' • ' : ''}{student.fatherName ? `পিতা: ${student.fatherName}` : ''}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-[#0A1E3C] border border-blue-200/80 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            <FaIdBadge className="w-3 h-3 text-[#C8102E]" />
                            {CLASS_LABELS[student.classGrade] || `Class ${student.classGrade}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-y-0.5">
                          {student.phone ? (
                            <p className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <FaPhone className="w-3 h-3 text-emerald-600" />
                              {student.phone}
                            </p>
                          ) : (
                            <span className="text-[11px] text-slate-400">নম্বর নেই</span>
                          )}
                          <p className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                            <FaEnvelope className="w-2.5 h-2.5" />
                            {student.email}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(student)}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0A1E3C] font-bold text-xs flex items-center gap-1 transition"
                            >
                              <FaPenToSquare className="w-3 h-3" />
                              <span>এডিট</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(student)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1 transition"
                            >
                              <FaTrashCan className="w-3 h-3" />
                              <span>ডিলিট</span>
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
      )}
    </div>
  );
}

