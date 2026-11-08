import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'লগইন করা আবশ্যক' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let finalUrl = '';
    let isCloudinary = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') as File | null) || (formData.get('image') as File | null);
      const folder = (formData.get('folder') as string | null) || 'shikkha_nova/general';

      if (!file) {
        return NextResponse.json({ error: 'কোনো ফাইল পাওয়া যায়নি' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (isCloudinaryConfigured()) {
        try {
          finalUrl = await uploadToCloudinary(buffer, folder);
          isCloudinary = true;
        } catch (err: any) {
          console.warn('Cloudinary upload warning:', err.message);
        }
      }

      if (!finalUrl) {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'general');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.name) || '.jpg';
        const filename = `file-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);
        finalUrl = `/uploads/general/${filename}`;
      }
    } else {
      return NextResponse.json({ error: 'অসমর্থিত কনটেন্ট টাইপ' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      isCloudinary,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message || 'আপলোড ব্যর্থ হয়েছে' }, { status: 500 });
  }
}

