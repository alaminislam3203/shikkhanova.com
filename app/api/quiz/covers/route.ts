import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { QuizCovers } from '@/lib/defaultQuizData';
import { getQuizCoversFromDb, saveQuizCoversToDb } from '@/lib/dbSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const covers = await getQuizCoversFromDb();
    return NextResponse.json(
      { covers, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'কভার ইমেজ লোড করতে সমস্যা হয়েছে' },
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
        { error: 'শুধুমাত্র অ্যাডমিন কভার ইমেজ পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { covers } = body;

    if (!covers || typeof covers !== 'object') {
      return NextResponse.json(
        { error: 'কভার ইমেজের ডাটা সঠিক নয়।' },
        { status: 400 }
      );
    }

    // Clean and normalize keys
    const rawClasses = typeof covers.classes === 'object' && covers.classes ? covers.classes : {};
    const rawSubjects = typeof covers.subjects === 'object' && covers.subjects ? covers.subjects : {};

    const cleanClasses: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawClasses)) {
      if (typeof v === 'string' && v.trim()) {
        cleanClasses[String(k).trim()] = v.trim();
      }
    }

    const cleanSubjects: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawSubjects)) {
      if (typeof v === 'string' && v.trim()) {
        cleanSubjects[String(k).trim()] = v.trim();
      }
    }

    const sanitized: QuizCovers = {
      classes: cleanClasses,
      subjects: cleanSubjects,
    };

    // Save permanently to PostgreSQL Database & File Backup
    await saveQuizCoversToDb(sanitized);

    return NextResponse.json({
      message: 'কুইজ কার্ডের কভার ইমেজ সফলভাবে ডেটাবেজে সংরক্ষণ ও আপডেট করা হয়েছে!',
      covers: sanitized,
      savedToDb: true,
    });
  } catch (error: any) {
    console.error('Failed to save quiz covers:', error);
    return NextResponse.json(
      { error: error.message || 'কভার ইমেজ সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
