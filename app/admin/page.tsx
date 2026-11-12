"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AdminSidebar, {
  AdminTab,
  AdminProfileInfo,
} from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import PurchasesTable from "@/components/admin/PurchasesTable";
import AddResultForm from "@/components/admin/AddResultForm";
import AddPdfForm, { PdfFormData } from "@/components/admin/AddPdfForm";
import AdminAttendanceManager from "@/components/admin/AdminAttendanceManager";
import AdminNoticesManager from "@/components/admin/AdminNoticesManager";
import AdminStudentsManager from "@/components/admin/AdminStudentsManager";
import AdminSubjectsManager from "@/components/admin/AdminSubjectsManager";
import AdminBannersManager from "@/components/admin/AdminBannersManager";
import AdminAchieversManager from "@/components/admin/AdminAchieversManager";
import AdminQuizManager from "@/components/admin/AdminQuizManager";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import AdminLandingManager from "@/components/admin/AdminLandingManager";
import AdminSmsManager from "@/components/admin/AdminSmsManager";
import { PurchaseRecord } from "@/types";
import {
  FaBars,
  FaFilePdf,
  FaClock,
  FaCircleCheck,
  FaCircleExclamation,
  FaArrowRight,
  FaCamera,
  FaCloudArrowUp,
  FaCheck,
  FaUserShield,
} from "react-icons/fa6";

const VALID_ADMIN_TABS: AdminTab[] = [
  "dashboard",
  "banners",
  "achievers",
  "purchases",
  "addResult",
  "addPdf",
  "mcqQuiz",
  "gallery",
  "notices",
  "students",
  "subjects",
  "attendance",
  "sms",
  "settings",
];

export default function AdminPage() {
  const { data: session, update } = useSession();
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Initialize with deterministic default for SSR to prevent hydration mismatch
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mounted, setMounted] = useState<boolean>(false);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [pdfCount, setPdfCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [savingAdminProfile, setSavingAdminProfile] = useState<boolean>(false);
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Dynamic URL Sync on Tab Change
  const handleTabChange = (newTab: AdminTab) => {
    setActiveTab(newTab);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sn_admin_active_tab", newTab);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", newTab);
        window.history.pushState({ tab: newTab }, "", url.toString());
      } catch {}
    }
  };

  // Admin Profile State (Synced with DB & Cloudinary)
  const [adminProfile, setAdminProfile] = useState<AdminProfileInfo>({
    name: "রবিউল ইসলাম (পরিচালক)",
    email: "robiulnil101@gmail.com",
    image: "",
    phone: "01712592519",
  });

  // Add Result State
  const [resultForm, setResultForm] = useState({
    examTitle: "১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬",
    classGrade: 7,
    rollNumber: "",
    studentName: "",
    totalMarks: "400",
    obtainedMarks: "",
    grade: "A+",
    gpa: "5.00",
  });

  // Add PDF State
  const [pdfForm, setPdfForm] = useState<PdfFormData>({
    title: "",
    description: "",
    classGrade: 7,
    subject: "গণিত (Mathematics)",
    price: "50",
    fileUrl: "",
    isFree: false,
  });

  // Check URL query param & keep in sync on popstate and refresh
  useEffect(() => {
    setMounted(true);
    const syncTabFromUrl = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        let tabParam = params.get("tab") as AdminTab | null;

        if (!tabParam || !VALID_ADMIN_TABS.includes(tabParam)) {
          const stored = localStorage.getItem("sn_admin_active_tab") as AdminTab | null;
          if (stored && VALID_ADMIN_TABS.includes(stored)) {
            tabParam = stored;
          } else {
            tabParam = "dashboard";
          }
        }

        if (tabParam && VALID_ADMIN_TABS.includes(tabParam)) {
          setActiveTab(tabParam);
          // Sync URL address bar with current active tab
          const url = new URL(window.location.href);
          url.searchParams.set("tab", tabParam);
          window.history.replaceState({ tab: tabParam }, "", url.toString());
        }
      }
    };

    syncTabFromUrl();
    window.addEventListener("popstate", syncTabFromUrl);

    fetchPurchases();
    fetchAdminProfile();
    fetchPdfCount();

    return () => window.removeEventListener("popstate", syncTabFromUrl);
  }, []);

  // Sync session user image if loaded
  useEffect(() => {
    if (session?.user) {
      setAdminProfile((prev) => ({
        name: prev.name || session.user.name || "রবিউল ইসলাম (পরিচালক)",
        email: session.user.email || prev.email,
        image: prev.image || session.user.image || "",
        phone: session.user.phone || prev.phone,
      }));
    }
  }, [session]);

  const fetchAdminProfile = async () => {
    try {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      const data = await res.json();
      if (data.user) {
        setAdminProfile({
          name: data.user.name || "রবিউল ইসলাম (পরিচালক)",
          email: data.user.email || "robiulnil101@gmail.com",
          image: data.user.image || session?.user?.image || "",
          phone: data.user.phone || "01712592519",
        });
      }
    } catch {}
  };

  const fetchPdfCount = async () => {
    try {
      const res = await fetch("/api/pdfs", { cache: "no-store" });
      const data = await res.json();
      if (data.pdfs && Array.isArray(data.pdfs)) {
        setPdfCount(data.pdfs.length);
      }
    } catch {}
  };

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/purchases", { cache: "no-store" });
      const data = await res.json();
      if (data.purchases && Array.isArray(data.purchases)) {
        setPurchases(data.purchases);
      } else {
        setPurchases([]);
      }
    } catch {
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Profile Photo Upload (Cloudinary + DB)
  const handleAdminPhotoSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMsg({
        text: "দয়া করে একটি সঠিক ছবি (JPG, PNG, WebP) নির্বাচন করুন",
        type: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: "ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে", type: "error" });
      return;
    }

    setUploadingPhoto(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/user/upload-photo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ছবি আপলোড ব্যর্থ হয়েছে");
      }

      setAdminProfile((prev) => ({ ...prev, image: data.imageUrl }));
      setMsg({
        text: "অ্যাডমিন প্রোফাইল ছবি সফলভাবে ক্লাউডে আপলোড ও সংরক্ষিত হয়েছে!",
        type: "success",
      });

      if (update) {
        await update({
          user: { image: data.imageUrl },
        });
      }
    } catch (err: any) {
      setMsg({ text: err.message || "ছবি আপলোডে সমস্যা হয়েছে", type: "error" });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  };

  // Save Admin Name & Phone in Settings
  const handleAdminProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAdminProfile(true);
    setMsg(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminProfile.name,
          phone: adminProfile.phone,
          image: adminProfile.image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "তথ্য সংরক্ষণ করা যায়নি");
      }

      setMsg({
        text: "অ্যাডমিন প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!",
        type: "success",
      });
      if (update) {
        await update({
          user: {
            name: adminProfile.name,
            phone: adminProfile.phone,
          },
        });
      }
    } catch (err: any) {
      setMsg({ text: err.message || "সমস্যা হয়েছে", type: "error" });
    } finally {
      setSavingAdminProfile(false);
    }
  };

  const updatePurchaseStatus = async (
    purchaseId: string,
    newStatus: "APPROVED" | "REJECTED",
  ) => {
    try {
      await fetch("/api/admin/purchases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, status: newStatus }),
      });

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseId ? { ...p, status: newStatus } : p,
        ),
      );

      setMsg({
        text: `পেমেন্ট রিকোয়েস্ট সফলভাবে ${newStatus === "APPROVED" ? "অনুমোদন (Approved)" : "বাতিল (Rejected)"} করা হয়েছে!`,
        type: "success",
      });
    } catch {
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseId ? { ...p, status: newStatus } : p,
        ),
      );
      setMsg({ text: "স্ট্যাটাস আপডেট সফল হয়েছে!", type: "success" });
    }
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultForm),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "ফলাফল আপলোড ব্যর্থ হয়েছে");
      }

      setMsg({ text: "নতুন ফলাফল সফলভাবে আপলোড হয়েছে!", type: "success" });
      setResultForm({
        examTitle: "১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬",
        classGrade: 7,
        rollNumber: "",
        studentName: "",
        totalMarks: "400",
        obtainedMarks: "",
        grade: "A+",
        gpa: "5.00",
      });
    } catch (err: any) {
      setMsg({
        text: err.message || "ফলাফল আপলোডে সমস্যা হয়েছে",
        type: "error",
      });
    }
  };

  const pendingPurchases = purchases.filter((p) => p.status === "PENDING");
  const approvedPurchases = purchases.filter((p) => p.status === "APPROVED");
  const totalRevenue = approvedPurchases.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col lg:flex-row items-start">
      {/* Hidden File Input for Quick Admin Photo Upload from Anywhere in Admin Panel */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handleAdminPhotoSelect}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Sticky Side Menu Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        pendingCount={pendingPurchases.length}
        pdfCount={pdfCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        adminProfile={adminProfile}
        onTriggerPhotoUpload={() => photoInputRef.current?.click()}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Sticky Top Header Bar */}
        <div className="sticky top-3 z-20 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="মেন্যু খুলুন"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  অ্যাডমিন প্যানেল
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-brand-700">
                  {activeTab === "dashboard" && "ড্যাশবোর্ড ওভারভিউ"}
                  {activeTab === "banners" && "হোমপেজ ব্যানার স্লাইডার"}
                  {activeTab === "achievers" && "আমাদের সাফল্য গাঁথা"}
                  {activeTab === "purchases" && "পেমেন্ট রিকোয়েস্ট যাচাই"}
                  {activeTab === "addPdf" && "পিডিএফ শিট ও কার্ড ম্যানেজমেন্ট"}
                  {activeTab === "addResult" && "কোচিং পরীক্ষার রেজাল্ট আপলোড"}
                  {activeTab === "mcqQuiz" && "অনলাইন কুইজ ও MCQ পরীক্ষা"}
                  {activeTab === "gallery" && "ফটো গ্যালারি ম্যানেজ"}
                  {activeTab === "notices" && "নোটিশ বোর্ড ম্যানেজমেন্ট"}
                  {activeTab === "students" && "শিক্ষার্থী ম্যানেজ ও ভর্তি"}
                  {activeTab === "subjects" && "শ্রেণিভিত্তিক বিষয় ও NCTB বই"}
                  {activeTab === "attendance" && "রোল উপস্থিতি শিট"}
                  {activeTab === "sms" && "এসএমএস সেন্টার (BulkSMSBD)"}
                  {activeTab === "settings" && "প্রোফাইল ও সেন্টার সেটিংস"}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-800 leading-tight">
                {activeTab === "dashboard" &&
                  "লাইভ ড্যাশবোর্ড ও একাডেমিক পরিসংখ্যান"}
                {activeTab === "banners" &&
                  "ফুল-উইডথ হিরো ব্যানার আপলোড ও ম্যানেজমেন্ট"}
                {activeTab === "achievers" &&
                  "আমাদের সাফল্য গাঁথা (৬ষ্ঠ - ১০ম শ্রেণি)"}
                {activeTab === "purchases" && "বিকাশ ও নগদ পেমেন্ট অনুমোদন"}
                {activeTab === "addPdf" &&
                  "পিডিএফ শিট আপলোড ও কার্ড কাস্টমাইজেশন"}
                {activeTab === "addResult" && "নতুন পরীক্ষার ফলাফল সংরক্ষণ"}
                {activeTab === "mcqQuiz" &&
                  "অনলাইন কুইজ, MCQ প্রশ্ন ও মডেল টেস্ট কার্ড ম্যানেজমেন্ট"}
                {activeTab === "gallery" &&
                  "ফটো গ্যালারি আপলোড, এডিট ও অ্যালবাম ব্যবস্থাপনা"}
                {activeTab === "notices" && "ডায়নামিক নোটিশ প্রকাশ ও সম্পাদনা"}
                {activeTab === "students" &&
                  "শিক্ষার্থী ভর্তি, তালিকা ও হাজিরা ব্যবস্থাপনা"}
                {activeTab === "subjects" &&
                  "শ্রেণি ৫-১০ বিষয় ও NCTB পাঠ্যবই ম্যানেজমেন্ট"}
                {activeTab === "attendance" &&
                  "রোল উপস্থিতি ও প্রতিদিনের হাজিরা গ্রহণ"}
                {activeTab === "sms" &&
                  "বাল্ক নোটিফিকেশন, ফি রিমাইন্ডার ও লাইভ এসএমএস হিস্ট্রি"}
                {activeTab === "settings" &&
                  "অ্যাডমিন প্রোফাইল, সেন্টার ও ল্যান্ডিং পেজ সেটিংস"}
              </h1>
            </div>
          </div>

          {/* Right: Quick Stats Pills & Admin Avatar */}
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleTabChange("addPdf")}
                className="bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-brand-800 transition"
              >
                <FaFilePdf className="text-brand-600" />
                <span>{pdfCount}টি শিট</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("purchases")}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-amber-800 transition"
              >
                <FaClock className="text-amber-600" />
                <span>{pendingPurchases.length}টি অপেক্ষমাণ</span>
              </button>

              <div className="bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <FaCircleCheck className="text-emerald-600" />
                <span>আয়: ৳{totalRevenue}</span>
              </div>
            </div>

            {/* Admin Profile Avatar Trigger in Header */}
            <button
              type="button"
              onClick={() => handleTabChange("settings")}
              title="অ্যাডমিন প্রোফাইল ও ফটো সেটিংস"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform relative cursor-pointer"
            >
              {adminProfile.image ? (
                <img
                  src={adminProfile.image}
                  alt={adminProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-black text-brand-700">
                  {adminProfile.name.charAt(0) || "A"}
                </span>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <FaClock className="w-3.5 h-3.5 text-white animate-spin" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Message Banner */}
        {msg && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-between shadow-sm animate-in fade-in ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {msg.type === "success" ? (
                <FaCircleCheck className="text-emerald-600 shrink-0 w-4 h-4" />
              ) : (
                <FaCircleExclamation className="text-rose-600 shrink-0 w-4 h-4" />
              )}
              <span>{msg.text}</span>
            </div>
            <button
              onClick={() => setMsg(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 0: Dynamic Overview Dashboard */}
        {activeTab === "dashboard" && (
          <AdminDashboard
            onNavigateTab={handleTabChange}
            onStatusUpdated={() => {
              fetchPurchases();
              fetchPdfCount();
            }}
          />
        )}

        {/* TAB 0.5: Hero Banner Slider Manager */}
        {activeTab === "banners" && <AdminBannersManager />}

        {/* TAB 0.8: Success Stories / Achievers Manager */}
        {activeTab === "achievers" && <AdminAchieversManager />}

        {/* TAB 1: Review Purchases */}
        {activeTab === "purchases" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500 font-semibold px-1">
              <span>
                শিক্ষার্থীদের পাঠানো TrxID বিকাশ/নগদ স্টেটমেন্টের সাথে মিলিয়ে
                Approve বাটনে চাপুন।
              </span>
              <button
                type="button"
                onClick={fetchPurchases}
                className="text-brand-700 hover:underline font-bold"
              >
                ↻ তালিকা রিফ্রেশ করুন
              </button>
            </div>
            <PurchasesTable
              purchases={purchases}
              loading={loading}
              onUpdateStatus={updatePurchaseStatus}
            />
          </div>
        )}

        {/* TAB 2: Manage & Upload PDF Materials */}
        {activeTab === "addPdf" && (
          <AddPdfForm
            formData={pdfForm}
            onChange={setPdfForm}
            onNotify={(m) => {
              setMsg(m);
              fetchPdfCount();
            }}
          />
        )}

        {/* TAB 2.5: Manage Online Quiz & MCQ Questions */}
        {activeTab === "mcqQuiz" && <AdminQuizManager />}

        {/* TAB 3: Upload Result */}
        {activeTab === "addResult" && (
          <AddResultForm
            formData={resultForm}
            onChange={setResultForm}
            onSubmit={handleResultSubmit}
          />
        )}

        {/* TAB 3.5: Manage Notices */}
        {activeTab === "notices" && <AdminNoticesManager />}

        {/* TAB 3.8: Manage Photo Gallery */}
        {activeTab === "gallery" && <AdminGalleryManager />}

        {/* TAB 4: Manage & Add Students */}
        {activeTab === "students" && <AdminStudentsManager />}

        {/* TAB 4.5: Manage Class-wise Subjects & NCTB Books */}
        {activeTab === "subjects" && <AdminSubjectsManager />}

        {/* TAB 4.8: Admin Roll Attendance Manager */}
        {activeTab === "attendance" && <AdminAttendanceManager />}

        {/* TAB 4.9: BulkSMSBD Notification & SMS Center */}
        {activeTab === "sms" && <AdminSmsManager />}

        {/* TAB 5: Admin Profile Photo & Center Settings */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Admin Profile & Photo Upload Card (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
                  <FaUserShield /> মাস্টার অ্যাডমিন প্রোফাইল
                </span>
                <h3 className="text-lg font-black text-slate-800">
                  অ্যাডমিন প্রোফাইল ছবি ও তথ্য পরিবর্তন
                </h3>
                <p className="text-xs text-slate-500">
                  এখানে আপলোড করা ছবি সাইডবার, টপ ন্যাভবার এবং সব জায়গায়
                  প্রদর্শিত হবে।
                </p>
              </div>

              {/* Photo Upload Box */}
              <div className="p-5 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-600 bg-brand-50 flex items-center justify-center shadow-md">
                      {adminProfile.image ? (
                        <img
                          src={adminProfile.image}
                          alt={adminProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-brand-700">
                          {adminProfile.name.charAt(0) || "A"}
                        </span>
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <FaClock className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-nova-500 hover:bg-nova-600 text-white flex items-center justify-center shadow border-2 border-white"
                      title="ছবি পরিবর্তন করুন"
                    >
                      <FaCamera className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800">
                      {adminProfile.name}
                    </h4>
                    <p className="text-xs font-mono text-slate-500">
                      {adminProfile.email}
                    </p>
                    <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Cloudinary ক্লাউড সিঙ্ক সক্রিয়
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-brand transition shrink-0"
                >
                  <FaCloudArrowUp className="w-4 h-4" />
                  <span>
                    {uploadingPhoto ? "আপলোড হচ্ছে..." : "নতুন ছবি আপলোড"}
                  </span>
                </button>
              </div>

              {/* Admin Details Form */}
              <form
                onSubmit={handleAdminProfileSave}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাডমিনের নাম / পদবি
                  </label>
                  <input
                    type="text"
                    required
                    value={adminProfile.name}
                    onChange={(e) =>
                      setAdminProfile({ ...adminProfile, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    হেল্পলাইন ও যোগাযোগের নম্বর
                  </label>
                  <input
                    type="text"
                    required
                    value={adminProfile.phone}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingAdminProfile}
                  className="bg-brand-700 hover:bg-brand-800 text-white font-bold px-6 py-3 rounded-xl shadow-brand transition flex items-center gap-2"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>
                    {savingAdminProfile
                      ? "সংরক্ষণ হচ্ছে..."
                      : "প্রোফাইল তথ্য সেভ করুন"}
                  </span>
                </button>
              </form>
            </div>

            {/* Right: Center Info & Quick Shortcuts (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  শিক্ষানোভা একাডেমি তথ্য
                </h3>
                <p className="text-xs text-slate-500">
                  প্রতিষ্ঠানের সার্বিক অফিশিয়াল বিবরণ
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-xs font-bold">
                    প্রতিষ্ঠানের নাম
                  </span>
                  <p className="font-black text-slate-800 text-base">
                    শিক্ষানোভা (shikkhanova)
                  </p>
                  <p className="text-xs text-nova-600 font-bold">
                    "শিখবো, জিতবো"
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-xs font-bold">
                    অফিসের ঠিকানা
                  </span>
                  <p className="font-bold text-slate-800">
                    জুম্মাপাড়া, নীলফামারী সদর, নীলফামারী
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-xs font-bold">
                    বিকাশ ও নগদ পার্সোনাল নম্বর
                  </span>
                  <p className="font-black font-bn-normal text-brand-700 text-base">
                    ০১৭১২৫৯২৫১৯
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-xs font-bold">
                    লগইন ইমেইল
                  </span>
                  <p className="font-mono font-bold text-slate-800">
                    {adminProfile.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Landing Page Content Manager */}
          <AdminLandingManager />
        </div>
      )}
      </div>
    </div>
  );
}
