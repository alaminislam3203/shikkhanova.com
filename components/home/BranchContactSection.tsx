'use client';

import React, { useState, useEffect } from 'react';
import {
  LandingContactInfo,
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
} from '@/lib/defaultLandingContent';
import {
  FaPhoneVolume,
  FaWhatsapp,
  FaLocationDot,
  FaClock,
  FaEnvelope,
  FaBuildingColumns,
} from 'react-icons/fa6';

export default function BranchContactSection() {
  const [contact, setContact] = useState<LandingContactInfo>(DEFAULT_LANDING_CONTENT.contact);

  useEffect(() => {
    try {
      const stored = getStoredLandingContent();
      if (stored?.contact) {
        setContact(stored.contact);
      }
    } catch {}

    fetch('/api/landing', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.contact) {
          setContact(data.content.contact);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative">
      <div className="bg-gradient-to-br from-slate-900 via-[#07172C] to-[#0A1E3C] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-slate-700/60 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Heading & Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-black border border-white/15">
              <FaBuildingColumns className="w-3 h-3" />
              <span>সরাসরি যোগাযোগ ও ভর্তি সহায়তা</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              যেকোনো জিজ্ঞাসা বা পরামর্শে আমরা আছি <span className="text-[#C8102E]">আপনার পাশে</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
              অনলাইন মডেল টেস্ট, হ্যান্ডনোট সংগ্রহ অথবা অফলাইন ক্লাসরুমে সরাসরি ভর্তির বিষয়ে যেকোনো সহায়তার জন্য আজই আমাদের সাথে যোগাযোগ করুন।
            </p>

            {/* Quick Contact Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${contact.helpline}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#9B0D23] via-[#C8102E] to-[#E5254A] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <FaPhoneVolume className="w-4 h-4 text-white" />
                <span className="font-mono font-bold tracking-wider">{contact.helpline}</span>
              </a>

              <a
                href={`https://wa.me/88${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-200" />
                <span>WhatsApp মেসেজ</span>
              </a>
            </div>
          </div>

          {/* Right: Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-amber-300 border border-white/10">
                  <FaLocationDot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-300 uppercase">কোচিং সেন্টারের ঠিকানা</h4>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-300 border border-white/10">
                  <FaClock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-300 uppercase">অফিস ও ক্লাসের সময়সূচী</h4>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                    {contact.hours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-blue-300 border border-white/10">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-300 uppercase">অফিশিয়াল ইমেইল</h4>
                  <p className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">
                    {contact.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
