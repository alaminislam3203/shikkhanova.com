"use client";

import React from "react";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

/**
 * Triggers a custom Hot Toast modal matching the user's design for logout confirmation.
 */
export const confirmSignOut = () => {
  // Dismiss any existing toast first so confirmation is clean and immediate
  toast.dismiss();

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible
            ? "animate-in fade-in slide-in-from-top-4 duration-200"
            : "animate-out fade-out slide-out-to-top-4 duration-150"
        } bg-white shadow-2xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 w-[360px] max-w-[92vw] pointer-events-auto transition-all`}
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          লগ আউট
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
          আপনি কি লগ আউট করতে চান?
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-5">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer active:scale-95 shadow-2xs"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              signOut({ callbackUrl: "/" });
            }}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-red-500 bg-[#E53E3E] hover:bg-[#C53030] rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
          >
            হ্যাঁ, লগ আউট করুন
          </button>
        </div>
      </div>
    ),
    {
      id: "logout-confirmation-toast",
      duration: 60000,
      position: "top-center",
    },
  );
};
