import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkSmsBalance } from '@/lib/smsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন ব্যালেন্স দেখতে পারবেন' },
        { status: 403 }
      );
    }

    const data = await checkSmsBalance();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'ব্যালেন্স দেখতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
