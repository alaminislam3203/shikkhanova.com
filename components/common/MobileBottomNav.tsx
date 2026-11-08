'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FaHouse,
  FaUserCheck,
  FaAward,
  FaFilePdf,
  FaUser,
  FaUserShield,
} from 'react-icons/fa6';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If in admin panel, do not render public mobile nav
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'হোম',
      icon: FaHouse,
      exact: true,
    },
    {
      href: '/attendance',
      label: 'হাজিরা',
      icon: FaUserCheck,
      exact: false,
    },
    {
      href: '/results',
      label: 'রেজাল্ট',
      icon: FaAward,
      exact: false,
    },
    {
      href: '/pdfs',
      label: 'হ্যান্ডনোট',
      icon: FaFilePdf,
      exact: false,
    },
    {
      href: session?.user
        ? session.user.role === 'ADMIN'
          ? '/admin'
          : '/account'
        : '/login',
      label: session?.user
        ? session.user.role === 'ADMIN'
          ? 'অ্যাডমিন'
          : 'প্রোফাইল'
        : 'লগইন',
      icon: session?.user?.role === 'ADMIN' ? FaUserShield : FaUser,
      isProfile: true,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="মোবাইল নেভিগেশন"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      {/* Frosted Glass Background with Subtle Glow */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 sm:px-4">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== '/';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 group min-w-[56px] ${
                  active
                    ? 'text-brand-800'
                    : 'text-slate-500 hover:text-brand-700'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {active && (
                  <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-brand-600 via-nova-500 to-brand-600 rounded-full animate-in fade-in zoom-in-75 duration-200" />
                )}

                {/* Icon Container */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    active
                      ? 'bg-brand-50 text-brand-700 shadow-xs scale-105'
                      : 'text-slate-500 group-hover:scale-105'
                  }`}
                >
                  {/* If Profile & logged in with avatar, show real photo */}
                  {item.isProfile && session?.user ? (
                    <div
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${
                        active
                          ? 'border-brand-600 shadow-sm'
                          : 'border-slate-300'
                      }`}
                    >
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-700 text-white flex items-center justify-center text-[10px] font-black">
                          {session.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-bold tracking-tight mt-0.5 leading-none transition-colors ${
                    active
                      ? 'text-brand-800 font-black'
                      : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

