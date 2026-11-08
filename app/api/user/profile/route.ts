import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'অননুমোদিত' }, { status: 401 });
    }

    if (session.user.id === 'admin-master-id') {
      return NextResponse.json({
        user: {
          id: 'admin-master-id',
          name: session.user.name,
          email: session.user.email,
          role: 'ADMIN',
          phone: session.user.phone || '01712592519',
          classGrade: null,
          rollNumber: null,
          image: session.user.image || null,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        classGrade: true,
        rollNumber: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'অননুমোদিত' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, classGrade, rollNumber, currentPassword, newPassword } = body;

    if (session.user.id === 'admin-master-id') {
      return NextResponse.json({ message: 'মাস্টার অ্যাডমিন তথ্য সফলভাবে সংরক্ষিত হয়েছে' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (classGrade !== undefined) updateData.classGrade = classGrade ? parseInt(classGrade) : null;
    if (rollNumber !== undefined) updateData.rollNumber = rollNumber ? parseInt(rollNumber) : null;

    // Handle Password Change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ড প্রদান করুন' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!existingUser) {
        return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়' }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        classGrade: true,
        rollNumber: true,
        image: true,
      },
    });

    return NextResponse.json({ message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে', user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

