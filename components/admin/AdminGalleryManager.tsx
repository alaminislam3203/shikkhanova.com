'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GalleryPhoto, CATEGORY_MAP } from '@/lib/defaultGallery';
import {
  FaImages,
  FaPlus,
  FaTrash,
  FaPenToSquare,
  FaArrowUpRightFromSquare,
  FaCamera,
  FaCloudArrowUp,
  FaCheck,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
  FaCalendarDays,
  FaTag,
  FaXmark,
} from 'react-icons/fa6';
import Link from 'next/link';

export default function AdminGalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: 'classroom' as GalleryPhoto['category'],
    date: 'নভেম্বর ২০২৬',
    imageUrl: '',
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await res.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch {
      setMsg({ text: 'গ্যালারির ছবি লোড করা যায়নি', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      subtitle: '',
      category: 'classroom',
      date: 'নভেম্বর ২০২৬',
      imageUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Upload photo from device via /api/user/upload-photo
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg({ text: 'অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল নির্বাচন করুন', type: 'error' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMsg({ text: 'ছবি সর্বোচ্চ ৮ মেগাবাইট হতে পারবে', type: 'error' });
      return;
    }

    setUploadingImage(true);
    setMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/user/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ছবি আপলোড ব্যর্থ হয়েছে');
      }

      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      setMsg({ text: 'ছবি সফলভাবে আপলোড হয়েছে!', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে', type: 'error' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditClick = (photo: GalleryPhoto) => {
    setEditingId(photo.id);
    setForm({
      title: photo.title,
      subtitle: photo.subtitle,
      category: photo.category,
      date: photo.date,
      imageUrl: photo.imageUrl,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      setMsg({ text: 'শিরোনাম ও ছবির লিঙ্ক বা আপলোড আবশ্যক', type: 'error' });
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      if (editingId) {
        // Edit existing
        const res = await fetch('/api/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'আপডেট ব্যর্থ হয়েছে');
        setMsg({ text: 'ছবি সফলভাবে আপডেট করা হয়েছে!', type: 'success' });
      } else {
        // Create new
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'ছবি সংরক্ষণ করা যায়নি');
        setMsg({ text: 'নতুন ছবি সফলভাবে গ্যালারিতে যোগ হয়েছে!', type: 'success' });
      }

      resetForm();
      await fetchPhotos();
    } catch (err: any) {
      setMsg({ text: err.message || 'সমস্যা হয়েছে', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${title}" ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ছবি মোছা সম্ভব হয়নি');
      setMsg({ text: 'ছবি সফলভাবে মুছে ফেলা হয়েছে!', type: 'success' });
      await fetchPhotos();
    } catch (err: any) {
      setMsg({ text: err.message || 'ছবি মুছতে সমস্যা হয়েছে', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs mb-2">
            <FaImages />
            <span>গ্যালারি নিয়ন্ত্রণ মডিউল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ফটো গ্যালারি ম্যানেজমেন্ট
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            একাডেমির ক্লাসরুম, পরীক্ষা, কৃতি শিক্ষার্থী সংবর্ধনা ও ক্যাম্পাসের ছবিসমূহ সরাসরি আপলোড ও নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/gallery"
            target="_blank"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>পাবলিক গ্যালারি দেখুন</span>
            <FaArrowUpRightFromSquare className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={() => {
              if (showForm && editingId) {
                resetForm();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A00D24] text-white text-xs font-bold shadow-xs transition active:scale-95"
          >
            {showForm ? (
              <>
                <FaXmark className="w-3.5 h-3.5" />
                <span>ফর্ম বন্ধ করুন</span>
              </>
            ) : (
              <>
                <FaPlus className="w-3.5 h-3.5" />
                <span>নতুন ছবি যোগ করুন</span>
              </>
            )}
          </button>
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

      {/* Add / Edit Form Card */}
      {showForm && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#C8102E]/30 shadow-md space-y-5 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <FaImages className="text-[#C8102E]" />
              <span>{editingId ? 'ছবি তথ্য সম্পাদনা করুন' : 'নতুন ছবি যুক্ত করুন'}</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <FaXmark className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  ছবির শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="যেমন: শ্রেণিকক্ষে মাল্টিমিডিয়া ও ইন্টারেক্টিভ পাঠদান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
                />
              </div>

              {/* Subtitle / Details */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  উপশিরোনাম ও স্থান (ব্যাচ, শ্রেণি ও বিবরণ)
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="যেমন: ৯ম ও ১০ম শ্রেণির বিজ্ঞান ব্যাচ • জুম্মাপাড়া, নীলফামারী সদর"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">ক্যাটাগরি</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as GalleryPhoto['category'] })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
                >
                  <option value="classroom">ক্লাসরুম ও পাঠদান</option>
                  <option value="exam">পরীক্ষা ও মূল্যায়ন</option>
                  <option value="award">পুরস্কার ও সংবর্ধনা</option>
                  <option value="campus">একাডেমিক কার্যক্রম</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">তারিখ / মাস</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="যেমন: নভেম্বর ২০২৬"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
                />
              </div>

              {/* Image Input Options */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  ছবির ফাইল আপলোড অথবা ইমেজ URL <span className="text-rose-500">*</span>
                </label>
                
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... অথবা নিচে থেকে সরাসরি আপলোড করুন"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shrink-0 active:scale-95 disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <>
                        <FaClock className="w-3.5 h-3.5 animate-spin text-rose-400" />
                        <span>আপলোড হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <FaCloudArrowUp className="w-3.5 h-3.5 text-rose-400" />
                        <span>ডিভাইস থেকে আপলোড</span>
                      </>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Image Live Preview */}
              {form.imageUrl && (
                <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-40 h-28 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-xs relative">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">ছবির প্রিভিউ প্রি-ভিউ:</p>
                    <p className="truncate max-w-md font-mono text-[11px] text-slate-500">{form.imageUrl}</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      ✓ প্রস্তুত
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-6 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A00D24] text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-60 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <FaClock className="w-3.5 h-3.5 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="w-3.5 h-3.5" />
                    <span>{editingId ? 'আপডেট সম্পন্ন করুন' : 'ছবি সংরক্ষণ করুন'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Photos Grid / List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              বর্তমান গ্যালারি অ্যালবাম ({photos.length}টি ছবি)
            </h3>
            <p className="text-xs text-slate-400">ওয়েবসাইটে এই ছবিগুলো যথাক্রমে প্রদর্শিত হবে</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 font-bold space-y-2">
            <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-xs">গ্যালারির ছবি লোড হচ্ছে...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <FaImages className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-xs font-bold">এখনো কোনো ছবি যুক্ত করা হয়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {photos.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/95 text-[#C8102E] shadow-xs backdrop-blur-xs">
                      {item.categoryLabel || CATEGORY_MAP[item.category] || 'ফটো'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 shadow-2xs transition active:scale-95"
                    >
                      <FaPenToSquare className="w-3 h-3 text-brand-600" />
                      <span>সম্পাদনা</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold border border-rose-200 transition active:scale-95"
                    >
                      <FaTrash className="w-3 h-3" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

