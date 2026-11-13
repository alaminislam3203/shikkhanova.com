import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CustomQuizCard } from '@/lib/defaultQuizData';
import { getQuizCardsFromDb, saveQuizCardsToDb } from '@/lib/dbSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cards = await getQuizCardsFromDb();
    return NextResponse.json(
      { cards, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'কার্ড ডাটা লোড করতে সমস্যা হয়েছে' },
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
        { error: 'শুধুমাত্র অ্যাডমিন কুইজ কার্ড পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { cards } = body;

    if (!Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'কার্ডের তালিকা সঠিক নয়।' },
        { status: 400 }
      );
    }

    const sanitized: CustomQuizCard[] = cards.map((c: any, index: number) => ({
      id: c.id ? String(c.id) : `card_${Date.now()}_${index}`,
      title: String(c.title || 'মডেল টেস্ট কার্ড').trim(),
      subtitle: c.subtitle ? String(c.subtitle).trim() : '',
      classGrade: Number(c.classGrade) || 10,
      subject: String(c.subject || 'সাধারণ গণিত').trim(),
      group: c.group || undefined,
      isPaid: Boolean(c.isPaid),
      price: c.isPaid ? Math.max(0, Number(c.price) || 50) : 0,
      badge: c.badge ? String(c.badge).trim() : (c.isPaid ? 'পেইড টেস্ট' : 'ফ্রি টেস্ট'),
      coverImage: c.coverImage ? String(c.coverImage).trim() : '',
      questionCount: Number(c.questionCount) || 20,
      durationMinutes: Number(c.durationMinutes) || 20,
      isActive: c.isActive !== false,
      createdAt: c.createdAt || new Date().toISOString(),
    }));

    // Save permanently to PostgreSQL Database & File Backup
    await saveQuizCardsToDb(sanitized);

    return NextResponse.json({
      message: 'সকল কুইজ কার্ড সফলভাবে ডেটাবেজে সংরক্ষণ ও আপডেট করা হয়েছে!',
      cards: sanitized,
      savedToDb: true,
    });
  } catch (error: any) {
    console.error('Failed to save quiz cards:', error);
    return NextResponse.json(
      { error: error.message || 'কার্ড সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
