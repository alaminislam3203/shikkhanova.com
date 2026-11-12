'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { confirmSignOut } from '@/lib/logout';
import Logo from '@/components/common/Logo';
import {
  FaAward,
  FaFilePdf,
  FaUsers,
  FaArrowUpRightFromSquare,
  FaGear,
  FaXmark,
  FaCamera,
  FaArrowRightFromBracket,
  FaAnglesLeft,
  FaAnglesRight,
  FaChartPie,
  FaBell,
  FaBookOpen,
  FaUserCheck,
  FaImages,
  FaCommentSms,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';

export type AdminTab =
  | 'dashboard'
  | 'banners'
  | 'achievers'
  | 'purchases'
  | 'addPdf'
  | 'mcqQuiz'
  | 'addResult'
  | 'gallery'
  | 'notices'
  | 'students'
  | 'subjects'
  | 'attendance'
  | 'sms'
  | 'settings';

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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
  collapsed: controlledCollapsed,
  onToggleCollapse,
  adminProfile,
  onTriggerPhotoUpload,
}: AdminSidebarProps) {
  const { data: session } = useSession();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapseToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const displayName = adminProfile?.name || session?.user?.name || 'রবিউল ইসলাম (পরিচালক)';
  const displayEmail = adminProfile?.email || session?.user?.email || 'robiulnil101@gmail.com';
  const displayImage = adminProfile?.image || session?.user?.image || '';

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড ওভারভিউ',
      sublabel: 'লাইভ পরিসংখ্যান ও রিপোর্ট',
      icon: FaChartPie,
    },
    {
      id: 'banners',
      label: 'হিরো ব্যানার স্লাইডার',
      sublabel: 'হোমপেজ ব্যানার আপলোড ও ম্যানেজ',
      icon: FaImages,
    },
    {
      id: 'achievers',
      label: 'আমাদের সাফল্য গাঁথা',
      sublabel: '৬ষ্ঠ-১০ম কৃতী শিক্ষার্থী ম্যানেজ',
      icon: FaAward,
    },
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
      id: 'mcqQuiz',
      label: 'অনলাইন কুইজ ও MCQ',
      sublabel: 'মডেল টেস্ট প্রশ্ন যোগ ও ম্যানেজ',
      icon: FaBookOpen,
      badge: 'MCQ',
    },
    {
      id: 'addResult',
      label: 'কোচিং রেজাল্ট আপলোড',
      sublabel: 'পরীক্ষার মার্কশিট তৈরি',
      icon: FaAward,
    },
    {
      id: 'students',
      label: 'শিক্ষার্থী ম্যানেজ ও ভর্তি',
      sublabel: 'নতুন শিক্ষার্থী যোগ ও তালিকা',
      icon: FaUsers,
    },
    {
      id: 'subjects',
      label: 'বিষয় ও NCTB বই (৫ম-১০ম)',
      sublabel: 'শ্রেণিভিত্তিক বিষয় ও বোর্ড বই',
      icon: FaBookOpen,
      badge: 'NCTB',
    },
    {
      id: 'attendance',
      label: 'রোল উপস্থিতি (Attendance)',
      sublabel: 'শ্রেণি ৫-১০ হাজিরা গ্রহণ',
      icon: FaUserCheck,
    },
    {
      id: 'sms',
      label: 'এসএমএস সেন্টার (BulkSMS)',
      sublabel: 'হাজিরা, রেজাল্ট ও ফি নোটিফিকেশন',
      icon: FaCommentSms,
      badge: 'SMS',
    },
    {
      id: 'gallery',
      label: 'ফটো গ্যালারি ম্যানেজ',
      sublabel: 'ছবি আপলোড, এডিট ও ডিলিট',
      icon: FaImages,
      badge: 'Photos',
    },
    {
      id: 'notices',
      label: 'নোটিশ বোর্ড ম্যানেজ',
      sublabel: 'নোটিশ প্রকাশ, এডিট ও ডিলিট',
      icon: FaBell,
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

      {/* Light Mode Collapsible & Sticky Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 ${
          isCollapsed ? 'lg:w-20 lg:px-3 lg:py-5' : 'lg:w-72 lg:p-5'
        } p-5 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200/90 shadow-xl lg:shadow-xs transition-all duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:overflow-y-auto lg:overflow-x-hidden lg:self-start lg:z-30 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Brand Header & Navigation Menu */}
        <div className="space-y-5">
          
          {/* Header & Collapse Button */}
          <div
            className={`flex items-center pb-4 border-b border-slate-100 ${
              isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'
            }`}
          >
            {/* Expanded Logo */}
            <div className={`flex items-center gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <Logo size="sm" clickable={true} />
              <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200/80 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Admin
              </span>
            </div>

            {/* Desktop Collapse / Expand Button */}
            <button
              type="button"
              onClick={handleCollapseToggle}
              title={isCollapsed ? 'সাইডবার বড় করুন (Expand)' : 'সাইডবার ছোট করুন (Collapse)'}
              className="hidden lg:flex w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-700 items-center justify-center transition border border-slate-200/80 shrink-0 shadow-2xs"
            >
              {isCollapsed ? (
                <FaAnglesRight className="w-4 h-4" />
              ) : (
                <FaAnglesLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          {/* Side Navigation Menu */}
          <nav className="space-y-1.5">
            <span
              className={`text-[10px] uppercase font-black text-slate-400 tracking-wider px-3 block ${
                isCollapsed ? 'lg:hidden' : ''
              }`}
            >
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
                  title={isCollapsed ? `${item.label} — ${item.sublabel}` : undefined}
                  className={`w-full text-left rounded-2xl text-xs font-bold transition-all flex items-center relative group ${
                    isCollapsed
                      ? 'lg:justify-center lg:p-2.5 p-3 justify-between'
                      : 'p-3 justify-between'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-brand-700 to-brand-800 text-white shadow-brand border border-brand-600'
                      : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100/90 border border-transparent'
                  }`}
                >
                  <div
                    className={`flex items-center min-w-0 ${
                      isCollapsed ? 'lg:gap-0 gap-3' : 'gap-3'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition ${
                        active
                          ? 'bg-white/20 text-white shadow-inner'
                          : 'bg-slate-100 text-slate-500 group-hover:text-brand-700 group-hover:bg-brand-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className={`min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
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

                  {/* Badge when Expanded */}
                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs shrink-0 ml-1 ${
                        isCollapsed ? 'lg:hidden' : ''
                      } ${
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

                  {/* Small Dot Badge when Collapsed */}
                  {item.badge && isCollapsed && (
                    <span
                      className={`hidden lg:block absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        item.isAlertBadge ? 'bg-amber-500 animate-ping' : 'bg-brand-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Section: Admin Profile & Email Card + Action Buttons */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
          
          {/* Admin Profile & Email Box at the Bottom */}
          <div
            className={`bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 border border-slate-200/90 rounded-2xl transition group ${
              isCollapsed
                ? 'lg:p-2 lg:flex lg:justify-center p-3 flex items-center gap-3'
                : 'p-3 flex items-center gap-3 shadow-xs'
            }`}
          >
            <div className="relative shrink-0" title={displayName}>
              <div
                onClick={() => {
                  setActiveTab('settings');
                  onClose();
                }}
                className={`${
                  isCollapsed ? 'lg:w-10 lg:h-10' : 'w-11 h-11'
                } w-11 h-11 rounded-2xl overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shadow-sm cursor-pointer`}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-sm text-brand-700">
                    {displayName.charAt(0) || 'A'}
                  </span>
                )}
              </div>

              {onTriggerPhotoUpload && (
                <button
                  type="button"
                  onClick={onTriggerPhotoUpload}
                  title="প্রোফাইল ছবি পরিবর্তন করুন"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow border-2 border-white transition transform hover:scale-110"
                >
                  <FaCamera className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className={`overflow-hidden flex-1 min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
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
                className="text-[10px] text-brand-700 hover:text-brand-800 font-bold mt-0.5 inline-block"
              >
                প্রোফাইল সেটিংস →
              </button>
            </div>
          </div>

          {/* Website & Logout Buttons */}
          <div
            className={`grid gap-2 ${
              isCollapsed ? 'lg:grid-cols-1 grid-cols-2' : 'grid-cols-2'
            }`}
          >
            <Link
              href="/"
              title="মূল ওয়েবসাইটে যান"
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-bold py-2.5 px-3 rounded-xl text-xs transition border border-slate-200/80"
            >
              <span className={isCollapsed ? 'lg:hidden' : ''}>ওয়েবসাইট</span>
              <FaArrowUpRightFromSquare className="w-3.5 h-3.5 shrink-0" />
            </Link>

            <button
              type="button"
              onClick={() => confirmSignOut()}
              title="লগআউট করুন"
              className="inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition border border-rose-200/70 cursor-pointer"
            >
              <FaArrowRightFromBracket className="w-3.5 h-3.5 shrink-0" />
              <span className={isCollapsed ? 'lg:hidden' : ''}>লগআউট</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
