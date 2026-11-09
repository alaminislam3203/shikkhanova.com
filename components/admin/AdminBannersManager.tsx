'use client';

import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  FaImages,
  FaCloudArrowUp,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaCheck,
  FaXmark,
  FaClock,
  FaEye,
  FaLink,
} from 'react-icons/fa6';
import { BannerItem } from '@/lib/defaultBanners';

export default function AdminBannersManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    displayOrder: '1',
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners', { cache: 'no-store' });
      const data = await res.json();
      if (data.banners && Array.isArray(data.banners)) {
        setBanners(data.banners);
        if (!editingId) {
          setFormData((prev) => ({
            ...prev,
            displayOrder: String(data.banners.length + 1),
          }));
        }
      }
    } catch {
      toast.error('ব্যানার তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      imageUrl: '',
      linkUrl: '',
      displayOrder: String(banners.length + 1),
      isActive: true,
    });
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('দয়া করে একটি সঠিক ছবি (JPG, PNG, WebP, SVG) নির্বাচন করুন');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ব্যানার ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('folder', 'shikkha_nova/banners');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.url,
          title:
            prev.title ||
            file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        toast.success('ব্যানার ছবি সফলভাবে আপলোড হয়েছে! এখন সেভ বাটনে চাপুন।');
      } else {
        // Fallback to Data URL if Cloudinary is unavailable
        const dataUrl = await readFileAsDataUrl(file);
        setFormData((prev) => ({
          ...prev,
          imageUrl: dataUrl,
          title:
            prev.title ||
            file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        toast.success('ব্যানার ছবি যুক্ত হয়েছে! এখন সেভ বাটনে চাপুন।');
      }
    } catch {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setFormData((prev) => ({
          ...prev,
          imageUrl: dataUrl,
          title:
            prev.title ||
            file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        toast.success('ব্যানার ছবি যুক্ত হয়েছে! এখন সেভ বাটনে চাপুন।');
      } catch {
        toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
      }
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      toast.error('দয়া করে একটি ব্যানার ছবি আপলোড করুন অথবা ছবির লিংক দিন');
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(editingId);
      const res = await fetch('/api/banners', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          title:
            formData.title.trim() || 'শিক্ষানোভা একাডেমি অফিশিয়াল ব্যানার',
          imageUrl: formData.imageUrl.trim(),
          linkUrl: formData.linkUrl.trim(),
          displayOrder: Number(formData.displayOrder) || 1,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ব্যানার সংরক্ষণ ব্যর্থ হয়েছে');
      }

      toast.success(
        isEditing
          ? 'হিরো ব্যানার সফলভাবে আপডেট করা হয়েছে!'
          : 'নতুন হিরো ব্যানার সফলভাবে প্রকাশিত হয়েছে!'
      );

      await fetchBanners();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (banner: BannerItem) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      displayOrder: String(banner.displayOrder || 1),
      isActive: Boolean(banner.isActive),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive,
        }),
      });
      if (!res.ok) throw new Error('স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে');
      await fetchBanners();
      toast.success(
        !banner.isActive
          ? 'ব্যানারটি হিরো স্লাইডারে সক্রিয় করা হয়েছে!'
          : 'ব্যানারটি সাময়িকভাবে লুকানো হয়েছে'
      );
    } catch {
      toast.error('স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে');
    }
  };

  const handleDelete = (banner: BannerItem) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-rose-500 p-5 max-w-sm w-full space-y-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <FaTrashCan className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                ব্যানারটি মুছে ফেলবেন?
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">
                {banner.title}
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
                    `/api/banners?id=${encodeURIComponent(banner.id)}`,
                    { method: 'DELETE' }
                  );
                  if (!res.ok) throw new Error('ডিলিট ব্যর্থ হয়েছে');
                  setBanners((prev) =>
                    prev.filter((b) => b.id !== banner.id)
                  );
                  if (editingId === banner.id) resetForm();
                  toast.success('ব্যানারটি সফলভাবে মুছে ফেলা হয়েছে');
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
            <FaImages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0A1E3C]">
              হোমপেজ ফুল-উইডথ হিরো ব্যানার ম্যানেজমেন্ট
            </h2>
            <p className="text-xs text-slate-500">
              এখান থেকে আপলোড করা ব্যানার ছবিগুলো হোমপেজের হিরো সেকশনে ফুল-উইডথ জুড়ে অটো-সোয়াইপ করবে
            </p>
          </div>
        </div>

        <span className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] text-xs font-black shrink-0">
          সক্রিয় ব্যানার: {banners.filter((b) => b.isActive).length}টি / মোট {banners.length}টি
        </span>
      </div>

      {/* Main Grid: Upload/Edit Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Upload & Edit Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-full mb-1">
                <FaImages /> {editingId ? 'ব্যানার এডিট মোড' : 'নতুন ব্যানার আপলোড'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
                {editingId
                  ? 'ব্যানারের ছবি ও তথ্য পরিবর্তন করুন'
                  : 'নতুন হিরো ব্যানার যোগ করুন'}
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
            {/* Direct Image File Upload Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/60 via-slate-50 to-blue-50/40 border-2 border-dashed border-[#C8102E]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-black text-[#0A1E3C] text-xs sm:text-sm">
                    ১. ব্যানার ছবি আপলোড করুন (ওয়াইড সাইজ)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    JPG, PNG, WebP বা SVG ছবি সিলেক্ট করুন (প্রস্তাবিত রেশিও ৩:১ বা ১৯২০×৬৪০)
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
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  অথবা সরাসরি ছবির লিংক (Image URL) দিন:
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="যেমন: https://res.cloudinary.com/... বা /banners/banner-1.svg"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-700 focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ২. ব্যানারের শিরোনাম (Alt / Title)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="যেমন: নতুন শিক্ষাবর্ষে ৫ম-১০ম শ্রেণিতে ভর্তি চলছে"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ৩. ক্লিক লিংক <span className="text-[10px] font-normal text-slate-400">(ঐচ্ছিক)</span>
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  placeholder="যেমন: /pdfs বা /notices"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ৪. সিরিয়াল নম্বর (Order)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-black text-slate-800 focus:outline-none focus:border-[#C8102E] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="banner-active"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 accent-[#C8102E] rounded"
              />
              <label
                htmlFor="banner-active"
                className="text-xs font-bold text-slate-700 cursor-pointer"
              >
                হোমপেজ স্লাইডারে ব্যানারটি সক্রিয় (Active) রাখুন
              </label>
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
                  <span>ব্যানার আপডেট করুন</span>
                </>
              ) : (
                <>
                  <FaPlus className="w-4 h-4" />
                  <span>ব্যানার পাবলিশ করুন</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Live Preview & Existing Banners List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FaEye className="text-[#C8102E]" /> লাইভ ফুল-উইডথ ব্যানার প্রিভিউ
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                ডেস্কটপ ও মোবাইলে সমানুপাতিক দেখাবে
              </span>
            </div>

            <div className="w-full aspect-[3/1] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center relative">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt={formData.title || 'Banner Preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400 space-y-1 p-4">
                  <FaImages className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-xs font-bold">
                    বাম পাশ থেকে ব্যানার ছবি সিলেক্ট করলে এখানে প্রিভিউ দেখাবে
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* All Saved Banners */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-black text-[#0A1E3C]">
              আপলোডকৃত সকল হিরো ব্যানার ({banners.length}টি)
            </h3>

            {loading ? (
              <div className="py-10 text-center space-y-2">
                <FaClock className="w-6 h-6 text-[#C8102E] animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">
                  ব্যানার তালিকা লোড হচ্ছে...
                </p>
              </div>
            ) : banners.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                কোনো ব্যানার পাওয়া যায়নি। নতুন ব্যানার আপলোড করুন।
              </div>
            ) : (
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className={`rounded-2xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                      editingId === banner.id
                        ? 'border-[#C8102E] bg-red-50/30'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 min-w-0 flex-1 w-full">
                      <div className="w-full sm:w-44 aspect-[3/1] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black bg-[#0A1E3C] text-white px-2 py-0.5 rounded-sm">
                            স্লাইড #{banner.displayOrder}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(banner)}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full transition ${
                              banner.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {banner.isActive ? '✓ সক্রিয় (Active)' : 'নিষ্ক্রিয় (Hidden)'}
                          </button>
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-[#0A1E3C] truncate">
                          {banner.title}
                        </h4>

                        {banner.linkUrl && (
                          <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <FaLink className="w-2.5 h-2.5 text-[#C8102E]" />
                            <span>লিংক: {banner.linkUrl}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(banner)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0A1E3C] font-bold text-xs flex items-center gap-1 transition"
                      >
                        <FaPenToSquare className="w-3 h-3" />
                        <span>এডিট</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(banner)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1 transition"
                      >
                        <FaTrashCan className="w-3 h-3" />
                        <span>ডিলিট</span>
                      </button>
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

