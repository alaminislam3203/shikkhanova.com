'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiBook,
  FiFileText,
  FiAward,
  FiCheckCircle,
  FiHelpCircle,
  FiUser,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import {
  DEFAULT_LANDING_CONTENT,
  getStoredLandingContent,
  LandingContactInfo,
} from '@/lib/defaultLandingContent';

interface ContactReason {
  id: string;
  label: string;
  icon: any;
  description: string;
}

export default function BranchContactSection() {
  const [contact, setContact] = useState<LandingContactInfo>(DEFAULT_LANDING_CONTENT.contact);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    reason: 'admission',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const contactReasons: ContactReason[] = [
    {
      id: 'admission',
      label: 'ভর্তি ও পাঠদান',
      icon: FiBook,
      description: '৫ম-১০ম শ্রেণি ভর্তি ও ব্যাচ',
    },
    {
      id: 'notes',
      label: 'শিট ও হ্যান্ডনোট',
      icon: FiFileText,
      description: 'রঙিন শিট ও পিডিএফ সংগ্রহ',
    },
    {
      id: 'results',
      label: 'রেজাল্ট ও মার্কশিট',
      icon: FiAward,
      description: 'পরীক্ষার নম্বর ও গ্রেডশিট',
    },
    {
      id: 'modeltest',
      label: 'মডেল টেস্ট ও কুইজ',
      icon: FiCheckCircle,
      description: 'অনলাইন পরীক্ষা ও লিডারবোর্ড',
    },
    {
      id: 'other',
      label: 'অন্যান্য জিজ্ঞাসা',
      icon: FiHelpCircle,
      description: 'যেকোনো সাধারণ তথ্য',
    },
  ];

  const cleanPhone = (contact.helpline || '01712592519').replace(/\D/g, '');
  const cleanWhatsapp = (contact.whatsapp || '01712592519').replace(/\D/g, '');

  const contactCards = [
    {
      icon: FiMail,
      title: 'ইমেইল',
      content: contact.email || 'shikkhanova@gmail.com',
      description: 'সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দেওয়া হয়',
      href: `mailto:${contact.email || 'shikkhanova@gmail.com'}`,
    },
    {
      icon: FiPhone,
      title: 'হেল্পলাইন ফোন',
      content: contact.helpline || '০১৭১২৫৯২৫১৯',
      description: `প্রতিদিন ${contact.hours || 'সকাল ৮টা – রাত ৯টা'}`,
      href: `tel:${cleanPhone}`,
    },
    {
      icon: FiMapPin,
      title: 'ক্যাম্পাস ও ঠিকানা',
      content: contact.address || 'জুম্মাপাড়া, নীলফামারী সদর',
      description: 'শিক্ষানোভা একাডেমি',
      href: 'https://maps.google.com?q=Jummapara,Nilphamari',
    },
    {
      icon: FaWhatsapp,
      title: 'সরাসরি হোয়াটসঅ্যাপ',
      content: 'চ্যাট করুন',
      description: 'তাৎক্ষণিক তথ্য ও সহায়তা',
      href: `https://wa.me/88${cleanWhatsapp}`,
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error('অনুগ্রহ করে নাম, ইমেইল এবং বার্তা পূরণ করুন');
      setLoading(false);
      return;
    }

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      toast.success(
        'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! দ্রুত উত্তর দেওয়া হবে।',
      );
      setFormData({
        name: '',
        email: '',
        subject: '',
        reason: 'admission',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      toast.error('বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 overflow-hidden">
      {/* 1. Header Section matching /contact-us */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-block mb-3">
          <span className="text-xs font-bold tracking-widest text-[#0F2C59] px-4 py-1.5 rounded-full border border-[#0F2C59]/20 bg-[#0F2C59]/5">
            আমাদের সাথে যোগাযোগ
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-slate-900 tracking-tight">
          চলুন কথা বলি
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          শিক্ষানোভা একাডেমি, ৫ম-১০ম শ্রেণি ভর্তি, অধ্যায়ভিত্তিক রঙিন শিট কিংবা পরীক্ষার রেজাল্ট নিয়ে যেকোনো প্রশ্ন থাকলে নির্দ্বিধায় বার্তা দিন।
        </p>
      </div>

      {/* 2. Top 4 Contact Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-14">
        {contactCards.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group relative bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white bg-[#0F2C59] group-hover:scale-105 group-hover:bg-[#C8102E] transition-all duration-300 shadow-md">
                <IconComponent size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-[#C8102E] transition-colors">
                  {item.content}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* 3. Form & Info Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              বার্তা পাঠান
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              নিচের ফর্মটি পূরণ করে সাবমিট করুন, আমরা দ্রুত আপনার সাথে যোগাযোগ করব।
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  পূর্ণ নাম *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <FiUser size={16} />
                  </span>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="আপনার নাম লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-[#0F2C59] focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  ইমেইল ঠিকানা *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <FiMail size={16} />
                  </span>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="আপনার ইমেইল লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-[#0F2C59] focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  বিষয়
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="বার্তার বিষয় (যেমন: ৭ম শ্রেণি ভর্তি তথ্য)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-[#0F2C59] focus:outline-none transition text-sm"
                />
              </div>

              {/* Reason Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  যোগাযোগের কারণ নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {contactReasons.map((reason) => {
                    const isSelected = formData.reason === reason.id;
                    const ReasonIcon = reason.icon;
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            reason: reason.id,
                          }))
                        }
                        className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#0F2C59] bg-[#0F2C59] text-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ReasonIcon size={14} />
                        </div>
                        <p className="text-xs font-bold leading-tight">
                          {reason.label}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {reason.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  বার্তা *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="আপনার জিজ্ঞাসা বা বিস্তারিত তথ্য এখানে লিখুন..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-[#0F2C59] focus:outline-none transition text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F2C59] hover:bg-[#0A1E3C] text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    <span>বার্তা পাঠান</span>
                  </>
                )}
              </button>

              {/* Success Alert */}
              {success && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in">
                  <FiCheckCircle
                    size={18}
                    className="text-emerald-600 shrink-0"
                  />
                  <span>আপনার বার্তা সফলভাবে পৌঁছেছে! ধন্যবাদ।</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: "Always Here" Info Box (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <div className="relative rounded-2xl p-7 sm:p-9 text-white shadow-xl overflow-hidden bg-gradient-to-br from-[#0A1E3C] via-[#0F2C59] to-[#0A1E3C] border border-[#0F2C59]">
            {/* Decorative Glows */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-7">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-200 font-bold">
                  শিক্ষা নোভা একাডেমি
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 leading-tight">
                  আমরা সবসময় পাশে
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  শিক্ষার্থীদের সার্বিক উন্নতি ও সঠিক দিকনির্দেশনাই আমাদের মূল ব্রত।
                </p>
              </div>

              <div className="space-y-6">
                {/* Point 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-xs text-emerald-400">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      দ্রুত উত্তর
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ভর্তি, পরীক্ষা বা শিট সংক্রান্ত যেকোনো প্রশ্নের উত্তর যথাসম্ভব দ্রুত দেওয়া হয়।
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-xs text-amber-400">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      অভিজ্ঞ শিক্ষক প্যানেল
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      গণিত, বিজ্ঞান ও ইংরেজির দক্ষ শিক্ষকগণ প্রতিটি প্রশ্নের সমাধান দিতে প্রস্তুত।
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-xs text-blue-400">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      সরাসরি যোগাযোগ
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ফোন, হোয়াটসঅ্যাপ ও সরাসরি ক্যাম্পাসে এসে যোগাযোগ করার সুব্যবস্থা।
                    </p>
                  </div>
                </div>
              </div>

              {/* Hotline & WhatsApp Section */}
              <div className="pt-6 border-t border-white/15 space-y-4">
                <p className="text-xs text-slate-300">
                  জরুরি প্রয়োজনে প্রতিদিন সকাল ৮টা থেকে রাত ৯টার মধ্যে সরাসরি হেল্পলাইনে ফোন করুন।
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/88${cleanWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 rounded-full font-bold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    <FaWhatsapp size={16} />
                    <span>হোয়াটসঅ্যাপে চ্যাট</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-2 bg-white text-[#0A1E3C] hover:bg-slate-100 px-5 py-2.5 rounded-full font-bold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    <FiPhone size={14} />
                    <span>{contact.helpline || '০১৭১২৫৯২৫১৯'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Google Maps Embed Section */}
      <div className="mt-14 sm:mt-16">
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-50">
          <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                আমাদের অবস্থান মানচিত্র
              </h4>
              <p className="text-xs text-slate-500">
                {contact.address || 'জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী'}
              </p>
            </div>
            <a
              href="https://maps.google.com?q=Jummapara,Nilphamari"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#C8102E] hover:underline"
            >
              গুগল ম্যাপে দেখুন →
            </a>
          </div>
          <div className="relative h-[240px] sm:h-[300px] md:h-[350px]">
            <iframe
              title="Shikkha Nova Location"
              src="https://www.google.com/maps?q=Jummapara,Nilphamari&output=embed"
              className="w-full h-full grayscale-25 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
