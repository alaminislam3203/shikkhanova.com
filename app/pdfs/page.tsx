'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PdfCard from '@/components/pdfs/PdfCard';
import PdfPurchaseModal from '@/components/pdfs/PdfPurchaseModal';
import { PdfItem } from '@/types';
import {
  FaFilePdf,
  FaMagnifyingGlass,
  FaPhone,
  FaCircleCheck,
  FaShieldHalved,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function PdfsPage() {
  const { data: session } = useSession();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activePdf, setActivePdf] = useState<PdfItem | null>(null);

  useEffect(() => {
    fetchPdfs();
  }, [selectedClass]);

  const fetchPdfs = async () => {
    try {
      const url = selectedClass === 'all' ? '/api/pdfs' : `/api/pdfs?classGrade=${selectedClass}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.pdfs && data.pdfs.length > 0) {
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
            purchaseStatus:
              p.purchases && p.purchases.length > 0
                ? p.purchases[0].status
                : 'NONE',
          }))
        );
      } else {
        setPdfs(getDefaultPdfs());
      }
    } catch {
      setPdfs(getDefaultPdfs());
    }
  };

  const getDefaultPdfs = (): PdfItem[] => [
    {
      id: 'pdf-1',
      title: '৭ম শ্রেণি গণিত ১ম সাময়িক স্পেশাল হ্যান্ডনোট ও সূত্রাবলি',
      description: 'বীজগণিতীয় রাশি, জ্যামিতির মৌলিক নিয়মাবলি ও ১০০% কমন উপযোগী অধ্যায়ভিত্তিক সৃজনশীল সমাধান।',
      classGrade: 7,
      subject: 'গণিত (Mathematics)',
      price: 50,
      fileUrl: '/assets/pdfs/class-7-math-special.pdf',
    },
    {
      id: 'pdf-2',
      title: '৮ম শ্রেণি সাধারণ বিজ্ঞান ফাইনাল মডেল টেস্ট ও সাজেশন',
      description: 'পদার্থের প্রকৃতি, জীব ও পরিবেশ অধ্যায়ের পূর্ণাঙ্গ ব্যাখ্যাসহ ১০০% কমন উপযোগী প্রশ্নব্যাংক।',
      classGrade: 8,
      subject: 'বিজ্ঞান (Science)',
      price: 60,
      fileUrl: '/assets/pdfs/class-8-science.pdf',
    },
    {
      id: 'pdf-3',
      title: '৯ম-১০ম শ্রেণি পদার্থবিজ্ঞান গাণিতিক সমস্যার সহজ সমাধান',
      description: 'গতি ও বল অধ্যায়ের সকল গাণিতিক সূত্র, মাত্রা ও শর্টকাট টেকনিকসহ শতভাগ কমন হ্যান্ডনোট।',
      classGrade: 9,
      subject: 'পদার্থবিজ্ঞান (Physics)',
      price: 80,
      fileUrl: '/assets/pdfs/class-9-physics.pdf',
    },
    {
      id: 'pdf-4',
      title: '১০ম শ্রেণি এসএসসি ইংরেজি ২য় পত্র গ্রামার শর্ট সাজেশন',
      description: 'Right form of verbs, Tag questions, Completing sentences ও প্যাসেজ ন্যারেশন সহজ নিয়মাবলি।',
      classGrade: 10,
      subject: 'ইংরেজি (English)',
      price: 100,
      fileUrl: '/assets/pdfs/class-10-english.pdf',
    },
    {
      id: 'pdf-5',
      title: '৫ম শ্রেণি প্রাথমিক গণিত ভগ্নাংশ ও দশমিক বেসিক নোট',
      description: 'সহজ ভাষায় ব্যাখ্যাসহ প্রাথমিক সমাপনী প্রস্তুতির জন্য রঙিন ও আকর্ষণীয় অনুশীলন শিট।',
      classGrade: 5,
      subject: 'গণিত (Mathematics)',
      price: 40,
      fileUrl: '/assets/pdfs/class-5-math.pdf',
    },
    {
      id: 'pdf-6',
      title: '৬ষ্ঠ শ্রেণি তথ্য ও যোগাযোগ প্রযুক্তি (ICT) সম্পূর্ণ শিট',
      description: 'আইসিটি ১ম থেকে ৫ম অধ্যায়ের সকল গুরুত্বপূর্ণ সংক্ষিপ্ত ও বর্ণনামূলক প্রশ্নোত্তর।',
      classGrade: 6,
      subject: 'আইসিটি (ICT)',
      price: 40,
      fileUrl: '/assets/pdfs/class-6-ict.pdf',
    },
  ];

  const openPurchaseModal = (pdf: PdfItem) => {
    setActivePdf(pdf);
    setModalOpen(true);
  };

  const handlePurchaseSuccess = (pdfId: string) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === pdfId ? { ...p, purchaseStatus: 'PENDING' } : p))
    );
  };

  const filteredPdfs = pdfs.filter((p) => {
    const matchesClass = selectedClass === 'all' || p.classGrade.toString() === selectedClass;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Dark Navy Gradient with High Contrast White & Gold Text */}
      <div
        style={{
          background: 'linear-gradient(135deg, #020D24 0%, #082C6D 50%, #001A4D 100%)',
        }}
        className="relative overflow-hidden text-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-2xl space-y-6 border border-blue-900/60"
      >
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left: Heading & Description */}
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-nova-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <HiSparkles /> প্রিমিয়াম হ্যান্ডনোট শপ
              </span>
              <span className="text-xs text-blue-200 font-semibold bg-white/10 px-3 py-0.5 rounded-full border border-white/10">
                ৫ম থেকে ১০ম শ্রেণি • জুম্মাপাড়া, নীলফামারী সদর
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              স্মার্ট হ্যান্ডনোট ও <span className="text-nova-400">এক্সক্লুসিভ সাজেশন</span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
              আমাদের অভিজ্ঞ শিক্ষকদের প্রস্তুতকৃত অধ্যায়ভিত্তিক রঙিন নোট। যেকোনো শিট নিতে নির্ধারিত ফি বিকাশ বা নগদ নম্বরে সেন্ড মানি করে TrxID সাবমিট করলেই ডাউনলোড আনলক হয়ে যাবে।
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-blue-200 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-400" /> ১০০% কমন নিশ্চয়তা
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-400" /> স্পষ্ট A4 প্রিন্টযোগ্য PDF
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-400" /> ম্যানুয়াল বিকাশ/নগদ ভেরিফিকেশন
              </span>
            </div>
          </div>

          {/* Right: Payment Quick Numbers */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between gap-5 shadow-xl hover:bg-white/15 transition">
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
                  <img src="/assets/images/bkash.png" alt="bKash" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">বিকাশ পার্সোনাল</p>
                  <p className="text-base font-black font-mono text-white tracking-wider">01712592519</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-400/30">
                Send Money
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between gap-5 shadow-xl hover:bg-white/15 transition">
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
                  <img src="/assets/images/nagad.png" alt="Nagad" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">নগদ পার্সোনাল</p>
                  <p className="text-base font-black font-mono text-white tracking-wider">01712592519</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-400/30">
                Send Money
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          
          {/* Class Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 hidden lg:inline mr-1">শ্রেণি:</span>
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedClass === 'all'
                  ? 'bg-brand-700 text-white shadow-brand'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সকল শ্রেণি
            </button>
            {[5, 6, 7, 8, 9, 10].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls.toString())}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedClass === cls.toString()
                    ? 'bg-brand-700 text-white shadow-brand'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Class {cls}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:w-72">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোট বা বিষয় খুঁজুন..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

        </div>

      </div>

      {/* PDF Cards Grid */}
      {filteredPdfs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-2xl text-slate-400">
            📄
          </div>
          <h3 className="text-base font-bold text-slate-800">কোনো হ্যান্ডনোট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500">
            অন্য কোনো শ্রেণি সিলেক্ট করুন অথবা সার্চ কি-ওয়ার্ড পরিবর্তন করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPdfs.map((pdf) => (
            <PdfCard key={pdf.id} pdf={pdf} onBuyClick={openPurchaseModal} />
          ))}
        </div>
      )}

      {/* Modular Purchase Modal */}
      {activePdf && (
        <PdfPurchaseModal
          pdf={activePdf}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handlePurchaseSuccess}
          userPhone={session?.user?.phone || ''}
          userName={session?.user?.name || ''}
          userEmail={session?.user?.email || ''}
        />
      )}
    </div>
  );
}
