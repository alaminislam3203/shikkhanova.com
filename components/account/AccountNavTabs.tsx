'use client';

import React from 'react';
import Link from 'next/link';
import { FaUser, FaShieldHalved, FaBookOpen } from 'react-icons/fa6';

export type AccountTabKey = 'account' | 'security' | 'sheets';

interface AccountNavTabsProps {
  activeTab: AccountTabKey;
}

export default function AccountNavTabs({ activeTab }: AccountNavTabsProps) {
  const tabs = [
    {
      id: 'account' as AccountTabKey,
      label: 'একাউন্ট',
      href: '/account',
      icon: FaUser,
    },
    {
      id: 'security' as AccountTabKey,
      label: 'নিরাপত্তা ও পাসওয়ার্ড',
      href: '/password',
      icon: FaShieldHalved,
    },
    {
      id: 'sheets' as AccountTabKey,
      label: 'আমার শিট ও ফলাফল',
      href: '/my-notes',
      icon: FaBookOpen,
    },
  ];

  return (
    <div className="w-full flex justify-center py-1 sm:py-2">
      <nav
        aria-label="অ্যাকাউন্ট নেভিগেশন ট্যাব"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-1 sm:p-1.5 shadow-sm max-w-xl w-full flex items-center justify-between gap-1 sm:gap-1.5"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-2 sm:px-4 rounded-xl text-center transition-all duration-200 group ${
                isActive
                  ? 'bg-[#0A1E3C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0A1E3C] hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 mb-1 transition-transform ${
                  isActive
                    ? 'text-white scale-105'
                    : 'text-slate-400 group-hover:text-[#0A1E3C] group-hover:scale-105'
                }`}
              />
              <span
                className={`text-[11px] sm:text-xs tracking-tight leading-tight ${
                  isActive ? 'font-bold text-white' : 'font-semibold text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

