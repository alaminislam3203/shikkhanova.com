'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DEFAULT_GALLERY_PHOTOS, GalleryPhoto } from '@/lib/defaultGallery';
import {
  FaImages,
  FaExpand,
  FaXmark,
  FaLocationDot,
  FaCalendarDays,
  FaAward,
  FaGear,
  FaClock,
} from 'react-icons/fa6';

export default function PhotoGalleryPage() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEFAULT_GALLERY_PHOTOS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetchGalleryPhotos();
  }, []);

  const fetchGalleryPhotos = async () => {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await res.json();
      if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
        setPhotos(data.photos);
      }
    } catch {
      // Fallback already set to DEFAULT_GALLERY_PHOTOS
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'সকল ছবি' },
    { id: 'classroom', label: 'ক্লাসরুম ও পাঠদান' },
    { id: 'exam', label: 'পরীক্ষা ও মূল্যায়ন' },
    { id: 'award', label: 'পুরস্কার ও সংবর্ধনা' },
    { id: 'campus', label: 'একাডেমিক কার্যক্রম' },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071426 0%, #0A1E3C 55%, #2A0B1E 100%)',
        }}
        className="relative overflow-hidden text-white p-4 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-b-4 border-[#C8102E]"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6">
          <div className="space-y-2 sm:space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-sm uppercase tracking-wider shadow-xs">
                <FaImages className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                ফটো গ্যালারি
              </span>

              {session?.user?.role === 'ADMIN' && (
                <Link
                  href="/admin?tab=gallery"
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-0.5 rounded-sm transition border border-white/20"
                >
                  <FaGear className="w-3 h-3 text-rose-300" />
                  <span>অ্যাডমিন এডিট</span>
                </Link>
              )}
            </div>

            <h1 className="text-lg sm:text-3xl md:text-4xl font-black tracking-tight leading-snug sm:leading-tight">
              শিক্ষা নোভা একাডেমির মুহূর্তসমূহ
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-200 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              আমাদের ক্লাসরুম পাঠদান, সাপ্তাহিক ও মাসিক পরীক্ষা, কৃতি শিক্ষার্থী সংবর্ধনা এবং একাডেমিক কার্যক্রমের ছবিসমূহ।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-[10px] sm:text-xs shrink-0 flex items-center justify-between md:flex-col md:items-start gap-2.5 md:gap-1.5">
            <p className="text-amber-300 font-bold flex items-center gap-1.5">
              <FaAward className="text-amber-300" /> স্লোগান: “শিখবো, জিতবো”
            </p>
            <p className="text-slate-200 flex items-center gap-1.5">
              <FaLocationDot className="text-[#EF5350]" /> জুম্মাপাড়া, নীলফামারী সদর
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-[#C8102E] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Gallery Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
          >
            {/* Image Container with Zoom & Badge */}
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-200 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-[#C8102E] p-2.5 rounded-full shadow-lg">
                  <FaExpand className="w-4 h-4" />
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-sm text-[10px] sm:text-xs font-black bg-white/95 text-[#C8102E] shadow-2xs backdrop-blur-xs">
                  {photo.categoryLabel}
                </span>
              </div>
            </div>

            {/* Photo Caption */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#C8102E] transition-colors line-clamp-2">
                  {photo.title}
                </h3>
                {photo.subtitle && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {photo.subtitle}
                  </p>
                )}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <FaCalendarDays className="w-3 h-3 text-slate-400" />
                  {photo.date}
                </span>
                <span className="text-[#C8102E] font-bold group-hover:underline">
                  বড় করে দেখুন →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal for Large Photo View */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50">
              <div className="min-w-0 pr-3">
                <span className="inline-block text-[10px] font-black uppercase text-[#C8102E] mb-0.5">
                  {activePhoto.categoryLabel} • {activePhoto.date}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition"
                aria-label="বন্ধ করুন"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center max-h-[65vh]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <p className="font-bold text-slate-800">{activePhoto.title}</p>
              {activePhoto.subtitle && (
                <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">
                  {activePhoto.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
