'use client';

import React, { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { PdfItem } from '@/types';

interface PdfPurchaseModalProps {
  pdf: PdfItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pdfId: string) => void;
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
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [senderPhone, setSenderPhone] = useState<string>(userPhone);
  const [trxId, setTrxId] = useState<string>('');
  const [name, setName] = useState<string>(userName);
  const [email, setEmail] = useState<string>(userEmail);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          guestName: name,
          guestEmail: email,
          guestClass: pdf.classGrade,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'পেমেন্ট সাবমিট করতে সমস্যা হয়েছে');
      }

      setSuccessMsg('আপনার TrxID সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করার পর ডাউনলোড অপশন সক্রিয় হবে।');
      onSuccess(pdf.id);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'সমস্যা হয়েছে');
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
            Class {pdf.classGrade} • {pdf.subject}
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
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition ${
                  paymentMethod === 'BKASH'
                    ? 'border-bkash bg-pink-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-11 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <img src="/assets/images/bkash.png" alt="bKash" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">bKash Personal</p>
                  <p className="text-[11px] font-bn-normal font-bold text-slate-600">০১৭১২৫৯২৫১৯</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition ${
                  paymentMethod === 'NAGAD'
                    ? 'border-nagad bg-orange-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-11 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
                  <img src="/assets/images/nagad.png" alt="Nagad" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Nagad Personal</p>
                  <p className="text-[11px] font-bn-normal font-bold text-slate-600">০১৭১২৫৯২৫১৯</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">টাকা পাঠানোর নির্দেশিকা:</p>
            <p>
              আপনার {paymentMethod === 'BKASH' ? 'বিকাশ' : 'নগদ'} থেকে <strong className="font-bn-normal text-slate-900">০১৭১২৫৯২৫১৯</strong> নম্বরে সেন্ড মানি করে <strong>৳{pdf.price}</strong> টাকা পাঠান। এরপর নিচের ফর্মে TrxID ও ফোন দিয়ে সাবমিট করুন।
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

          {!userEmail && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="নাম"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

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

