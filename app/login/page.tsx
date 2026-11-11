'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const validEmail = /\S+@\S+\.\S+/.test(email);
    return validEmail && password.length >= 6 && !loading;
  }, [email, password, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      toast.error('অনুগ্রহ করে সঠিক ইমেইল লিখুন');
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      setLoading(false);
      return;
    }

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: cleanEmail,
        password,
      });

      if (res?.error) {
        const errorMsg =
          res.error === 'CredentialsSignin'
            ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়'
            : res.error || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়';
        toast.error(errorMsg);
        setLoading(false);
      } else {
        toast.success('স্বাগতম! লগইন সফল হয়েছে।');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      const msg = err?.message || 'লগইন করতে সমস্যা হয়েছে';
      toast.error(msg);
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('robiulnil101@gmail.com');
    setPassword('RABIUL@20');
    toast.success('অ্যাডমিন ডেমো তথ্য পূরণ করা হয়েছে');
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="max-w-[500px] mx-auto rounded-2xl overflow-hidden">
          
          {/* Card Header matching Merxo Hub structure */}
          <div className="px-6 pt-6 text-center">
            <div className="inline-block mb-3">
              <span className="text-xs font-bold tracking-widest text-white px-4 py-2 rounded-full bg-[#0F2C59]">
                স্বাগতম
              </span>
            </div>
            <h2 className="text-3xl font-black text-[#0F2C59]">
              লগইন
            </h2>
            {callbackUrl && callbackUrl !== '/' && (
              <p className="text-sm text-gray-600 mt-2 font-mono">
                রিডাইরেক্ট হবে: {callbackUrl}
              </p>
            )}
          </div>

          {/* Card Body & Form */}
          <div className="p-6 border-t border-gray-100">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              
              {/* Email Input with exact FiMail icon */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <FiMail />
                </span>
                <input
                  type="email"
                  placeholder="ইমেইল"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                  style={{ paddingLeft: '34px' }}
                />
              </div>

              {/* Password Input with exact FiLock icon and FiEye / FiEyeOff toggle */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <FiLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#ccc] rounded-[5px] p-[10px] text-sm bg-transparent focus:outline-none focus:border-[#0F2C59] transition"
                  style={{ paddingLeft: '34px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="accent-[#0F2C59] cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>মনে রাখুন</span>
                </label>
                <Link href="/password" className="text-[#C8102E] text-sm hover:underline font-medium">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                className="bg-[#0F2C59] hover:bg-[#0A1E3C] p-2.5 rounded text-white w-full disabled:opacity-50 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
                type="submit"
                disabled={!canSubmit}
              >
                {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>

            {/* Registration Link */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
              <p>অ্যাকাউন্ট নেই?</p>
              <Link href="/register" className="text-[#C8102E] font-semibold hover:underline">
                রেজিস্ট্রেশন করুন
              </Link>
            </div>

            {/* Admin Demo Fill Button for easy testing */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={autofillAdmin}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 rounded text-xs font-semibold text-amber-900 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>অ্যাডমিন ডেমো অটোফিল (robiulnil101@gmail.com)</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center py-10 text-gray-500">লোড হচ্ছে...</p>}>
      <LoginFormInner />
    </Suspense>
  );
}
