'use client';

import React from 'react';
import { FaCheck, FaXmark, FaClock, FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';
import { PurchaseRecord } from '@/types';

interface PurchasesTableProps {
  purchases: PurchaseRecord[];
  loading: boolean;
  onUpdateStatus: (purchaseId: string, newStatus: 'APPROVED' | 'REJECTED') => void;
}

export default function PurchasesTable({
  purchases,
  loading,
  onUpdateStatus,
}: PurchasesTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <FaClock className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">পেমেন্ট রিকোয়েস্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
        কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি।
      </div>
    );
  }

  return (
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
            {purchases.map((pur) => (
              <tr key={pur.id} className="hover:bg-slate-50/80 transition">
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
                  <div className="flex items-center gap-1.5 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black text-white ${
                        pur.paymentMethod === 'BKASH' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'
                      }`}
                    >
                      {pur.paymentMethod}
                    </span>
                    <span className="font-mono text-xs">{pur.senderPhone}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(pur.createdAt).toLocaleDateString('bn-BD')}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block text-xs border border-slate-200">
                    {pur.trxId}
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
                        onClick={() => onUpdateStatus(pur.id, 'APPROVED')}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition shadow-sm border border-emerald-200"
                        title="অনুমোদন করুন (Approve)"
                      >
                        <FaCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {pur.status !== 'REJECTED' && (
                      <button
                        onClick={() => onUpdateStatus(pur.id, 'REJECTED')}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-sm border border-rose-200"
                        title="বাতিল করুন (Reject)"
                      >
                        <FaXmark className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

