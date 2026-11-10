'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaFilePdf,
  FaDownload,
  FaClock,
  FaCheck,
  FaArrowRight,
  FaPlus,
  FaShieldHalved,
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

interface StudentPurchase {
  id: string;
  amount: number;
  paymentMethod: string;
  trxId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  pdf: {
    id: string;
    title: string;
    classGrade: number;
    subject: string;
    fileUrl: string;
  };
}

export default function MyNotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<StudentPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserPurchases();
    }
  }, [session]);

  const fetchUserPurchases = async () => {
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
      if (data.pdfs) {
        const userList: StudentPurchase[] = [];
        data.pdfs.forEach((p: any) => {
          if (p.purchases && p.purchases.length > 0) {
            p.purchases.forEach((pur: any) => {
              userList.push({
                id: pur.id,
                amount: pur.amount,
                paymentMethod: pur.paymentMethod,
                trxId: pur.trxId,
                status: pur.status,
                createdAt: pur.createdAt,
                pdf: {
                  id: p.id,
                  title: p.title,
                  classGrade: p.classGrade,
                  subject: p.subject,
                  fileUrl: p.fileUrl,
                },
              });
            });
          }
        });
        setPurchases(userList);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="py-24 text-center text-slate-500 font-bold space-y-2">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm">হ্যান্ডনোট তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-premium border-b-4 border-[#C8102E] relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-200 border border-white/10">
              <FaFilePdf className="text-rose-400" /> আমার সংগ্রহশালা
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              সংগৃহীত পিডিএফ হ্যান্ডনোট ও শিট
            </h1>
            <p className="text-xs text-blue-100 max-w-lg">
              বিকাশ ও নগদ পেমেন্টে সংগৃহীত আপনার সকল হ্যান্ডনোট, লেকচার শিট ও অনুমোদিত ডাউনলোডের তালিকা।
            </p>
          </div>

          <Link
            href="/pdfs"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C8102E] to-[#9B0D23] hover:from-[#A50D26] hover:to-[#800A1C] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition active:scale-98 shrink-0"
          >
            <FaPlus className="w-3 h-3" />
            <span>নতুন শিট কিনুন</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <span>সংগৃহীত শিটের তালিকা</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              মোট: {purchases.length}টি
            </span>
          </h2>

          <Link
            href="/pdfs"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
          >
            পিডিএফ শপে যান →
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs space-y-2">
            <FaClock className="w-6 h-6 animate-spin mx-auto text-brand-600" />
            <p>আপনার সংগৃহীত হ্যান্ডনোট লোড হচ্ছে...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-slate-200/80">
              <FaFilePdf className="w-8 h-8 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                আপনি এখনও কোনো পিডিএফ শিট ক্রয় করেননি
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ৫ম থেকে ১০ম শ্রেণির গণিত, বিজ্ঞান, ইংরেজি ও অন্যান্য বিষয়ের ১০০% কমন উপযোগী এক্সক্লুসিভ হ্যান্ডনোট পেতে আমাদের পিডিএফ শপ ভিজিট করুন।
              </p>
            </div>
            <div>
              <Link
                href="/pdfs"
                className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition active:scale-98"
              >
                <HiSparkles />
                <span>পিডিএফ শপ দেখুন</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {purchases.map((pur) => (
              <div
                key={pur.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200/60">
                      Class {pur.pdf.classGrade} • {pur.pdf.subject}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        pur.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : pur.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {pur.status === 'APPROVED'
                        ? 'অনুমোদিত'
                        : pur.status === 'REJECTED'
                        ? 'বাতিল'
                        : 'যাচাই চলছে'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                    {pur.pdf.title}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-1 font-mono pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-sans text-slate-500">পেমেন্ট মাধ্যম:</span>
                      <div className="bg-white px-2 py-0.5 rounded border border-slate-200 inline-flex items-center shadow-xs">
                        <img
                          src={pur.paymentMethod === 'BKASH' ? '/assets/images/bkash.png' : '/assets/images/nagad.png'}
                          alt={pur.paymentMethod}
                          className="h-3.5 w-auto object-contain"
                        />
                      </div>
                      <span className="font-bold text-slate-800">৳{pur.amount}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">TrxID: {pur.trxId}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {pur.status === 'APPROVED' ? (
                    <a
                      href={`/api/pdfs/download?pdfId=${encodeURIComponent(pur.pdf.id)}&trxIds=${encodeURIComponent(pur.trxId)}`}
                      download={`${pur.pdf.title}.pdf`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition active:scale-98"
                    >
                      <FaDownload className="w-3.5 h-3.5" />
                      <span>ডাউনলোড করুন (PDF)</span>
                    </a>
                  ) : (
                    <div className="w-full text-center py-2 px-3 bg-slate-50 text-slate-500 text-xs font-semibold rounded-xl border border-slate-200/60">
                      পেমেন্ট যাচাইয়ের পর ডাউনলোড লিংক সক্রিয় হবে
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
