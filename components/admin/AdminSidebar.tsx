'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/components/common/Logo';
import {
  FaAward,
  FaFilePdf,
  FaUsers,
  FaArrowUpRightFromSquare,
  FaGear,
  FaXmark,
  FaPhone,
  FaCamera,
  FaArrowRightFromBracket,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';

export type AdminTab = 'purchases' | 'addResult' | 'addPdf' | 'students' | 'settings';

export interface AdminProfileInfo {
  name: string;
  email: string;
  image: string;
  phone: string;
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingCount: number;
  pdfCount?: number;
  isOpen: boolean;
  onClose: () => void;
  adminProfile?: AdminProfileInfo;
  onTriggerPhotoUpload?: () => void;
}

interface MenuItem {
  id: AdminTab;
  label: string;
  sublabel: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount,
  pdfCount,
  isOpen,
  onClose,
  adminProfile,
  onTriggerPhotoUpload,
}: AdminSidebarProps) {
  const { data: session } = useSession();

  const displayName = adminProfile?.name || session?.user?.name || 'রবিউল ইসলাম (পরিচালক)';
  const displayEmail = adminProfile?.email || session?.user?.email || 'robiulnil101@gmail.com';
  const displayImage = adminProfile?.image || session?.user?.image || '';

  const menuItems: MenuItem[] = [
    {
      id: 'purchases',
      label: 'পেমেন্ট রিকোয়েস্ট (TrxID)',
      sublabel: 'বিকাশ ও নগদ অনুমোদন',
      icon: TbCashBanknote,
      badge: pendingCount > 0 ? `${pendingCount}টি নতুন` : undefined,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
    },
    {
      id: 'addPdf',
      label: 'পিডিএফ শিট ও কার্ড ম্যানেজ',
      sublabel: 'PDF আপলোড, এডিট ও ডিলিট',
      icon: FaFilePdf,
      badge: pdfCount !== undefined && pdfCount > 0 ? `${pdfCount}টি` : undefined,
      badgeColor: 'bg-brand-500/40 text-blue-100 border border-brand-400/30',
    },
    {
      id: 'addResult',
      label: 'কোচিং রেজাল্ট আপলোড',
      sublabel: 'পরীক্ষার মার্কশিট তৈরি',
      icon: FaAward,
    },
    {
      id: 'students',
      label: 'শিক্ষার্থী ও উপস্থিতি',
      sublabel: 'রোল তালিকা ও হাজিরা',
      icon: FaUsers,
    },
    {
      id: 'settings',
      label: 'প্রোফাইল ও সেন্টার সেটিংস',
      sublabel: 'অ্যাডমিন ফটো ও তথ্য পরিবর্তন',
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

      {/* Sticky Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#020D24] via-[#041A42] to-[#010816] text-white flex flex-col justify-between p-5 border-r border-brand-800/60 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:overflow-y-auto lg:self-start lg:z-30 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl shadow-md">
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

          {/* Admin Profile Box with Real Avatar & Quick Photo Upload */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 shadow-inner transition group">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-nova-400 bg-gradient-to-tr from-brand-700 to-nova-500 flex items-center justify-center shadow-md">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-base text-white">
                    {displayName.charAt(0) || 'A'}
                  </span>
                )}
              </div>

              {onTriggerPhotoUpload && (
                <button
                  type="button"
                  onClick={onTriggerPhotoUpload}
                  title="প্রোফাইল ছবি পরিবর্তন করুন"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow border border-white/80 transition transform hover:scale-110"
                >
                  <FaCamera className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <p className="text-xs font-black text-white truncate">{displayName}</p>
              </div>
              <p className="text-[10px] text-blue-200 font-mono truncate mt-0.5">{displayEmail}</p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                  onClose();
                }}
                className="text-[10px] text-nova-400 hover:text-nova-300 font-bold mt-1 inline-block"
              >
                প্রোফাইল ও ফটো সেটিংস →
              </button>
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
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand border border-brand-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 transition ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-slate-400 group-hover:text-nova-400 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold leading-tight truncate">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0 ml-1 ${item.badgeColor}`}
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
        <div className="pt-4 mt-4 border-t border-white/10 space-y-2.5">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[11px] text-slate-300 space-y-0.5">
            <div className="flex items-center gap-1.5 text-nova-400 font-bold">
              <FaPhone className="w-3 h-3" /> হেল্পলাইন ও পেমেন্ট নম্বর
            </div>
            <p className="font-mono font-bold text-white text-xs">01712592519</p>
            <p className="text-[10px] text-slate-400">জুম্মাপাড়া, নীলফামারী সদর</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition border border-white/10"
            >
              <span>ওয়েবসাইট</span>
              <FaArrowUpRightFromSquare className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center justify-center gap-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition border border-rose-500/30"
            >
              <FaArrowRightFromBracket className="w-3 h-3" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
