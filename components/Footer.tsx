'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaFacebook,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaHeart,
  FaGraduationCap,
  FaFilePdf,
  FaAward,
  FaUserCheck,
} from 'react-icons/fa6';
import { TbCashBanknote } from 'react-icons/tb';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                🎓
              </div>
              <div>
                <span className="text-2xl font-black text-white">Shikkha<span className="text-nova-500">Nova</span></span>
                <span className="block text-xs font-bold text-slogan-500">শিখবো, জিতবো</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য আধুনিক রোল ভিত্তিক উপস্থিতি, কোচিং রেজাল্ট ও মার্কশিট, অধ্যায়ভিত্তিক হ্যান্ডনোট পিডিএফ ও ইউটিউব ভিডিও ক্লাসের নির্ভরযোগ্য প্ল্যাটফর্ম।
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition shadow"
                title="Facebook Page"
              >
                <FaFacebook />
              </a>
              <a
                href="https://youtube.com/@ShikkhaNova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center hover:scale-105 transition shadow"
                title="YouTube Channel"
              >
                <FaYoutube />
              </a>
              <a
                href="tel:01712592519"
                className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition shadow"
                title="Call 01712592519"
              >
                <FaPhone />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              গুরুত্বপূর্ণ লিংকসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/attendance" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaUserCheck className="text-brand-400" /> রোল উপস্থিতি (Class 5 - 10)
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaAward className="text-nova-400" /> কোচিং রেজাল্ট ও মার্কশিট
                </Link>
              </li>
              <li>
                <Link href="/pdfs" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaFilePdf className="text-slogan-500" /> পিডিএফ হ্যান্ডনোট ও শিট
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaYoutube className="text-red-500" /> ইউটিউব ভিডিও ক্লাস
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-nova-400 transition flex items-center gap-2">
                  <FaGraduationCap className="text-slate-400" /> স্টুডেন্ট ও অ্যাডমিন লগইন
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment & PDF Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              ম্যানুয়াল পেমেন্ট (বিকাশ / নগদ)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              যেকোনো বিষয়ের প্রিমিয়াম পিডিএফ হ্যান্ডনোট বা সাজেশন পেতে আমাদের পার্সোনাল নম্বরে সেন্ড মানি করে TrxID দিয়ে সাবমিট করুন:
            </p>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-bkash font-bold">bKash (Personal):</span>
                <span className="text-white font-bold">01712592519</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-nagad font-bold">Nagad (Personal):</span>
                <span className="text-white font-bold">01712592519</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              <TbCashBanknote className="w-4 h-4" /> TrxID সাবমিটের সাথে সাথে ভেরিফিকেশন শুরু হয়
            </p>
          </div>

          {/* Col 4: Center Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              যোগাযোগ ও ঠিকানা
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <FaLocationDot className="text-nova-500 mt-1 flex-shrink-0" />
                <span>জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী।</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhone className="text-emerald-400 flex-shrink-0" />
                <a href="tel:01712592519" className="hover:text-white transition font-mono">01712592519</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <a href="mailto:robiulnil101@gmail.com" className="hover:text-white transition font-mono">robiulnil101@gmail.com</a>
              </div>
              <div className="pt-2">
                <span className="inline-block bg-brand-800/80 text-brand-200 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-brand-700">
                  🌐 sikkhanova.com
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">শিক্ষানোভা (SikkhaNova)</strong> - সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>স্লোগান:</span>
            <span className="text-slogan-500 font-bold">"শিখবো, জিতবো"</span>
            <FaHeart className="text-slogan-500 w-3 h-3 mx-1" />
            <span>জুম্মাপাড়া, নীলফামারী সদর</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
