import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get('pdfId');
    const trxIdsParam = searchParams.get('trxIds') || searchParams.get('trxId') || '';

    if (!pdfId) {
      return NextResponse.json({ error: 'পিডিএফ আইডি পাওয়া যায়নি' }, { status: 400 });
    }

    const pdf = await prisma.pdfMaterial.findUnique({
      where: { id: pdfId },
    });

    if (!pdf) {
      return NextResponse.json({ error: 'পিডিএফ শিটটি খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const isFree = Boolean(pdf.isFree) || Number(pdf.price) <= 0;
    const isAdmin = session?.user?.role === 'ADMIN';

    if (!isFree && !isAdmin) {
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

      if (orConditions.length === 0) {
        return NextResponse.json(
          { error: 'পিডিএফটি ডাউনলোড করতে লগইন করুন অথবা অনুমোদিত TrxID প্রদান করুন' },
          { status: 403 }
        );
      }

      const approvedPurchase = await prisma.pdfPurchase.findFirst({
        where: {
          pdfId: pdf.id,
          status: 'APPROVED',
          OR: orConditions,
        },
      });

      if (!approvedPurchase) {
        return NextResponse.json(
          { error: 'আপনার পেমেন্ট এখনো অনুমোদিত হয়নি। অনুমোদনের পর ডাউনলোড সক্রিয় হবে।' },
          { status: 403 }
        );
      }
    }

    const fileUrl = pdf.fileUrl.trim();
    const safeFileName = `SikkhaNova-Class-${pdf.classGrade}-${pdf.id.slice(-6)}.pdf`;
    const encodedUtf8Name = encodeURIComponent(`${pdf.title}.pdf`);

    // If remote URL (e.g. Cloudinary), proxy stream with attachment header for instant browser download
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const remoteRes = await fetch(fileUrl);
      if (!remoteRes.ok) {
        return NextResponse.redirect(fileUrl);
      }

      const fileBuffer = await remoteRes.arrayBuffer();

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedUtf8Name}`,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }

    // Fallback redirect for relative paths
    return NextResponse.redirect(new URL(fileUrl, req.url));
  } catch (error: any) {
    console.error('PDF Download error:', error);
    return NextResponse.json(
      { error: error.message || 'পিডিএফ ডাউনলোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

