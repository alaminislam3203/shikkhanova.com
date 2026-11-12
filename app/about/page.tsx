'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import {
  FaGraduationCap,
  FaArrowRight,
  FaCircleCheck,
  FaLocationDot,
  FaPhone,
} from 'react-icons/fa6';

// Decorative Section Header Component matching the reference style
function EditorialHeading({
  title,
  highlight,
  subtitle,
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center space-y-2.5 max-w-3xl mx-auto mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
        {title}{' '}
        {highlight && (
          <span className="text-[#C8102E] font-black">{highlight}</span>
        )}
      </h2>

      {/* Decorative Red Accent Line with Diamond */}
      <div className="flex items-center justify-center gap-2">
        <span className="h-0.5 w-10 sm:w-16 bg-[#C8102E]/30 rounded-full" />
        <span className="w-2 h-2 rotate-45 bg-[#C8102E] rounded-xs" />
        <span className="h-0.5 w-10 sm:w-16 bg-[#C8102E]/30 rounded-full" />
      </div>

      {subtitle && (
        <p className="text-xs sm:text-sm font-semibold text-[#C8102E] italic">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-8 sm:space-y-12 select-none" suppressHydrationWarning>
      
      {/* ─────────────────────────────────────────────────────────────
          TOP BRAND HERO BANNER (Compact & Prestigious)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172C] via-[#0F2C59] to-[#0A1E3C] p-6 sm:p-10 text-white shadow-xl border-b-4 border-[#C8102E]">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#C8102E]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold border border-white/15 backdrop-blur-md">
              <FaGraduationCap className="text-[#C8102E]" />
              <span>শিক্ষানোভা একাডেমি — মেধা, যত্ন ও সাফল্যের প্রতিশ্রুতি</span>
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              আমাদের পরিচিতি ও একাডেমিক ধারা
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য আধুনিক প্রযুক্তি, নিবিড় যত্ন ও বোর্ড সেরা ফলাফলের এক নির্ভরযোগ্য বিদ্যাপীঠ।
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col items-center gap-3 shrink-0 border border-slate-100">
            <Logo size="md" clickable={false} />
            <Link
              href="/chairman-message"
              className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#A50D26] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
            >
              <span>পরিচালকের বার্তা</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: শিক্ষানোভা-র যাত্রা যেভাবে (Our Inception & Story)
          Style: White clean background, narrative editorial prose
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xs">
        <EditorialHeading title="শিক্ষানোভা-র যাত্রা" highlight="যেভাবে" />

        <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:leading-loose text-justify">
          <p>
            শিক্ষানোভা একাডেমির প্রতিষ্ঠাতা ও পরিচালক <strong>মোঃ রবিউল ইসলাম</strong> নীলফামারী জেলার একঝাঁক মেধাবী ও উদ্যমী তরুণকে সাথে নিয়ে এক মহৎ লক্ষ্যকে সামনে রেখে এই প্রতিষ্ঠানের সূচনা করেন। তাঁর উদ্দেশ্য ছিল কেবল মুখস্থবিদ্যার গণ্ডিতে আবদ্ধ না রেখে ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের প্রতিটি বিষয়ের মৌলিক ভিত্তি (Basic Foundation) অত্যন্ত মজবুত ও স্বচ্ছ করে গড়ে তোলা। নীলফামারীর আঞ্চলিক পর্যায়ে এমন একটি সমন্বিত প্ল্যাটফর্ম তৈরি করা যেখানে উন্নত শহরগুলোর মতো আধুনিক প্রযুক্তি, সুপরিকল্পিত শিট এবং নিয়মিত ডিজিটাল মনিটরিং নিশ্চিত করা যায়।
          </p>

          <p>
            শুরুর দিকে মাত্র অল্প কয়েকজন শিক্ষার্থী নিয়ে সীমিত পরিসরে যাত্রা শুরু হলেও সততা, শিক্ষকদের অক্লান্ত পরিশ্রম ও ঈর্ষণীয় ফলাফলের কারণে প্রতিষ্ঠানটি দ্রুতই শিক্ষক, অভিভাবক ও শিক্ষার্থীদের আস্থাভাজন হয়ে ওঠে। শিক্ষার্থীদের পরীক্ষার ভীতি দূর করা, প্রতি অধ্যায়ের ওপর ধারাবাহিক মূল্যায়ন পরীক্ষা নেওয়া এবং দুর্বল শিক্ষার্থীদের জন্য আলাদা সময় বরাদ্দের মাধ্যমে শিক্ষানোভা একটি স্বতন্ত্র ও মানসম্মত প্রাতিষ্ঠানিক রূপ ধারণ করে।
          </p>

          <p>
            পরবর্তীতে নতুন জাতীয় শিক্ষাক্রম (New Curriculum) ও আধুনিক ডিজিটাল প্রযুক্তির সাথে তাল মিলিয়ে শিক্ষানোভা একাডেমি তাদের শিক্ষা ব্যবস্থাপনাকে সম্পূর্ণ ডিজিটাল রূপান্তর করেছে। বর্তমানে নিজস্ব ওয়েব পোর্টাল, অনলাইনে রোল ভিত্তিক স্বয়ংক্রিয় রেজাল্ট কার্ড, ডিজিটাল এসএমএস নোটিফিকেশন এবং অধ্যায়ভিত্তিক প্রিমিয়াম রঙিন হ্যান্ডনোটের মাধ্যমে নীলফামারী সদর ও আশপাশের শত শত শিক্ষার্থীর শিক্ষা জীবনকে করছে আলোকিত ও সমৃদ্ধ।
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: শিক্ষানোভা-র বৈশিষ্ট্য সমূহ (Institutional Key Features)
          Style: Soft tinted blush background (#FAF4F4), 2-column bullet list
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF4F4] rounded-3xl p-6 sm:p-10 lg:p-12 border border-rose-100 shadow-xs">
        <EditorialHeading title="শিক্ষানোভা-র" highlight="বৈশিষ্ট্য সমূহ" />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-xs sm:text-[13px] md:text-sm text-slate-800 leading-relaxed">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>অভিজ্ঞ ও নিবেদিত বিষয়ভিত্তিক শিক্ষক:</strong> গণিত, বিজ্ঞান ও ইংরেজি সহ প্রতিটি বিষয়ের জন্য রয়েছেন অভিজ্ঞ ও যত্নশীল শিক্ষকমণ্ডলী।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>এনসিটিবি (NCTB) পাঠ্যক্রমের গভীর বিশ্লেষণ:</strong> বোর্ড বইয়ের প্রতিটি অনুচ্ছেদ, পাঠ ও সূত্রের বাস্তবধর্মী ও প্রায়োগিক ব্যাখ্যা।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>অধ্যায়ভিত্তিক প্রিমিয়াম রঙিন হ্যান্ডনোট:</strong> পরীক্ষার উপযোগী বিশেষ সংকলন, যা সহজে বোধগম্য ও শতভাগ কমন উপযোগী।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>প্রতিদিনের মূল্যায়ন ও Daily Class Test:</strong> ক্লাসের পড়া ক্লাসেই আদায় ও নিয়মিত সংক্ষিপ্ত লিখিত পরীক্ষা।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>অনলাইন কুইজ ও MCQ প্র্যাকটিস:</strong> স্মার্টফোনে ও কম্পিউটারে রিয়েল-টাইম কুইজ পরীক্ষা ও তাৎক্ষণিক লিডারবোর্ড।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>ডিজিটাল মার্কশিট ও রেজাল্ট প্রকাশ:</strong> ওয়েবসাইটের মাধ্যমে রোল নম্বর দিয়ে ফলাফল, মোট নম্বর ও জিপিএ দেখার সুবিধা।
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>স্বয়ংক্রিয় মোবাইল এসএমএস নোটিফিকেশন:</strong> শিক্ষার্থীর অনুপস্থিতি, পরীক্ষার ফলাফল ও ফি সংক্রান্ত বার্তা অভিভাবকের ফোনে প্রেরণ।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>স্পেশাল প্রবলেম সলভিং ও এক্সট্রা কেয়ার:</strong> যেসব শিক্ষার্থী কোনো বিষয়ে পিছিয়ে থাকে তাদের জন্য বিশেষ অতিরিক্ত সময় বরাদ্দ।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>সাপ্তাহিক ও পূর্ণাঙ্গ মডেল টেস্ট সিরিজ:</strong> চূড়ান্ত পরীক্ষার অনুরূপ পরিবেশে সময় ধরে সম্পূর্ণ সিলেবাসের পরীক্ষা গ্রহণ।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>মেধা তালিকা ও প্রগ্রেস ট্র্যাকিং:</strong> প্রতিটি পরীক্ষার পর শিক্ষার্থীদের মেধা ক্রম ও দুর্বলতা চিহ্নিত করে ফিডব্যাক প্রদান।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>নিয়মিত অভিভাবক মতবিনিময় সভা:</strong> শিক্ষার্থীর পাঠোন্নতি ও আচরণিক দিক নিয়ে অভিভাবকদের সাথে সরাসরি খোলামেলা আলোচনা।
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p>
                <strong>নৈতিক শিক্ষা ও মোটিভেশনাল সেশন:</strong> পড়ালেখার পাশাপাশি চরিত্র গঠন, নিয়মানুবর্তিতা ও আত্মবিশ্বাস বৃদ্ধির গাইডলাইন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: শিক্ষানোভা-র সাফল্যের ফলাফল খতিয়ান (Success & Results Record)
          Style: White background, editorial analytical narrative
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xs">
        <EditorialHeading
          title="শিক্ষানোভা-র সাফল্যের"
          highlight="ফলাফল খতিয়ান"
        />

        <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:leading-loose text-justify">
          <p>
            একটি শিক্ষা প্রতিষ্ঠানের আসল পরিচয় গড়ে ওঠে তার শিক্ষার্থীদের সাফল্যের ওপর ভিত্তি করে। বিগত বছরগুলোতে নীলফামারী জেলার সেরা স্কুলগুলোর বার্ষিক মূল্যায়ন পরীক্ষা এবং এসএসসি (SSC) বোর্ড পরীক্ষায় শিক্ষানোভা একাডেমির শিক্ষার্থীদের অসাধারণ কৃতিত্ব জেলাজুড়ে প্রশংসিত হয়েছে। আমাদের ধারাবাহিক শতভাগ পাশের হার এবং সিংহভাগ শিক্ষার্থীর এ+ (GPA-5.00) অর্জন আমাদের সঠিক দিকনির্দেশনা ও কঠোর মেধা চর্চারই প্রমাণ বহন করে।
          </p>

          <p>
            শিক্ষানোভায় প্রতিটি শিক্ষার্থীকে কেবল একটি রোল নম্বর হিসেবে বিবেচনা না করে একজন ভবিষ্যৎ রূপকার হিসেবে গড়ে তোলা হয়। নিয়মিত ক্লাস টেস্ট, উইকলি টেস্ট ও রিভিশন টেস্টের মাধ্যমে শিক্ষার্থীদের দুর্বলতাগুলো আগেই চিহ্নিত করা হয়। শিক্ষকরা প্রতিটি পরীক্ষার খাতা পুঙ্খানুপুঙ্খভাবে মূল্যায়ন করেন এবং শিক্ষার্থীদের কোথায় ভুল হয়েছে তা হাতে-কলমে শুধরে দেন। এই সুশৃঙ্খল ও ধারাবাহিক মূল্যায়ন পদ্ধতির কারণেই ফাইনাল পরীক্ষার আগে শিক্ষার্থীদের আত্মবিশ্বাস বহুগুণে বৃদ্ধি পায়।
          </p>

          <p>
            আমাদের সফলতার খতিয়ানে আরও রয়েছে সরকারি ও বেসরকারি মেধা বৃত্তি পরীক্ষায় শিক্ষার্থীদের ঈর্ষণীয় সাফল্য। বিশেষ করে গণিত অলিম্পিয়াড ও মেধা যাচাই প্রতিযোগিতায় শিক্ষানোভার ছাত্র-ছাত্রীরা সবসময় শীর্ষস্থান ধরে রেখেছে। শিক্ষানোভা একাডেমি বিশ্বাস করে—সঠিক গাইডলাইন, আন্তরিক যত্ন এবং নিয়মিত অনুশীলন থাকলে যেকোনো সাধারণ শিক্ষার্থীও অসাধারণ ফলাফল করতে সক্ষম।
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Intensive Care Program (ইন্টেনসিভ কেয়ার প্রোগ্রাম)
          Style: Soft tinted background (#FAF4F4), structured program details
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF4F4] rounded-3xl p-6 sm:p-10 lg:p-12 border border-rose-100 shadow-xs">
        <EditorialHeading
          title="Intensive Care"
          highlight="Program"
          subtitle="শিক্ষানোভা এমন একটি বিশেষ কেয়ার প্রোগ্রাম চালু করেছে, যা প্রতিটি শিক্ষার্থীর মেধা বিকাশ ও ঘাটতি পূরণে অনন্য ভূমিকা রাখে।"
        />

        <div className="max-w-4xl mx-auto space-y-5 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:leading-loose text-justify">
          <p>
            প্রতিটি শিক্ষার্থীর মেধা ও ধারণক্ষমতা এক নয়। অনেকেই শ্রেণিকক্ষে সাধারণ ক্লাসে কোনো একটি নির্দিষ্ট অধ্যায় বা সূত্র পুরোপুরি বুঝতে হিমশিম খায়। প্রচলিত কোচিং সিস্টেমে এদের প্রতি আলাদা নজর দেওয়ার সুযোগ থাকে না। কিন্তু শিক্ষানোভা একাডেমি বিশ্বাস করে, একজন শিক্ষার্থীও যাতে পিছিয়ে না থাকে। এই লক্ষ্যকে সামনে রেখেই আমাদের উদ্ভাবনী <strong>"Intensive Care Program"</strong>।
          </p>

          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-rose-200/80 shadow-xs space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
              <span>এ প্রোগ্রামের বৈশিষ্ট্য:</span>
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-[13px] md:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>ছোট ছোট গ্রুপে পাঠদান:</strong> প্রতিটি ব্যাচ থেকে পিছিয়ে পড়া শিক্ষার্থীদের আলাদা ছোট গ্রুপে এনে নিবিড় পরিচর্যা।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>দৈনিক অতিরিক্ত সময়:</strong> স্বাভাবিক ক্লাসের বাইরে প্রতিদিন অতিরিক্ত ১ থেকে ১.৫ ঘণ্টা শুধুমাত্র সমস্যা সমাধান ও অনুশীলনে ব্যয় করা হয়।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>হাতে-কলমে পড়া আদায়:</strong> বাসায় পড়ার ভরসায় না রেখে শিক্ষকের সামনেই কঠিন অঙ্ক, বিজ্ঞানের সূত্র ও ইংরেজি গ্রামার মুখস্থ ও লিখিত চর্চা।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C8102E] font-bold">•</span>
                <span><strong>ব্যক্তিগত কাউন্সিলিং:</strong> শিক্ষার্থীর মানসিক চাপ কমাতে এবং পড়ালেখায় মনোযোগ ফিরিয়ে আনতে সরাসরি পরিচালকের মোটিভেশনাল মেন্টরিং।</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              নির্বাচন পদ্ধতি:
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              সাপ্তাহিক মূল্যায়ন পরীক্ষা ও ক্লাস পারফরম্যান্স গভীরভাবে পর্যবেক্ষণ করে যেসকল শিক্ষার্থী প্রত্যাশিত নম্বর অর্জনে ব্যর্থ হয়, তাদের স্বয়ংক্রিয়ভাবে এই প্রোগ্রামে যুক্ত করে নেওয়া হয়। অভিভাবকের সাথে পরামর্শক্রমে তাদের জন্য বিশেষ সময়সূচি নির্ধারণ করা হয়।
            </p>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#C8102E] pt-2 border-t border-rose-200/60">
            * ইন্টেনসিভ কেয়ার প্রোগ্রামের জন্য কোনো অতিরিক্ত ফি বা চার্জ নেওয়া হয় না; এটি আমাদের দায়বদ্ধতা ও সেবার অবিচ্ছেদ্য অংশ।
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: ১ম ব্যাচসমূহে ভর্তির সুবিধা (Benefits of 1st Batch)
          Style: White background, informative narrative
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xs">
        <EditorialHeading title="১ম ব্যাচসমূহে" highlight="ভর্তির সুবিধা" />

        <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:leading-loose text-justify">
          <p>
            শিক্ষাবর্ষের শুরুতেই যেসকল শিক্ষার্থী ১ম ব্যাচসমূহে ভর্তি হয়, তারা পড়ালেখায় অন্যদের চেয়ে স্বাভাবিকভাবেই এগিয়ে থাকে। বছরের প্রথমার্ধ থেকে সুশৃঙ্খল পাঠদান শুরু হওয়ায় তাদের ওপর শেষ মুহূর্তের কোনো মানসিক চাপ থাকে না।
          </p>

          <p>
            <strong>প্রথম ব্যাচের শিক্ষার্থীদের বিশেষ সুবিধাসমূহ:</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-600 w-3.5 h-3.5" />
                <span>যথাযথ সময়ে পূর্ণ সিলেবাস সমাপ্তি</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                স্কুলের পরীক্ষার বেশ আগেই সম্পূর্ণ সিলেবাস শেষ করে একাধিকবার পূর্ণাঙ্গ রিভিশনের অফুরন্ত সুযোগ পাওয়া যায়।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-600 w-3.5 h-3.5" />
                <span>সর্বোচ্চ মডেল টেস্ট ও রিভিশন</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                সিলেবাস দ্রুত শেষ হওয়ায় ১ম ব্যাচের শিক্ষার্থীরা সবচেয়ে বেশি সংখ্যক মডেল টেস্ট ও প্রশ্ন ব্যাংক সমাধানের সুযোগ পায়।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-600 w-3.5 h-3.5" />
                <span>পছন্দসই সময় ও শিট প্যাকেজ</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                আসন সীমাবদ্ধতার কারণে পছন্দের শিফটে (সকাল/বিকাল) আসন নিশ্চিত করা যায় এবং প্রারম্ভিক স্পেশাল হ্যান্ডনোট প্যাকেজ পাওয়া যায়।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <FaCircleCheck className="text-emerald-600 w-3.5 h-3.5" />
                <span>শিক্ষকদের গভীর পর্যবেক্ষণ</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                শুরু থেকেই শিক্ষকদের সাথে নিবিড় মিথস্ক্রিয়া গড়ে ওঠে, যা শিক্ষার্থীর মেধার মানোন্নয়নে বিশেষ সহায়ক ভূমিকা রাখে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: সমন্বিত বিষয়ভিত্তিক কোচিং ও ডিজিটাল সহায়তার প্রয়োজনীয়তা
          Style: Soft tinted background (#FAF4F4)
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF4F4] rounded-3xl p-6 sm:p-10 lg:p-12 border border-rose-100 shadow-xs">
        <EditorialHeading
          title="একই ছাদের নিচে পূর্ণাঙ্গ বিষয়ভিত্তিক"
          highlight="কোচিং করার প্রয়োজনীয়তা"
        />

        <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:leading-loose text-justify">
          <p>
            অনেক শিক্ষার্থী ভিন্ন ভিন্ন শিক্ষকের কাছে দৌড়াদৌড়ি করতে গিয়ে দিনের সিংহভাগ সময় ও শক্তি অপচয় করে ফেলে। এর ফলে তাদের নিজস্ব পড়ার (Self-Study) জন্য পর্যাপ্ত সময় থাকে না। এছাড়া বিভিন্ন শিক্ষকের পরীক্ষার সময়সূচি ও পাঠদানের ধারার মধ্যে কোনো সমন্বয় থাকে না, যার কারণে শিক্ষার্থী তীব্র মানসিক ক্লান্তিতে ভোগে।
          </p>

          <p>
            শিক্ষানোভা একাডেমিতে গণিত, বিজ্ঞান, ইংরেজি, বাংলা, বাংলাদেশ ও বিশ্বপরিচয় এবং তথ্যপ্রযুক্তি সহ সকল আবশ্যিক বিষয়কে একটি সুসংহত রুটিনের আওতায় পড়ানো হয়। আমাদের এক ছাতার নিচের সমন্বিত ব্যবস্থার কারণে:
          </p>

          <ul className="space-y-2 text-xs sm:text-[13px] md:text-sm text-slate-800 list-disc list-inside">
            <li>যাতায়াতের সময় ও অতিরিক্ত অর্থ অপচয় সম্পূর্ণ রোধ হয়।</li>
            <li>সকল বিষয়ের পরীক্ষার তারিখ সুষমভাবে বিন্যস্ত থাকে, কোনো বিষয়ই অবহেলিত হয় না।</li>
            <li>ওয়েবসাইটের মাধ্যমে শিক্ষার্থীরা যেকোনো সময় যেকোনো বিষয়ের শিট ও হ্যান্ডনোট ডাউনলোড করতে পারে।</li>
            <li>অভিভাবক মাত্র একটি প্রতিষ্ঠান থেকেই সন্তানের সার্বিক সব বিষয়ের অগ্রগতি ও উপস্থিতি ট্র্যাক করতে পারেন।</li>
          </ul>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: ADVANCED BATCH-এ ভর্তির সুবিধা
          Style: White background, bulleted distinct benefits
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xs">
        <EditorialHeading title="ADVANCED BATCH-এ" highlight="ভর্তির সুবিধা" />

        <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:leading-loose">
          <p className="text-justify">
            শীর্ষস্থানীয় মেধাবী এবং বোর্ড পরীক্ষায় ট্যালেন্টপুল বৃত্তি ও গোল্ডেন জিপিএ-৫ প্রত্যাশী শিক্ষার্থীদের জন্য আমাদের রয়েছে বিশেষায়িত <strong>Advanced Batch</strong>। এই ব্যাচে নিয়মিত বোর্ড সিলেবাসের পাশাপাশি উচ্চতর বিশ্লেষণ ও কঠিন সমস্যার সমাধানের কৌশল শেখানো হয়।
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p><strong>একক ও কম্বাইন্ড কোর্স সুবিধা:</strong> নির্দিষ্ট কোনো একটি বিষয় (যেমন উচ্চতর গণিত/পদার্থ/রসায়ন) অথবা সম্পূর্ণ কম্বাইন্ড কোর্সে অংশ নেওয়ার সুযোগ।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p><strong>বোর্ড সেরা প্রশ্ন ব্যাংক সমাধান:</strong> বিগত ১০ বছরের ক্যাডেট কলেজ, সরকারি জিলা স্কুল ও বোর্ড পরীক্ষার শীর্ষ প্রশ্নের ব্যবচ্ছেদ।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p><strong>অলিম্পিয়াড ও ক্রিয়েটিভ প্রবলেম সলভিং:</strong> মুখস্থ সূত্রের বাইরে ভিন্নধর্মী ও জটিল গাণিতিক সমস্যার ত্বরিত সমাধান কৌশল।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p><strong>র‍্যাঙ্কিং ও লাইভ ড্যাশবোর্ড প্রতিযোগিতা:</strong> প্রতিটি পরীক্ষায় সর্বোচ্চ স্কোরের সাথে তুলনা করে নিজের অবস্থান নিরূপণ।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 shrink-0" />
              <p><strong>সরাসরি পরিচালকের তত্ত্বাবধান:</strong> নিয়মিত ক্যারিয়ার ও শিক্ষা পরিকল্পনা নিয়ে দিকনির্দেশনা ও মেন্টরশিপ।</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM CALL TO ACTION & CONTACT DETAILS
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0F2C59] to-[#0A1E3C] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black">
            সন্তানের সুন্দর ভবিষ্যতের জন্য আজই যোগাযোগ করুন
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            ৫ম থেকে ১০ম শ্রেণি ভর্তি চলছে। সীমিত আসনে প্রথম ব্যাচের অগ্রাধিকার নিশ্চিত করুন।
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-semibold text-slate-200">
            <span className="inline-flex items-center gap-1.5">
              <FaLocationDot className="text-[#C8102E]" /> জুম্মাপাড়া, নীলফামারী সদর
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaPhone className="text-emerald-400" /> হেল্পলাইন: ০১৭১২৫৯২৫১৯
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/contact-us"
            className="px-5 py-3 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:scale-105 active:scale-95"
          >
            সরাসরি যোগাযোগ করুন
          </Link>
          <Link
            href="/results"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition"
          >
            ফলাফল যাচাই করুন
          </Link>
        </div>
      </div>

    </div>
  );
}
