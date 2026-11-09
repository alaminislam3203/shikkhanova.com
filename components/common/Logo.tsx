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
  clickable = true,
  className = '',
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-10 sm:h-11',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
  };

  const content = (
    <div className={`relative inline-flex items-center group select-none ${className}`}>
      <img
        src="/logo.svg"
        alt="শিক্ষা নোভা - শিখবো, জিতবো"
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs`}
      />
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
