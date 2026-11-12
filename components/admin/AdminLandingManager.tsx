'use client';

import React, { useState, useEffect } from 'react';
import {
  LandingContent,
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
  saveStoredLandingContent,
} from '@/lib/defaultLandingContent';
import {
  FaSliders,
  FaCheck,
  FaPlus,
  FaTrashCan,
  FaChartLine,
  FaUserTie,
  FaCircleQuestion,
  FaPhoneVolume,
  FaRotateLeft,
} from 'react-icons/fa6';

export default function AdminLandingManager() {
  const [content, setContent] = useState<LandingContent>(DEFAULT_LANDING_CONTENT);
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'director' | 'contact' | 'faqs'>('stats');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New FAQ inputs
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    // Load local storage first
    try {
      const stored = getStoredLandingContent();
      if (stored) {
        setContent(stored);
      }
    } catch {}

    // Load from server API
    fetch('/api/landing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) {
          setContent(data.content);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (updatedContent?: LandingContent | any) => {
    const isRealLandingContent =
      updatedContent &&
      typeof updatedContent === 'object' &&
      !('nativeEvent' in updatedContent) &&
      !('target' in updatedContent) &&
      'stats' in updatedContent;

    const payload: LandingContent = isRealLandingContent ? updatedContent : content;
    setSaving(true);
    setStatusMsg(null);

    try {
      // Save locally
      saveStoredLandingContent(payload);

      // Save to server
      const res = await fetch('/api/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMsg({ text: 'ল্যান্ডিং পেজ কন্টেন্ট সফলভাবে আপডেট হয়েছে!', type: 'success' });
      } else {
        setStatusMsg({ text: 'সার্ভারে সংরক্ষণ ব্যর্থ, তবে ব্রাউজারে সংরক্ষিত হয়েছে।', type: 'error' });
      }
    } catch {
      setStatusMsg({ text: 'নেটওয়ার্ক সমস্যা, কন্টেন্ট লোকাল স্টোরেজে সংরক্ষিত হয়েছে।', type: 'success' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('আপনি কি ডিফল্ট কন্টেন্টে রিসেট করতে চান?')) {
      setContent(DEFAULT_LANDING_CONTENT);
      handleSave(DEFAULT_LANDING_CONTENT);
    }
  };

  // Add FAQ Item
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const updatedFaqs = [
      ...content.faqs,
      {
        id: 'faq_' + Date.now(),
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      },
    ];

    const updated = { ...content, faqs: updatedFaqs };
    setContent(updated);
    setNewQuestion('');
    setNewAnswer('');
    handleSave(updated);
  };

  // Delete FAQ Item
  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = content.faqs.filter((f) => f.id !== id);
    const updated = { ...content, faqs: updatedFaqs };
    setContent(updated);
    handleSave(updated);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
            <FaSliders /> ল্যান্ডিং পেজ ডায়নামিক কন্ট্রোল
          </span>
          <h2 className="text-xl font-black text-slate-800">
            ল্যান্ডিং পেজ কন্টেন্ট ও তথ্য ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">
            হোমপেজের ইমপ্যাক্ট পরিসংখ্যান, পরিচালকের বাণী, ব্রাঞ্চের হেল্পলাইন ও FAQ কন্টেন্ট এখান থেকে পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            title="ডিফল্ট মান ফিরিয়ে আনুন"
          >
            <FaRotateLeft className="w-3 h-3" />
            <span>রিসেট</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-brand transition disabled:opacity-50"
          >
            <FaCheck className="w-3.5 h-3.5" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সব পরিবর্তন সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveSubTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
            activeSubTab === 'stats'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaChartLine className="w-3.5 h-3.5" />
          <span>পরিসংখ্যান কাউন্টার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('director')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
            activeSubTab === 'director'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaUserTie className="w-3.5 h-3.5" />
          <span>পরিচালকের বাণী</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
            activeSubTab === 'contact'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaPhoneVolume className="w-3.5 h-3.5" />
          <span>ব্রাঞ্চ ও হেল্পলাইন</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
            activeSubTab === 'faqs'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaCircleQuestion className="w-3.5 h-3.5" />
          <span>সচরাচর জিজ্ঞাসা (FAQs)</span>
          <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-full">
            {content.faqs?.length || 0}
          </span>
        </button>
      </div>

      {/* SubTab 1: Live Stats Counter */}
      {activeSubTab === 'stats' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
            এখানে যে সংখ্যাগুলো লিখবেন, হোমপেজে সুন্দর কাউন্টার এনিমেশনসহ শিক্ষার্থী ও অভিভাবকদের দেখানো হবে।
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.stats.map((st, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">
                    স্ট্যাটাস কার্ড #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                    কাউন্টার ভ্যালু
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    লেবেল / বিষয়
                  </label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const copy = [...content.stats];
                      copy[idx] = { ...copy[idx], label: e.target.value };
                      setContent({ ...content, stats: copy });
                    }}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      সংখ্যা (কাউন্টার ভ্যালু)
                    </label>
                    <input
                      type="number"
                      value={st.value}
                      onChange={(e) => {
                        const copy = [...content.stats];
                        copy[idx] = { ...copy[idx], value: Number(e.target.value) || 0 };
                        setContent({ ...content, stats: copy });
                      }}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      সাফিক্স (+ / %)
                    </label>
                    <input
                      type="text"
                      value={st.suffix}
                      onChange={(e) => {
                        const copy = [...content.stats];
                        copy[idx] = { ...copy[idx], suffix: e.target.value };
                        setContent({ ...content, stats: copy });
                      }}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সংক্ষিপ্ত বর্ণনা
                  </label>
                  <input
                    type="text"
                    value={st.description}
                    onChange={(e) => {
                      const copy = [...content.stats];
                      copy[idx] = { ...copy[idx], description: e.target.value };
                      setContent({ ...content, stats: copy });
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Director's Speech */}
      {activeSubTab === 'director' && (
        <div className="space-y-4 max-w-3xl">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
            পরিচালক মহোদয়ের ছবি প্রোফাইল ট্যাব থেকে ক্লাউডিনারি আপলোড করা ছবির সাথে স্বয়ংক্রিয়ভাবে সিঙ্ক থাকবে, অথবা আপনি কাস্টম ইমেজ লিঙ্কও দিতে পারেন।
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পরিচালকের নাম
              </label>
              <input
                type="text"
                value={content.director.name}
                onChange={(e) =>
                  setContent({
                    ...content,
                    director: { ...content.director, name: e.target.value },
                  })
                }
                className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পদবি ও একাডেমি
              </label>
              <input
                type="text"
                value={content.director.designation}
                onChange={(e) =>
                  setContent({
                    ...content,
                    director: { ...content.director, designation: e.target.value },
                  })
                }
                className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              প্রধান বাণী / উক্তি (Quotation)
            </label>
            <input
              type="text"
              value={content.director.quote}
              onChange={(e) =>
                setContent({
                  ...content,
                  director: { ...content.director, quote: e.target.value },
                })
              }
              className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিস্তারিত বার্তা (Full Message)
            </label>
            <textarea
              rows={5}
              value={content.director.message}
              onChange={(e) =>
                setContent({
                  ...content,
                  director: { ...content.director, message: e.target.value },
                })
              }
              className="w-full text-xs leading-relaxed bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              কাস্টম ইমেজ ইউআরএল (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={content.director.image || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  director: { ...content.director, image: e.target.value },
                })
              }
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              ফাঁকা রাখলে মাস্টার অ্যাডমিনের আসল প্রোফাইল ছবি স্বয়ংক্রিয়ভাবে দেখাবে।
            </p>
          </div>
        </div>
      )}

      {/* SubTab 3: Contact & Branch Info */}
      {activeSubTab === 'contact' && (
        <div className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রধান হেল্পলাইন নম্বর
              </label>
              <input
                type="text"
                value={content.contact.helpline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, helpline: e.target.value },
                  })
                }
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                হোয়াটসঅ্যাপ নম্বর
              </label>
              <input
                type="text"
                value={content.contact.whatsapp}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, whatsapp: e.target.value },
                  })
                }
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                যোগাযোগের অফিসিয়াল ইমেইল
              </label>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value },
                  })
                }
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অফিস খোলার সময়সূচি
              </label>
              <input
                type="text"
                value={content.contact.hours}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, hours: e.target.value },
                  })
                }
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              শাখার পূর্ণাঙ্গ ঠিকানা
            </label>
            <input
              type="text"
              value={content.contact.address}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, address: e.target.value },
                })
              }
              className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* SubTab 4: Interactive FAQs */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-6">
          {/* Add new FAQ Form */}
          <form
            onSubmit={handleAddFaq}
            className="p-5 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 space-y-3"
          >
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <FaPlus className="w-3 h-3 text-brand-600" /> নতুন সাধারণ প্রশ্ন ও উত্তর যোগ করুন
            </h4>

            <div>
              <input
                type="text"
                required
                placeholder="প্রশ্ন (যেমন: মডেল টেস্টের ফলাফল কীভাবে দেখতে পাব?)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <textarea
                required
                rows={2}
                placeholder="উত্তর লিখুন..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-brand transition"
            >
              <FaPlus className="w-3 h-3" />
              <span>প্রশ্ন যোগ করুন</span>
            </button>
          </form>

          {/* Current FAQ List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500">
              বর্তমান প্রশ্নাবলী ({content.faqs?.length || 0})
            </h4>

            {content.faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-slate-800">
                      {faq.question}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition shrink-0"
                  title="মুছে ফেলুন"
                >
                  <FaTrashCan className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

