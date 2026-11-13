"use client";

import React from "react";
import toast from "react-hot-toast";

export interface ConfirmToastOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void | Promise<void>;
}

/**
 * Triggers a custom Hot Toast modal matching the user's design for confirmation prompts.
 */
export const showConfirmToast = ({
  title = "মুছে ফেলা নিশ্চিতকরণ",
  message,
  confirmText = "হ্যাঁ, নিশ্চিত করুন",
  cancelText = "বাতিল",
  confirmButtonClass = "bg-[#C8102E] hover:bg-[#A50D26]",
  onConfirm,
}: ConfirmToastOptions) => {
  // Dismiss any existing toast first so confirmation is clean and immediate
  try {
    toast.dismiss();
  } catch {}

  const toastId = `confirm-toast-${Date.now()}`;

  setTimeout(() => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? "animate-in fade-in slide-in-from-top-4 duration-200"
              : "animate-out fade-out slide-out-to-top-4 duration-150"
          } bg-white shadow-2xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 w-[380px] max-w-[92vw] pointer-events-auto transition-all relative z-[999999]`}
          style={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex items-center justify-end gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer active:scale-95 shadow-2xs"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await onConfirm();
                } catch (err: any) {
                  toast.error(err?.message || "অপারেশন ব্যর্থ হয়েছে।");
                }
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-black text-white border border-transparent rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        id: toastId,
        duration: 60000,
        position: "top-center",
      }
    );
  }, 10);
};

