'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PdfCard from '@/components/pdfs/PdfCard';
import PdfPurchaseModal from '@/components/pdfs/PdfPurchaseModal';
import { PdfItem } from '@/types';
import toast from 'react-hot-toast';
import { toBengaliClass } from '@/lib/defaultQuizData';
import {
  FaFilePdf,
  FaMagnifyingGlass,
  FaClock,
  FaPlus,
  FaKey,
} from 'react-icons/fa6';

export default function PdfsPage() {
  const { data: session } = useSession();
  const router = useRouter();
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
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cls = params.get('classGrade');
      if (cls && ['5', '6', '7', '8', '9', '10'].includes(cls)) {
        setSelectedClass(cls);
      }
    }
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

  // Allow logged-in student to enter their TrxID to check status
  const handleQuickTrxVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('TrxID যাচাই করতে অনুগ্রহ করে আগে লগইন করুন');
      router.push('/login?callbackUrl=/pdfs');
      return;
    }
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
    if (!session?.user) {
      toast.error('পিডিএফ শিট সংগ্রহ করতে অনুগ্রহ করে আগে লগইন করুন');
      router.push('/login?callbackUrl=/pdfs');
      return;
    }
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
    <div className="space-y-5 sm:space-y-8">
      {/* Login Required Notice Banner */}
      {!session?.user && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F2C59] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FaFilePdf className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                পিডিএফ হ্যান্ডনোট ডাউনলোড বা সংগ্রহ করতে লগইন আবশ্যক
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                ফ্রি ও পেইড সকল পিডিএফ শিট পেতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
              </p>
            </div>
          </div>
          <Link
            href="/login?callbackUrl=/pdfs"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-black rounded-xl shadow-md transition transform active:scale-95 text-center shrink-0"
          >
            লগইন করুন
          </Link>
        </div>
      )}

      {/* Top Banner: pdf-page-banner.png */}
      <div className="space-y-3">
        {session?.user?.role === 'ADMIN' && (
          <div className="flex justify-end">
            <Link
              href="/admin?tab=addPdf"
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-md transition transform hover:-translate-y-0.5"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>পিডিএফ শিট আপলোড ও ম্যানেজ করুন</span>
            </Link>
          </div>
        )}

        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
          <a
            href="tel:01712592519"
            aria-label="বিকাশ, নগদ, রকেট বা উপায় নম্বরে ফি পাঠাতে কল করুন ০১৭১২৫৯২৫১৯"
            className="block w-full group"
          >
            <img
              src="/banners/pdf-page-banner.png"
              alt="৫ম থেকে ১০ম শ্রেণির স্মার্ট হ্যান্ডনোট ও এক্সক্লুসিভ সাজেশন • বিকাশ, নগদ, রকেট, উপায়: 01712592519"
              className="w-full h-auto object-cover group-hover:scale-[1.005] transition-transform duration-300"
            />
          </a>
        </div>

        {/* Accepted MFS Payment Methods Strip */}
        <div className="bg-gradient-to-r from-[#07172C] via-[#0F2C59] to-[#07172C] text-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-md border border-slate-700/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 hidden sm:inline-block animate-pulse"></span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center justify-center sm:justify-start gap-1.5">
                <span>হ্যান্ডনোট ও সাজেশন পেমেন্ট মাধ্যম</span>
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">
                সেন্ড মানি করার পার্সোনাল নম্বর: <strong className="text-amber-300 font-mono font-black text-xs sm:text-sm">01712592519</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="h-8 sm:h-9 px-2.5 bg-white rounded-xl flex items-center justify-center shadow-xs border border-white/80" title="bKash">
              <img src="/assets/images/bkash.png" alt="bKash" className="h-5 sm:h-6 w-auto object-contain" />
            </div>
            <div className="h-8 sm:h-9 px-2.5 bg-white rounded-xl flex items-center justify-center shadow-xs border border-white/80" title="Nagad">
              <img src="/assets/images/nagad.png" alt="Nagad" className="h-5 sm:h-6 w-auto object-contain" />
            </div>
            <div className="h-8 sm:h-9 px-2.5 bg-white rounded-xl flex items-center justify-center shadow-xs border border-white/80" title="Rocket">
              <img src="/assets/images/rocket.png" alt="Rocket" className="h-5 sm:h-6 w-auto object-contain" />
            </div>
            <div className="h-8 sm:h-9 px-2.5 bg-white rounded-xl flex items-center justify-center shadow-xs border border-white/80" title="Upay">
              <img src="/assets/images/upay.png" alt="Upay" className="h-5 sm:h-6 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          
          {/* Class Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 hidden lg:inline mr-1">শ্রেণি:</span>
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedClass === 'all'
                  ? 'bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] text-white shadow-md'
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
                    ? 'bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {toBengaliClass(cls)} শ্রেণি
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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
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
