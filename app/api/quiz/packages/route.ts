import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_QUIZ_PACKAGES, QuizPackageItem } from '@/lib/defaultQuizData';
import { getQuizPackagesFromDb, saveQuizPackagesToDb } from '@/lib/dbSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const packages = await getQuizPackagesFromDb();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'প্যাকেজ লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = (process.env.ADMIN_EMAIL || 'robiulnil101@gmail.com').toLowerCase().trim();
    const userRole = String(session?.user?.role || '').toUpperCase().trim();
    const userEmail = String(session?.user?.email || '').toLowerCase().trim();
    const isAdmin = userRole === 'ADMIN' || userEmail === adminEmail;

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন প্যাকেজ পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { packages } = body;

    if (!Array.isArray(packages)) {
      return NextResponse.json(
        { error: 'প্যাকেজের তথ্য সঠিক নয়।' },
        { status: 400 }
      );
    }

    // Sanitize packages
    const cleanPackages: QuizPackageItem[] = packages.map((pkg, idx) => ({
      id: pkg.id || `package_${Date.now()}_${idx}`,
      title: String(pkg.title || 'Special Package').trim(),
      badge: pkg.badge ? String(pkg.badge).trim() : undefined,
      tagline: String(pkg.tagline || '').trim(),
      price: Math.max(0, Number(pkg.price) || 0),
      originalPrice: pkg.originalPrice ? Math.max(0, Number(pkg.originalPrice) || 0) : undefined,
      features: Array.isArray(pkg.features)
        ? pkg.features.map((f: any) => String(f).trim()).filter(Boolean)
        : [],
      unlockScope: ['single_subject', 'single_class', 'all_classes'].includes(pkg.unlockScope)
        ? pkg.unlockScope
        : 'single_class',
      isPopular: Boolean(pkg.isPopular),
      isActive: pkg.isActive !== false,
      accentColor: pkg.accentColor || 'red',
    }));

    await saveQuizPackagesToDb(cleanPackages);

    return NextResponse.json({
      message: 'স্পেশাল মডেল টেস্ট প্যাকেজসমূহ সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!',
      packages: cleanPackages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'প্যাকেজ সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
