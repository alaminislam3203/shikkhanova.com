import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PaymentStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন এক্সেস করতে পারেন' }, { status: 403 });
    }

    const purchases = await prisma.pdfPurchase.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            classGrade: true,
            rollNumber: true,
          },
        },
        pdf: {
          select: {
            id: true,
            title: true,
            classGrade: true,
            subject: true,
            price: true,
            fileUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ purchases });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন পরিবর্তন করতে পারেন' }, { status: 403 });
    }

    const body = await req.json();
    const { purchaseId, status, note } = body;

    if (!purchaseId || !status) {
      return NextResponse.json({ error: 'purchaseId এবং status প্রয়োজন' }, { status: 400 });
    }

    const updated = await prisma.pdfPurchase.update({
      where: { id: purchaseId },
      data: {
        status: status as PaymentStatus,
        note: note || null,
      },
    });

    return NextResponse.json({ message: `স্ট্যাটাস সফলভাবে ${status} করা হয়েছে`, updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

