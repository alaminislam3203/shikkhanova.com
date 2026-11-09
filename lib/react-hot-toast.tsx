'use client';

import React, { useEffect, useState } from 'react';

export type ToastType = 'blank' | 'success' | 'error' | 'loading' | 'custom';

export interface Toast {
  id: string;
  type: ToastType;
  message: React.ReactNode | ((t: Toast) => React.ReactNode);
  visible: boolean;
  duration?: number;
  createdAt: number;
}

export interface ToastOptions {
  id?: string;
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
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
    type === 'loading' || type === 'custom' ? Infinity : 4000;
  const duration = opts?.duration ?? defaultDuration;

  const newToast: Toast = {
    id,
    type,
    message,
    visible: true,
    duration,
    createdAt: Date.now(),
  };

  const existingIndex = memoryToasts.findIndex((t) => t.id === id);
  if (existingIndex > -1) {
    memoryToasts = memoryToasts.map((t, idx) =>
      idx === existingIndex ? newToast : t
    );
  } else {
    memoryToasts = [newToast, ...memoryToasts].slice(0, 6);
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
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  toastOptions?: ToastOptions;
}

export function Toaster({
  position = 'top-center',
  containerStyle,
  containerClassName = '',
}: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setToasts([...memoryToasts]);
    const listener: Listener = (updated) => {
      setToasts(updated);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  const posClasses: Record<string, string> = {
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'top-right': 'top-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
  };

  return (
    <div
      style={containerStyle}
      className={`fixed z-[9999] flex flex-col gap-3 pointer-events-none max-w-[95vw] w-full sm:w-auto ${
        posClasses[position] || posClasses['top-center']
      } ${containerClassName}`}
    >
      {toasts.map((t) => {
        const content =
          typeof t.message === 'function' ? t.message(t) : t.message;

        if (t.type === 'custom') {
          return (
            <div
              key={t.id}
              className="pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
            >
              {content}
            </div>
          );
        }

        return (
          <div
            key={t.id}
            className="pointer-events-auto bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-200/90 flex items-center gap-3 text-xs sm:text-sm font-bold max-w-md animate-in fade-in zoom-in-95 duration-150"
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
            {t.type === 'loading' && (
              <span className="w-5 h-5 rounded-full border-2 border-brand-600 border-t-transparent animate-spin shrink-0" />
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
  );
}

export { toast };
export default toast;

