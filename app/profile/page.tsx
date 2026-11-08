'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaUser,
  FaGraduationCap,
  FaFilePdf,
  FaDownload,
  FaClock,
  FaAward,
  FaPhone,
  FaEnvelope,
  FaHashtag,
  FaBookOpen,
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

export default function ProfilePage() {
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
      const res = await fetch('/api/pdfs');
      const data = await res.json();
      if (data.pdfs) {
        // Collect user purchases
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
      // Mock purchases if offline
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="py-20 text-center text-slate-500 font-bold">
        তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-premium border border-brand-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-nova-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-nova-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg border-2 border-white/20">
              {session.user.name ? session.user.name.charAt(0) : '🎓'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{session.user.name}</h1>
                <span className="bg-nova-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {session.user.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200">
                শিক্ষানোভা একাডেমি • জুম্মাপাড়া, নীলফামারী সদর
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                {session.user.classGrade && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-md font-bold">
                    <FaGraduationCap className="text-nova-400" /> শ্রেণি {session.user.classGrade}
                  </span>
                )}
                {session.user.rollNumber && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-md font-bold">
                    <FaHashtag className="text-nova-400" /> রোল {session.user.rollNumber}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
                  <FaEnvelope className="text-nova-400" /> {session.user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition border border-white/15"
            >
              <FaAward /> ফলাফল দেখুন
            </Link>
            <Link
              href="/attendance"
              className="inline-flex items-center gap-1.5 bg-nova-500 hover:bg-nova-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition"
            >
              <FaClock /> হাজিরা দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* Purchased PDFs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
              <FaFilePdf className="text-slogan-600" /> আমার সংগৃহীত পিডিএফ হ্যান্ডনোট
            </h2>
            <p className="text-xs text-slate-500">
              বিকাশ ও নগদ পেমেন্টের মাধ্যমে সংগৃহীত শিট ও ডাউনলোডের বর্তমান অবস্থা
            </p>
          </div>

          <Link
            href="/pdfs"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl border border-brand-200 transition"
          >
            + নতুন শিট নিন
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
            হ্যান্ডনোট তালিকা লোড হচ্ছে...
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-xl text-slate-400">
              📚
            </div>
            <p className="text-sm font-bold text-slate-700">আপনি এখনও কোনো পিডিএফ শিট ক্রয় করেননি</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ৫ম থেকে ১০ম শ্রেণির গণিত, বিজ্ঞান ও ইংরেজির এক্সক্লুসিভ সাজেশন পেতে আমাদের পিডিএফ শপে যান।
            </p>
            <Link
              href="/pdfs"
              className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
            >
              পিডিএফ তালিকা দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchases.map((pur) => (
              <div
                key={pur.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      Class {pur.pdf.classGrade} • {pur.pdf.subject}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        pur.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pur.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pur.status === 'APPROVED'
                        ? 'অনুমোদিত'
                        : pur.status === 'REJECTED'
                        ? 'বাতিল'
                        : 'যাচাই চলছে'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm leading-snug">
                    {pur.pdf.title}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-0.5 font-mono">
                    <div>পেমেন্ট: {pur.paymentMethod} • ৳{pur.amount}</div>
                    <div className="text-[11px] text-slate-400">TrxID: {pur.trxId}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {pur.status === 'APPROVED' ? (
                    <a
                      href={pur.pdf.fileUrl}
                      download
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition"
                    >
                      <FaDownload className="w-3.5 h-3.5" /> ডাউনলোড করুন
                    </a>
                  ) : (
                    <div className="w-full text-center py-2 bg-slate-50 text-slate-500 text-xs font-semibold rounded-xl">
                      অ্যাডমিন অনুমোদনের পর ডাউনলোড লিংক সক্রিয় হবে
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

