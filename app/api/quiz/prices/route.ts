import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_QUIZ_PRICES, QuizPrices } from '@/lib/defaultQuizData';
import { getQuizPricesFromDb, saveQuizPricesToDb } from '@/lib/dbSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prices = await getQuizPricesFromDb();
    return NextResponse.json({ prices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'মূল্য লোড করতে সমস্যা হয়েছে' }, { status: 500 });
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
        { error: 'শুধুমাত্র অ্যাডমিন কুইজের মূল্য পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const current = await getQuizPricesFromDb();

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

    await saveQuizPricesToDb(updated);

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
