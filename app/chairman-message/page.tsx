'use client';

import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa6';

export default function ChairmanMessagePage() {
  return (
    <div
      suppressHydrationWarning
      className="w-full max-w-7xl xl:max-w-[1380px] mx-auto py-8 sm:py-14 px-4 sm:px-6 lg:px-8 select-none"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-12 lg:p-16 xl:p-20 border border-slate-200/80 shadow-xs space-y-6 sm:space-y-7">
        
        {/* ─────────────────────────────────────────────────────────────
            TOP SECTION (Exact match to Reference Screenshot):
            Left: Circular Photo with Pastel Background Circles
            Right: Name, Title, Email, Phone, Socials + First Salutation & Paragraph
        ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          
          {/* Left: Circular Headshot Photo with Yellow & Salmon Pastel Shapes */}
          <div className="relative shrink-0 flex items-center justify-center p-3">
            {/* Top-Left Yellow Circle */}
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFE566] pointer-events-none opacity-90" />
            
            {/* Bottom-Right Soft Pink / Peach Circle */}
            <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FFB3BA] pointer-events-none opacity-85" />

            {/* Circular Headshot Photo */}
            <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden bg-slate-100 shadow-md border-4 border-white">
              <img
                src="/chairman.png"
                alt="মোঃ রবিউল ইসলাম"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right: Info, Socials, Salutation & First Paragraph */}
          <div className="flex-1 min-w-0 space-y-3 pt-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              মোঃ রবিউল ইসলাম
            </h1>
            
            <p className="text-sm sm:text-[15px] font-semibold text-slate-700">
              প্রতিষ্ঠাতা ও পরিচালক - শিক্ষানোভা একাডেমি
            </p>

            <div className="pt-0.5 space-y-1 text-xs sm:text-sm text-slate-600 font-medium">
              <p>
                <strong className="text-slate-800">Email :</strong>{' '}
                <a
                  href="mailto:robiulnil101@gmail.com"
                  className="hover:underline text-slate-700"
                >
                  robiulnil101@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-slate-800">Phone :</strong>{' '}
                <a
                  href="tel:01712592519"
                  className="hover:underline text-slate-700 font-mono"
                >
                  01712592519
                </a>
              </p>
            </div>

            {/* Social Icons: Facebook, Instagram (Requested), YouTube */}
            <div className="pt-1.5 flex items-center justify-center md:justify-start gap-2">
              <a
                href="https://facebook.com/ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#1877F2] text-slate-600 hover:text-white flex items-center justify-center transition shadow-2xs text-xs"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/shikkhanova?exln=ZzV0dGhqcXB5Z2k0"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#E4405F] text-slate-600 hover:text-white flex items-center justify-center transition shadow-2xs text-xs"
              >
                <FaInstagram />
              </a>

              <a
                href="https://youtube.com/@ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#FF0000] text-slate-600 hover:text-white flex items-center justify-center transition shadow-2xs text-xs"
              >
                <FaYoutube />
              </a>
            </div>

            {/* Salutation & Paragraph 1 placed on the right next to photo (exact screenshot layout) */}
            <div className="pt-3 space-y-2">
              <h2 className="text-sm sm:text-[15.5px] font-bold text-slate-900">
                স্নেহাস্পদ ছাত্র-ছাত্রী ভাই ও বোনেরা,
              </h2>

              <p className="text-xs sm:text-[14px] md:text-[15px] text-[#222222] leading-relaxed sm:leading-[2.05] text-justify font-normal">
                শিক্ষানোভা পরিবারের পক্ষ থেকে তোমাদের সকলকে হৃদয়-উৎসারিত একরাশ প্রীতি, শুভেচ্ছা ও প্রাণঢালা অভিনন্দন জানাচ্ছি। তোমরা হয়তো অবগত আছো যে, ৫ম থেকে ১০ম শ্রেণির এই সময়টা প্রতিটি শিক্ষার্থীর মেধা বিকাশ ও শিক্ষাজীবনের মজবুত ভিত্তিপ্রস্তর গড়ে তোলার সবচেয়ে মূল্যবান মুহূর্ত। কালের সীমাহীন গণ্ডি পেরিয়ে গতানুগতিক মুখস্থবিদ্যার যুগ শেষ হয়ে এখন মেধা ও সৃজনশীলতার বিকাশই সাফল্যের প্রধান সোপান। শুরু থেকেই শিক্ষানোভা পরিবারের পথচলা—মন, মনন, মেধা, শ্রম, নিষ্ঠা, দক্ষতা, আধুনিক শিক্ষাদান পদ্ধতি ও আন্তরিক পরিচর্যার মাধ্যমে প্রতিটি শিক্ষার্থীকে সাফল্যের সোনালী শীর্ষে পৌঁছে দেওয়ার দৃঢ় প্রত্যয় নিয়ে।
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FULL-WIDTH PARAGRAPHS (Under the Top Profile Area)
            (Matching Reference Screenshot Flow)
        ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4 sm:space-y-5 text-xs sm:text-[14px] md:text-[15px] text-[#222222] leading-relaxed sm:leading-[2.05] text-justify font-normal">
          
          <p>
            তোমরা জেনে আনন্দিত হবে যে, প্রতি বছরের ন্যায় আমাদের একঝাঁক কৃতী শিক্ষার্থী স্কুল মূল্যায়ন পরীক্ষা ও এসএসসি বোর্ড পরীক্ষায় অসাধারণ কৃতিত্ব প্রদর্শন করে আসছে। তাদের এই সাফল্য আমাদের জন্য বয়ে এনেছে পরম আত্মতৃপ্তি এবং অনাবিল আনন্দ। শিক্ষানোভার অতীত সাফল্যমণ্ডিত ইতিহাস, ছাত্র-ছাত্রী ও শিক্ষকদের ঐকান্তিক নিরলস প্রচেষ্টা, সুপরিকল্পিত উন্নতমানের নিখুঁত পাঠদান পদ্ধতি ও অধ্যায়ভিত্তিক রঙিন শিট শিক্ষার্থীদের বরাবরই শীর্ষস্থানে অধিষ্ঠিত রেখেছে।
          </p>

          <p>
            আমরা আমাদের সর্বোচ্চ মেধা, পরিশ্রম ও যোগ্যতা দিয়ে এ সাফল্যকে ধরে রেখে আগামী দিনে আরও সুষ্ঠু, সুসংগঠিত ও সুনিপুণ পদ্ধতিতে প্রতিটি ছাত্র-ছাত্রীর মেধা শাণিত করে কাঙ্ক্ষিত লক্ষ্যে পৌঁছে দিতে পারব বলে আমার পূর্ণ বিশ্বাস। মনে রাখবে, সাফল্যের মূল চাবিকাঠি হচ্ছে অধ্যবসায়। গতানুগতিক সাজেশন-নির্ভর মুখস্থ বিদ্যার বেড়াজাল ডিঙিয়ে নিয়মিত অনুশীলন ও ধারাবাহিক পরীক্ষার মাধ্যমেই পৌঁছতে হবে তোমাদের স্বপ্নের গন্তব্যে।
          </p>

          <p>
            ৫ম থেকে ১০ম শ্রেণির এই শিক্ষাবর্ষের প্রতিটি দিন অত্যন্ত মূল্যবান সময়। সঠিক সময়ে সঠিকভাবে সময়ের সদ্ব্যবহার করাই বুদ্ধিমানের কাজ। তাই শিক্ষানোভা একাডেমি পরীক্ষার পূর্ব থেকেই সুনির্দিষ্ট পাঠপরিকল্পনা ও পরীক্ষার মাধ্যমে সম্পূর্ণ সিলেবাস শেষ করার নিশ্চয়তা দিচ্ছে। শিক্ষানোভা পরিবারের সক্রিয় সহযোগিতায় শিক্ষার্থীদের মন-মনন-মেধা আরও শাণিত হোক এবং তোমাদের দীপ্ত পদচারণায় মুখরিত হোক জীবনের প্রতিটি পরীক্ষার অঙ্গন। আমরা আমাদের ধারাবাহিক সাফল্য বজায় রাখতে বরাবরই প্রতিশ্রুতিবদ্ধ।
          </p>

          {/* Valediction */}
          <div className="pt-2 space-y-1">
            <p className="font-bold text-slate-900">
              সকলের শুভ কামনায়- আল্লাহ হাফেজ।
            </p>
            <p className="font-bold text-slate-900 pt-2">
              শুভেচ্ছান্তে -
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM: Two-Column Credentials & Designations (Square Bullets)
            (Exact match to Reference Screenshot Signature Area)
        ───────────────────────────────────────────────────────────── */}
        <div className="pt-4 space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            মোঃ রবিউল ইসলাম
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-2 text-xs sm:text-[13px] text-slate-800 leading-relaxed">
            {/* Column 1 */}
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>প্রতিষ্ঠাতা ও পরিচালক</strong> - শিক্ষানোভা একাডেমি</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>প্রধান সমন্বয়ক ও গণিত প্রশিক্ষক</strong> - শিক্ষানোভা একাডেমিক টিম</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>কারিকুলাম ও শিট গবেষক</strong> - এনসিটিবি নতুন পাঠ্যক্রম</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>সদস্য</strong> - বাংলাদেশ গণিত একাডেমি ফোরাম</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>সংকলক ও সম্পাদক</strong> - শিক্ষানোভা এক্সক্লুসিভ শিট সিরিজ</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>প্রতিষ্ঠাতা</strong> - শিক্ষানোভা ডিজিটাল রেজাল্ট ও লার্নিং পোর্টাল</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>প্রধান মেন্টর</strong> - ইনটেনসিভ কেয়ার ও মেধা বৃত্তি উইং</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>ক্যারিয়ার ও একাডেমিক কাউন্সেলর</strong></p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>পরিচালক</strong> - শিক্ষানোভা মডেল টেস্ট ও অলিম্পিয়াড ক্লাব</p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#222222] mt-2 shrink-0 rounded-xs" />
                <p><strong>শিক্ষা উদ্যোক্তা ও সমাজসেবক</strong> - জুম্মাপাড়া, নীলফামারী</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
