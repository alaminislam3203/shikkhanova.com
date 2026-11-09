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
  isAlertBadge?: boolean;
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
      isAlertBadge: true,
    },
    {
      id: 'addPdf',
      label: 'পিডিএফ শিট ও কার্ড ম্যানেজ',
      sublabel: 'PDF আপলোড, এডিট ও ডিলিট',
      icon: FaFilePdf,
      badge: pdfCount !== undefined && pdfCount > 0 ? `${pdfCount}টি` : undefined,
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Light Mode Sticky Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white text-slate-800 flex flex-col justify-between p-5 border-r border-slate-200/90 shadow-xl lg:shadow-xs transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:overflow-y-auto lg:self-start lg:z-30 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" clickable={true} />
              <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200/80 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Admin
              </span>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Box (Clean Light Mode Card) */}
          <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs transition group">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shadow-sm">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-base text-brand-700">
                    {displayName.charAt(0) || 'A'}
                  </span>
                )}
              </div>

              {onTriggerPhotoUpload && (
                <button
                  type="button"
                  onClick={onTriggerPhotoUpload}
                  title="প্রোফাইল ছবি পরিবর্তন করুন"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow border-2 border-white transition transform hover:scale-110"
                >
                  <FaCamera className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-xs font-black text-slate-800 truncate">{displayName}</p>
              </div>
              <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{displayEmail}</p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                  onClose();
                }}
                className="text-[10px] text-brand-700 hover:text-brand-800 font-bold mt-1 inline-block"
              >
                প্রোফাইল ও ফটো সেটিংস →
              </button>
            </div>
          </div>

          {/* Side Navigation Menu */}
          <nav className="space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-3 block">
              অ্যাডমিন মেনু
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
                      ? 'bg-gradient-to-r from-brand-700 to-brand-800 text-white shadow-brand border border-brand-600'
                      : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100/90 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition ${
                        active
                          ? 'bg-white/20 text-white shadow-inner'
                          : 'bg-slate-100 text-slate-500 group-hover:text-brand-700 group-hover:bg-brand-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold leading-tight truncate">{item.label}</p>
                      <p
                        className={`text-[10px] font-normal leading-tight mt-0.5 truncate ${
                          active ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs shrink-0 ml-1 ${
                        item.isAlertBadge
                          ? 'bg-amber-500 text-white animate-pulse'
                          : active
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-50 text-brand-700 border border-brand-200'
                      }`}
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
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-0.5">
            <div className="flex items-center gap-1.5 text-brand-700 font-bold">
              <FaPhone className="w-3 h-3 text-emerald-600" /> হেল্পলাইন ও পেমেন্ট নম্বর
            </div>
            <p className="font-mono font-black text-slate-800 text-xs">01712592519</p>
            <p className="text-[10px] text-slate-400">জুম্মাপাড়া, নীলফামারী সদর</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-bold py-2.5 px-3 rounded-xl text-xs transition border border-slate-200/80"
            >
              <span>ওয়েবসাইট</span>
              <FaArrowUpRightFromSquare className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition border border-rose-200/70"
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
