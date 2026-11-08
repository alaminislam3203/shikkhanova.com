'use client';

import React from 'react';
import { FaFilePdf, FaDownload, FaClock, FaBookOpen } from 'react-icons/fa6';
import { PdfItem } from '@/types';

interface PdfCardProps {
  pdf: PdfItem;
  onBuyClick: (pdf: PdfItem) => void;
}

export default function PdfCard({ pdf, onBuyClick }: PdfCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-premium transition flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-lg">
            <FaBookOpen className="w-3 h-3" /> Class {pdf.classGrade} • {pdf.subject}
          </span>
          <span className="text-lg font-black text-nova-600 bg-nova-50 px-2.5 py-0.5 rounded-xl border border-nova-200">
            ৳{pdf.price}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 leading-snug">
          {pdf.title}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          {pdf.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100">
        {pdf.purchaseStatus === 'APPROVED' ? (
          <a
            href={pdf.fileUrl}
            download
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
          >
            <FaDownload className="w-3.5 h-3.5" />
            <span>অনুমোদিত - ডাউনলোড করুন</span>
          </a>
        ) : pdf.purchaseStatus === 'PENDING' ? (
          <div className="w-full text-center py-2.5 px-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center justify-center gap-2">
            <FaClock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>TrxID যাচাই করা হচ্ছে...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onBuyClick(pdf)}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold py-2.5 rounded-xl text-xs shadow-brand transition transform hover:-translate-y-0.5"
          >
            <FaFilePdf className="w-3.5 h-3.5 text-nova-400" />
            <span>৳{pdf.price} দিয়ে কিনুন (TrxID দিন)</span>
          </button>
        )}
      </div>
    </div>
  );
}

