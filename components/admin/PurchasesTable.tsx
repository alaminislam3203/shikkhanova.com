'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FaCheck,
  FaXmark,
  FaClock,
  FaCircleCheck,
  FaCircleExclamation,
  FaMagnifyingGlass,
  FaBolt,
} from 'react-icons/fa6';
import { PurchaseRecord } from '@/types';
import toast from 'react-hot-toast';

interface PurchasesTableProps {
  purchases: PurchaseRecord[];
  loading: boolean;
  onUpdateStatus: (purchaseId: string, newStatus: 'APPROVED' | 'REJECTED') => Promise<void> | void;
}

export default function PurchasesTable({
  purchases,
  loading,
  onUpdateStatus,
}: PurchasesTableProps) {
  const [trxSearch, setTrxSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const lastPromptedTrxRef = useRef<string>('');

  // Reusable react-hot-toast Confirmation Popup before Auto Payment Success
  const triggerPaymentSuccessConfirmation = (pur: PurchaseRecord, isAutoMatch = false) => {
    const toastId = `confirm-trx-${pur.id}`;

    toast.custom(
      (t) => (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/80 p-5 max-w-md w-full space-y-3.5 text-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                <FaBolt className="w-5 h-5" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {isAutoMatch ? '⚡ TrxID অটো-ম্যাচ পাওয়া গেছে!' : 'পেমেন্ট কনফার্মেশন'}
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">
                  Auto Payment Success নিশ্চিত করবেন?
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/90 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">ট্রানজ্যাকশন আইডি (TrxID):</span>
              <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {pur.trxId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">শিক্ষার্থীর নাম:</span>
              <span className="font-bold text-slate-800">
                {pur.student?.name} (শ্রেণি {pur.student?.classGrade || 'N/A'})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">প্রেরকের নম্বর ও মাধ্যম:</span>
              <span className="font-mono font-bold text-slate-800">
                {pur.senderPhone} ({pur.paymentMethod})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">নির্ধারিত ফি ও শিট:</span>
              <span className="font-black text-brand-700 truncate max-w-[180px]">
                ৳{pur.amount} • {pur.pdf?.title}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            অনুমোদন করলে পেমেন্টটি <strong>Payment Success (Approved)</strong> হয়ে যাবে এবং শিক্ষার্থী সাথে সাথে পিডিএফ শিটটি ডাউনলোড করতে পারবে।
          </p>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                await onUpdateStatus(pur.id, 'APPROVED');
                toast.success(
                  `পেমেন্ট সফল (TrxID: ${pur.trxId})! "${pur.student?.name}" এখন পিডিএফ ডাউনলোড করতে পারবে।`,
                  { duration: 5000 }
                );
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <FaCheck className="w-3.5 h-3.5" />
              <span>হ্যাঁ, পেমেন্ট সফল করুন</span>
            </button>

            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
            >
              বাতিল
            </button>
          </div>
        </div>
      ),
      { id: toastId, duration: Infinity }
    );
  };

  // Auto-detect exact TrxID match as Admin types or pastes in the search box
  useEffect(() => {
    const cleanQuery = trxSearch.trim().toUpperCase();
    if (!cleanQuery) {
      lastPromptedTrxRef.current = '';
      return;
    }

    const exactMatch = purchases.find(
      (p) => p.trxId.trim().toUpperCase() === cleanQuery
    );

    if (exactMatch && lastPromptedTrxRef.current !== cleanQuery) {
      lastPromptedTrxRef.current = cleanQuery;
      if (exactMatch.status !== 'APPROVED') {
        triggerPaymentSuccessConfirmation(exactMatch, true);
      } else {
        toast.success(
          `TrxID "${exactMatch.trxId}" মিলেছে! এই পেমেন্টটি ইতোমধ্যে অনুমোদিত (Payment Success) রয়েছে।`,
          { id: `already-${exactMatch.id}` }
        );
      }
    }
  }, [trxSearch, purchases]);

  const handleManualTrxVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = trxSearch.trim().toUpperCase();
    if (!cleanQuery) return;

    const exactMatch = purchases.find(
      (p) => p.trxId.trim().toUpperCase() === cleanQuery
    );

    if (!exactMatch) {
      toast.error(`"${cleanQuery}" TrxID দিয়ে কোনো পেমেন্ট রিকোয়েস্ট খুঁজে পাওয়া যায়নি।`);
      return;
    }

    if (exactMatch.status === 'APPROVED') {
      toast.success(`TrxID "${exactMatch.trxId}" ইতোমধ্যে অনুমোদিত (Payment Success) রয়েছে!`);
    } else {
      triggerPaymentSuccessConfirmation(exactMatch, true);
    }
  };

  const filteredPurchases = purchases.filter((pur) => {
    const matchesStatus = statusFilter === 'ALL' || pur.status === statusFilter;
    const q = trxSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      pur.trxId.toLowerCase().includes(q) ||
      pur.senderPhone.toLowerCase().includes(q) ||
      pur.student?.name?.toLowerCase().includes(q) ||
      pur.student?.email?.toLowerCase().includes(q) ||
      pur.pdf?.title?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">পেমেন্ট রিকোয়েস্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* TrxID Search & Auto-Payment Verification Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* TrxID Search Form */}
          <form onSubmit={handleManualTrxVerifySubmit} className="flex-1 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={trxSearch}
                onChange={(e) => setTrxSearch(e.target.value)}
                placeholder="TrxID দিয়ে সার্চ করুন (মিলে গেলে অটো পেমেন্ট কনফার্মেশন আসবে)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-800 placeholder:font-sans placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white transition"
              />
              {trxSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setTrxSearch('');
                    lastPromptedTrxRef.current = '';
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-sm transition flex items-center justify-center gap-2 shrink-0"
            >
              <FaBolt className="w-3.5 h-3.5 text-amber-300" />
              <span>TrxID মিলিয়ে ভেরিফাই করুন</span>
            </button>
          </form>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'ALL', label: `সকল (${purchases.length})` },
              {
                id: 'PENDING',
                label: `অপেক্ষমাণ (${purchases.filter((p) => p.status === 'PENDING').length})`,
              },
              {
                id: 'APPROVED',
                label: `অনুমোদিত (${purchases.filter((p) => p.status === 'APPROVED').length})`,
              },
              {
                id: 'REJECTED',
                label: `বাতিল (${purchases.filter((p) => p.status === 'REJECTED').length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  statusFilter === tab.id
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs sm:text-sm font-semibold">
          {trxSearch
            ? `"${trxSearch}" এর সাথে কোনো পেমেন্ট রিকোয়েস্ট মিলেনি।`
            : 'কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি।'}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="py-4 px-6">শিক্ষার্থী ও রোল</th>
                  <th className="py-4 px-6">পিডিএফ ও শ্রেণি</th>
                  <th className="py-4 px-6">মেথড ও নম্বর</th>
                  <th className="py-4 px-6 font-mono">TrxID ও ফি</th>
                  <th className="py-4 px-6 text-center">স্ট্যাটাস</th>
                  <th className="py-4 px-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPurchases.map((pur) => {
                  const isExactTrxMatch =
                    trxSearch.trim() !== '' &&
                    pur.trxId.trim().toUpperCase() === trxSearch.trim().toUpperCase();

                  return (
                    <tr
                      key={pur.id}
                      className={`transition ${
                        isExactTrxMatch
                          ? 'bg-emerald-50/90 ring-2 ring-inset ring-emerald-500'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{pur.student.name}</div>
                        <div className="text-xs text-slate-500">
                          শ্রেণি {pur.student.classGrade || 'N/A'} • রোল {pur.student.rollNumber || 'N/A'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{pur.student.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800 line-clamp-1">{pur.pdf.title}</div>
                        <div className="text-xs text-brand-600 font-bold">
                          Class {pur.pdf.classGrade} • {pur.pdf.subject}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-xs flex items-center">
                            <img
                              src={
                                pur.paymentMethod === 'BKASH'
                                  ? '/assets/images/bkash.png'
                                  : '/assets/images/nagad.png'
                              }
                              alt={pur.paymentMethod}
                              className="h-3.5 w-auto object-contain"
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {pur.senderPhone}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(pur.createdAt).toLocaleDateString('bn-BD')}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-black px-2 py-1 rounded inline-block text-xs border ${
                              isExactTrxMatch
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                : 'bg-slate-100 text-slate-900 border-slate-200'
                            }`}
                          >
                            {pur.trxId}
                          </span>
                          {isExactTrxMatch && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Matched!
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-nova-600 mt-1">৳{pur.amount}</div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        {pur.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            <FaCircleCheck /> অনুমোদিত
                          </span>
                        ) : pur.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            <FaCircleExclamation /> বাতিল
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            <FaClock className="animate-spin" /> অপেক্ষমাণ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {pur.status !== 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => triggerPaymentSuccessConfirmation(pur, false)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-sm border border-emerald-200 text-xs font-bold flex items-center gap-1"
                              title="অনুমোদন করুন (Approve)"
                            >
                              <FaCheck className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          {pur.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={async () => {
                                await onUpdateStatus(pur.id, 'REJECTED');
                                toast.error(
                                  `TrxID "${pur.trxId}" এর পেমেন্ট রিকোয়েস্টটি বাতিল (Rejected) করা হয়েছে।`,
                                  { position: 'center', duration: 3500 }
                                );
                              }}
                              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-sm border border-rose-200"
                              title="বাতিল করুন (Reject)"
                            >
                              <FaXmark className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
