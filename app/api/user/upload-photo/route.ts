import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'লগইন করা আবশ্যক' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const contentType = req.headers.get('content-type') || '';

    // Create target directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let relativeFilePath = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('photo') as File | null) || (formData.get('file') as File | null);

      if (!file) {
        return NextResponse.json({ error: 'কোনো ছবি পাওয়া যায়নি' }, { status: 400 });
      }

      // Validate size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const cleanExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase()) ? ext : '.jpg';
      const safePrefix = userEmail.replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `avatar-${safePrefix}-${Date.now()}${cleanExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      relativeFilePath = `/uploads/avatars/${filename}`;
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      const { imageBase64, imageUrl } = body;

      if (imageUrl && !imageBase64) {
        relativeFilePath = imageUrl;
      } else if (imageBase64) {
        const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return NextResponse.json({ error: 'সঠিক বেস-৬৪ ছবি নয়' }, { status: 400 });
        }

        const ext = `.${matches[1].toLowerCase()}`;
        const buffer = Buffer.from(matches[2], 'base64');
        const safePrefix = userEmail.replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `avatar-${safePrefix}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);
        relativeFilePath = `/uploads/avatars/${filename}`;
      } else {
        return NextResponse.json({ error: 'ছবির ডেটা পাওয়া যায়নি' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'অসমর্থিত কনটেন্ট টাইপ' }, { status: 400 });
    }

    // Update user by email in database (Works for Student, Teacher, and Admin)
    try {
      await prisma.user.upsert({
        where: { email: userEmail },
        update: { image: relativeFilePath },
        create: {
          name: session.user.name || 'ব্যবহারকারী',
          email: userEmail,
          password: 'managed_account',
          role: session.user.role || 'STUDENT',
          image: relativeFilePath,
          phone: session.user.phone || '',
        },
      });
    } catch (dbErr) {
      console.warn('DB update warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে',
      imageUrl: relativeFilePath,
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: error.message || 'ছবি আপলোডে সমস্যা হয়েছে' }, { status: 500 });
  }
}
