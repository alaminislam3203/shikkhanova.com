'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FaBookOpen,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaMagnifyingGlass,
  FaGraduationCap,
  FaCheck,
  FaXmark,
  FaClock,
  FaArrowUpRightFromSquare,
  FaLayerGroup,
  FaBook,
} from 'react-icons/fa6';
import { NctbSubjectItem } from '@/lib/nctbSubjects';

const CLASS_LABELS: Record<number, string> = {
  5: '৫ম শ্রেণি',
  6: '৬ষ্ঠ শ্রেণি',
  7: '৭ম শ্রেণি',
  8: '৮ম শ্রেণি',
  9: '৯ম শ্রেণি',
  10: '১০ম শ্রেণি',
};

const GROUP_OPTIONS = [
  'সকল বিভাগ (Common)',
  'বিজ্ঞান বিভাগ (Science)',
  'ব্যবসায় শিক্ষা (Business Studies)',
  'মানবিক বিভাগ (Humanities)',
];

export default function AdminSubjectsManager() {
  const [subjects, setSubjects] = useState<NctbSubjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    classGrade: 7,
    subjectName: '',
    bookTitle: '',
    subjectCode: '',
    group: 'সকল বিভাগ (Common)',
    fullMarks: '100',
    isCompulsory: true,
    nctbBookUrl: 'https://nctb.portal.gov.bd',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subjects', { cache: 'no-store' });
      const data = await res.json();
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      }
    } catch {
      toast.error('বিষয় ও NCTB বইয়ের তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      classGrade:
        selectedClassFilter !== 'all' ? Number(selectedClassFilter) : 7,
      subjectName: '',
      bookTitle: '',
      subjectCode: '',
      group: 'সকল বিভাগ (Common)',
      fullMarks: '100',
      isCompulsory: true,
      nctbBookUrl: 'https://nctb.portal.gov.bd',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectName.trim()) {
      toast.error('বিষয়ের নাম লিখুন');
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(editingId);
      const res = await fetch('/api/subjects', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          classGrade: Number(formData.classGrade),
          subjectName: formData.subjectName.trim(),
          bookTitle:
            formData.bookTitle.trim() || `${formData.subjectName.trim()} (NCTB)`,
          subjectCode: formData.subjectCode.trim() || '100',
          group: formData.group,
          fullMarks: Number(formData.fullMarks) || 100,
          isCompulsory: formData.isCompulsory,
          nctbBookUrl:
            formData.nctbBookUrl.trim() || 'https://nctb.portal.gov.bd',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }

      toast.success(
        isEditing
          ? `"${formData.subjectName}" বিষয় ও NCTB বই আপডেট হয়েছে!`
          : `${CLASS_LABELS[Number(formData.classGrade)]}-এ "${formData.subjectName}" সফলভাবে যোগ হয়েছে!`
      );

      await fetchSubjects();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (item: NctbSubjectItem) => {
    setEditingId(item.id);
    setFormData({
      classGrade: Number(item.classGrade),
      subjectName: item.subjectName,
      bookTitle: item.bookTitle,
      subjectCode: item.subjectCode,
      group: item.group || 'সকল বিভাগ (Common)',
      fullMarks: String(item.fullMarks || 100),
      isCompulsory: Boolean(item.isCompulsory),
      nctbBookUrl: item.nctbBookUrl || 'https://nctb.portal.gov.bd',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (item: NctbSubjectItem) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-rose-500 p-5 max-w-sm w-full space-y-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <FaTrashCan className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                বিষয় ও NCTB বই মুছে ফেলবেন?
              </h4>
              <p className="text-xs text-slate-500">
                {CLASS_LABELS[item.classGrade]} — {item.subjectName}
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
                    `/api/subjects?id=${encodeURIComponent(item.id)}`,
                    { method: 'DELETE' }
                  );
                  if (!res.ok) throw new Error('ডিলিট ব্যর্থ হয়েছে');
                  setSubjects((prev) => prev.filter((s) => s.id !== item.id));
                  if (editingId === item.id) resetForm();
                  toast.success(`"${item.subjectName}" মুছে ফেলা হয়েছে`);
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

  const filteredSubjects = subjects.filter((s) => {
    const matchClass =
      selectedClassFilter === 'all' ||
      Number(s.classGrade) === Number(selectedClassFilter);
    const matchGroup =
      selectedGroupFilter === 'all' || s.group === selectedGroupFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      s.subjectName.toLowerCase().includes(q) ||
      s.bookTitle.toLowerCase().includes(q) ||
      s.subjectCode.toLowerCase().includes(q);
    return matchClass && matchGroup && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <FaBookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0A1E3C]">
              শ্রেণিভিত্তিক বিষয় ও NCTB পাঠ্যবই ম্যানেজমেন্ট (Class 5–10)
            </h2>
            <p className="text-xs text-slate-500">
              ৫ম থেকে ১০ম শ্রেণি পর্যন্ত সকল NCTB পাঠ্যবই এখানে যুক্ত আছে — নতুন বিষয় বা বই যোগ, এডিট ও ডিলিট করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] text-xs font-black">
            মোট NCTB বই ও বিষয়: {subjects.length}টি
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Add / Edit Subject & NCTB Book Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-full mb-1">
                <FaBook /> {editingId ? 'বিষয় এডিট মোড' : 'নতুন বিষয় ও NCTB বই যোগ'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
                {editingId
                  ? 'বিষয় ও NCTB বই সম্পাদনা'
                  : 'শ্রেণিভিত্তিক বিষয় যোগ করুন'}
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

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  শ্রেণি (Class 5–10) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.classGrade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      classGrade: Number(e.target.value),
                    })
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
                  বিষয় কোড (Code)
                </label>
                <input
                  type="text"
                  value={formData.subjectCode}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectCode: e.target.value })
                  }
                  placeholder="যেমন: 109"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                বিষয়ের নাম (Subject Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subjectName}
                onChange={(e) =>
                  setFormData({ ...formData, subjectName: e.target.value })
                }
                placeholder="যেমন: উচ্চতর গণিত (Higher Mathematics)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NCTB পাঠ্যবইয়ের নাম (NCTB Textbook Title)
              </label>
              <input
                type="text"
                value={formData.bookTitle}
                onChange={(e) =>
                  setFormData({ ...formData, bookTitle: e.target.value })
                }
                placeholder="যেমন: উচ্চতর গণিত — ৯ম-১০ম শ্রেণি (NCTB)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বিভাগ / গ্রুপ
                </label>
                <select
                  value={formData.group}
                  onChange={(e) =>
                    setFormData({ ...formData, group: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                >
                  {GROUP_OPTIONS.map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  পূর্ণমান (Full Marks)
                </label>
                <input
                  type="number"
                  min="25"
                  max="200"
                  value={formData.fullMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, fullMarks: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-black text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NCTB বই / পিডিএফ লিংক (URL)
              </label>
              <input
                type="text"
                value={formData.nctbBookUrl}
                onChange={(e) =>
                  setFormData({ ...formData, nctbBookUrl: e.target.value })
                }
                placeholder="https://nctb.portal.gov.bd"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-700 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="compulsory-check"
                type="checkbox"
                checked={formData.isCompulsory}
                onChange={(e) =>
                  setFormData({ ...formData, isCompulsory: e.target.checked })
                }
                className="w-4 h-4 accent-[#C8102E] rounded"
              />
              <label
                htmlFor="compulsory-check"
                className="text-xs font-bold text-slate-700 cursor-pointer"
              >
                আবশ্যিক বিষয় (Compulsory Subject)
              </label>
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
                  <span>পরিবর্তন সেভ করুন</span>
                </>
              ) : (
                <>
                  <FaPlus className="w-4 h-4" />
                  <span>নতুন বিষয় ও NCTB বই যোগ করুন</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 8 Cols: Class-wise NCTB Books & Subjects List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
                শ্রেণি ৫–১০ NCTB পাঠ্যবই ও বিষয় তালিকা ({filteredSubjects.length}টি)
              </h3>
              <p className="text-xs text-slate-500">
                শ্রেণি সিলেক্ট করে ওই শ্রেণির সকল বোর্ড বই ও বিষয় দেখুন কিংবা নতুন যোগ করুন
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিষয়, বই বা কোড দিয়ে খুঁজুন..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>
          </div>

          {/* Class Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedClassFilter('all');
                setSelectedGroupFilter('all');
              }}
              className={`px-3.5 py-2 rounded-sm text-xs font-bold transition whitespace-nowrap ${
                selectedClassFilter === 'all'
                  ? 'bg-[#C8102E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]'
              }`}
            >
              সকল শ্রেণি ({subjects.length})
            </button>
            {[5, 6, 7, 8, 9, 10].map((cls) => {
              const count = subjects.filter(
                (s) => Number(s.classGrade) === cls
              ).length;
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setSelectedClassFilter(String(cls));
                    if (!editingId) {
                      setFormData((prev) => ({ ...prev, classGrade: cls }));
                    }
                  }}
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

          {/* Group Filter (Especially useful for Class 9 & 10) */}
          {(selectedClassFilter === '9' ||
            selectedClassFilter === '10' ||
            selectedClassFilter === 'all') && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                বিভাগ ফিল্টার:
              </span>
              <button
                type="button"
                onClick={() => setSelectedGroupFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  selectedGroupFilter === 'all'
                    ? 'bg-[#0A1E3C] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                সব বিভাগ
              </button>
              {GROUP_OPTIONS.map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedGroupFilter(grp)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    selectedGroupFilter === grp
                      ? 'bg-[#0A1E3C] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grp.split(' (')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Subjects & NCTB Books Grid */}
          {loading ? (
            <div className="py-14 text-center space-y-2">
              <FaClock className="w-6 h-6 text-[#C8102E] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">
                NCTB পাঠ্যবই ও বিষয় তালিকা লোড হচ্ছে...
              </p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <FaGraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                কোনো বিষয় বা NCTB বই পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-500">
                বাম পাশের ফর্ম থেকে নতুন বিষয় ও বই যোগ করুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition ${
                    editingId === item.id
                      ? 'border-[#C8102E] bg-red-50/30 ring-2 ring-[#C8102E]/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-[#0A1E3C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm">
                          <FaLayerGroup className="w-2.5 h-2.5 text-red-300" />
                          {CLASS_LABELS[item.classGrade] || `Class ${item.classGrade}`}
                        </span>
                        <span className="font-mono text-[11px] font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-sm">
                          কোড: {item.subjectCode}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.group.includes('বিজ্ঞান')
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.group.includes('ব্যবসায়')
                            ? 'bg-amber-100 text-amber-800'
                            : item.group.includes('মানবিক')
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.group.split(' (')[0]}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#0A1E3C] leading-snug">
                        {item.subjectName}
                      </h4>
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                        <FaBookOpen className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                        <span>{item.bookTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">
                        পূর্ণমান: <strong className="text-slate-800">{item.fullMarks}</strong>
                      </span>
                      {item.nctbBookUrl && (
                        <a
                          href={item.nctbBookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C8102E] hover:underline"
                        >
                          <span>NCTB বই</span>
                          <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A1E3C] font-bold text-xs flex items-center gap-1 transition"
                      >
                        <FaPenToSquare className="w-3 h-3" />
                        <span>এডিট</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1 transition"
                      >
                        <FaTrashCan className="w-3 h-3" />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
