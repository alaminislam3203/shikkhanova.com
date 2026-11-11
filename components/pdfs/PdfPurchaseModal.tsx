'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaXmark } from 'react-icons/fa6';
import { PdfItem } from '@/types';
import toast from 'react-hot-toast';
import { toBengaliClass } from '@/lib/defaultQuizData';

interface PdfPurchaseModalProps {
  pdf: PdfItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pdfId: string, trxId?: string) => void;
  userPhone?: string;
  userName?: string;
  userEmail?: string;
}

export default function PdfPurchaseModal({
  pdf,
  isOpen,
  onClose,
  onSuccess,
  userPhone = '',
  userName = '',
  userEmail = '',
}: PdfPurchaseModalProps) {
  const { data: session } = useSession();
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET' | 'UPAY'>('BKASH');
  const [senderPhone, setSenderPhone] = useState<string>(userPhone || session?.user?.phone || '');
  const [trxId, setTrxId] = useState<string>('');
  const [name, setName] = useState<string>(userName || session?.user?.name || '');
  const [email, setEmail] = useState<string>(userEmail || session?.user?.email || '');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('পিডিএফ ক্রয় করতে অনুগ্রহ করে আগে লগইন করুন');
      onClose();
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/pdfs/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfId: pdf.id,
          paymentMethod,
          senderPhone,
          trxId,
          amount: pdf.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'পেমেন্ট সাবমিট করতে সমস্যা হয়েছে');
      }

      const savedTrx = (data.trxId || trxId).trim().toUpperCase();
      try {
        const prev = JSON.parse(localStorage.getItem('sn_my_trx_ids') || '[]');
        if (Array.isArray(prev) && !prev.includes(savedTrx)) {
          localStorage.setItem('sn_my_trx_ids', JSON.stringify([...prev, savedTrx]));
        }
      } catch {}

      setSuccessMsg('আপনার TrxID সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করার পর ডাউনলোড অপশন সক্রিয় হবে।');
      toast.success(`TrxID (${savedTrx}) জমা হয়েছে! অ্যাডমিন অনুমোদন করলেই ডাউনলোড বাটন সক্রিয় হবে।`);
      onSuccess(pdf.id, savedTrx);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      const message = err.message || 'সমস্যা হয়েছে';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <FaXmark className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-nova-600 bg-nova-50 px-2 py-0.5 rounded-md">
            {toBengaliClass(pdf.classGrade)} শ্রেণি • {pdf.subject}
          </span>
          <h3 className="text-lg font-black text-slate-800">
            {pdf.title}
          </h3>
          <p className="text-xs text-slate-500">
            নির্ধারিত ফি: <strong className="text-brand-700 text-sm font-black">৳{pdf.price}</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পেমেন্ট মাধ্যম বেছে নিন
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-2.5 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'BKASH'
                    ? 'border-[#E2136E] bg-pink-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-12 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <img src="/assets/images/bkash.png" alt="bKash" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">bKash</p>
                  <p className="text-[10px] text-slate-500 font-medium">Personal</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-2.5 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'NAGAD'
                    ? 'border-[#F7941D] bg-orange-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-12 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <img src="/assets/images/nagad.png" alt="Nagad" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Nagad</p>
                  <p className="text-[10px] text-slate-500 font-medium">Personal</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ROCKET')}
                className={`p-2.5 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'ROCKET'
                    ? 'border-[#8C3494] bg-purple-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-12 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <img src="/assets/images/rocket.png" alt="Rocket" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Rocket</p>
                  <p className="text-[10px] text-slate-500 font-medium">Personal</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPAY')}
                className={`p-2.5 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'UPAY'
                    ? 'border-[#0081C9] bg-sky-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-12 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <img src="/assets/images/upay.png" alt="Upay" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Upay</p>
                  <p className="text-[10px] text-slate-500 font-medium">Personal</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">টাকা পাঠানোর পার্সোনাল নম্বর:</span>
              <span className="font-mono font-black text-xs text-[#0F2C59] bg-white px-2.5 py-0.5 rounded-lg border border-slate-300/80 shadow-xs">
                01712592519
              </span>
            </div>
            <p>
              আপনার {
                paymentMethod === 'BKASH' ? 'বিকাশ' :
                paymentMethod === 'NAGAD' ? 'নগদ' :
                paymentMethod === 'ROCKET' ? 'রকেট' : 'উপায়'
              } অ্যাকাউন্ট থেকে <strong className="font-bn-normal text-slate-900">০১৭১২৫৯২৫১৯</strong> নম্বরে সেন্ড মানি করে <strong>৳{pdf.price}</strong> টাকা পাঠান। এরপর নিচের ফর্মে TrxID ও ফোন নম্বর দিয়ে সাবমিট করুন।
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Phone)
            </label>
            <input
              type="text"
              required
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ট্রানজ্যাকশন আইডি (Transaction ID / TrxID)
            </label>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value.toUpperCase())}
              placeholder="যেমন: 9J72AKL89Q"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs flex items-center justify-between text-slate-700">
            <span className="text-slate-500 font-medium">শিক্ষার্থী অ্যাকাউন্ট:</span>
            <span className="font-bold text-slate-900 truncate max-w-[220px]">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <span>{submitting ? 'সাবমিট হচ্ছে...' : 'TrxID সাবমিট করুন ও অনুমোদন চান'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

