import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_QUIZ_PRICES, QuizPrices } from '@/lib/defaultQuizData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'quiz-prices.json');

function readQuizPrices(): QuizPrices {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          classPrices: {
            ...DEFAULT_QUIZ_PRICES.classPrices,
            ...(parsed.classPrices || {}),
          },
          subjectPrice: Number(parsed.subjectPrice) || DEFAULT_QUIZ_PRICES.subjectPrice,
          packages: {
            singleSubject: Number(parsed.packages?.singleSubject) || DEFAULT_QUIZ_PRICES.packages.singleSubject,
            fullClass: Number(parsed.packages?.fullClass) || DEFAULT_QUIZ_PRICES.packages.fullClass,
            vipAll: Number(parsed.packages?.vipAll) || DEFAULT_QUIZ_PRICES.packages.vipAll,
          },
        };
      }
    }
  } catch (err) {
    console.error('Failed to read quiz prices file:', err);
  }
  return DEFAULT_QUIZ_PRICES;
}

function writeQuizPrices(prices: QuizPrices): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(prices, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write quiz prices file:', err);
  }
}

export async function GET() {
  try {
    const prices = readQuizPrices();
    return NextResponse.json({ prices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'মূল্য লোড করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন কুইজের মূল্য পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const current = readQuizPrices();

    const updated: QuizPrices = {
      classPrices: {
        5: Number(body.classPrices?.[5] ?? body.classPrices?.['5'] ?? current.classPrices[5]),
        6: Number(body.classPrices?.[6] ?? body.classPrices?.['6'] ?? current.classPrices[6]),
        7: Number(body.classPrices?.[7] ?? body.classPrices?.['7'] ?? current.classPrices[7]),
        8: Number(body.classPrices?.[8] ?? body.classPrices?.['8'] ?? current.classPrices[8]),
        9: Number(body.classPrices?.[9] ?? body.classPrices?.['9'] ?? current.classPrices[9]),
        10: Number(body.classPrices?.[10] ?? body.classPrices?.['10'] ?? current.classPrices[10]),
      },
      subjectPrice: Number(body.subjectPrice ?? current.subjectPrice),
      packages: {
        singleSubject: Number(body.packages?.singleSubject ?? current.packages.singleSubject),
        fullClass: Number(body.packages?.fullClass ?? current.packages.fullClass),
        vipAll: Number(body.packages?.vipAll ?? current.packages.vipAll),
      },
    };

    writeQuizPrices(updated);

    return NextResponse.json({
      message: 'পেইড কুইজের মূল্য সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!',
      prices: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'মূল্য সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

