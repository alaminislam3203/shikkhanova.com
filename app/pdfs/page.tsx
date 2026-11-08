'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PdfCard from '@/components/pdfs/PdfCard';
import PdfPurchaseModal from '@/components/pdfs/PdfPurchaseModal';
import { PdfItem } from '@/types';

export default function PdfsPage() {
  const { data: session } = useSession();
  const [selectedClass, setSelectedClass] = useState<string>('all');
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
      description: 'বীজগণিতীয় রাশি, জ্যামিতির বেসিক ও অধ্যায়ভিত্তিক সৃজনশীল সমাধান।',
      classGrade: 7,
      subject: 'গণিত (Mathematics)',
      price: 50,
      fileUrl: '/assets/pdfs/class-7-math-special.pdf',
    },
    {
      id: 'pdf-2',
      title: '৮ম শ্রেণি সাধারণ বিজ্ঞান ফাইনাল মডেল টেস্ট ও সাজেশন',
      description: 'পদার্থের প্রকৃতি, জীব ও পরিবেশ অধ্যায়ের ১০০% কমন উপযোগী প্রশ্নাবলি।',
      classGrade: 8,
      subject: 'বিজ্ঞান (Science)',
      price: 60,
      fileUrl: '/assets/pdfs/class-8-science.pdf',
    },
    {
      id: 'pdf-3',
      title: '৯ম-১০ম শ্রেণি পদার্থবিজ্ঞান গাণিতিক সমস্যার সহজ সমাধান',
      description: 'গতি ও বল অধ্যায়ের সকল গাণিতিক সূত্র ও শর্টকাট টেকনিক।',
      classGrade: 9,
      subject: 'পদার্থবিজ্ঞান (Physics)',
      price: 80,
      fileUrl: '/assets/pdfs/class-9-physics.pdf',
    },
    {
      id: 'pdf-4',
      title: '১০ম শ্রেণি এসএসসি ইংরেজি ২য় পত্র গ্রামার শর্ট সাজেশন',
      description: 'Right form of verbs, Tag questions, ও প্যাসেজ ন্যারেশন শর্টকাট।',
      classGrade: 10,
      subject: 'ইংরেজি (English)',
      price: 100,
      fileUrl: '/assets/pdfs/class-10-english.pdf',
    },
    {
      id: 'pdf-5',
      title: '৫ম শ্রেণি প্রাথমিক গণিত ভগ্নাংশ ও দশমিক বেসিক নোট',
      description: 'সহজ ভাষায় ব্যাখ্যাসহ প্রাথমিক শিক্ষার্থীদের জন্য অনুশীলন শিট।',
      classGrade: 5,
      subject: 'গণিত (Mathematics)',
      price: 40,
      fileUrl: '/assets/pdfs/class-5-math.pdf',
    },
    {
      id: 'pdf-6',
      title: '৬ষ্ঠ শ্রেণি তথ্য ও যোগাযোগ প্রযুক্তি (ICT) সম্পূর্ণ শিট',
      description: 'আইসিটি ১ম থেকে ৫ম অধ্যায়ের সংক্ষিপ্ত ও বর্ণনামূলক প্রশ্নোত্তর।',
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

  const filteredPdfs = pdfs.filter((p) =>
    selectedClass === 'all' ? true : p.classGrade.toString() === selectedClass
  );

  return (
    <div className="space-y-8">
      {/* Top Banner: How to Buy PDFs */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl space-y-4 border border-brand-700/60">
        <div className="flex items-center gap-2">
          <span className="bg-nova-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ম্যানুয়াল TrxID পেমেন্ট সিস্টেম
          </span>
          <span className="text-xs text-blue-200">ক্লাস ৫ থেকে ১০ম শ্রেণি</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black">
          পিডিএফ হ্যান্ডনোট ও সাজেশন সংগ্রহ
        </h1>

        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          যেকোনো বিষয়ের প্রিমিয়াম নোট ডাউনলোড করতে আমাদের বিকাশ বা নগদ নম্বরে সেন্ড মানি করুন। এরপর "TrxID দিন" বাটনে চাপ দিয়ে ট্রানজ্যাকশন আইডি ও ফোন নম্বর সাবমিট করুন। অ্যাডমিন অনুমোদন দিলেই ডাউনলোড বাটন সক্রিয় হবে।
        </p>

        {/* Quick Payment Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-bkash text-white font-black text-xs flex items-center justify-center">বিকাশ</span>
              <div>
                <p className="text-[11px] text-slate-300 font-bold">bKash Personal</p>
                <p className="text-sm font-black font-mono">01712592519</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Send Money</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-nagad text-white font-black text-xs flex items-center justify-center">নগদ</span>
              <div>
                <p className="text-[11px] text-slate-300 font-bold">Nagad Personal</p>
                <p className="text-sm font-black font-mono">01712592519</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Send Money</span>
          </div>
        </div>
      </div>

      {/* Class Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">শ্রেণি ফিল্টার:</span>
        <button
          onClick={() => setSelectedClass('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedClass === 'all'
              ? 'bg-brand-700 text-white shadow-brand'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সব ক্লাস (5-10)
        </button>
        {[5, 6, 7, 8, 9, 10].map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls.toString())}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedClass === cls.toString()
                ? 'bg-brand-700 text-white shadow-brand'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Class {cls}
          </button>
        ))}
      </div>

      {/* PDF Cards Grid - Modular Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPdfs.map((pdf) => (
          <PdfCard key={pdf.id} pdf={pdf} onBuyClick={openPurchaseModal} />
        ))}
      </div>

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
