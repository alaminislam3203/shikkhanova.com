'use client';

import React, { useState, useEffect } from 'react';
import {
  LandingFaqItem,
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
} from '@/lib/defaultLandingContent';
import {
  FaCircleQuestion,
  FaChevronDown,
  FaPlus,
  FaMinus,
} from 'react-icons/fa6';

export default function FaqSection() {
  const [faqs, setFaqs] = useState<LandingFaqItem[]>(DEFAULT_LANDING_CONTENT.faqs);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  useEffect(() => {
    try {
      const stored = getStoredLandingContent();
      if (stored?.faqs && Array.isArray(stored.faqs)) {
        setFaqs(stored.faqs);
      }
    } catch {}

    fetch('/api/landing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.faqs && Array.isArray(data.content.faqs)) {
          setFaqs(data.content.faqs);
        }
      })
      .catch(() => {});
  }, []);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
          <FaCircleQuestion className="w-3 h-3 text-emerald-600" />
          <span>সাধারণ জিজ্ঞাসা ও উত্তর</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          সচরাচর জিজ্ঞাসিত <span className="text-[#C8102E]">প্রশ্নাবলী (FAQ)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          মডেল টেস্ট, শিট ডাউনলোড, পেমেন্ট ও ক্লাসরুম সংক্রান্ত যেকোনো তথ্যের উত্তর এক নজরে দেখুন।
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.id || idx}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-brand-500/80 shadow-md ring-1 ring-brand-500/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>

                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? 'bg-brand-50 text-brand-700 rotate-180'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <FaChevronDown className="w-3 h-3" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pl-12 sm:pl-14 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
