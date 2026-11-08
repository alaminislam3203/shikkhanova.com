import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const session = await getServerSession(authOptions);

    const where: any = {};
    if (classGrade) {
      where.classGrade = parseInt(classGrade);
    }

    const pdfs = await prisma.pdfMaterial.findMany({
      where,
      include: {
        purchases: session?.user?.id
          ? {
              where: {
                studentId: session.user.id,
              },
            }
          : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ pdfs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন পিডিএফ শিট যুক্ত করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, classGrade, subject, price, fileUrl, isFree } = body;

    const newPdf = await prisma.pdfMaterial.create({
      data: {
        title,
        description,
        classGrade: parseInt(classGrade),
        subject,
        price: parseFloat(price || '50'),
        fileUrl,
        isFree: Boolean(isFree),
      },
    });

    return NextResponse.json({ message: 'পিডিএফ সফলভাবে যোগ করা হয়েছে', pdf: newPdf });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

