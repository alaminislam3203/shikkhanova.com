import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_QUIZ_PACKAGES, QuizPackageItem } from '@/lib/defaultQuizData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const PACKAGES_FILE_PATH = path.join(process.cwd(), 'data', 'quiz-packages.json');

function readQuizPackages(): QuizPackageItem[] {
  try {
    if (fs.existsSync(PACKAGES_FILE_PATH)) {
      const raw = fs.readFileSync(PACKAGES_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read quiz packages file:', err);
  }
  return DEFAULT_QUIZ_PACKAGES;
}

function writeQuizPackages(packages: QuizPackageItem[]): void {
  try {
    const dir = path.dirname(PACKAGES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PACKAGES_FILE_PATH, JSON.stringify(packages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write quiz packages file:', err);
  }
}

export async function GET() {
  try {
    const packages = readQuizPackages();
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
    if (session?.user?.role !== 'ADMIN') {
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

    writeQuizPackages(cleanPackages);

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

