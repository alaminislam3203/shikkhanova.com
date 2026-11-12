"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function AboutPreviewSection() {
  return (
    <section
      suppressHydrationWarning
      className="relative p-6 sm:p-8 lg:p-12 overflow-hidden select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: Editorial Narrative & Action Button (7 cols)
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Red Accent Top Bar */}
          <div className="flex items-center gap-1.5">
            <span className="w-10 sm:w-12 h-1 bg-[#C8102E] rounded-full block" />
            <span className="w-2 h-1 bg-[#C8102E]/40 rounded-full block" />
          </div>

          {/* Impactful Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
            মানসম্মত শিক্ষা ও সাফল্যের অঙ্গীকার নিয়ে এগিয়ে চলেছে{" "}
            <span className="text-[#C8102E] font-black inline-block">
              শিক্ষানোভা পরিবার !!!
            </span>
          </h2>

          {/* Narrative Paragraph */}
          <p className="text-xs sm:text-sm md:text-[15px] text-slate-600 leading-relaxed sm:leading-loose text-justify font-normal">
            শিক্ষার মূল উদ্দেশ্য হলো একজন শিক্ষার্থীর সুপ্ত মেধা ও প্রতিভাকে
            বিকশিত করা, তার চিন্তা শক্তিকে ত্বরান্বিত করা এবং তাকে ধৈর্যশীল,
            আত্মবিশ্বাসী, নীতিবান ও দায়িত্ববান মানুষ হিসেবে গড়ে তোলা—এই নীতিকে
            সামনে নিয়ে শুরু থেকেই শিক্ষানোভা পরিবারের পথচলা। সততা, নিষ্ঠা, গভীর
            যত্ন ও পরিবর্তনের মানসিকতা নিয়ে আমরা প্রতিটি শিক্ষার্থীর মেধা বিকাশ
            ও বোর্ড পরীক্ষায় শ্রেষ্ঠত্ব অর্জনে অঙ্গীকারবদ্ধ। এগিয়ে চলেছে
            পরিবর্তনের প্রত্যয় নিয়ে, এগিয়ে চলেছে প্রতিটি শিক্ষার্থীর স্বপ্ন
            পূরণের এক উজ্জ্বল পথচলা।
          </p>

          {/* Action Button: আরও পড়ুন -> /about */}
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A50D26] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>আরও পড়ুন</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: Educational Illustration (5 cols)
            (Matching Reference: Stacked books, student, trophy, lightbulb)
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="w-full max-w-md lg:max-w-none relative">
            <svg
              viewBox="0 0 500 420"
              className="w-full h-auto drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="bulbGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                <linearGradient id="trophyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                <linearGradient id="bookRed" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#C8102E" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>

                <linearGradient id="bookBlue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0F2C59" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>

                <linearGradient id="bookNavy" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Background Decorative Soft Foliage */}
              <path
                d="M330 200 C320 150, 360 120, 380 140 C410 170, 380 230, 350 240 Z"
                fill="url(#leafGrad)"
              />
              <path
                d="M260 210 C240 160, 270 130, 300 140 C320 170, 300 230, 270 240 Z"
                fill="url(#leafGrad)"
              />

              {/* Ground base shadow */}
              <ellipse cx="320" cy="385" rx="140" ry="12" fill="#E2E8F0" />

              {/* Floating Paper Airplane */}
              <g transform="translate(340, 45) rotate(-15) scale(0.9)">
                <path d="M0 10 L45 0 L15 35 L12 20 Z" fill="#93C5FD" />
                <path d="M45 0 L15 35 L12 20 Z" fill="#60A5FA" />
                {/* Dashed trail */}
                <path
                  d="M-40 25 Q-15 18, 0 10"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                />
              </g>

              {/* Glowing Idea Lightbulb */}
              <g transform="translate(315, 60)">
                {/* Glow rays */}
                <line
                  x1="25"
                  y1="-8"
                  x2="25"
                  y2="-20"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="45"
                  y1="2"
                  x2="56"
                  y2="-8"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="5"
                  y1="2"
                  x2="-6"
                  y2="-8"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="50"
                  y1="25"
                  x2="62"
                  y2="25"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="0"
                  y1="25"
                  x2="-12"
                  y2="25"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Bulb Glass */}
                <path
                  d="M12 40 C0 28, 5 8, 25 8 C45 8, 50 28, 38 40 L35 48 L15 48 Z"
                  fill="url(#bulbGrad)"
                  filter="drop-shadow(0px 2px 4px rgba(245, 158, 11, 0.3))"
                />
                {/* Filament */}
                <path
                  d="M20 28 Q25 20, 25 32 Q25 20, 30 28"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Base Screw */}
                <rect
                  x="18"
                  y="48"
                  width="14"
                  height="4"
                  rx="2"
                  fill="#94A3B8"
                />
                <rect
                  x="20"
                  y="52"
                  width="10"
                  height="3"
                  rx="1.5"
                  fill="#64748B"
                />
                <rect
                  x="22"
                  y="55"
                  width="6"
                  height="3"
                  rx="1"
                  fill="#475569"
                />
              </g>

              {/* Gold Victory Trophy on Left */}
              <g transform="translate(70, 210)">
                {/* Sparkle Stars */}
                <circle cx="5" cy="5" r="2.5" fill="#F59E0B" />
                <circle cx="95" cy="15" r="2" fill="#F59E0B" />
                <circle cx="20" cy="50" r="1.5" fill="#F59E0B" />

                {/* Trophy Handles */}
                <path
                  d="M18 45 C-5 45, -5 85, 18 90"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M82 45 C105 45, 105 85, 82 90"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Trophy Cup */}
                <path
                  d="M15 35 Q15 105, 50 115 Q85 105, 85 35 Z"
                  fill="url(#trophyGrad)"
                />
                {/* Rim */}
                <ellipse cx="50" cy="35" rx="35" ry="6" fill="#FDE047" />

                {/* White #1 Emblem on Trophy */}
                <circle cx="50" cy="72" r="14" fill="#FFFFFF" opacity="0.95" />
                <text
                  x="50"
                  y="77"
                  textAnchor="middle"
                  fill="#D97706"
                  fontSize="15"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  1
                </text>

                {/* Trophy Stem & Pedestal */}
                <path d="M43 115 L57 115 L55 135 L45 135 Z" fill="#D97706" />
                <path d="M30 135 L70 135 L75 155 L25 155 Z" fill="#92400E" />
                <rect
                  x="20"
                  y="155"
                  width="60"
                  height="12"
                  rx="3"
                  fill="#78350F"
                />
              </g>

              {/* Stack of Educational Books */}
              {/* Bottom Book (Navy) */}
              <g transform="translate(230, 320)">
                <rect
                  x="0"
                  y="0"
                  width="170"
                  height="42"
                  rx="4"
                  fill="url(#bookNavy)"
                />
                <rect x="16" y="6" width="154" height="30" fill="#F8FAFC" />
                <line
                  x1="22"
                  y1="12"
                  x2="162"
                  y2="12"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="18"
                  x2="162"
                  y2="18"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="24"
                  x2="162"
                  y2="24"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="30"
                  x2="162"
                  y2="30"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <rect
                  x="0"
                  y="0"
                  width="20"
                  height="42"
                  rx="4"
                  fill="#0F172A"
                />
              </g>

              {/* Middle Book (Vibrant Red) */}
              <g transform="translate(225, 275)">
                <rect
                  x="0"
                  y="0"
                  width="160"
                  height="40"
                  rx="4"
                  fill="url(#bookRed)"
                />
                <rect x="16" y="6" width="144" height="28" fill="#FFFFFF" />
                <line
                  x1="22"
                  y1="12"
                  x2="152"
                  y2="12"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="18"
                  x2="152"
                  y2="18"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="24"
                  x2="152"
                  y2="24"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="40"
                  rx="4"
                  fill="#9F1239"
                />
              </g>

              {/* Top Book (Deep Blue) */}
              <g transform="translate(240, 235)">
                <rect
                  x="0"
                  y="0"
                  width="145"
                  height="36"
                  rx="4"
                  fill="url(#bookBlue)"
                />
                <rect x="15" y="5" width="130" height="26" fill="#F8FAFC" />
                <rect
                  x="0"
                  y="0"
                  width="16"
                  height="36"
                  rx="4"
                  fill="#0A1E3C"
                />
              </g>

              {/* Ladder Leaning on the Books */}
              <g transform="translate(225, 220)">
                <line
                  x1="0"
                  y1="150"
                  x2="35"
                  y2="0"
                  stroke="#334155"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="18"
                  y1="150"
                  x2="53"
                  y2="0"
                  stroke="#334155"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="6"
                  y1="125"
                  x2="24"
                  y2="125"
                  stroke="#334155"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="13"
                  y1="95"
                  x2="31"
                  y2="95"
                  stroke="#334155"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="20"
                  y1="65"
                  x2="38"
                  y2="65"
                  stroke="#334155"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="27"
                  y1="35"
                  x2="45"
                  y2="35"
                  stroke="#334155"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              {/* Student Studying on Top of Books */}
              <g transform="translate(305, 155)">
                {/* Hair */}
                <ellipse cx="20" cy="18" rx="8" ry="9" fill="#1E293B" />
                {/* Face */}
                <circle cx="20" cy="20" r="6" fill="#FCD34D" />
                {/* Body (Pink/Red shirt) */}
                <path
                  d="M12 28 C12 25, 28 25, 28 28 L32 50 L8 50 Z"
                  fill="#E11D48"
                />
                {/* Blue Pants */}
                <path
                  d="M8 50 L32 50 L36 78 L26 78 L20 60 L14 78 L4 78 Z"
                  fill="#1E3A8A"
                />
                {/* Laptop in Lap */}
                <path d="M16 46 L36 46 L34 35 L18 35 Z" fill="#CBD5E1" />
                <rect
                  x="14"
                  y="46"
                  width="24"
                  height="3"
                  rx="1"
                  fill="#94A3B8"
                />
              </g>

              {/* Magnifying Glass Leaning on Bottom */}
              <g transform="translate(245, 345) rotate(25)">
                <circle
                  cx="25"
                  cy="25"
                  r="22"
                  stroke="#1E40AF"
                  strokeWidth="6"
                  fill="#DBEAFE"
                  fillOpacity="0.4"
                />
                <rect
                  x="22"
                  y="47"
                  width="6"
                  height="42"
                  rx="3"
                  fill="#1E40AF"
                />
              </g>

              {/* Yellow Educational Pencil on Bottom */}
              <g transform="translate(330, 368)">
                <rect
                  x="0"
                  y="0"
                  width="75"
                  height="12"
                  rx="2"
                  fill="#F59E0B"
                />
                <polygon points="75,0 92,6 75,12" fill="#FDE68A" />
                <polygon points="87,4 92,6 87,8" fill="#1E293B" />
                <rect
                  x="-10"
                  y="0"
                  width="10"
                  height="12"
                  rx="2"
                  fill="#FDA4AF"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
