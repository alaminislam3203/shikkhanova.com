'use client';

import React from 'react';
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
  const sizeClasses = {
    sm: 'h-9 sm:h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
  };

  const content = (
    <div className={`relative flex items-center gap-3 group ${className}`}>
      <img
        src="/logo.png"
        alt="Shikkha Nova - শিখবো, জিতবো"
        className={`${sizeClasses[size]} w-auto object-contain group-hover:scale-102 transition-transform duration-300 drop-shadow-sm`}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (!img.src.endsWith('/logo.svg')) {
            img.src = '/logo.svg';
          } else {
            img.style.display = 'none';
            const fallback = document.getElementById('logo-text-fallback');
            if (fallback) fallback.style.display = 'flex';
          }
        }}
      />
      
      {/* SVG / Text Fallback */}
      <div id="logo-text-fallback" style={{ display: 'none' }} className="items-center gap-2">
        <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-black text-xl shadow-md">
          🎓
        </div>
        <div>
          <span className="text-2xl font-black text-brand-900">
            Shikkha<span className="text-nova-500">Nova</span>
          </span>
          {showSlogan && (
            <span className="block text-[11px] font-extrabold text-slogan-600">
              শিখবো, জিতবো
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (clickable) {
    return <Link href="/" className="inline-block">{content}</Link>;
  }

  return content;
}

