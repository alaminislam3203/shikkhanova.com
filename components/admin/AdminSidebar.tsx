'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import {
  FaAward,
  FaFilePdf,
  FaUsers,
  FaArrowUpRightFromSquare,
  FaGear,
  FaXmark,
  FaPhone,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';

export type AdminTab = 'purchases' | 'addResult' | 'addPdf' | 'students' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'purchases' as AdminTab,
      label: 'পেমেন্ট রিকোয়েস্ট (TrxID)',
      sublabel: 'বিকাশ ও নগদ অনুমোদন',
      icon: TbCashBanknote,
      badge: pendingCount > 0 ? `${pendingCount}টি নতুন` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'addResult' as AdminTab,
      label: 'কোচিং রেজাল্ট আপলোড',
      sublabel: 'পরীক্ষার মার্কশিট তৈরি',
      icon: FaAward,
    },
    {
      id: 'addPdf' as AdminTab,
      label: 'পিডিএফ শিট পাবলিশ',
      sublabel: 'নতুন সাজেশন যুক্ত করুন',
      icon: FaFilePdf,
    },
    {
      id: 'students' as AdminTab,
      label: 'শিক্ষার্থী ও উপস্থিতি',
      sublabel: 'রোল তালিকা ও হাজিরা',
      icon: FaUsers,
    },
    {
      id: 'settings' as AdminTab,
      label: 'সেন্টার সেটিংস ও তথ্য',
      sublabel: 'হেল্পলাইন ও প্রোফাইল',
      icon: FaGear,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#020D24] via-[#041A42] to-[#010816] text-white flex flex-col justify-between p-5 border-r border-brand-800/60 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-md">
                <Logo size="sm" clickable={false} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white leading-tight">অ্যাডমিন কন্ট্রোল</h2>
                <span className="text-[10px] text-nova-400 font-bold uppercase tracking-wider">
                  Master Portal
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-nova-500 text-white flex items-center justify-center font-black text-sm shadow">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">রবিউল ইসলাম (পরিচালক)</p>
              <p className="text-[10px] text-blue-200 font-mono truncate">robiulnil101@gmail.com</p>
            </div>
          </div>

          {/* Side Navigation Menu */}
          <nav className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 block">
              প্রধান মেন্যু
            </span>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group ${
                    active
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand scale-102 border border-brand-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-slate-400 group-hover:text-nova-400 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold leading-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-nova-400 font-bold">
              <FaPhone className="w-3 h-3" /> হেল্পলাইন নম্বর
            </div>
            <p className="font-mono font-bold text-white text-xs">01712592519</p>
            <p className="text-[10px] text-slate-400">জুম্মাপাড়া, নীলফামারী সদর</p>
          </div>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 rounded-xl text-xs transition border border-white/10"
          >
            <span>মূল ওয়েবসাইটে যান</span>
            <FaArrowUpRightFromSquare className="w-3 h-3" />
          </Link>
        </div>
      </aside>
    </>
  );
}

