'use client';

import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaThumbtack,
  FaCalendarDays,
  FaCheck,
  FaXmark,
  FaArrowsRotate,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { DEFAULT_NOTICES, CATEGORY_LABELS, NoticeItem } from '@/lib/defaultNotices';

export default function AdminNoticesManager() {
  const [notices, setNotices] = useState<NoticeItem[]>(DEFAULT_NOTICES);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toLocaleDateString('bn-BD', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    category: 'exam' as NoticeItem['category'],
    targetClass: '৫ম - ১০ম শ্রেণি',
    isPinned: false,
    summary: '',
    details: '',
    attachmentUrl: '',
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices', { cache: 'no-store' });
      const data = await res.json();
      if (data.notices && Array.isArray(data.notices) && data.notices.length > 0) {
        setNotices(data.notices);
        try {
          sessionStorage.setItem('sn_notices_cache_v1', JSON.stringify(data.notices));
        } catch {}
      }
    } catch {
      // Keep default notices
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      date: new Date().toLocaleDateString('bn-BD', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      category: 'exam',
      targetClass: '৫ম - ১০ম শ্রেণি',
      isPinned: false,
      summary: '',
      details: '',
      attachmentUrl: '',
    });
  };

  const handleEditClick = (notice: NoticeItem) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      date: notice.date,
      category: notice.category,
      targetClass: notice.targetClass,
      isPinned: Boolean(notice.isPinned),
      summary: notice.summary,
      details: notice.details,
      attachmentUrl: notice.attachmentUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim()) {
      toast.error('নোটিশের শিরোনাম ও সংক্ষিপ্ত বিবরণ লিখুন');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/notices', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingId ? { id: editingId, ...formData } : formData
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }

      toast.success(editingId ? 'নোটিশ সফলভাবে আপডেট হয়েছে!' : 'নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!');
      resetForm();
      await fetchNotices();
    } catch (err: any) {
      toast.error(err.message || 'সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (notice: NoticeItem) => {
    try {
      const res = await fetch('/api/notices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: notice.id,
          isPinned: !notice.isPinned,
        }),
      });
      if (!res.ok) throw new Error('আপডেট ব্যর্থ হয়েছে');
      toast.success(!notice.isPinned ? 'নোটিশটি পিন করা হয়েছে!' : 'নোটিশ আনপিন করা হয়েছে');
      await fetchNotices();
    } catch {
      toast.error('পিন স্ট্যাটাস পরিবর্তন করা যায়নি');
    }
  };

  const handleDelete = (notice: NoticeItem) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-[#C8102E] max-w-md w-full space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold bg-red-50 text-[#C8102E] px-2.5 py-0.5 rounded-sm">
              নোটিশ ডিলিট নিশ্চিতকরণ
            </span>
            <h4 className="text-base font-bold text-[#0A1E3C]">
              আপনি কি নিশ্চিতভাবে এই নোটিশটি মুছে ফেলতে চান?
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">“{notice.title}”</p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 rounded-sm text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await fetch(`/api/notices?id=${encodeURIComponent(notice.id)}`, {
                    method: 'DELETE',
                  });
                  if (!res.ok) throw new Error('ডিলিট ব্যর্থ হয়েছে');
                  toast.success('নোটিশ সফলভাবে মুছে ফেলা হয়েছে!');
                  await fetchNotices();
                } catch {
                  toast.error('নোটিশ ডিলিট করতে সমস্যা হয়েছে');
                }
              }}
              className="px-4 py-2 rounded-sm text-xs font-bold bg-[#C8102E] hover:bg-[#A50D26] text-white"
            >
              হ্যাঁ, ডিলিট করুন
            </button>
          </div>
        </div>
      ),
      { duration: 15000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Add / Edit Notice Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-red-50 text-[#C8102E] flex items-center justify-center text-lg">
              <FaBell />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0A1E3C]">
                {editingId ? 'নোটিশ এডিট ও আপডেট করুন' : 'নতুন নোটিশ প্রকাশ করুন'}
              </h2>
              <p className="text-xs text-slate-500">
                এখানে যুক্ত বা আপডেট করা নোটিশ সাথে সাথে ওয়েবসাইটের নোটিশ বোর্ডে ও হোমপেজে ডাইনামিকভাবে দেখাবে
              </p>
            </div>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold self-start sm:self-auto"
            >
              <FaXmark /> এডিট বাতিল করুন
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block font-bold text-slate-700 mb-1">নোটিশের শিরোনাম *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="যেমন: ৫ম থেকে ১০ম শ্রেণির মাসিক পরীক্ষার সময়সূচি প্রকাশ"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as NoticeItem['category'],
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              >
                <option value="exam">{CATEGORY_LABELS.exam}</option>
                <option value="admission">{CATEGORY_LABELS.admission}</option>
                <option value="routine">{CATEGORY_LABELS.routine}</option>
                <option value="general">{CATEGORY_LABELS.general}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">শ্রেণি</label>
              <input
                type="text"
                value={formData.targetClass}
                onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                placeholder="৫ম - ১০ম শ্রেণি"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">তারিখ</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="১০ নভেম্বর, ২০২৬"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (Summary) *</label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="নোটিশ কার্ডে দেখানোর জন্য ১-২ লাইনের সংক্ষিপ্ত বিবরণ লিখুন..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">বিস্তারিত নোটিশ (Full Details)</label>
            <textarea
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="বিস্তারিত দেখুন বাটনে ক্লিক করলে যে সম্পূর্ণ বিজ্ঞপ্তিটি দেখাবে তা এখানে লিখুন..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 accent-[#C8102E] rounded"
                />
                <span>টপ পিন করা নোটিশ হিসেবে রাখুন (হোমপেজ ও সবার উপরে দেখাবে)</span>
              </label>

              <input
                type="text"
                value={formData.attachmentUrl}
                onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                placeholder="লিংক (ঐচ্ছিক, যেমন: /results বা /pdfs)"
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#A50D26] text-white font-bold px-6 py-3 rounded-sm shadow-sm transition disabled:opacity-60"
            >
              {editingId ? <FaCheck /> : <FaPlus />}
              <span>
                {submitting
                  ? 'সংরক্ষণ হচ্ছে...'
                  : editingId
                  ? 'নোটিশ আপডেট করুন'
                  : 'নোটিশ প্রকাশ করুন'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Published Notices List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1E3C]">
              প্রকাশিত সকল নোটিশ ({notices.length}টি)
            </h3>
            <p className="text-xs text-slate-500">
              যেকোনো নোটিশ পিন, এডিট অথবা ডিলিট করুন
            </p>
          </div>

          <button
            type="button"
            onClick={fetchNotices}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1E3C] hover:text-[#C8102E] bg-slate-100 px-3 py-2 rounded-sm transition"
          >
            <FaArrowsRotate className={loading ? 'animate-spin' : ''} />
            <span>রিফ্রেশ</span>
          </button>
        </div>

        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                notice.isPinned
                  ? 'bg-red-50/30 border-l-4 border-l-[#C8102E] border-slate-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#C8102E] text-white px-2 py-0.5 rounded-sm">
                      <FaThumbtack className="w-2.5 h-2.5" /> পিন করা
                    </span>
                  )}
                  <span className="text-[11px] font-bold bg-white text-[#0A1E3C] px-2.5 py-0.5 rounded-sm border border-slate-200">
                    {notice.categoryLabel}
                  </span>
                  <span className="text-[11px] font-bold bg-red-50 text-[#C8102E] px-2 py-0.5 rounded-sm">
                    {notice.targetClass}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <FaCalendarDays className="text-slate-400" /> {notice.date}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#0A1E3C]">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">{notice.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePin(notice)}
                  title={notice.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
                  className={`px-3 py-2 rounded-sm text-xs font-bold inline-flex items-center gap-1.5 transition ${
                    notice.isPinned
                      ? 'bg-[#C8102E] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-[#C8102E] hover:text-[#C8102E]'
                  }`}
                >
                  <FaThumbtack className="w-3 h-3" />
                  <span>{notice.isPinned ? 'পিনড' : 'পিন'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEditClick(notice)}
                  className="px-3 py-2 rounded-sm text-xs font-bold bg-[#0A1E3C] hover:bg-slate-800 text-white inline-flex items-center gap-1.5 transition"
                >
                  <FaPenToSquare className="w-3 h-3" />
                  <span>এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(notice)}
                  className="px-3 py-2 rounded-sm text-xs font-bold bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white inline-flex items-center gap-1.5 transition"
                >
                  <FaTrashCan className="w-3 h-3" />
                  <span>ডিলিট</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
