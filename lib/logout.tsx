'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

/**
 * Triggers a custom Hot Toast modal matching the user's design for logout confirmation.
 */
export const confirmSignOut = () => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible
            ? 'animate-in fade-in zoom-in-95 duration-200'
            : 'animate-out fade-out zoom-out-95 duration-150'
        } bg-white shadow-2xl rounded-2xl p-5 border border-slate-100 max-w-[340px] sm:max-w-sm w-full pointer-events-auto transition-all`}
        style={{
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          লগ আউট
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
          আপনি কি লগ আউট করতে চান?
        </p>

        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer active:scale-95"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              signOut({ callbackUrl: '/' });
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#E53E3E] hover:bg-red-700 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
          >
            হ্যাঁ, লগ আউট করুন
          </button>
        </div>
      </div>
    ),
    {
      id: 'logout-confirmation-toast',
      duration: 15000,
      position: 'top-center',
    }
  );
};

