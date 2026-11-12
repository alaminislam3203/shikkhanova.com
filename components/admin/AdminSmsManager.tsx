'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FaPaperPlane,
  FaCoins,
  FaRotate,
  FaUsers,
  FaMobileScreenButton,
  FaFileInvoiceDollar,
  FaListUl,
  FaGear,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaTrashCan,
  FaBullhorn,
  FaUserCheck,
  FaGraduationCap,
  FaMoneyBillWave,
  FaArrowUpRightFromSquare,
  FaCheck,
  FaClock,
} from 'react-icons/fa6';
import { toBengaliClass } from '@/lib/defaultQuizData';

interface SmsLogItem {
  id: string;
  timestamp: string;
  type: string;
  recipientCount: number;
  numbers: string[];
  message: string;
  status: 'SENT' | 'FAILED' | 'MOCK_SENT';
  response: any;
  error?: string;
}

export default function AdminSmsManager() {
  const [activeSubTab, setActiveSubTab] = useState<
    'broadcast' | 'direct' | 'fee' | 'logs' | 'settings'
  >('broadcast');

  // Balance & Gateway Status State
  const [balance, setBalance] = useState<number | string>('...');
  const [balanceStatus, setBalanceStatus] = useState<'active' | 'inactive' | 'mock'>('mock');
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  // Broadcast Tab State
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [broadcastType, setBroadcastType] = useState<string>('announcement');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [extraNumbers, setExtraNumbers] = useState<string>('');
  const [sendingBroadcast, setSendingBroadcast] = useState<boolean>(false);

  // Direct Quick SMS State
  const [directNumbers, setDirectNumbers] = useState<string>('');
  const [directMessage, setDirectMessage] = useState<string>('');
  const [sendingDirect, setSendingDirect] = useState<boolean>(false);

  // Monthly Fee Reminder State
  const [feeClass, setFeeClass] = useState<string>('7');
  const [feeMonth, setFeeMonth] = useState<string>('নভেম্বর ২০২৬');
  const [feeDueDate, setFeeDueDate] = useState<string>('২০ নভেম্বর ২০২৬');
  const [feeAmount, setFeeAmount] = useState<string>('৫০০');
  const [feeCustomMessage, setFeeCustomMessage] = useState<string>('');
  const [sendingFee, setSendingFee] = useState<boolean>(false);

  // Test SMS State
  const [testNumber, setTestNumber] = useState<string>('01712592519');
  const [testMessage, setTestMessage] = useState<string>(
    'শিক্ষানোভা একাডেমি থেকে এটি একটি টেস্ট এসএমএস। বাল্ক এসএমএস সিস্টেম সফলভাবে সক্রিয় আছে!'
  );
  const [sendingTest, setSendingTest] = useState<boolean>(false);

  // Logs State
  const [logs, setLogs] = useState<SmsLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);

  // Fetch live balance
  const fetchBalance = async () => {
    setLoadingBalance(true);
    try {
      const res = await fetch('/api/sms/balance', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        setBalanceStatus(data.status);
      } else {
        setBalance('অপ্রতুল / এরর');
        setBalanceStatus('inactive');
      }
    } catch {
      setBalance('অফলাইন');
      setBalanceStatus('inactive');
    } finally {
      setLoadingBalance(false);
    }
  };

  // Fetch delivery logs
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/sms/logs', { cache: 'no-store' });
      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch {
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchLogs();
  }, []);

  // Update default fee message when fee details change
  useEffect(() => {
    setFeeCustomMessage(
      `সম্মানিত অভিভাবক, আপনার সন্তানের ${feeMonth} মাসের অ্যাকাডেমিক কোচিং ফি ${
        feeAmount ? '৳' + feeAmount + ' ' : ''
      }বকেয়া রয়েছে। অনুগ্রহ করে ${feeDueDate}-এর মধ্যে পরিশোধ করার জন্য অনুরোধ করা হলো। হেল্পলাইন: 01712592519 — শিক্ষানোভা একাডেমি`
    );
  }, [feeMonth, feeDueDate, feeAmount]);

  // Set predefined templates in Broadcast tab
  const handleApplyTemplate = (type: string) => {
    setBroadcastType(type);
    if (type === 'announcement') {
      setBroadcastMessage(
        'জরুরি নোটিশ: আগামী শনিবার শিক্ষানোভা একাডেমির সকল ক্লাস যথারীতি অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে নির্ধারিত সময়ে উপস্থিত থাকার নির্দেশ দেওয়া হলো। — পরিচালক, শিক্ষানোভা'
      );
    } else if (type === 'holiday') {
      setBroadcastMessage(
        'সম্মানিত অভিভাবক ও শিক্ষার্থী, সরকারি ছুটি উপলক্ষে আগামী রবিবার ও সোমবার কোচিংয়ের সকল ক্লাস বন্ধ থাকবে। মঙ্গলবার থেকে স্বাভাবিক রুটিনে ক্লাস চলবে। — শিক্ষানোভা একাডেমি'
      );
    } else if (type === 'meeting') {
      setBroadcastMessage(
        'জরুরি অভিভাবক সমাবেশ: আগামী শুক্রবার বিকাল ৪:০০ টায় শিক্ষানোভা একাডেমি প্রাঙ্গণে বার্ষিক মূল্যায়ন ও প্রগ্রেস রিপোর্ট সংক্রান্ত অভিভাবক সভা অনুষ্ঠিত হবে। আপনার উপস্থিতি একান্ত কাম্য।'
      );
    } else if (type === 'modeltest') {
      setBroadcastMessage(
        'বিশেষ মডেল টেস্ট নোটিশ: আগামী সপ্তাহ থেকে সকল বিষয়ের অধ্যায়ভিত্তিক পূর্ণাঙ্গ মডেল টেস্ট পরীক্ষা শুরু হবে। প্রস্তুতি জোরদার করার জন্য নির্দেশ দেওয়া হলো। — শিক্ষানোভা একাডেমি'
      );
    }
  };

  // Helper to calculate characters and SMS segments
  const getSmsCount = (text: string) => {
    const len = text.length;
    // Check if contains non-ASCII (Bangla / Unicode)
    const isUnicode = /[^\u0000-\u007F]/.test(text);
    if (isUnicode) {
      if (len <= 70) return { count: 1, max: 70, remaining: 70 - len, isUnicode: true };
      const count = Math.ceil(len / 67);
      return { count, max: count * 67, remaining: count * 67 - len, isUnicode: true };
    } else {
      if (len <= 160) return { count: 1, max: 160, remaining: 160 - len, isUnicode: false };
      const count = Math.ceil(len / 153);
      return { count, max: count * 153, remaining: count * 153 - len, isUnicode: false };
    }
  };

  // 1. Send Class-wise Broadcast SMS
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.error('অনুগ্রহ করে এসএমএস বার্তা লিখুন');
      return;
    }

    if (
      !confirm(
        `আপনি কি নিশ্চিত যে ${
          selectedClass === 'all'
            ? 'সকল শ্রেণির'
            : toBengaliClass(parseInt(selectedClass, 10)) + ' শ্রেণির'
        } শিক্ষার্থীদের এসএমএস পাঠাতে চান?`
      )
    ) {
      return;
    }

    setSendingBroadcast(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedClass === 'all' ? 'all-students' : 'class-bulk',
          classGrade: selectedClass,
          message: broadcastMessage,
          numbers: extraNumbers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'এসএমএস সফলভাবে পাঠানো হয়েছে!');
        fetchBalance();
        fetchLogs();
      } else {
        toast.error(data.error || data.message || 'এসএমএস পাঠাতে ব্যর্থ হয়েছে');
      }
    } catch {
      toast.error('সার্ভার কানেকশন এরর');
    } finally {
      setSendingBroadcast(false);
    }
  };

  // 2. Send Direct Quick SMS
  const handleSendDirect = async () => {
    if (!directNumbers.trim() || !directMessage.trim()) {
      toast.error('মোবাইল নম্বর ও বার্তা পূরণ করুন');
      return;
    }

    setSendingDirect(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          numbers: directNumbers,
          message: directMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'এসএমএস পাঠানো হয়েছে!');
        setDirectMessage('');
        fetchBalance();
        fetchLogs();
      } else {
        toast.error(data.error || data.message || 'ব্যর্থ হয়েছে');
      }
    } catch {
      toast.error('সার্ভার এরর');
    } finally {
      setSendingDirect(false);
    }
  };

  // 3. Send Monthly Fee Reminders
  const handleSendFeeReminder = async () => {
    if (!feeCustomMessage.trim()) {
      toast.error('রিমাইন্ডার বার্তা পূরণ করুন');
      return;
    }

    if (
      !confirm(
        `আপনি কি নিশ্চিত যে ${toBengaliClass(
          parseInt(feeClass, 10)
        )} শ্রেণির শিক্ষার্থীদের অভিভাবককে ফি বকেয়া রিমাইন্ডার পাঠাতে চান?`
      )
    ) {
      return;
    }

    setSendingFee(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'fee-reminder',
          classGrade: feeClass,
          message: feeCustomMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'ফি রিমাইন্ডার সফলভাবে পাঠানো হয়েছে!');
        fetchBalance();
        fetchLogs();
      } else {
        toast.error(data.error || data.message || 'ব্যর্থ হয়েছে');
      }
    } catch {
      toast.error('সার্ভার এরর');
    } finally {
      setSendingFee(false);
    }
  };

  // 4. Send Test SMS
  const handleSendTest = async () => {
    if (!testNumber.trim() || !testMessage.trim()) {
      toast.error('টেস্ট নম্বর ও বার্তা দিন');
      return;
    }

    setSendingTest(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          numbers: testNumber,
          message: testMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'টেস্ট এসএমএস পাঠানো হয়েছে!');
        fetchBalance();
        fetchLogs();
      } else {
        toast.error(data.error || data.message || 'ব্যর্থ হয়েছে');
      }
    } catch {
      toast.error('সার্ভার এরর');
    } finally {
      setSendingTest(false);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    if (!confirm('আপনি কি সকল এসএমএস ডেলিভারি লগ মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/sms/logs', { method: 'DELETE' });
      if (res.ok) {
        toast.success('এসএমএস লগ মুছে ফেলা হয়েছে');
        setLogs([]);
      }
    } catch {
      toast.error('লগ মুছতে ব্যর্থ হয়েছে');
    }
  };

  const broadcastSmsInfo = getSmsCount(broadcastMessage);
  const directSmsInfo = getSmsCount(directMessage);
  const feeSmsInfo = getSmsCount(feeCustomMessage);

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Balance Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172C] via-[#0F2C59] to-[#0A1E3C] p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C8102E]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 backdrop-blur-md">
              <FaBullhorn className="w-3.5 h-3.5" />
              <span>BulkSMSBD গেটওয়ে ইন্টিগ্রেশন (https://bulksmsbd.net)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              স্মার্ট এসএমএস নোটিফিকেশন সেন্টার
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              অভিভাবকদের অনুপস্থিতি নোটিফিকেশন, মাসিক ফি বকেয়া রিমাইন্ডার, পরীক্ষার রেজাল্ট, পেমেন্ট কনফার্মেশন ও ক্লাস নোটিশ সরাসরি মোবাইল এসএমএস পাঠান।
            </p>
          </div>

          {/* Live Balance Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 flex items-center justify-center font-black shadow-md">
              <FaCoins className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">অবশিষ্ট এসএমএস</span>
                <button
                  type="button"
                  onClick={fetchBalance}
                  disabled={loadingBalance}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                  title="ব্যালেন্স রিফ্রেশ করুন"
                >
                  <FaRotate className={`w-3 h-3 ${loadingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-amber-300">
                {balance}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    balanceStatus === 'active'
                      ? 'bg-emerald-400 animate-pulse'
                      : balanceStatus === 'mock'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                />
                <span className="text-slate-300">
                  {balanceStatus === 'active'
                    ? 'গেটওয়ে সক্রিয়'
                    : balanceStatus === 'mock'
                    ? 'সিমুলেশন মোড (Mock)'
                    : 'অপ্রতুল ব্যালেন্স'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'broadcast'
              ? 'bg-[#0F2C59] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FaUsers className="w-4 h-4 text-blue-400" />
          <span>শ্রেণিভিত্তিক বাল্ক নোটিশ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('direct')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'direct'
              ? 'bg-[#0F2C59] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FaMobileScreenButton className="w-4 h-4 text-emerald-400" />
          <span>তাৎক্ষণিক সরাসরি এসএমএস</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('fee')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'fee'
              ? 'bg-[#0F2C59] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FaFileInvoiceDollar className="w-4 h-4 text-amber-400" />
          <span>মাসিক ফি বকেয়া রিমাইন্ডার</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('logs');
            fetchLogs();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'logs'
              ? 'bg-[#0F2C59] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FaListUl className="w-4 h-4 text-purple-400" />
          <span>ডেলিভারি হিস্ট্রি ও লগ ({logs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ml-auto ${
            activeSubTab === 'settings'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FaGear className="w-4 h-4 text-slate-400" />
          <span>গেটওয়ে সেটিংস ও টেস্ট</span>
        </button>
      </div>

      {/* 3. Sub-tab Content Panes */}

      {/* TAB 1: Class-wise Bulk Broadcast */}
      {activeSubTab === 'broadcast' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaUsers className="text-[#0F2C59]" /> শ্রেণিভিত্তিক বাল্ক ব্রডকাস্ট এসএমএস
              </h2>
              <p className="text-xs text-slate-500">
                এক ক্লিকে নির্দিষ্ট শ্রেণি বা সকল শিক্ষার্থীর রেজিস্টার্ড মোবাইল নম্বরে এসএমএস পাঠান।
              </p>
            </div>

            {/* Class Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="target-class-select" className="text-xs font-bold text-slate-700">টার্গেট শ্রেণি:</label>
              <select
                id="target-class-select"
                aria-label="টার্গেট শ্রেণি নির্বাচন করুন"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              >
                <option value="all">🌟 সকল শ্রেণি (৫ম - ১০ম)</option>
                <option value="5">৫ম শ্রেণি</option>
                <option value="6">৬ষ্ঠ শ্রেণি</option>
                <option value="7">৭ম শ্রেণি</option>
                <option value="8">৮ম শ্রেণি</option>
                <option value="9">৯ম শ্রেণি</option>
                <option value="10">১০ম শ্রেণি</option>
              </select>
            </div>
          </div>

          {/* Quick Predefined Templates */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              দ্রুত টেমপ্লেট নির্বাচন করুন (ক্লিক করলে মেসেজ বক্স স্বয়ংক্রিয় পূরণ হবে):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyTemplate('announcement')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  broadcastType === 'announcement'
                    ? 'border-[#0F2C59] bg-blue-50/70 text-[#0F2C59] font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  <FaBullhorn className="text-blue-600" />
                  <span>সাধারণ নোটিশ</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">ক্লাস রুটিন ও জরুরি তথ্য</p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('holiday')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  broadcastType === 'holiday'
                    ? 'border-[#0F2C59] bg-blue-50/70 text-[#0F2C59] font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  <FaClock className="text-amber-600" />
                  <span>ছুটির ঘোষণা</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">সরকারি ও বিশেষ ছুটি</p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('meeting')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  broadcastType === 'meeting'
                    ? 'border-[#0F2C59] bg-blue-50/70 text-[#0F2C59] font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  <FaUsers className="text-emerald-600" />
                  <span>অভিভাবক সভা</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">মিটিং ও প্রগ্রেস কার্ড</p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('modeltest')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  broadcastType === 'modeltest'
                    ? 'border-[#0F2C59] bg-blue-50/70 text-[#0F2C59] font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  <FaGraduationCap className="text-[#C8102E]" />
                  <span>মডেল টেস্ট নোটিশ</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">পরীক্ষা গ্রহণ ও সিলেবাস</p>
              </button>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="broadcast-message-area">এসএমএস বার্তা লিখুন (বাংলা / ইংরেজি):</label>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-slate-500">{broadcastMessage.length} অক্ষর</span>
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                  {broadcastSmsInfo.count}টি SMS ({broadcastSmsInfo.isUnicode ? 'বাংলা' : 'ইংরেজি'})
                </span>
              </div>
            </div>
            <textarea
              id="broadcast-message-area"
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="এসএমএস এর বিস্তারিত বার্তা লিখুন..."
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-[#0F2C59] focus:bg-white transition"
            />
          </div>

          {/* Optional Extra Mobile Numbers */}
          <div>
            <label htmlFor="extra-numbers-input" className="block text-xs font-bold text-slate-700 mb-1.5">
              অতিরিক্ত মোবাইল নম্বর যোগ করুন (ঐচ্ছিক, কমা দিয়ে একাধিক দিন):
            </label>
            <input
              id="extra-numbers-input"
              type="text"
              value={extraNumbers}
              onChange={(e) => setExtraNumbers(e.target.value)}
              placeholder="যেমন: 01712592519, 01811223344"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-[#0F2C59]"
            />
          </div>

          {/* Send Broadcast Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <FaCircleInfo className="text-blue-500" />
              <span>BulkSMSBD গেটওয়ের মাধ্যমে একযোগে সকল প্রাপকের কাছে পৌঁছে যাবে।</span>
            </div>

            <button
              type="button"
              onClick={handleSendBroadcast}
              disabled={sendingBroadcast || !broadcastMessage.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0A1E3C] to-[#C8102E] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {sendingBroadcast ? (
                <>
                  <FaRotate className="w-4 h-4 animate-spin" />
                  <span>এসএমএস পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="w-4 h-4" />
                  <span>বাল্ক ব্রডকাস্ট পাঠান</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Direct Quick SMS */}
      {activeSubTab === 'direct' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FaMobileScreenButton className="text-emerald-600" /> তাৎক্ষণিক সরাসরি কাস্টম এসএমএস
            </h2>
            <p className="text-xs text-slate-500">
              যেকোনো এক বা একাধিক নির্দিষ্ট মোবাইল নম্বরে সরাসরি কাস্টম বার্তা পাঠান।
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="direct-numbers-area" className="block text-xs font-bold text-slate-700 mb-1.5">
                প্রাপকের মোবাইল নম্বর (কমা বা নতুন লাইন দিয়ে একাধিক নম্বর দিতে পারেন) *
              </label>
              <textarea
                id="direct-numbers-area"
                rows={2}
                value={directNumbers}
                onChange={(e) => setDirectNumbers(e.target.value)}
                placeholder="01712592519, 01899887766, 01911223344"
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-mono text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <label htmlFor="direct-message-area">মেসেজ টেক্সট *</label>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-slate-500">{directMessage.length} অক্ষর</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    {directSmsInfo.count}টি SMS ({directSmsInfo.isUnicode ? 'বাংলা' : 'ইংরেজি'})
                  </span>
                </div>
              </div>
              <textarea
                id="direct-message-area"
                rows={4}
                value={directMessage}
                onChange={(e) => setDirectMessage(e.target.value)}
                placeholder="এখানে আপনার কাঙ্ক্ষিত বার্তাটি লিখুন..."
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              />
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                type="button"
                onClick={handleSendDirect}
                disabled={sendingDirect || !directNumbers.trim() || !directMessage.trim()}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {sendingDirect ? (
                  <>
                    <FaRotate className="w-4 h-4 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    <span>এসএমএস পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Monthly Fee Reminder Hub */}
      {activeSubTab === 'fee' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FaFileInvoiceDollar className="text-amber-500" /> মাসিক ফি বকেয়া রিমাইন্ডার সেন্টার
            </h2>
            <p className="text-xs text-slate-500">
              মাসিক টিউশন ফি ও কোচিং বকেয়া ফি সংগ্রহের জন্য এক ক্লিকে সংশ্লিষ্ট শ্রেণির সকল অভিভাবককে নোটিফিকেশন পাঠান।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="fee-class-select" className="block text-xs font-bold text-slate-700 mb-1.5">শ্রেণি নির্বাচন:</label>
              <select
                id="fee-class-select"
                aria-label="ফি রিমাইন্ডারের শ্রেণি নির্বাচন করুন"
                value={feeClass}
                onChange={(e) => setFeeClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              >
                <option value="5">৫ম শ্রেণি</option>
                <option value="6">৬ষ্ঠ শ্রেণি</option>
                <option value="7">৭ম শ্রেণি</option>
                <option value="8">৮ম শ্রেণি</option>
                <option value="9">৯ম শ্রেণি</option>
                <option value="10">১০ম শ্রেণি</option>
              </select>
            </div>

            <div>
              <label htmlFor="fee-month-input" className="block text-xs font-bold text-slate-700 mb-1.5">মাসের নাম:</label>
              <input
                id="fee-month-input"
                type="text"
                value={feeMonth}
                onChange={(e) => setFeeMonth(e.target.value)}
                placeholder="যেমন: নভেম্বর ২০২৬"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              />
            </div>

            <div>
              <label htmlFor="fee-due-date-input" className="block text-xs font-bold text-slate-700 mb-1.5">পরিশোধের শেষ তারিখ:</label>
              <input
                id="fee-due-date-input"
                type="text"
                value={feeDueDate}
                onChange={(e) => setFeeDueDate(e.target.value)}
                placeholder="যেমন: ২০ নভেম্বর ২০২৬"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              />
            </div>

            <div>
              <label htmlFor="fee-amount-input" className="block text-xs font-bold text-slate-700 mb-1.5">টাকার পরিমাণ (ঐচ্ছিক):</label>
              <input
                id="fee-amount-input"
                type="text"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                placeholder="যেমন: ৫০০"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F2C59]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="fee-custom-message-area">রিমাইন্ডার বার্তার প্রিভিউ (প্রয়োজনে এডিট করতে পারেন):</label>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-slate-500">{feeCustomMessage.length} অক্ষর</span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                  {feeSmsInfo.count}টি SMS
                </span>
              </div>
            </div>
            <textarea
              id="fee-custom-message-area"
              rows={4}
              value={feeCustomMessage}
              onChange={(e) => setFeeCustomMessage(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-[#0F2C59]"
            />
          </div>

          <div className="flex items-center justify-end pt-3">
            <button
              type="button"
              onClick={handleSendFeeReminder}
              disabled={sendingFee || !feeCustomMessage.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {sendingFee ? (
                <>
                  <FaRotate className="w-4 h-4 animate-spin" />
                  <span>রিমাইন্ডার পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaFileInvoiceDollar className="w-4 h-4" />
                  <span>{toBengaliClass(parseInt(feeClass, 10))} শ্রেণিতে ফি রিমাইন্ডার পাঠান</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Delivery History & Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaListUl className="text-purple-600" /> এসএমএস ডেলিভারি লগ ও হিস্ট্রি
              </h2>
              <p className="text-xs text-slate-500">
                সম্প্রতি প্রেরিত সকল এসএমএস এর ডেলিভারি স্টেটাস ও বিস্তারিত হিস্ট্রি।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchLogs}
                disabled={loadingLogs}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <FaRotate className={loadingLogs ? 'animate-spin' : ''} />
                <span>রিফ্রেশ</span>
              </button>

              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearLogs}
                  className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FaTrashCan />
                  <span>লগ মুছুন</span>
                </button>
              )}
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FaMobileScreenButton className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-semibold">এখনো কোনো এসএমএস পাঠানো হয়নি</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4">তারিখ ও সময়</th>
                    <th className="py-3 px-4">টাইপ</th>
                    <th className="py-3 px-4">প্রাপক সংখ্যা</th>
                    <th className="py-3 px-4">বার্তা প্রিভিউ</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('bn-BD')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {log.recipientCount}টি নম্বর
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-700" title={log.message}>
                        {log.message}
                      </td>
                      <td className="py-3 px-4">
                        {log.status === 'SENT' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FaCircleCheck className="w-2.5 h-2.5" /> সফল
                          </span>
                        ) : log.status === 'MOCK_SENT' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <FaCircleInfo className="w-2.5 h-2.5" /> সিমুলেশন
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <FaCircleExclamation className="w-2.5 h-2.5" /> ব্যর্থ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Gateway Settings & Test */}
      {activeSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Info: Gateway Details (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaGear className="text-slate-700" /> BulkSMSBD গেটওয়ে কনফিগারেশন
              </h2>
              <p className="text-xs text-slate-500">
                https://bulksmsbd.net থেকে প্রাপ্ত API Credentials কীভাবে সেট করবেন।
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-700">বর্তমান সেটআপ ফাইল:</span>
                <p className="text-xs text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200">
                  d:\MY-PROJECT\Shikkha Nova\.env
                </p>
                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <p>• <span className="font-bold text-slate-700">BULKSMSBD_API_KEY</span>: আপনার BulkSMSBD ড্যাশবোর্ডের API Key</p>
                  <p>• <span className="font-bold text-slate-700">BULKSMSBD_SENDER_ID</span>: আপনার অনুমোদিত Sender ID (যেমন: 8809617618999 বা ShikkhaNova)</p>
                  <p>• <span className="font-bold text-slate-700">BULKSMSBD_API_URL</span>: http://bulksmsbd.net/api/smsapi</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <FaCircleInfo className="text-amber-600" />
                  <span>কীভাবে BulkSMSBD থেকে API Key সংগ্রহ করবেন?</span>
                </div>
                <ol className="text-xs space-y-1 list-decimal list-inside text-amber-800">
                  <li><a href="https://bulksmsbd.net" target="_blank" rel="noopener noreferrer" className="underline font-bold">bulksmsbd.net</a> এ লগইন করুন।</li>
                  <li>ড্যাশবোর্ডের <strong>Developer API</strong> অথবা <strong>API Settings</strong> এ যান।</li>
                  <li>সেখান থেকে আপনার <strong>API Key</strong> এবং <strong>Sender ID</strong> কপি করে আপনার <code className="bg-white/80 px-1 py-0.5 rounded">.env</code> ফাইলে বসিয়ে সার্ভার রিস্টার্ট দিন।</li>
                </ol>
              </div>

              <a
                href="https://bulksmsbd.net/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F2C59] hover:bg-[#0A1E3C] text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>BulkSMSBD ড্যাশবোর্ডে লগইন করুন</span>
                <FaArrowUpRightFromSquare className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right: Live Test SMS Sender (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FaPaperPlane className="text-[#C8102E]" /> টেস্ট এসএমএস পাঠান
              </h3>
              <p className="text-xs text-slate-500">
                সরাসরি আপনার ব্যক্তিগত নম্বরে একটি টেস্ট এসএমএস পাঠিয়ে সংযোগ যাচাই করুন।
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="test-phone-input" className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার মোবাইল নম্বর:
                </label>
                <input
                  id="test-phone-input"
                  type="text"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0F2C59]"
                />
              </div>

              <div>
                <label htmlFor="test-message-area" className="block text-xs font-bold text-slate-700 mb-1">
                  টেস্ট বার্তা:
                </label>
                <textarea
                  id="test-message-area"
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0F2C59]"
                />
              </div>

              <button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest || !testNumber.trim() || !testMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A60D26] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {sendingTest ? (
                  <>
                    <FaRotate className="w-3.5 h-3.5 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-3.5 h-3.5" />
                    <span>টেস্ট এসএমএস পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
