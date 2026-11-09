'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import PdfCard from '@/components/pdfs/PdfCard';
import PdfPurchaseModal from '@/components/pdfs/PdfPurchaseModal';
import { PdfItem } from '@/types';
import toast from 'react-hot-toast';
import {
  FaFilePdf,
  FaMagnifyingGlass,
  FaCircleCheck,
  FaClock,
  FaPlus,
  FaKey,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

export default function PdfsPage() {
  const { data: session } = useSession();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activePdf, setActivePdf] = useState<PdfItem | null>(null);
  const [quickTrxInput, setQuickTrxInput] = useState<string>('');
  const [checkingTrx, setCheckingTrx] = useState<boolean>(false);
  const prevStatusMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('sn_pdfs_cache_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPdfs(parsed);
          setLoading(false);
        }
      }
    } catch {}
    fetchPdfs();
  }, [session?.user?.id, session?.user?.email]);

  // Live Auto-Polling when any PDF is PENDING so the student's download unlocks dynamically as soon as Admin approves
  useEffect(() => {
    const hasPending = pdfs.some((p) => p.purchaseStatus === 'PENDING');
    if (!hasPending) return;

    const timer = setInterval(() => {
      fetchPdfs(true);
    }, 4000);

    return () => clearInterval(timer);
  }, [pdfs]);

  const fetchPdfs = async (isSilentPoll = false) => {
    try {
      let savedTrxParam = '';
      try {
        const savedTrx = JSON.parse(localStorage.getItem('sn_my_trx_ids') || '[]');
        if (Array.isArray(savedTrx) && savedTrx.length > 0) {
          savedTrxParam = `?trxIds=${encodeURIComponent(savedTrx.join(','))}`;
        }
      } catch {}

      const res = await fetch(`/api/pdfs${savedTrxParam}`, { cache: 'no-store' });
      const data = await res.json();

      if (data.pdfs && Array.isArray(data.pdfs)) {
        const formatted: PdfItem[] = data.pdfs.map((p: any) => {
          let resolvedStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'NONE';
          if (Array.isArray(p.purchases) && p.purchases.length > 0) {
            if (p.purchases.some((pur: any) => pur.status === 'APPROVED')) {
              resolvedStatus = 'APPROVED';
            } else if (p.purchases.some((pur: any) => pur.status === 'PENDING')) {
              resolvedStatus = 'PENDING';
            } else {
              resolvedStatus = p.purchases[0].status;
            }
          }

          // Detect live transition from PENDING -> APPROVED
          const prevStatus = prevStatusMapRef.current[p.id];
          if (isSilentPoll && prevStatus === 'PENDING' && resolvedStatus === 'APPROVED') {
            toast.success(
              `🎉 অভিনন্দন! "${p.title}" শিটের পেমেন্ট অনুমোদিত হয়েছে। এখনই ডাউনলোড করুন!`,
              { duration: 6000 }
            );
          }
          prevStatusMapRef.current[p.id] = resolvedStatus;

          return {
            id: p.id,
            title: p.title,
            description: p.description || '',
            classGrade: p.classGrade,
            subject: p.subject,
            price: p.price,
            fileUrl: p.fileUrl,
            isFree: Boolean(p.isFree) || Number(p.price) <= 0,
            purchaseStatus: resolvedStatus,
          };
        });

        setPdfs(formatted);
        try {
          sessionStorage.setItem('sn_pdfs_cache_v1', JSON.stringify(formatted));
        } catch {}
      } else {
        setPdfs([]);
      }
    } catch (err) {
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Allow any student to enter their TrxID to check status & dynamically unlock download
  const handleQuickTrxVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickTrxInput.trim().toUpperCase();
    if (!clean) return;

    setCheckingTrx(true);
    try {
      const res = await fetch(`/api/pdfs/purchase?trxId=${encodeURIComponent(clean)}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok || !data.purchase) {
        toast.error(data.error || 'এই TrxID দিয়ে কোনো পেমেন্ট পাওয়া যায়নি');
        return;
      }

      // Save TrxID in localStorage so card stays unlocked dynamically
      try {
        const prev = JSON.parse(localStorage.getItem('sn_my_trx_ids') || '[]');
        if (Array.isArray(prev) && !prev.includes(clean)) {
          localStorage.setItem('sn_my_trx_ids', JSON.stringify([...prev, clean]));
        }
      } catch {}

      await fetchPdfs();

      if (data.purchase.status === 'APPROVED') {
        toast.success(
          `পেমেন্ট সফল! "${data.purchase.pdf?.title || 'পিডিএফ শিট'}" এখন ডাউনলোডের জন্য প্রস্তুত।`
        );
        setQuickTrxInput('');
      } else if (data.purchase.status === 'PENDING') {
        toast('আপনার TrxID এখন অ্যাডমিন যাচাইয়ের অপেক্ষায় (Pending) রয়েছে। অনুমোদন হলেই ডাউনলোড চালু হবে।');
      } else {
        toast.error('এই TrxID পেমেন্ট রিকোয়েস্টটি বাতিল (Rejected) করা হয়েছে।');
      }
    } catch {
      toast.error('TrxID যাচাই করতে সমস্যা হয়েছে');
    } finally {
      setCheckingTrx(false);
    }
  };

  const openPurchaseModal = (pdf: PdfItem) => {
    setActivePdf(pdf);
    setModalOpen(true);
  };

  const handlePurchaseSuccess = (pdfId: string) => {
    prevStatusMapRef.current[pdfId] = 'PENDING';
    setPdfs((prev) =>
      prev.map((p) => (p.id === pdfId ? { ...p, purchaseStatus: 'PENDING' } : p))
    );
    fetchPdfs();
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
      
      {/* Top Banner: UCC Group Style Deep Academic Navy & Crimson Red */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden text-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-2xl space-y-6 border-b-4 border-[#C8102E]"
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

            {session?.user?.role === 'ADMIN' && (
              <div className="pt-2">
                <Link
                  href="/admin?tab=addPdf"
                  className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <FaPlus className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন প্যানেল থেকে পিডিএফ শিট আপলোড ও ম্যানেজ করুন</span>
                </Link>
              </div>
            )}
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
                  <p className="text-base font-black font-bn-normal text-white tracking-wider">০১৭১২৫৯২৫১৯</p>
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
                  <p className="text-base font-black font-bn-normal text-white tracking-wider">০১৭১২৫৯২৫১৯</p>
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
              সকল শ্রেণি ({pdfs.length})
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

        {/* Dynamic TrxID Lookup & Instant Download Unlocker Bar */}
        <form
          onSubmit={handleQuickTrxVerify}
          className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <FaKey className="w-3.5 h-3.5" />
            </span>
            <span>
              পেমেন্ট করেছেন? আপনার <strong className="text-slate-800">TrxID</strong> দিয়ে ডাউনলোড আনলক বা স্ট্যাটাস চেক করুন:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={quickTrxInput}
              onChange={(e) => setQuickTrxInput(e.target.value.toUpperCase())}
              placeholder="TrxID লিখুন (যেমন: 9J72AKL89Q)"
              className="flex-1 sm:w-56 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={checkingTrx || !quickTrxInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition whitespace-nowrap"
            >
              {checkingTrx ? 'চেক হচ্ছে...' : 'ডাউনলোড আনলক'}
            </button>
          </div>
        </form>

      </div>

      {/* PDF Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">হ্যান্ডনোট ও সাজেশন লোড হচ্ছে...</p>
        </div>
      ) : filteredPdfs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-2xl text-slate-400">
            <FaFilePdf className="w-7 h-7 text-rose-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">কোনো হ্যান্ডনোট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">
              {pdfs.length === 0
                ? 'অ্যাডমিন প্যানেল থেকে নতুন পিডিএফ শিট পাবলিশ করলে তা এখানে প্রদর্শিত হবে।'
                : 'অন্য কোনো শ্রেণি সিলেক্ট করুন অথবা সার্চ কি-ওয়ার্ড পরিবর্তন করুন।'}
            </p>
          </div>
          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin?tab=addPdf"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>নতুন পিডিএফ শিট যুক্ত করুন</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPdfs.map((pdf) => (
            <PdfCard
              key={pdf.id}
              pdf={pdf}
              onBuyClick={openPurchaseModal}
              onRefreshStatus={() => {
                fetchPdfs();
                toast.success('পেমেন্ট স্ট্যাটাস আপডেট করা হয়েছে!');
              }}
            />
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
