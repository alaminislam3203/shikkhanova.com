import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import { isGoogleDriveConfigured, uploadPdfToGoogleDrive } from '@/lib/googleDrive';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'লগইন করা আবশ্যক' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'অসমর্থিত কনটেন্ট টাইপ' }, { status: 400 });
    }

    const formData = await req.formData();
    const file =
      (formData.get('file') as File | null) ||
      (formData.get('pdf') as File | null) ||
      (formData.get('image') as File | null);

    if (!file) {
      return NextResponse.json({ error: 'কোনো ফাইল পাওয়া যায়নি' }, { status: 400 });
    }

    const lowerName = file.name.toLowerCase();
    const isDocx =
      lowerName.endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isDoc =
      lowerName.endsWith('.doc') || file.type === 'application/msword';
    const isPdf =
      lowerName.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocument = isPdf || isDocx || isDoc;

    // Max 25MB for Documents (PDF, DOC, DOCX), 5MB for images
    const maxSize = isDocument ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isDocument
            ? 'ডকুমেন্ট ফাইলের সাইজ সর্বোচ্চ ২৫ মেগাবাইট হতে পারবে'
            : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Document files (PDF, DOC, DOCX) ALWAYS upload ONLY to Google Drive (never to Cloudinary)
    if (isDocument) {
      if (!isGoogleDriveConfigured()) {
        return NextResponse.json(
          { error: 'ডকুমেন্ট আপলোডের জন্য .env ফাইলে Google Drive ক্রেডেনশিয়াল সেটআপ করা নেই।' },
          { status: 500 }
        );
      }

      let mimeType = 'application/pdf';
      if (isDocx) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (isDoc) {
        mimeType = 'application/msword';
      }

      const driveResult = await uploadPdfToGoogleDrive(buffer, file.name, mimeType);
      return NextResponse.json({
        success: true,
        url: driveResult.viewUrl,
        downloadUrl: driveResult.downloadUrl,
        driveFileId: driveResult.fileId,
        fileName: file.name,
        fileSize: file.size,
        isPdf: isPdf,
        isDoc: isDoc || isDocx,
        isDocument: true,
        isGoogleDrive: true,
      });
    }

    // 2. Non-Document files (Images) upload to Cloudinary
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'ছবি আপলোডের জন্য Cloudinary ক্রেডেনশিয়াল (.env) সেটআপ করা নেই।' },
        { status: 500 }
      );
    }

    const folder = (formData.get('folder') as string | null) || 'shikkha_nova/general';

    const baseName =
      file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 35) || 'material';

    const finalUrl = await uploadToCloudinary(buffer, folder, baseName, { isPdf: false });

    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileName: file.name,
      fileSize: file.size,
      isPdf: false,
      isCloudinary: true,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message || 'আপলোড ব্যর্থ হয়েছে' }, { status: 500 });
  }
}

