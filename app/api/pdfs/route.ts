import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const trxIdsParam = searchParams.get('trxIds');
    const session = await getServerSession(authOptions);

    const where: any = {};
    if (classGrade && classGrade !== 'all') {
      where.classGrade = parseInt(classGrade);
    }

    // Build dynamic purchase filter so logged-in students, email-matched students, and TrxID-matched students all get their live status
    const orConditions: any[] = [];

    if (session?.user?.id && session.user.id !== 'admin-master-id') {
      orConditions.push({ studentId: session.user.id });
    }

    if (session?.user?.email) {
      orConditions.push({
        student: {
          email: session.user.email.toLowerCase(),
        },
      });
    }

    if (trxIdsParam) {
      const trxList = trxIdsParam
        .split(',')
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean);
      if (trxList.length > 0) {
        orConditions.push({
          trxId: { in: trxList },
        });
      }
    }

    const pdfs = await prisma.pdfMaterial.findMany({
      where,
      include: {
        purchases:
          orConditions.length > 0
            ? {
                where: {
                  OR: orConditions,
                },
                orderBy: {
                  updatedAt: 'desc',
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

    if (!title || !subject || !fileUrl) {
      return NextResponse.json(
        { error: 'পিডিএফ টাইটেল, বিষয় এবং ফাইল লিংক প্রদান করা আবশ্যক' },
        { status: 400 }
      );
    }

    const numericPrice = isFree ? 0 : parseFloat(price || '0');
    const freeFlag = Boolean(isFree) || numericPrice <= 0;

    const newPdf = await prisma.pdfMaterial.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : '',
        classGrade: parseInt(classGrade?.toString() || '7'),
        subject: subject.trim(),
        price: freeFlag ? 0 : numericPrice,
        fileUrl: fileUrl.trim(),
        isFree: freeFlag,
      },
    });

    return NextResponse.json({ message: 'নতুন পিডিএফ কার্ড সফলভাবে প্রকাশিত হয়েছে!', pdf: newPdf });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন পিডিএফ শিট এডিট করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, description, classGrade, subject, price, fileUrl, isFree } = body;

    if (!id) {
      return NextResponse.json({ error: 'পিডিএফ আইডি পাওয়া যায়নি' }, { status: 400 });
    }

    if (!title || !subject || !fileUrl) {
      return NextResponse.json(
        { error: 'পিডিএফ টাইটেল, বিষয় এবং ফাইল লিংক প্রদান করা আবশ্যক' },
        { status: 400 }
      );
    }

    const numericPrice = isFree ? 0 : parseFloat(price || '0');
    const freeFlag = Boolean(isFree) || numericPrice <= 0;

    const updatedPdf = await prisma.pdfMaterial.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description ? description.trim() : '',
        classGrade: parseInt(classGrade?.toString() || '7'),
        subject: subject.trim(),
        price: freeFlag ? 0 : numericPrice,
        fileUrl: fileUrl.trim(),
        isFree: freeFlag,
      },
    });

    return NextResponse.json({ message: 'পিডিএফ কার্ড সফলভাবে আপডেট হয়েছে!', pdf: updatedPdf });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন পিডিএফ শিট ডিলিট করতে পারবেন' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'ডিলিট করার জন্য পিডিএফ আইডি প্রয়োজন' }, { status: 400 });
    }

    await prisma.pdfMaterial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'পিডিএফ কার্ড সফলভাবে মুছে ফেলা হয়েছে!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

