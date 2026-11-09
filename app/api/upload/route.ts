import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

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

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary সেটআপ করা নেই। দয়া করে .env ফাইলে Cloudinary কী যুক্ত করুন।' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file =
      (formData.get('file') as File | null) ||
      (formData.get('pdf') as File | null) ||
      (formData.get('image') as File | null);

    if (!file) {
      return NextResponse.json({ error: 'কোনো ফাইল পাওয়া যায়নি' }, { status: 400 });
    }

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    // Max 15MB for PDFs, 5MB for images
    const maxSize = isPdf ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isPdf
            ? 'পিডিএফ ফাইলের সাইজ সর্বোচ্চ ১৫ মেগাবাইট হতে পারবে'
            : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে',
        },
        { status: 400 }
      );
    }

    const defaultFolder = isPdf ? 'shikkha_nova/pdfs' : 'shikkha_nova/general';
    const folder = (formData.get('folder') as string | null) || defaultFolder;

    const baseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 35) || 'material';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const finalUrl = await uploadToCloudinary(buffer, folder, baseName, { isPdf });

    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileName: file.name,
      fileSize: file.size,
      isPdf,
      isCloudinary: true,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message || 'আপলোড ব্যর্থ হয়েছে' }, { status: 500 });
  }
}

