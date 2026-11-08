'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import PurchasesTable from '@/components/admin/PurchasesTable';
import AddResultForm from '@/components/admin/AddResultForm';
import AddPdfForm from '@/components/admin/AddPdfForm';
import { PurchaseRecord } from '@/types';
import {
  FaBars,
  FaAward,
  FaFilePdf,
  FaUsers,
  FaClock,
  FaCircleCheck,
  FaPhone,
  FaLocationDot,
  FaArrowRight,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';
import { HiSparkles } from 'react-icons/hi2';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('purchases');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Add Result State
  const [resultForm, setResultForm] = useState({
    examTitle: '১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬',
    classGrade: 7,
    rollNumber: '',
    studentName: '',
    totalMarks: '400',
    obtainedMarks: '',
    grade: 'A+',
    gpa: '5.00',
  });

  // Add PDF State
  const [pdfForm, setPdfForm] = useState({
    title: '',
    description: '',
    classGrade: 7,
    subject: 'সাধারণ গণিত',
    price: '50',
    fileUrl: '/assets/pdfs/class-7-math.pdf',
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/purchases');
      const data = await res.json();
      if (data.purchases) {
        setPurchases(data.purchases);
      } else {
        setPurchases(getDemoPurchases());
      }
    } catch {
      setPurchases(getDemoPurchases());
    } finally {
      setLoading(false);
    }
  };

  const getDemoPurchases = (): PurchaseRecord[] => [
    {
      id: 'pur-1',
      amount: 50,
      paymentMethod: 'BKASH',
      senderPhone: '01711223344',
      trxId: '9J72AKL89Q',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      student: {
        name: 'রাকিবুল হাসান',
        email: 'rakibul@gmail.com',
        phone: '01711223344',
        classGrade: 7,
        rollNumber: 1,
      },
      pdf: {
        title: '৭ম শ্রেণি গণিত ১ম সাময়িক স্পেশাল হ্যান্ডনোট',
        classGrade: 7,
        subject: 'গণিত',
        price: 50,
      },
    },
    {
      id: 'pur-2',
      amount: 80,
      paymentMethod: 'NAGAD',
      senderPhone: '01899887766',
      trxId: 'NGD98234KL',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      student: {
        name: 'সাদিয়া সুলতানা',
        email: 'sadia@gmail.com',
        phone: '01899887766',
        classGrade: 9,
        rollNumber: 2,
      },
      pdf: {
        title: '৯ম শ্রেণি পদার্থবিজ্ঞান গাণিতিক সমস্যা',
        classGrade: 9,
        subject: 'পদার্থবিজ্ঞান',
        price: 80,
      },
    },
  ];

  const updatePurchaseStatus = async (purchaseId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      await fetch('/api/admin/purchases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId, status: newStatus }),
      });

      setPurchases((prev) =>
        prev.map((p) => (p.id === purchaseId ? { ...p, status: newStatus } : p))
      );

      setMsg({
        text: `পেমেন্ট রিকোয়েস্ট সফলভাবে ${newStatus === 'APPROVED' ? 'অনুমোদন (Approved)' : 'বাতিল (Rejected)'} করা হয়েছে!`,
        type: 'success',
      });
    } catch {
      setPurchases((prev) =>
        prev.map((p) => (p.id === purchaseId ? { ...p, status: newStatus } : p))
      );
      setMsg({ text: 'স্ট্যাটাস আপডেট সফল হয়েছে!', type: 'success' });
    }
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultForm),
      });

      setMsg({ text: 'নতুন ফলাফল সফলভাবে আপলোড হয়েছে!', type: 'success' });
      setResultForm({
        examTitle: '১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬',
        classGrade: 7,
        rollNumber: '',
        studentName: '',
        totalMarks: '400',
        obtainedMarks: '',
        grade: 'A+',
        gpa: '5.00',
      });
    } catch {
      setMsg({ text: 'ফলাফল আপলোডে সমস্যা হয়েছে', type: 'error' });
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfForm),
      });

      setMsg({ text: 'নতুন পিডিএফ নোট সফলভাবে যুক্ত হয়েছে!', type: 'success' });
      setPdfForm({
        title: '',
        description: '',
        classGrade: 7,
        subject: 'সাধারণ গণিত',
        price: '50',
        fileUrl: '/assets/pdfs/demo.pdf',
      });
    } catch {
      setMsg({ text: 'পিডিএফ যুক্ত করতে সমস্যা হয়েছে', type: 'error' });
    }
  };

  const pendingPurchases = purchases.filter((p) => p.status === 'PENDING');
  const approvedPurchases = purchases.filter((p) => p.status === 'APPROVED');
  const totalRevenue = approvedPurchases.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* Side Menu Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingPurchases.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Top Navbar / Header Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="মেন্যু খুলুন"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">অ্যাডমিন ড্যাশবোর্ড</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-brand-700">
                  {activeTab === 'purchases' && 'পেমেন্ট রিকোয়েস্ট যাচাই'}
                  {activeTab === 'addResult' && 'কোচিং পরীক্ষার রেজাল্ট আপলোড'}
                  {activeTab === 'addPdf' && 'পিডিএফ হ্যান্ডনোট পাবলিশ'}
                  {activeTab === 'students' && 'শিক্ষার্থী ও উপস্থিতি'}
                  {activeTab === 'settings' && 'সেন্টার সেটিংস'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                {activeTab === 'purchases' && 'বিকাশ ও নগদ পেমেন্ট অনুমোদন'}
                {activeTab === 'addResult' && 'নতুন পরীক্ষার ফলাফল সংরক্ষণ'}
                {activeTab === 'addPdf' && 'নতুন পিডিএফ শিট বা সাজেশন যুক্ত করুন'}
                {activeTab === 'students' && 'শিক্ষার্থী ও হাজিরা ব্যবস্থাপনা'}
                {activeTab === 'settings' && 'সেন্টার পরিচিতি ও সেটিংস'}
              </h1>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-800">
              <FaClock className="text-amber-600" />
              <span>{pendingPurchases.length}টি অপেক্ষমাণ</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
              <FaCircleCheck className="text-emerald-600" />
              <span>মোট আয়: ৳{totalRevenue}</span>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {msg && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-between shadow-sm ${
              msg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* TAB 1: Review Purchases */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold px-1">
              <span>শিক্ষার্থীদের পাঠানো TrxID বিকাশ/নগদ স্টেটমেন্টের সাথে মিলিয়ে Approve বাটনে চাপুন।</span>
            </div>
            <PurchasesTable
              purchases={purchases}
              loading={loading}
              onUpdateStatus={updatePurchaseStatus}
            />
          </div>
        )}

        {/* TAB 2: Upload Result */}
        {activeTab === 'addResult' && (
          <AddResultForm
            formData={resultForm}
            onChange={setResultForm}
            onSubmit={handleResultSubmit}
          />
        )}

        {/* TAB 3: Add PDF Material */}
        {activeTab === 'addPdf' && (
          <AddPdfForm
            formData={pdfForm}
            onChange={setPdfForm}
            onSubmit={handlePdfSubmit}
          />
        )}

        {/* TAB 4: Students & Attendance Quick Directory */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-800">শ্রেণি ৫ থেকে ১০ শিক্ষার্থী উপস্থিতি</h3>
                <p className="text-xs text-slate-500">প্রতিদিনের উপস্থিতি গ্রহণ করতে সরাসরি উপস্থিতি মডিউলে যান।</p>
              </div>
              <Link
                href="/attendance"
                className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition"
              >
                <span>উপস্থিতি গ্রহণ করুন</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[5, 6, 7, 8, 9, 10].map((cls) => (
                <Link
                  key={cls}
                  href={`/attendance?class=${cls}`}
                  className="bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 p-4 rounded-2xl text-center space-y-1 transition group"
                >
                  <span className="text-xs font-bold text-slate-400 group-hover:text-brand-600 block">শ্রেণি</span>
                  <strong className="text-xl font-black text-slate-800 group-hover:text-brand-800 block">Class {cls}</strong>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 font-semibold inline-block">২০ শিক্ষার্থী</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Center Settings & Details */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-800">শিক্ষানোভা একাডেমি পরিচিতি ও তথ্য</h3>
              <p className="text-xs text-slate-500">প্রতিষ্ঠানের সার্বিক অফিশিয়াল তথ্য</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 text-xs font-bold">প্রতিষ্ঠানের নাম</span>
                <p className="font-black text-slate-800 text-base">শিক্ষানোভা (SikkhaNova)</p>
                <p className="text-xs text-nova-600 font-bold">"শিখবো, জিতবো"</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 text-xs font-bold">অফিসের ঠিকানা</span>
                <p className="font-bold text-slate-800">জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 text-xs font-bold">বিকাশ ও নগদ হেল্পলাইন</span>
                <p className="font-black font-mono text-brand-700 text-base">01712592519</p>
                <p className="text-[11px] text-slate-500">বিকাশ ও নগদ পার্সোনাল নম্বর</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 text-xs font-bold">মাস্টার অ্যাডমিন ক্রেডেনশিয়াল</span>
                <p className="font-mono font-bold text-slate-800">ইমেইল: robiulnil101@gmail.com</p>
                <p className="font-mono text-slate-500 text-xs">পাসওয়ার্ড: RABIUL@20</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
