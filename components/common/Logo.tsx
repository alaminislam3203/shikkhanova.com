'use client';

import React, { useId } from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
  clickable?: boolean;
  className?: string;
}

export default function Logo({
  size = 'md',
  showSlogan = true,
  clickable = true,
  className = '',
}: LogoProps) {
  const uid = useId().replace(/:/g, '');

  const sizeConfig = {
    sm: {
      crest: 'w-9 h-9 sm:w-10 sm:h-10',
      bnTitle: 'text-lg sm:text-xl',
      enSub: 'text-[9px] sm:text-[10px]',
      slogan: 'text-[9px] sm:text-[10px] px-1.5 py-0.5',
      gap: 'gap-2',
    },
    md: {
      crest: 'w-11 h-11 sm:w-12 sm:h-12',
      bnTitle: 'text-xl sm:text-2xl',
      enSub: 'text-[10px] sm:text-[11px]',
      slogan: 'text-[10px] sm:text-[11px] px-2 py-0.5',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      crest: 'w-14 h-14 sm:w-16 sm:h-16',
      bnTitle: 'text-2xl sm:text-3xl',
      enSub: 'text-xs sm:text-sm',
      slogan: 'text-[11px] sm:text-xs px-2.5 py-0.5',
      gap: 'gap-3 sm:gap-3.5',
    },
  }[size];

  const content = (
    <div className={`relative inline-flex items-center ${sizeConfig.gap} group select-none ${className}`}>
      {/* UCC Theme Academic Shield & Mortarboard Vector Crest */}
      <div className={`${sizeConfig.crest} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 180 185"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`uccNavy-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#071426" />
              <stop offset="55%" stopColor="#0A1E3C" />
              <stop offset="100%" stopColor="#15325E" />
            </linearGradient>
            <linearGradient id={`uccRed-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E51C39" />
              <stop offset="50%" stopColor="#C8102E" />
              <stop offset="100%" stopColor="#9B0A22" />
            </linearGradient>
            <linearGradient id={`uccGold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Academic Shield Base (Deep Navy with UCC Crimson Red Border) */}
          <path
            d="M 90,8 L 164,34 L 164,98 C 164,142 132,166 90,180 C 48,166 16,142 16,98 L 16,34 Z"
            fill={`url(#uccNavy-${uid})`}
            stroke="#C8102E"
            strokeWidth="5"
          />

          {/* Inner Shield Accent Line */}
          <path
            d="M 90,17 L 154,40 L 154,96 C 154,134 126,155 90,168 C 54,155 26,134 26,96 L 26,40 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />

          {/* Crimson Red Core Sun inside Shield */}
          <circle cx="90" cy="95" r="38" fill={`url(#uccRed-${uid})`} />

          {/* Graduation Cap (Mortarboard) */}
          <polygon points="90,28 148,54 90,78 32,54" fill="#FFFFFF" />
          <polygon points="90,32 140,54 90,74 40,54" fill={`url(#uccNavy-${uid})`} />
          <path d="M 60,67 Q 90,84 120,67 L 120,79 Q 90,96 60,79 Z" fill="#FFFFFF" />

          {/* Gold Cap Button & Tassel */}
          <circle cx="90" cy="54" r="4.5" fill={`url(#uccGold-${uid})`} />
          <path
            d="M 90,54 Q 120,58 128,84"
            stroke={`url(#uccGold-${uid})`}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <polygon points="124,83 132,83 135,98 121,98" fill={`url(#uccGold-${uid})`} />

          {/* Rising Student / Knowledge Beacon */}
          <circle cx="90" cy="96" r="9" fill="#FFFFFF" />
          <path
            d="M 90,108 Q 76,122 62,134 Q 90,118 118,134 Q 104,122 90,108 Z"
            fill="#FFFFFF"
          />

          {/* Open Book Upper Pages */}
          <path d="M 90,136 Q 60,116 34,128 Q 62,102 90,126 Z" fill="#FFFFFF" />
          <path d="M 90,136 Q 120,116 146,128 Q 118,102 90,126 Z" fill="#FFFFFF" />

          {/* Open Book Lower Wings (UCC Crimson Red) */}
          <path d="M 90,148 Q 56,128 30,142 Q 58,118 90,138 Z" fill={`url(#uccRed-${uid})`} />
          <path d="M 90,148 Q 124,128 150,142 Q 122,118 90,138 Z" fill={`url(#uccRed-${uid})`} />
        </svg>
      </div>

      {/* UCC Style Brand Typography (Noto Sans Bengali + Poppins) */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`${sizeConfig.bnTitle} font-black tracking-tight text-[#0A1E3C]`}>
            শিক্ষা<span className="text-[#C8102E]">নোভা</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          <span className={`${sizeConfig.enSub} font-extrabold uppercase tracking-wider text-[#0A1E3C]`}>
            Shikkha<span className="text-[#C8102E]">Nova</span>
          </span>

          {showSlogan && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#C8102E]" />
              <span
                className={`${sizeConfig.slogan} font-extrabold text-white bg-[#C8102E] rounded-full leading-tight shadow-2xs`}
              >
                শিখবো, জিতবো
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
