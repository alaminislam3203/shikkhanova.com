import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_CUSTOM_QUIZ_CARDS, CustomQuizCard } from '@/lib/defaultQuizData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CARDS_FILE_PATH = path.join(process.cwd(), 'data', 'quiz-cards.json');

function readQuizCards(): CustomQuizCard[] {
  try {
    if (fs.existsSync(CARDS_FILE_PATH)) {
      const raw = fs.readFileSync(CARDS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read quiz cards file:', err);
  }
  return DEFAULT_CUSTOM_QUIZ_CARDS;
}

function writeQuizCards(cards: CustomQuizCard[]): void {
  try {
    const dir = path.dirname(CARDS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CARDS_FILE_PATH, JSON.stringify(cards, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write quiz cards file:', err);
  }
}

export async function GET() {
  try {
    const cards = readQuizCards();
    return NextResponse.json(
      { cards },
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
    const adminEmail = (process.env.ADMIN_EMAIL || 'robiulnil101@gmail.com').toLowerCase();
    const isAdmin =
      session?.user?.role === 'ADMIN' ||
      session?.user?.email?.toLowerCase() === adminEmail;

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

    writeQuizCards(sanitized);

    return NextResponse.json({
      message: 'সকল কুইজ কার্ড সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!',
      cards: sanitized,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'কার্ড সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
