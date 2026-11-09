'use client';

import React, { useState } from 'react';
import {
  FaImages,
  FaExpand,
  FaXmark,
  FaLocationDot,
  FaCalendarDays,
  FaAward,
} from 'react-icons/fa6';

interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'classroom' | 'award' | 'exam' | 'campus';
  categoryLabel: string;
  date: string;
  imageUrl: string;
}

const GALLERY_ITEMS: GalleryPhoto[] = [
  {
    id: 'g-1',
    title: 'শ্রেণিকক্ষে মাল্টিমিডিয়া ও ইন্টারেক্টিভ পাঠদান',
    subtitle: '৯ম ও ১০ম শ্রেণির বিজ্ঞান ও গণিত স্পেশাল ব্যাচ • জুম্মাপাড়া, নীলফামারী সদর',
    category: 'classroom',
    categoryLabel: 'ক্লাসরুম ও পাঠদান',
    date: 'নভেম্বর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-2',
    title: 'মাসিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষা গ্রহণ',
    subtitle: 'সুশৃঙ্খল পরিবেশে ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের লিখিত ও এমসিকিউ পরীক্ষা',
    category: 'exam',
    categoryLabel: 'পরীক্ষা ও মূল্যায়ন',
    date: 'অক্টোবর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-3',
    title: 'কৃতি শিক্ষার্থীদের মাঝে পুরস্কার ও সনদপত্র বিতরণ',
    subtitle: 'GPA 5.00 ও মেধাতালিকায় উত্তীর্ণ শিক্ষার্থীদের বিশেষ সংবর্ধনা অনুষ্ঠান',
    category: 'award',
    categoryLabel: 'পুরস্কার ও সংবর্ধনা',
    date: 'অক্টোবর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-4',
    title: 'অধ্যায়ভিত্তিক প্রিমিয়াম হ্যান্ডনোট ও শিট প্রস্তুতি',
    subtitle: 'শিক্ষা নোভা গবেষণা ও সম্পাদনা পর্ষদের প্রস্তুতকৃত এক্সক্লুসিভ হ্যান্ডনোট',
    category: 'campus',
    categoryLabel: 'একাডেমিক কার্যক্রম',
    date: 'সেপ্টেম্বর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-5',
    title: 'গ্রুপ স্টাডি ও বিশেষ প্রবলেম সলভিং সেশন',
    subtitle: '৭ম ও ৮ম শ্রেণির শিক্ষার্থীদের গণিত ও ইংরেজি বিষয়ের নিবিড় তত্ত্বাবধান',
    category: 'classroom',
    categoryLabel: 'ক্লাসরুম ও পাঠদান',
    date: 'সেপ্টেম্বর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'g-6',
    title: 'অভিভাবক সমাবেশ ও একাডেমিক মতবিনিময় সভা',
    subtitle: 'শিক্ষার্থীদের অগ্রগতি ও ফলাফল নিয়ে অভিভাবকদের সাথে নিয়মিত পরামর্শ সভা',
    category: 'award',
    categoryLabel: 'পুরস্কার ও সংবর্ধনা',
    date: 'আগস্ট ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function PhotoGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const categories = [
    { id: 'all', label: 'সকল ছবি' },
    { id: 'classroom', label: 'ক্লাসরুম ও পাঠদান' },
    { id: 'exam', label: 'পরীক্ষা ও মূল্যায়ন' },
    { id: 'award', label: 'পুরস্কার ও সংবর্ধনা' },
    { id: 'campus', label: 'একাডেমিক কার্যক্রম' },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden text-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-2xl border-b-4 border-[#C8102E]"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white text-xs font-bold px-3.5 py-1 rounded-sm uppercase tracking-wider shadow-xs">
              <FaImages className="w-3.5 h-3.5 text-amber-300" />
              ফটো গ্যালারি
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              শিক্ষা নোভা একাডেমির মুহূর্তসমূহ
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              আমাদের ক্লাসরুম পাঠদান, সাপ্তাহিক ও মাসিক পরীক্ষা, কৃতি শিক্ষার্থী সংবর্ধনা এবং একাডেমিক কার্যক্রমের ছবিসমূহ।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-xs space-y-1 shrink-0">
            <p className="text-amber-300 font-bold flex items-center gap-1.5">
              <FaAward /> স্লোগান: “শিখবো, জিতবো”
            </p>
            <p className="text-slate-200 flex items-center gap-1.5">
              <FaLocationDot className="text-[#EF5350]" /> জুম্মাপাড়া, নীলফামারী সদর
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-sm text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-[#C8102E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#C8102E]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs font-bold text-white bg-[#C8102E] px-2.5 py-1 rounded-sm">
                  বড় করে দেখুন
                </span>
                <span className="w-8 h-8 rounded-full bg-white text-[#0A1E3C] flex items-center justify-center shadow">
                  <FaExpand className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="absolute top-3 left-3 text-[11px] font-bold bg-[#0A1E3C]/90 text-white px-2.5 py-1 rounded-sm">
                {photo.categoryLabel}
              </span>
            </div>

            <div className="p-5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                <FaCalendarDays className="text-[#C8102E]" />
                <span>{photo.date}</span>
              </div>
              <h3 className="text-base font-bold text-[#0A1E3C] group-hover:text-[#C8102E] transition">
                {photo.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{photo.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border-t-4 border-[#C8102E] animate-in zoom-in-95 duration-150"
          >
            <div className="relative h-72 sm:h-96 bg-slate-900">
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
    </div>
  );
}
