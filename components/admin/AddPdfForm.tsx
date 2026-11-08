'use client';

import React from 'react';

interface PdfFormData {
  title: string;
  description: string;
  classGrade: number;
  subject: string;
  price: string;
  fileUrl: string;
}

interface AddPdfFormProps {
  formData: PdfFormData;
  onChange: (data: PdfFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddPdfForm({
  formData,
  onChange,
  onSubmit,
}: AddPdfFormProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
      <h3 className="text-lg font-black text-slate-800">
        নতুন পিডিএফ শিট বা হ্যান্ডনোট যুক্ত করুন
      </h3>

      <form onSubmit={onSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block font-bold text-slate-700 mb-1">পিডিএফ টাইটেল</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            placeholder="যেমন: ৮ম শ্রেণি গণিত জ্যামিতি স্পেশাল নোট"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">শ্রেণি (Class)</label>
            <select
              value={formData.classGrade}
              onChange={(e) =>
                onChange({ ...formData, classGrade: parseInt(e.target.value) })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value={5}>Class 5</option>
              <option value={6}>Class 6</option>
              <option value={7}>Class 7</option>
              <option value={8}>Class 8</option>
              <option value={9}>Class 9</option>
              <option value={10}>Class 10</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">বিষয়</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => onChange({ ...formData, subject: e.target.value })}
              placeholder="গণিত / বিজ্ঞান..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">মূল্য (টাকা)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => onChange({ ...formData, price: e.target.value })}
              placeholder="50"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">বিবরণ / সূচিপত্র</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            placeholder="নোটের সংক্ষিপ্ত বিবরণ..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-500"
          ></textarea>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">পিডিএফ ফাইল পাথ / লিংক</label>
          <input
            type="text"
            required
            value={formData.fileUrl}
            onChange={(e) => onChange({ ...formData, fileUrl: e.target.value })}
            placeholder="/assets/pdfs/filename.pdf"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-brand-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slogan-600 hover:bg-slogan-700 text-white font-bold py-3 rounded-xl shadow-md transition active:scale-[0.99]"
        >
          পিডিএফ শিট পাবলিশ করুন
        </button>
      </form>
    </div>
  );
}

