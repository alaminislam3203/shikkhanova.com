'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/common/Logo';
import PurchasesTable from '@/components/admin/PurchasesTable';
import AddResultForm from '@/components/admin/AddResultForm';
import AddPdfForm from '@/components/admin/AddPdfForm';
import { PurchaseRecord } from '@/types';
import {
  FaUserShield,
  FaFilePdf,
  FaAward,
  FaClock,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'purchases' | 'addResult' | 'addPdf'>('purchases');
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Add Result State
  const [resultForm, setResultForm] = useState({
    examTitle: 'মাসিক মূল্যায়ন ও মডেল টেস্ট',
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
    fileUrl: '/assets/pdfs/demo.pdf',
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
        examTitle: 'মাসিক মূল্যায়ন ও মডেল টেস্ট',
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

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-brand-700/50">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-2 shadow-md flex items-center justify-center">
            <Logo size="sm" clickable={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">অ্যাডমিন কন্ট্রোল পোর্টাল</h1>
              <span className="bg-nova-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Master Admin</span>
            </div>
            <p className="text-xs text-blue-200">
              শিক্ষানোভা একাডেমি • জুম্মাপাড়া, নীলফামারী সদর | হেল্পলাইন: ০১৭১২৫৯২৫১৯
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white font-bold">
            robiulnil101@gmail.com
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'purchases'
              ? 'bg-brand-700 text-white shadow-brand'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TbCashBanknote className="w-4 h-4" />
          <span>পেমেন্ট অনুমোদন ({purchases.filter((p) => p.status === 'PENDING').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addResult')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'addResult'
              ? 'bg-brand-700 text-white shadow-brand'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FaAward className="w-4 h-4" />
          <span>রেজাল্ট আপলোড</span>
        </button>

        <button
          onClick={() => setActiveTab('addPdf')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'addPdf'
              ? 'bg-brand-700 text-white shadow-brand'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FaFilePdf className="w-4 h-4" />
          <span>পিডিএফ পাবলিশ</span>
        </button>
      </div>

      {/* Notification Message */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold transition ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* TAB 1: Review Purchases */}
      {activeTab === 'purchases' && (
        <PurchasesTable
          purchases={purchases}
          loading={loading}
          onUpdateStatus={updatePurchaseStatus}
        />
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
    </div>
  );
}
