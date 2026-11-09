'use client';

import React from 'react';

interface ResultFormData {
  examTitle: string;
  classGrade: number;
  rollNumber: string;
  studentName: string;
  totalMarks: string;
  obtainedMarks: string;
  grade: string;
  gpa: string;
}

interface AddResultFormProps {
  formData: ResultFormData;
  onChange: (data: ResultFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddResultForm({
  formData,
  onChange,
  onSubmit,
}: AddResultFormProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
      <h3 className="text-lg font-black text-slate-800">
        শিক্ষার্থীর কোচিং ফলাফল যুক্ত করুন
      </h3>

      <form onSubmit={onSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
          <input
            type="text"
            required
            value={formData.examTitle}
            onChange={(e) => onChange({ ...formData, examTitle: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">শ্রেণি (Class 5-10)</label>
            <select
              value={formData.classGrade}
              onChange={(e) =>
                onChange({ ...formData, classGrade: parseInt(e.target.value) })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value={5}>৫ম শ্রেণি </option>
              <option value={6}>৬ষ্ঠ শ্রেণি</option>
              <option value={7}>৭ম শ্রেণি</option>
              <option value={8}>৮ম শ্রেণি </option>
              <option value={9}>৯ম শ্রেণি </option>
              <option value={10}>১০ম শ্রেণি</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">রোল নম্বর</label>
            <input
              type="number"
              required
              value={formData.rollNumber}
              onChange={(e) => onChange({ ...formData, rollNumber: e.target.value })}
              placeholder="যেমন: 1, 5"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম</label>
          <input
            type="text"
            required
            value={formData.studentName}
            onChange={(e) => onChange({ ...formData, studentName: e.target.value })}
            placeholder="পুরো নাম লিখুন"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">প্রাপ্ত নম্বর</label>
            <input
              type="number"
              required
              value={formData.obtainedMarks}
              onChange={(e) => onChange({ ...formData, obtainedMarks: e.target.value })}
              placeholder="যেমন: 365"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">লেটার গ্রেড</label>
            <select
              value={formData.grade}
              onChange={(e) => onChange({ ...formData, grade: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-brand-500"
            >
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="F">F</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">জিপিএ (GPA)</label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => onChange({ ...formData, gpa: e.target.value })}
              placeholder="5.00"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl shadow-brand transition active:scale-[0.99]"
        >
          ফলাফল সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );
}

