'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaClock, FaTrophy } from 'react-icons/fa6';

export default function LeaderboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/quiz#leaderboard');
  }, [router]);

  return (
    <div className="py-24 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-200">
        <FaTrophy className="w-6 h-6 animate-bounce" />
      </div>
      <p className="text-sm font-bold text-slate-700">লিডারবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
    </div>
  );
}
