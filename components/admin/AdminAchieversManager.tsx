'use client';

import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  FaAward,
  FaCloudArrowUp,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaCheck,
  FaXmark,
  FaClock,
  FaGraduationCap,
  FaEye,
} from 'react-icons/fa6';
import { AchieverItem } from '@/lib/defaultAchievers';

export default function AdminAchieversManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [achievers, setAchievers] = useState<AchieverItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    classGrade: 10,
    classLabel: '১০ম শ্রেণি (SSC ২০২৬)',
    achievement: 'গোল্ডেন A+ (GPA 5.00)',
    institution: 'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
    photoUrl: '',
    badge: 'গোল্ডেন A+',
  });

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/achievers', { cache: 'no-store' });
      const data = await res.json();
      if (data.achievers && Array.isArray(data.achievers)) {
        setAchievers(data.achievers);
      }
    } catch {
      toast.error('সাফল্য তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      classGrade: 10,
      classLabel: '১০ম শ্রেণি (SSC ২০২৬)',
      achievement: 'গোল্ডেন A+ (GPA 5.00)',
      institution: 'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
      photoUrl: '',
      badge: 'গোল্ডেন A+',
    });
  };

  const handleImageFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('দয়া করে একটি সঠিক ছবি (JPG, PNG, WebP) নির্বাচন করুন');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('folder', 'shikkha_nova/achievers');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          photoUrl: data.url,
        }));
        toast.success(
          'ছবি সফলভাবে Cloudinary ক্লাউডে আপলোড হয়েছে! সেভ বাটনে চাপুন।'
        );
      } else {
        toast.error(data.error || 'ছবি আপলোড করতে সমস্যা হয়েছে');
      }
    } catch {
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('শিক্ষার্থীর নাম লিখুন');
      return;
    }
    if (!formData.photoUrl.trim()) {
      toast.error('দয়া করে একটি ছবি আপলোড করুন অথবা Cloudinary লিংক দিন');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/achievers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          classGrade: Number(formData.classGrade),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }

      toast.success(
        editingId
          ? 'সাফল্য গাঁথা তথ্য আপডেট করা হয়েছে!'
          : 'নতুন কৃতী শিক্ষার্থী সফলভাবে যুক্ত হয়েছে!'
      );

      await fetchAchievers();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (achiever: AchieverItem) => {
    setEditingId(achiever.id);
    setFormData({
      name: achiever.name,
      classGrade: achiever.classGrade,
      classLabel: achiever.classLabel,
      achievement: achiever.achievement,
      institution: achiever.institution,
      photoUrl: achiever.photoUrl,
      badge: achiever.badge || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (achiever: AchieverItem) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-rose-500 p-5 max-w-sm w-full space-y-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <FaTrashCan className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                সাফল্য রেকর্ডটি মুছে ফেলবেন?
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">
                {achiever.name} ({achiever.classLabel})
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
                    `/api/achievers?id=${encodeURIComponent(achiever.id)}`,
                    { method: 'DELETE' }
                  );
                  if (!res.ok) throw new Error('ডিলিট ব্যর্থ হয়েছে');
                  setAchievers((prev) =>
                    prev.filter((a) => a.id !== achiever.id)
                  );
                  if (editingId === achiever.id) resetForm();
                  toast.success('রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে');
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <FaAward className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0A1E3C]">
              আমাদের সাফল্য গাঁথা (৬ষ্ঠ - ১০ম শ্রেণি)
            </h2>
            <p className="text-xs text-slate-500">
              কৃতী শিক্ষার্থীদের ছবি Cloudinary-তে আপলোড করুন এবং হোমপেজের সাফল্য গাঁথা স্লাইডারে প্রদর্শন করুন
            </p>
          </div>
        </div>

        <span className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] text-xs font-black shrink-0">
          মোট কৃতী শিক্ষার্থী: {achievers.length} জন
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Add / Edit Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-full mb-1">
                <FaAward /> {editingId ? 'তথ্য এডিট মোড' : 'নতুন কৃতী শিক্ষার্থী যোগ'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
                {editingId
                  ? 'কৃতী শিক্ষার্থীর তথ্য আপডেট'
                  : 'নতুন সাফল্য রেকর্ড যুক্ত করুন'}
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
            {/* Cloudinary Photo Upload Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/60 via-slate-50 to-blue-50/40 border-2 border-dashed border-[#C8102E]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-black text-[#0A1E3C] text-xs sm:text-sm">
                    ১. শিক্ষার্থীর ছবি (Cloudinary ক্লাউডে আপলোড)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    পাসপোর্ট সাইজ / পোর্ট্রেট ছবি নির্বাচন করুন (সর্বোচ্চ ৫MB)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="inline-flex items-center justify-center gap-2 bg-[#0A1E3C] hover:bg-[#C8102E] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition shrink-0 disabled:opacity-60"
                >
                  {uploadingImage ? (
                    <>
                      <FaClock className="w-3.5 h-3.5 animate-spin" />
                      <span>আপলোড হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaCloudArrowUp className="w-4 h-4" />
                      <span>ছবি সিলেক্ট করুন</span>
                    </>
                  )}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  অথবা সরাসরি Cloudinary ছবির লিংক দিন:
                </label>
                <input
                  type="text"
                  required
                  value={formData.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, photoUrl: e.target.value })
                  }
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-700 focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ২. শিক্ষার্থীর পুরো নাম <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="যেমন: মারিয়া আক্তার মুন্নি"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ৩. শ্রেণি (Class 6 - 10)
                </label>
                <select
                  value={formData.classGrade}
                  onChange={(e) => {
                    const grade = Number(e.target.value);
                    setFormData({
                      ...formData,
                      classGrade: grade,
                      classLabel: `${grade}ম শ্রেণি`,
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                >
                  <option value={10}>১০ম শ্রেণি (SSC)</option>
                  <option value={9}>৯ম শ্রেণি</option>
                  <option value={8}>৮ম শ্রেণি</option>
                  <option value={7}>৭ম শ্রেণি</option>
                  <option value={6}>৬ষ্ঠ শ্রেণি</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ৪. ব্যাজ (টপ কর্নার)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                  placeholder="যেমন: গোল্ডেন A+ / ১ম স্থান"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ৫. ক্লাসের বিবরণ / বিভাগ
              </label>
              <input
                type="text"
                value={formData.classLabel}
                onChange={(e) =>
                  setFormData({ ...formData, classLabel: e.target.value })
                }
                placeholder="যেমন: ১০ম শ্রেণি (SSC ২০২৬) বা ৯ম শ্রেণি (বিজ্ঞান)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ৬. মেধা অর্জন / সাফল্য বিবরণ
              </label>
              <input
                type="text"
                value={formData.achievement}
                onChange={(e) =>
                  setFormData({ ...formData, achievement: e.target.value })
                }
                placeholder="যেমন: ট্যালেন্টপুল বৃত্তি ও গণিতে ১০০/১০০"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ৭. স্কুল / শিক্ষা প্রতিষ্ঠানের নাম
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="যেমন: নীলফামারী সরকারি উচ্চ বিদ্যালয়"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving || uploadingImage}
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
                  <span>সাফল্য গাঁথায় যোগ করুন</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Live Preview & Existing Achievers */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FaEye className="text-[#C8102E]" /> লাইভ কার্ড প্রিভিউ
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                হোমপেজে যেভাবে দেখাবে
              </span>
            </div>

            <div className="max-w-[280px] mx-auto bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/4.8] overflow-hidden bg-slate-100">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.name || 'Student Preview'}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    ছবি নির্বাচন করুন
                  </div>
                )}
                {formData.badge && (
                  <span className="absolute top-2.5 right-2.5 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs shadow-xs">
                    {formData.badge}
                  </span>
                )}
                <span className="absolute bottom-2 left-2 bg-[#0A1E3C]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                  {formData.classGrade}ম শ্রেণি
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="text-base font-bold text-[#C8102E] leading-snug">
                  {formData.name || 'শিক্ষার্থীর নাম'}
                </h4>
                <p className="text-xs font-bold text-slate-800">
                  {formData.classLabel}
                </p>
                <p className="text-xs font-semibold text-slate-600">
                  {formData.achievement}
                </p>
                <p className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center gap-1">
                  <FaGraduationCap className="text-slate-400" />
                  <span>{formData.institution}</span>
                </p>
              </div>
            </div>
          </div>

          {/* List of all achievers */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
              সকল কৃতী শিক্ষার্থী ({achievers.length} জন)
            </h3>

            {loading ? (
              <div className="py-10 text-center space-y-2">
                <FaClock className="w-6 h-6 text-[#C8102E] animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">
                  তালিকা লোড হচ্ছে...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievers.map((ach) => (
                  <div
                    key={ach.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-start gap-3 hover:bg-white transition"
                  >
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                      <img
                        src={ach.photoUrl}
                        alt={ach.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold bg-[#0A1E3C] text-white px-1.5 py-0.5 rounded-xs">
                          {ach.classGrade}ম শ্রেণি
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(ach)}
                            className="p-1 text-[#0A1E3C] hover:text-[#C8102E] transition"
                            title="এডিট"
                          >
                            <FaPenToSquare className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(ach)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition"
                            title="ডিলিট"
                          >
                            <FaTrashCan className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-[#C8102E] truncate">
                        {ach.name}
                      </h4>
                      <p className="text-[11px] text-slate-700 truncate font-semibold">
                        {ach.achievement}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {ach.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

