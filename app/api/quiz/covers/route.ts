import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_QUIZ_COVERS, QuizCovers } from '@/lib/defaultQuizData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const COVERS_FILE_PATH = path.join(process.cwd(), 'data', 'quiz-covers.json');

function readQuizCovers(): QuizCovers {
  try {
    if (fs.existsSync(COVERS_FILE_PATH)) {
      const raw = fs.readFileSync(COVERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          classes: parsed.classes || {},
          subjects: parsed.subjects || {},
        };
      }
    }
  } catch (err) {
    console.error('Failed to read quiz covers file:', err);
  }
  return DEFAULT_QUIZ_COVERS;
}

function writeQuizCovers(covers: QuizCovers): void {
  try {
    const dir = path.dirname(COVERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(COVERS_FILE_PATH, JSON.stringify(covers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write quiz covers file:', err);
  }
}

export async function GET() {
  try {
    const covers = readQuizCovers();
    return NextResponse.json({ covers });
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
    if (session?.user?.role !== 'ADMIN') {
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

    const sanitized: QuizCovers = {
      classes: typeof covers.classes === 'object' && covers.classes ? covers.classes : {},
      subjects: typeof covers.subjects === 'object' && covers.subjects ? covers.subjects : {},
    };

    writeQuizCovers(sanitized);

    return NextResponse.json({
      message: 'কুইজ কার্ডের কভার ইমেজ সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!',
      covers: sanitized,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'কভার ইমেজ সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

