import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { pdfId, paymentMethod, senderPhone, trxId, amount, guestEmail, guestName, guestClass, guestRoll } = body;

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

    let studentId = session?.user?.id;

    // If Master Admin is testing purchase, resolve or create DB record by email
    if (studentId === 'admin-master-id') {
      const adminEmail = (session?.user?.email || 'robiulnil101@gmail.com').toLowerCase();
      const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          name: session?.user?.name || 'শিক্ষানোভা অ্যাডমিন',
          email: adminEmail,
          password: 'master_admin_placeholder',
          role: 'ADMIN',
          phone: senderPhone || '01712592519',
        },
      });
      studentId = adminUser.id;
    }

    // If user is not logged in, find or create temporary student profile
    if (!studentId) {
      if (!guestEmail) {
        return NextResponse.json(
          { error: 'দয়া করে লগইন করুন অথবা আপনার ইমেইল প্রদান করুন' },
          { status: 400 }
        );
      }
      let student = await prisma.user.findUnique({ where: { email: guestEmail.toLowerCase() } });
      if (!student) {
        student = await prisma.user.create({
          data: {
            name: guestName || 'শিক্ষার্থী',
            email: guestEmail.toLowerCase(),
            password: 'guest-temp-password',
            phone: senderPhone,
            classGrade: guestClass ? parseInt(guestClass) : 7,
            rollNumber: guestRoll ? parseInt(guestRoll) : 1,
          },
        });
      }
      studentId = student.id;
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

