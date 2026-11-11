import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trxId = searchParams.get('trxId')?.trim().toUpperCase();

    if (!trxId) {
      return NextResponse.json({ error: 'TrxID প্রদান করুন' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'পেমেন্ট স্ট্যাটাস দেখতে অনুগ্রহ করে প্রথমে লগইন করুন' },
        { status: 401 }
      );
    }

    const purchase = await prisma.pdfPurchase.findUnique({
      where: { trxId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
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
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'এই TrxID দিয়ে কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    // Only the purchaser or Admin can view their purchase
    if (
      session.user.role !== 'ADMIN' &&
      purchase.studentId !== session.user.id &&
      purchase.student?.email?.toLowerCase() !== session.user.email?.toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'এই ট্রানজ্যাকশনটি আপনার অ্যাকাউন্টের সাথে যুক্ত নয়।' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      purchase: {
        id: purchase.id,
        trxId: purchase.trxId,
        status: purchase.status,
        pdfId: purchase.pdfId,
        pdf: purchase.pdf,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'পিডিএফ সংগ্রহ করতে অবশ্যই লগইন থাকতে হবে। অনুগ্রহ করে লগইন করুন।' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { pdfId, paymentMethod, senderPhone, trxId, amount } = body;

    if (!pdfId || !paymentMethod || !senderPhone || !trxId) {
      return NextResponse.json(
        { error: 'সবগুলো তথ্য সঠিকভাবে পূরণ করুন (পিডিএফ, মেথড, ফোন নম্বর এবং TrxID)' },
        { status: 400 }
      );
    }

    const cleanTrx = trxId.trim().toUpperCase();

    // Check if TrxID was already used
    const existingTrx = await prisma.pdfPurchase.findUnique({
      where: { trxId: cleanTrx },
    });

    if (existingTrx) {
      return NextResponse.json(
        { error: 'এই ট্রানজ্যাকশন আইডি (TrxID) দিয়ে ইতোমধ্যে সাবমিট করা হয়েছে' },
        { status: 400 }
      );
    }

    let studentId = session.user.id;

    // If Master Admin is testing purchase, resolve or create DB record by email
    if (studentId === 'admin-master-id') {
      const adminEmail = (session.user.email || 'robiulnil101@gmail.com').toLowerCase();
      const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          name: session.user.name || 'শিক্ষানোভা অ্যাডমিন',
          email: adminEmail,
          password: 'master_admin_placeholder',
          role: 'ADMIN',
          phone: senderPhone || '01712592519',
        },
      });
      studentId = adminUser.id;
    }

    const purchase = await prisma.pdfPurchase.create({
      data: {
        studentId,
        pdfId,
        amount: parseFloat(amount || '50'),
        paymentMethod: paymentMethod === 'NAGAD' ? PaymentMethod.NAGAD : PaymentMethod.BKASH,
        senderPhone,
        trxId: cleanTrx,
        status: PaymentStatus.PENDING,
      },
    });

    return NextResponse.json({
      message: 'পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করার পর পিডিএফ আনলক হবে।',
      purchaseId: purchase.id,
      trxId: purchase.trxId,
    });
  } catch (error: any) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: error.message || 'পেমেন্ট সাবমিট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

