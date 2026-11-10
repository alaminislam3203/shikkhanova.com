'use client';

import React, { useState } from 'react';
import {
  FaYoutube,
  FaPlay,
  FaGraduationCap,
  FaArrowUpRightFromSquare,
  FaBookOpen,
} from 'react-icons/fa6';

import VideoPlayerModal from '@/components/videos/VideoPlayerModal';
import { VideoItem } from '@/types';
import { toBengaliClass } from '@/lib/defaultQuizData';

export default function VideosPage() {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);

  const defaultVideos: VideoItem[] = [
    {
      id: 'v1',
      title: '৭ম শ্রেণি গণিত ১ম অধ্যায় - মূলদ ও অমূলদ সংখ্যা বেসিক ক্লাস',
      classGrade: 7,
      subject: 'গণিত',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '২৫ মিনিট',
    },
    {
      id: 'v2',
      title: '৮ম শ্রেণি বিজ্ঞান - পরমাণুর গঠন ও রাসায়নিক বিক্রিয়া সহজ সমাধান',
      classGrade: 8,
      subject: 'বিজ্ঞান',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '৩২ মিনিট',
    },
    {
      id: 'v3',
      title: '৯ম-১০ম শ্রেণি পদার্থবিজ্ঞান - গতি ও বল সমীকরণ প্রতিপাদন',
      classGrade: 9,
      subject: 'পদার্থবিজ্ঞান',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '৪০ মিনিট',
    },
    {
      id: 'v4',
      title: '১০ম শ্রেণি ইংরেজি ২য় পত্র - Completing Sentences সহজ নিয়ম',
      classGrade: 10,
      subject: 'ইংরেজি',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '২০ মিনিট',
    },
    {
      id: 'v5',
      title: '৫ম শ্রেণি প্রাথমিক গণিত - দশমিক ভগ্নাংশের ভাগ সহজে শেখা',
      classGrade: 5,
      subject: 'গণিত',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '১৮ মিনিট',
    },
    {
      id: 'v6',
      title: '৬ষ্ঠ শ্রেণি বাংলা - ব্যাকরণ ও নির্মিতি পারিভাষিক শব্দ',
      classGrade: 6,
      subject: 'বাংলা',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '২২ মিনিট',
    },
  ];

  React.useEffect(() => {
    fetchVideos();
  }, [selectedClass]);

  const fetchVideos = async () => {
    try {
      const url = selectedClass === 'all' ? '/api/videos' : `/api/videos?classGrade=${selectedClass}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        setVideoList(
          data.videos.map((v: any) => ({
            id: v.id,
            title: v.title,
            classGrade: v.classGrade,
            subject: v.subject,
            youtubeId: v.youtubeId,
            duration: 'ভিডিও ক্লাস',
          }))
        );
      } else {
        setVideoList(defaultVideos);
      }
    } catch {
      setVideoList(defaultVideos);
    }
  };

  const filteredVideos = videoList.filter((v) =>
    selectedClass === 'all' ? true : v.classGrade.toString() === selectedClass
  );

  return (
    <div className="space-y-5 sm:space-y-8">
      
      {/* YouTube Channel Hero (Compact Banner on Mobile) */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-6 border-b-4 border-red-800">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-16 sm:h-16 bg-white text-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0">
            <FaYoutube />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black">ইউটিউব ভিডিও ক্লাস</h1>
              <span className="bg-black/30 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-mono">
                @ShikkhaNova
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-red-100 max-w-xl line-clamp-2 sm:line-clamp-none">
              ৫ম থেকে ১০ম শ্রেণি পর্যন্ত প্রতিটি বিষয়ের অধ্যায়ভিত্তিক ভিডিও লেকচার সরাসরি ইউটিউব চ্যানেল থেকে সংযুক্ত।
            </p>
          </div>
        </div>

        <a
          href="https://youtube.com/@ShikkhaNova"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-red-700 hover:bg-red-50 font-bold px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm shadow-md transition flex-shrink-0 self-end sm:self-auto"
        >
          <span>চ্যানেল সাবস্ক্রাইব করুন</span>
          <FaArrowUpRightFromSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </a>
      </div>

      {/* Class Filter */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">শ্রেণি:</span>
        <button
          onClick={() => setSelectedClass('all')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedClass === 'all'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সব শ্রেণি
        </button>
        {[5, 6, 7, 8, 9, 10].map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls.toString())}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedClass === cls.toString()
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {toBengaliClass(cls)} শ্রেণি
          </button>
        ))}
      </div>

      {/* Video Grid (2 columns on mobile, 2 on md, 3 on lg) */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-premium transition flex flex-col justify-between group"
          >
            {/* Thumbnail Box */}
            <div
              onClick={() => setActiveVideo(video)}
              className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
            >
              <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xs sm:text-xl group-hover:scale-110 transition-transform shadow-lg z-10">
                <FaPlay className="ml-0.5 sm:ml-1" />
              </div>
              <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 bg-black/80 text-white text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            {/* Video Meta */}
            <div className="p-2.5 sm:p-5 space-y-1 sm:space-y-2">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                  {toBengaliClass(video.classGrade)} শ্রেণি
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                  {video.subject}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modular Video Player Modal */}
      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />

    </div>
  );
}

