'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaImages,
  FaExpand,
  FaXmark,
  FaArrowRight,
  FaCalendarDays,
} from 'react-icons/fa6';

interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  date: string;
  imageUrl: string;
}

const FEATURED_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g-1',
    title: 'শ্রেণিকক্ষে মাল্টিমিডিয়া ও ইন্টারেক্টিভ পাঠদান',
    subtitle: '৯ম ও ১০ম শ্রেণির বিজ্ঞান ও গণিত স্পেশাল ব্যাচ',
    categoryLabel: 'ক্লাসরুম ও পাঠদান',
    date: 'নভেম্বর ২০২৬',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-2',
    title: 'মাসিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষা গ্রহণ',
    subtitle: 'সুশৃঙ্খল পরিবেশে ৫ম থেকে ১০ম শ্রেণির লিখিত ও MCQ পরীক্ষা',
    categoryLabel: 'পরীক্ষা ও মূল্যায়ন',
    date: 'অক্টোবর ২০২৬',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-3',
    title: 'কৃতি শিক্ষার্থীদের মাঝে পুরস্কার ও সনদপত্র বিতরণ',
    subtitle: 'GPA 5.00 ও মেধাতালিকায় উত্তীর্ণদের বিশেষ সংবর্ধনা',
    categoryLabel: 'পুরস্কার ও সংবর্ধনা',
    date: 'অক্টোবর ২০২৬',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-4',
    title: 'গ্রুপ স্টাডি ও বিশেষ প্রবলেম সলভিং সেশন',
    subtitle: '৭ম ও ৮ম শ্রেণির গণিত ও ইংরেজি বিষয়ের নিবিড় কেয়ার ক্লাস',
    categoryLabel: 'ক্লাসরুম ও পাঠদান',
    date: 'সেপ্টেম্বর ২০২৬',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function HomeGallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(FEATURED_PHOTOS);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetch('/api/gallery', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-8 sm:py-10 space-y-8">
      {/* Section Header with UCC Style Red Accent */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3C] tracking-tight">
          আমাদের <span className="text-[#C8102E]">ফটো গ্যালারি</span>
        </h2>

        {/* UCC Style Red Center Accent Line (━━━ ■ ━━━) */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <div className="w-9 h-[3px] bg-[#C8102E] rounded-full" />
          <div className="w-3 h-[6px] bg-[#C8102E] rounded-xs" />
          <div className="w-9 h-[3px] bg-[#C8102E] rounded-full" />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto pt-1 font-medium">
          শিক্ষা নোভা একাডেমির ক্লাসরুম পাঠদান, মডেল টেস্ট পরীক্ষা ও কৃতি শিক্ষার্থী সংবর্ধনা অনুষ্ঠানের স্মরণীয় মুহূর্তসমূহ
        </p>
      </div>

      {/* 4-Card Responsive Grid (2 columns on mobile, 4 on lg) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#C8102E]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 sm:p-3.5">
                <span className="text-[9px] sm:text-[11px] font-bold text-white bg-[#C8102E] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-sm shadow-xs">
                  বড় করে দেখুন
                </span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#0A1E3C] flex items-center justify-center shadow">
                  <FaExpand className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </div>
              <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 text-[9px] sm:text-[10px] font-bold bg-[#0A1E3C]/90 backdrop-blur-xs text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-sm">
                {photo.categoryLabel}
              </span>
            </div>

            {/* Information Beneath Photo */}
            <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-0.5 sm:mb-1">
                  <FaCalendarDays className="text-[#C8102E] w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{photo.date}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0A1E3C] group-hover:text-[#C8102E] transition-colors leading-snug line-clamp-2">
                  {photo.title}
                </h3>
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-2 leading-relaxed pt-1 border-t border-slate-100">
                {photo.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Call-to-Action Link */}
      <div className="text-center pt-2">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 bg-[#0A1E3C] hover:bg-[#C8102E] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-sm transition shadow-sm hover:shadow-md"
        >
          <FaImages className="text-amber-400" />
          <span>সকল ছবি দেখুন (ফটো গ্যালারি)</span>
          <FaArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border-t-4 border-[#C8102E] animate-in zoom-in-95 duration-150"
          >
            <div className="relative h-64 sm:h-96 bg-slate-900">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-[#C8102E] text-white flex items-center justify-center transition"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-[#C8102E] text-white px-2.5 py-0.5 rounded-sm">
                  {activePhoto.categoryLabel}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{activePhoto.date}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3C]">{activePhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{activePhoto.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

