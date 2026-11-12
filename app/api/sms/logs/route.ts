import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSmsLogs, clearSmsLogs } from '@/lib/smsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন লগ দেখতে পারবেন' },
        { status: 403 }
      );
    }

    const logs = getSmsLogs();
    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'লগ লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন লগ মুছতে পারবেন' },
        { status: 403 }
      );
    }

    clearSmsLogs();
    return NextResponse.json({ message: 'এসএমএস লগ সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'লগ মুছতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

