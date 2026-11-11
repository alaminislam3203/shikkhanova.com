import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { extractGoogleDriveFileId, toGoogleDriveDownloadUrl } from '@/lib/googleDrive';

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
    if (!session?.user) {
      return NextResponse.json(
        { error: 'পিডিএফ ডাউনলোড করতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।' },
        { status: 401 }
      );
    }

    const isFree = Boolean(pdf.isFree) || Number(pdf.price) <= 0;
    const isAdmin = session.user.role === 'ADMIN';

    // For paid PDFs, strictly verify that THIS logged-in user actually purchased and was APPROVED
    if (!isFree && !isAdmin) {
      const orConditions: any[] = [];

      if (session.user.id && session.user.id !== 'admin-master-id') {
        orConditions.push({ studentId: session.user.id });
      }

      if (session.user.email) {
        orConditions.push({
          student: {
            email: session.user.email.toLowerCase(),
          },
        });
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
          { error: 'এই পিডিএফ শিটটি আপনার অ্যাকাউন্ট থেকে ক্রয় করা হয়নি অথবা পেমেন্ট এখনো অনুমোদিত হয়নি।' },
          { status: 403 }
        );
      }
    }

    const fileUrl = pdf.fileUrl.trim();
    const safeFileName = `SikkhaNova-Class-${pdf.classGrade}-${pdf.id.slice(-6)}.pdf`;
    const encodedUtf8Name = encodeURIComponent(`${pdf.title}.pdf`);

    // 1. If the PDF is hosted on Google Drive, redirect to Google Drive direct download URL
    const driveFileId = extractGoogleDriveFileId(fileUrl);
    if (driveFileId) {
      const directDriveDownload = toGoogleDriveDownloadUrl(fileUrl);
      return NextResponse.redirect(directDriveDownload);
    }

    // 2. If remote URL (e.g. Cloudinary), proxy stream with attachment header for instant browser download
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

