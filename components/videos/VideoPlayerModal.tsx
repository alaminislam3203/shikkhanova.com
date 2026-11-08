'use client';

import React from 'react';
import { VideoItem } from '@/types';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/40 p-2 rounded-full transition"
        >
          ✕
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
        <div className="p-5 text-white space-y-1">
          <h3 className="text-base font-bold">{video.title}</h3>
          <p className="text-xs text-slate-400">
            ইউটিউব চ্যানেল: <strong className="text-white">@ShikkhaNova</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

