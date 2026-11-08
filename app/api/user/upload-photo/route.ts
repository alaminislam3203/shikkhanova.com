import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'লগইন করা আবশ্যক' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const contentType = req.headers.get('content-type') || '';
    const safePrefix = userEmail.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);

    let finalImageUrl = '';

    // Verify Cloudinary configuration
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary সেটআপ করা নেই। দয়া করে .env ফাইলে CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET দিন।' },
        { status: 500 }
      );
    }

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

      // Upload directly to Cloudinary
      finalImageUrl = await uploadToCloudinary(buffer, 'shikkha_nova/avatars', `avatar-${safePrefix}`);

    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      const { imageBase64, imageUrl } = body;

      if (imageUrl && !imageBase64) {
        finalImageUrl = imageUrl;
      } else if (imageBase64) {
        finalImageUrl = await uploadToCloudinary(imageBase64, 'shikkha_nova/avatars', `avatar-${safePrefix}`);
      } else {
        return NextResponse.json({ error: 'ছবির ডেটা পাওয়া যায়নি' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'অসমর্থিত কনটেন্ট টাইপ' }, { status: 400 });
    }

    if (!finalImageUrl) {
      return NextResponse.json({ error: 'ছবি ক্লাউডে আপলোড করা যায়নি' }, { status: 500 });
    }

    // Save image URL into Database (Neon PostgreSQL via Prisma)
    try {
      if (session.user.id && session.user.id !== 'admin-master-id') {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { image: finalImageUrl },
        });
      } else {
        await prisma.user.upsert({
          where: { email: userEmail },
          update: { image: finalImageUrl },
          create: {
            name: session.user.name || 'শিক্ষানোভা অ্যাডমিন',
            email: userEmail,
            password: 'master_admin_placeholder',
            role: 'ADMIN',
            image: finalImageUrl,
            phone: session.user.phone || '01712592519',
          },
        });
      }
    } catch (dbErr: any) {
      console.error('Database update error for user avatar:', dbErr);
      return NextResponse.json(
        { error: `ছবি ক্লাউডে আপলোড হলেও ডেটাবেজে সংরক্ষণ ব্যর্থ: ${dbErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ছবি সফলভাবে Cloudinary ক্লাউডে আপলোড ও ডেটাবেজে সংরক্ষিত হয়েছে!',
      imageUrl: finalImageUrl,
      isCloudinary: true,
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: error.message || 'ছবি আপলোডে সমস্যা হয়েছে' }, { status: 500 });
  }
}
