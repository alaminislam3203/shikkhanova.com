"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaFilePdf,
  FaDownload,
  FaClock,
  FaCheck,
  FaLayerGroup,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { PdfItem } from "@/types";
import toast from "react-hot-toast";
import { toBengaliClass } from "@/lib/defaultQuizData";

interface PdfCardProps {
  pdf: PdfItem;
  onBuyClick: (pdf: PdfItem) => void;
  onRefreshStatus?: () => void;
}

export default function PdfCard({
  pdf,
  onBuyClick,
  onRefreshStatus,
}: PdfCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const requireLogin = () => {
    toast.error("পিডিএফ শিট পেতে অনুগ্রহ করে আগে লগইন করুন");
    router.push("/login?callbackUrl=/pdfs");
  };

  const handleDynamicDownload = async () => {
    if (!session?.user) {
      requireLogin();
      return;
    }

    setDownloading(true);
    const downloadUrl = `/api/pdfs/download?pdfId=${encodeURIComponent(pdf.id)}`;

    try {
      toast.success(`"${pdf.title}" ডাউনলোড শুরু হচ্ছে...`);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${pdf.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(pdf.fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const handleViewOnline = () => {
    if (!session?.user) {
      requireLogin();
      return;
    }
    window.open(pdf.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handlePurchaseClick = () => {
    if (!session?.user) {
      requireLogin();
      return;
    }
    onBuyClick(pdf);
  };
  // Theme colors depending on subject
  const getSubjectTheme = (subj: string) => {
    if (subj.includes("গণিত") || subj.includes("Math")) {
      return {
        gradient:
          "linear-gradient(135deg, #1D63D8 0%, #003893 50%, #041A42 100%)",
        textColor: "text-blue-100",
      };
    }
    if (
      subj.includes("বিজ্ঞান") ||
      subj.includes("Science") ||
      subj.includes("পদার্থ")
    ) {
      return {
        gradient:
          "linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)",
        textColor: "text-emerald-100",
      };
    }
    if (subj.includes("ইংরেজি") || subj.includes("English")) {
      return {
        gradient:
          "linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #4C0519 100%)",
        textColor: "text-rose-100",
      };
    }
    return {
      gradient:
        "linear-gradient(135deg, #0C4CB8 0%, #003893 50%, #020D24 100%)",
      textColor: "text-blue-100",
    };
  };

  const theme = getSubjectTheme(pdf.subject);
  const isFreePdf = Boolean(pdf.isFree) || Number(pdf.price) <= 0;
  const regularPrice = isFreePdf ? 50 : Math.round(pdf.price * 1.5);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden relative transform hover:-translate-y-1">
      {/* Top Banner & Visual Cover */}
      <div>
        <div
          style={{ background: theme.gradient }}
          className="relative text-white p-3 sm:p-6 overflow-hidden"
        >
          {/* Subtle geometric circles */}
          <div className="absolute -right-6 -bottom-6 w-20 h-20 sm:w-28 sm:h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 bg-nova-500/20 rounded-full blur-lg pointer-events-none"></div>

          {/* Badges on Cover */}
          <div className="relative z-10 flex justify-between items-start gap-1 sm:gap-2">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20 shadow-xs">
              <FaLayerGroup className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-nova-400" />
              {toBengaliClass(pdf.classGrade)} শ্রেণি
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 bg-nova-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <HiSparkles /> ১০০% কমন সাজেশন
            </span>
          </div>

          {/* Book Icon & Subject Header */}
          <div className="relative z-10 mt-2 sm:mt-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-105 transition-transform shrink-0">
              <FaFilePdf className="w-4 h-4 sm:w-6 sm:h-6 text-rose-300 drop-shadow" />
            </div>
            <div className="min-w-0">
              <span
                className={`text-[10px] sm:text-xs font-semibold ${theme.textColor} uppercase tracking-wide block truncate`}
              >
                {pdf.subject}
              </span>
              <span className="text-white font-black text-xs sm:text-base leading-tight block truncate">
                প্রিমিয়াম হ্যান্ডনোট
              </span>
            </div>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-base font-black text-slate-800 group-hover:text-brand-700 transition-colors leading-snug line-clamp-2">
              {pdf.title}
            </h3>

            <p className="hidden sm:block text-xs text-slate-500 leading-relaxed line-clamp-2">
              {pdf.description}
            </p>
          </div>

          {/* Value Bullet Points (Desktop only for 2-col mobile compactness) */}
          <div className="hidden sm:block space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <FaCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>অধ্যায়ভিত্তিক সৃজনশীল ও বহুনির্বাচনী সমাধান</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>উচ্চমানের রঙিন ও স্পষ্ট A4 প্রিন্ট উপযোগী PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>বিকাশ / নগদ পেমেন্টে তাৎক্ষণিক সংগ্রহ</span>
            </div>
          </div>

          {/* Price & Discount Tag */}
          <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block uppercase">
                নির্ধারিত ফি
              </span>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                {isFreePdf ? (
                  <>
                    <span className="text-sm sm:text-xl font-black text-emerald-600">
                      ফ্রি (৳০)
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                      ৳{regularPrice}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-2xl font-black text-brand-800">
                      ৳{pdf.price}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                      ৳{regularPrice}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mb-1 ${
                  isFreePdf
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {isFreePdf ? "সবার জন্য উন্মুক্ত" : "বিশেষ ছাড়"}
              </span>
              <div className="flex items-center justify-end gap-1">
                <div
                  className="bg-white px-1 py-0.5 rounded border border-slate-200/80 shadow-xs flex items-center"
                  title="bKash"
                >
                  <img
                    src="/assets/images/bkash.png"
                    alt="bKash"
                    className="h-3 sm:h-3.5 w-auto object-contain"
                  />
                </div>
                <div
                  className="bg-white px-1 py-0.5 rounded border border-slate-200/80 shadow-xs flex items-center"
                  title="Nagad"
                >
                  <img
                    src="/assets/images/nagad.png"
                    alt="Nagad"
                    className="h-3 sm:h-3.5 w-auto object-contain"
                  />
                </div>
                <div
                  className="bg-white px-1 py-0.5 rounded border border-slate-200/80 shadow-xs flex items-center"
                  title="Rocket"
                >
                  <img
                    src="/assets/images/rocket.png"
                    alt="Rocket"
                    className="h-3 sm:h-3.5 w-auto object-contain"
                  />
                </div>
                <div
                  className="bg-white px-1 py-0.5 rounded border border-slate-200/80 shadow-xs flex items-center"
                  title="Upay"
                >
                  <img
                    src="/assets/images/upay.png"
                    alt="Upay"
                    className="h-3 sm:h-3.5 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Action Button */}
      <div className="p-3 sm:p-6 pt-0">
        {isFreePdf ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleDynamicDownload}
              disabled={downloading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm shadow-md transition transform active:scale-95 disabled:opacity-75"
            >
              <FaDownload
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${downloading ? "animate-bounce" : ""}`}
              />
              <span>{downloading ? "..." : "ফ্রি ডাউনলোড"}</span>
            </button>
            <button
              type="button"
              onClick={handleViewOnline}
              title="ব্রাউজারে পিডিএফ পড়ুন"
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition shrink-0 cursor-pointer"
            >
              <FaArrowUpRightFromSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : pdf.purchaseStatus === "APPROVED" ? (
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleDynamicDownload}
                disabled={downloading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm shadow-md transition transform active:scale-95 disabled:opacity-75"
              >
                <FaDownload
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${downloading ? "animate-bounce" : ""}`}
                />
                <span>{downloading ? "..." : "ডাউনলোড"}</span>
              </button>
              <button
                type="button"
                onClick={handleViewOnline}
                title="ব্রাউজারে পিডিএফ ওপেন করুন"
                className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition shrink-0 cursor-pointer"
              >
                <FaArrowUpRightFromSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ) : pdf.purchaseStatus === "PENDING" ? (
          <div className="space-y-1.5 sm:space-y-2">
            <div className="w-full text-center py-2 sm:py-3 px-2 sm:px-3 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-amber-800 flex items-center justify-center gap-1 sm:gap-2">
              <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 animate-spin shrink-0" />
              <span className="truncate">যাচাই চলছে (Pending)...</span>
            </div>
            {onRefreshStatus && (
              <button
                type="button"
                onClick={onRefreshStatus}
                className="w-full text-[10px] sm:text-[11px] font-bold text-brand-700 hover:text-brand-800 hover:underline text-center truncate"
              >
                ↻ চেক করুন
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePurchaseClick}
            className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-brand-700 via-brand-800 to-indigo-900 hover:from-brand-800 hover:to-indigo-950 text-white font-bold py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm shadow-brand hover:shadow-xl transition-all duration-300 transform active:scale-95 group-hover:from-nova-600 group-hover:to-brand-800 cursor-pointer"
          >
            <FaFilePdf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nova-300" />
            <span>সংগ্রহ করুন</span>
          </button>
        )}
      </div>
    </div>
  );
}
