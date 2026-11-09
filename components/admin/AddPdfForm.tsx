'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FaFilePdf,
  FaCloudArrowUp,
  FaCircleCheck,
  FaClock,
  FaPenToSquare,
  FaTrashCan,
  FaEye,
  FaPlus,
  FaXmark,
  FaLayerGroup,
  FaCheck,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { PdfItem } from '@/types';
import PdfCard from '@/components/pdfs/PdfCard';

export interface PdfFormData {
  id?: string;
  title: string;
  description: string;
  classGrade: number;
  subject: string;
  price: string;
  fileUrl: string;
  isFree?: boolean;
}

interface AddPdfFormProps {
  formData: PdfFormData;
  onChange: (data: PdfFormData) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onNotify?: (msg: { text: string; type: 'success' | 'error' }) => void;
}

const SUBJECT_PRESETS = [
  'গণিত (Mathematics)',
  'বিজ্ঞান (Science)',
  'ইংরেজি (English)',
  'পদার্থবিজ্ঞান (Physics)',
  'রসায়ন (Chemistry)',
  'জীববিজ্ঞান (Biology)',
  'আইসিটি (ICT)',
  'বাংলা (Bangla)',
];

export default function AddPdfForm({
  formData,
  onChange,
  onNotify,
}: AddPdfFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [filterClass, setFilterClass] = useState<string>('all');

  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localMsg, setLocalMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const notify = (text: string, type: 'success' | 'error') => {
    setLocalMsg({ text, type });
    if (onNotify) {
      onNotify({ text, type });
    }
  };

  useEffect(() => {
    fetchPublishedPdfs();
  }, []);

  const fetchPublishedPdfs = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/pdfs', { cache: 'no-store' });
      const data = await res.json();
      if (data.pdfs) {
        setPdfs(
          data.pdfs.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            classGrade: p.classGrade,
            subject: p.subject,
            price: p.price,
            fileUrl: p.fileUrl,
            isFree: p.isFree,
            purchaseStatus: 'NONE',
          }))
        );
      }
    } catch (err) {
      console.error('Error loading PDFs:', err);
    } finally {
      setLoadingList(false);
    }
  };

  // Handle Direct PDF File Upload to Cloudinary
  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      notify('দয়া করে একটি সঠিক PDF ফাইল (.pdf) নির্বাচন করুন', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      notify('পিডিএফ ফাইলের সাইজ সর্বোচ্চ ১৫ মেগাবাইট হতে পারবে', 'error');
      return;
    }

    setUploadingFile(true);
    setLocalMsg(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'shikkha_nova/pdfs');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'পিডিএফ ফাইল আপলোড ব্যর্থ হয়েছে');
      }

      setUploadedFileName(file.name);
      onChange({
        ...formData,
        fileUrl: data.url,
        title: formData.title || file.name.replace(/\.pdf$/i, ''),
      });

      notify(`"${file.name}" সফলভাবে ক্লাউডে আপলোড হয়েছে! এখন কার্ডটি সেভ করুন।`, 'success');
    } catch (err: any) {
      notify(err.message || 'পিডিএফ আপলোডে সমস্যা হয়েছে', 'error');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Create or Update PDF Card
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      notify('পিডিএফ কার্ডের টাইটেল দিন', 'error');
      return;
    }
    if (!formData.fileUrl.trim()) {
      notify('দয়া করে একটি PDF ফাইল আপলোড করুন অথবা ফাইল লিংক দিন', 'error');
      return;
    }

    setSaving(true);
    setLocalMsg(null);

    try {
      const isEditing = Boolean(editingId);
      const method = isEditing ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        id: editingId || undefined,
        classGrade: Number(formData.classGrade),
        price: formData.isFree ? '0' : formData.price,
        isFree: Boolean(formData.isFree) || Number(formData.price) <= 0,
      };

      const res = await fetch('/api/pdfs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'পিডিএফ কার্ড সংরক্ষণ ব্যর্থ হয়েছে');
      }

      notify(
        isEditing
          ? 'পিডিএফ কার্ড সফলভাবে আপডেট করা হয়েছে!'
          : 'নতুন পিডিএফ কার্ড সফলভাবে প্রকাশিত হয়েছে!',
        'success'
      );

      // Reset form & refresh list
      resetForm();
      await fetchPublishedPdfs();
    } catch (err: any) {
      notify(err.message || 'সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Start Editing an Existing PDF Card
  const handleStartEdit = (pdf: PdfItem) => {
    setEditingId(pdf.id);
    setUploadedFileName('');
    onChange({
      id: pdf.id,
      title: pdf.title,
      description: pdf.description || '',
      classGrade: pdf.classGrade,
      subject: pdf.subject,
      price: pdf.price.toString(),
      fileUrl: pdf.fileUrl,
      isFree: Boolean(pdf.isFree) || pdf.price <= 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing
  const resetForm = () => {
    setEditingId(null);
    setUploadedFileName('');
    onChange({
      title: '',
      description: '',
      classGrade: 7,
      subject: 'গণিত (Mathematics)',
      price: '50',
      fileUrl: '',
      isFree: false,
    });
  };

  // Delete a PDF Card
  const handleDeletePdf = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${title}" কার্ডটি মুছে ফেলতে চান?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/pdfs?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ডিলিট করা যায়নি');
      }

      setPdfs((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
      notify('পিডিএফ কার্ড সফলভাবে মুছে ফেলা হয়েছে!', 'success');
    } catch (err: any) {
      notify(err.message || 'ডিলিট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Live Preview Card Object
  const previewCard: PdfItem = {
    id: editingId || 'preview-id',
    title: formData.title.trim() || '৭ম শ্রেণি গণিত ১ম সাময়িক স্পেশাল হ্যান্ডনোট ও সূত্রাবলি',
    description:
      formData.description.trim() ||
      'অধ্যায়ভিত্তিক সৃজনশীল প্রশ্নোত্তর, শর্টকাট সূত্রাবলি ও ১০০% কমন উপযোগী স্পেশাল সাজেশন।',
    classGrade: Number(formData.classGrade) || 7,
    subject: formData.subject.trim() || 'গণিত (Mathematics)',
    price: formData.isFree ? 0 : Number(formData.price) || 0,
    fileUrl: formData.fileUrl || '#',
    isFree: Boolean(formData.isFree) || Number(formData.price) <= 0,
    purchaseStatus: 'NONE',
  };

  const filteredPdfs = pdfs.filter(
    (p) => filterClass === 'all' || p.classGrade.toString() === filterClass
  );

  return (
    <div className="space-y-8">
      {/* Status Alert */}
      {localMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-sm animate-in fade-in ${
            localMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaCircleCheck
              className={localMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}
            />
            <span>{localMsg.text}</span>
          </div>
          <button onClick={() => setLocalMsg(null)} className="text-xs opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Top Section: Form (Left 7 Cols) + Live Card Preview (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Add / Edit Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
                <HiSparkles /> {editingId ? 'কার্ড এডিট মোড' : 'নতুন কার্ড তৈরি'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                {editingId
                  ? 'পিডিএফ শিট ও কার্ডের তথ্য পরিবর্তন করুন'
                  : 'নতুন পিডিএফ শিট আপলোড ও কার্ড সেটআপ'}
              </h3>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
              >
                <FaXmark /> এডিট বাতিল
              </button>
            )}
          </div>

          <form onSubmit={handleSaveCard} className="space-y-4 text-xs sm:text-sm">
            
            {/* 1. Direct PDF File Upload Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border-2 border-dashed border-brand-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <label className="font-black text-slate-800 flex items-center gap-2 text-sm">
                    <FaFilePdf className="text-rose-600 w-4 h-4" />
                    ১. পিডিএফ ফাইল আপলোড করুন (সরাসরি ক্লাউডে)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    কম্পিউটার বা মোবাইল থেকে PDF সিলেক্ট করলে স্বয়ংক্রিয়ভাবে লিংক তৈরি হবে (সর্বোচ্চ ১৫MB)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-brand transition shrink-0 active:scale-95 disabled:opacity-60"
                >
                  {uploadingFile ? (
                    <>
                      <FaClock className="w-4 h-4 animate-spin" />
                      <span>আপলোড হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaCloudArrowUp className="w-4 h-4" />
                      <span>PDF ফাইল সিলেক্ট করুন</span>
                    </>
                  )}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePdfFileUpload}
                  accept="application/pdf,.pdf"
                  className="hidden"
                />
              </div>

              {uploadedFileName && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800">
                  <span className="truncate">✓ আপলোডকৃত ফাইল: {uploadedFileName}</span>
                  {formData.fileUrl && (
                    <a
                      href={formData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 underline ml-2 shrink-0"
                    >
                      ফাইল দেখুন
                    </a>
                  )}
                </div>
              )}

              {/* Direct URL Field (Auto-filled by Upload or Manually Editable) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  অথবা সরাসরি পিডিএফ লিংক / Google Drive লিংক দিন:
                </label>
                <input
                  type="text"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => onChange({ ...formData, fileUrl: e.target.value })}
                  placeholder="ফাইল আপলোড করলে এখানে স্বয়ংক্রিয়ভাবে লিংক বসবে..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-700 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* 2. PDF Card Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ২. কার্ডের শিরোনাম (PDF Title)
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => onChange({ ...formData, title: e.target.value })}
                placeholder="যেমন: ৮ম শ্রেণি গণিত জ্যামিতি স্পেশাল হ্যান্ডনোট"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>

            {/* 3. Class & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">৩. শ্রেণি</label>
                <select
                  value={formData.classGrade}
                  onChange={(e) =>
                    onChange({ ...formData, classGrade: parseInt(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
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
                <label className="block font-bold text-slate-700 mb-1">৪. বিষয়</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => onChange({ ...formData, subject: e.target.value })}
                  placeholder="গণিত / বিজ্ঞান / ইংরেজি..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Subject Quick-Select Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400">দ্রুত বিষয় বাছাই:</span>
              {SUBJECT_PRESETS.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => onChange({ ...formData, subject: subj })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition border ${
                    formData.subject === subj
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {subj.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* 4. Paid vs Free & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">৫. শিটের ধরন</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...formData,
                        isFree: false,
                        price: Number(formData.price) <= 0 ? '50' : formData.price,
                      })
                    }
                    className={`py-2 rounded-lg text-xs font-black transition ${
                      !formData.isFree
                        ? 'bg-white text-brand-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    পেইড (৳ টাকা)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...formData, isFree: true, price: '0' })}
                    className={`py-2 rounded-lg text-xs font-black transition ${
                      formData.isFree
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    ফ্রি (Free)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ৬. নির্ধারিত মূল্য (টাকা)
                </label>
                <input
                  type="number"
                  min="0"
                  required={!formData.isFree}
                  disabled={Boolean(formData.isFree)}
                  value={formData.isFree ? '0' : formData.price}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      price: e.target.value,
                      isFree: Number(e.target.value) <= 0,
                    })
                  }
                  placeholder="50"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-black text-slate-800 focus:outline-none focus:border-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* 5. Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ৭. কার্ডের সংক্ষিপ্ত বিবরণ / সূচিপত্র
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => onChange({ ...formData, description: e.target.value })}
                placeholder="যেমন: বীজগণিতীয় রাশি, জ্যামিতির মৌলিক নিয়মাবলি ও ১০০% কমন উপযোগী সৃজনশীল সমাধান..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving || uploadingFile}
                className="flex-1 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-black py-3.5 px-6 rounded-2xl shadow-brand transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <FaClock className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : editingId ? (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span>কার্ডের পরিবর্তন সেভ করুন</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="w-4 h-4" />
                    <span>পিডিএফ কার্ড পাবলিশ করুন</span>
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-5 rounded-2xl transition"
                >
                  বাতিল
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Right: Live Card Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-8">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FaEye className="text-brand-600" /> লাইভ কার্ড প্রিভিউ (/pdfs পেইজে যেমন দেখাবে)
            </span>
          </div>

          <div className="pointer-events-none select-none">
            <PdfCard pdf={previewCard} onBuyClick={() => {}} />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            ফর্মে যা লিখবেন বা সেট করবেন, ঠিক সেটিই উপরের কার্ডে এবং <strong>/pdfs</strong> পেইজে প্রদর্শিত হবে।
          </p>
        </div>

      </div>

      {/* Bottom Section: Manage All Published PDF Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              প্রকাশিত সকল পিডিএফ কার্ড ম্যানেজমেন্ট ({pdfs.length}টি)
            </h3>
            <p className="text-xs text-slate-500">
              যেকোনো কার্ড এডিট করতে বা মুছে ফেলতে নিচের অ্যাকশন বাটন ব্যবহার করুন।
            </p>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterClass('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                filterClass === 'all'
                  ? 'bg-brand-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সব ({pdfs.length})
            </button>
            {[5, 6, 7, 8, 9, 10].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setFilterClass(cls.toString())}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                  filterClass === cls.toString()
                    ? 'bg-brand-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Class {cls}
              </button>
            ))}
          </div>
        </div>

        {loadingList ? (
          <div className="py-12 text-center space-y-2">
            <FaClock className="w-6 h-6 text-brand-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">পিডিএফ কার্ড তালিকা লোড হচ্ছে...</p>
          </div>
        ) : filteredPdfs.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <FaFilePdf className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">এখনও কোনো পিডিএফ কার্ড যুক্ত করা হয়নি</p>
            <p className="text-xs text-slate-500">
              উপরের ফর্ম থেকে পিডিএফ আপলোড করে প্রথম কার্ডটি পাবলিশ করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPdfs.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition ${
                  editingId === item.id
                    ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      <FaLayerGroup className="w-3 h-3" /> শ্রেণি {item.classGrade}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        item.isFree || item.price <= 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.isFree || item.price <= 0 ? 'ফ্রি শিট' : `৳${item.price}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-brand-600 block">
                      {item.subject}
                    </span>
                    <h4 className="text-sm font-black text-slate-800 leading-snug mt-0.5">
                      {item.title}
                    </h4>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition"
                    title="পিডিএফ ফাইল দেখুন"
                  >
                    <FaEye className="w-3.5 h-3.5 text-brand-600" />
                    <span>PDF দেখুন</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition"
                    >
                      <FaPenToSquare className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePdf(item.id, item.title)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition disabled:opacity-50"
                    >
                      <FaTrashCan className="w-3.5 h-3.5" />
                      <span>{deletingId === item.id ? '...' : 'ডিলিট'}</span>
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
