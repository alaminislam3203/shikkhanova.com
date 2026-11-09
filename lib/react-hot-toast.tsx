'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'blank' | 'success' | 'error' | 'loading' | 'custom';

export type ToastPosition =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: string;
  type: ToastType;
  message: React.ReactNode | ((t: Toast) => React.ReactNode);
  visible: boolean;
  duration?: number;
  position?: ToastPosition;
  createdAt: number;
}

export interface ToastOptions {
  id?: string;
  duration?: number;
  position?: ToastPosition;
  style?: React.CSSProperties;
  className?: string;
}

type Listener = (toasts: Toast[]) => void;

let memoryToasts: Toast[] = [];
const listeners: Set<Listener> = new Set();
const timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

function emit() {
  const snapshot = [...memoryToasts];
  listeners.forEach((listener) => listener(snapshot));
}

function genId() {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function scheduleDismiss(id: string, duration: number) {
  if (timers.has(id)) {
    clearTimeout(timers.get(id)!);
    timers.delete(id);
  }
  if (duration === Infinity || duration <= 0) return;

  const timer = setTimeout(() => {
    dismissToast(id);
  }, duration);
  timers.set(id, timer);
}

function upsertToast(
  message: React.ReactNode | ((t: Toast) => React.ReactNode),
  type: ToastType,
  opts?: ToastOptions
): string {
  const id = opts?.id || genId();
  const defaultDuration =
    type === 'loading' || type === 'custom' ? Infinity : 3500;
  const duration = opts?.duration ?? defaultDuration;
  const position =
    opts?.position ?? (type === 'custom' ? 'center' : undefined);

  const newToast: Toast = {
    id,
    type,
    message,
    visible: true,
    duration,
    position,
    createdAt: Date.now(),
  };

  const existingIndex = memoryToasts.findIndex((t) => t.id === id);
  if (existingIndex > -1) {
    memoryToasts = memoryToasts.map((t, idx) =>
      idx === existingIndex ? newToast : t
    );
  } else {
    memoryToasts = [newToast, ...memoryToasts].slice(0, 5);
  }

  emit();
  scheduleDismiss(id, duration);
  return id;
}

function dismissToast(toastId?: string) {
  if (!toastId) {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    memoryToasts = [];
    emit();
    return;
  }

  if (timers.has(toastId)) {
    clearTimeout(timers.get(toastId)!);
    timers.delete(toastId);
  }

  memoryToasts = memoryToasts.filter((t) => t.id !== toastId);
  emit();
}

export interface ToastFn {
  (
    message: React.ReactNode | ((t: Toast) => React.ReactNode),
    opts?: ToastOptions
  ): string;
  success: (
    message: React.ReactNode | ((t: Toast) => React.ReactNode),
    opts?: ToastOptions
  ) => string;
  error: (
    message: React.ReactNode | ((t: Toast) => React.ReactNode),
    opts?: ToastOptions
  ) => string;
  loading: (
    message: React.ReactNode | ((t: Toast) => React.ReactNode),
    opts?: ToastOptions
  ) => string;
  custom: (
    renderer: React.ReactNode | ((t: Toast) => React.ReactNode),
    opts?: ToastOptions
  ) => string;
  dismiss: (toastId?: string) => void;
  remove: (toastId?: string) => void;
}

const toast = ((message, opts) =>
  upsertToast(message, 'blank', opts)) as ToastFn;

toast.success = (message, opts) => upsertToast(message, 'success', opts);
toast.error = (message, opts) => upsertToast(message, 'error', opts);
toast.loading = (message, opts) => upsertToast(message, 'loading', opts);
toast.custom = (renderer, opts) => upsertToast(renderer, 'custom', opts);
toast.dismiss = (toastId?: string) => dismissToast(toastId);
toast.remove = (toastId?: string) => dismissToast(toastId);

export interface ToasterProps {
  position?: ToastPosition;
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  toastOptions?: ToastOptions;
}

export function Toaster({
  position = 'center',
  containerStyle,
  containerClassName = '',
}: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToasts([...memoryToasts]);
    const listener: Listener = (updated) => {
      setToasts(updated);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!mounted || toasts.length === 0 || typeof document === 'undefined') {
    return null;
  }

  const centerToasts = toasts.filter(
    (t) => (t.position || position) === 'center' || t.type === 'custom'
  );
  const topToasts = toasts.filter(
    (t) => (t.position || position) !== 'center' && t.type !== 'custom'
  );

  const portalContent = (
    <>
      {/* Screen-Centered Toasts — Always on top of ALL layers via Portal + Max 32-bit zIndex */}
      {centerToasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2147483647,
            ...containerStyle,
          }}
          className={`fixed inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 ${containerClassName}`}
        >
          <div
            style={{ zIndex: 2147483647 }}
            className="flex flex-col items-center justify-center gap-3 w-full max-w-md pointer-events-auto relative"
          >
            {centerToasts.map((t) => {
              const content =
                typeof t.message === 'function' ? t.message(t) : t.message;

              if (t.type === 'custom') {
                return (
                  <div
                    key={t.id}
                    className="w-full flex items-center justify-center animate-in zoom-in-95 duration-200"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <div
                  key={t.id}
                  className="w-full max-w-sm bg-white text-slate-800 p-6 rounded-3xl shadow-2xl border-2 border-slate-200 flex flex-col items-center text-center gap-3.5 animate-in zoom-in-95 duration-200 relative"
                >
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition"
                  >
                    ✕
                  </button>

                  {t.type === 'success' && (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-black shadow-inner border border-emerald-200">
                      ✓
                    </div>
                  )}
                  {t.type === 'error' && (
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-black shadow-inner border border-rose-200">
                      ✕
                    </div>
                  )}
                  {t.type === 'loading' && (
                    <div className="w-12 h-12 rounded-full border-3 border-brand-600 border-t-transparent animate-spin" />
                  )}
                  {t.type === 'blank' && (
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-black shadow-inner border border-amber-200">
                      !
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4
                      className={`text-base font-black ${
                        t.type === 'success'
                          ? 'text-emerald-700'
                          : t.type === 'error'
                          ? 'text-rose-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {t.type === 'success'
                        ? 'সফল হয়েছে!'
                        : t.type === 'error'
                        ? 'সতর্কবার্তা'
                        : 'বিজ্ঞপ্তি'}
                    </h4>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                      {content}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className={`w-full py-2.5 px-5 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95 ${
                      t.type === 'success'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : t.type === 'error'
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-brand-700 hover:bg-brand-800'
                    }`}
                  >
                    ঠিক আছে
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-center Toasts — Also rendered at Max zIndex */}
      {topToasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: 0,
            right: 0,
            zIndex: 2147483647,
          }}
          className="fixed top-5 inset-x-0 flex flex-col items-center gap-2.5 px-4 pointer-events-none"
        >
          {topToasts.map((t) => {
            const content =
              typeof t.message === 'function' ? t.message(t) : t.message;

            return (
              <div
                key={t.id}
                className="pointer-events-auto bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-200/90 flex items-center gap-3 text-xs sm:text-sm font-bold max-w-md w-full sm:w-auto animate-in fade-in duration-150"
              >
                {t.type === 'success' && (
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-black">
                    ✓
                  </span>
                )}
                {t.type === 'error' && (
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 text-xs font-black">
                    ✕
                  </span>
                )}
                <div className="flex-1 leading-snug">{content}</div>
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  className="text-slate-400 hover:text-slate-600 text-xs pl-1"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return createPortal(portalContent, document.body);
}

export { toast };
export default toast;
