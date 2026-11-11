import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getStudentProfile, saveStudentProfile } from '@/lib/studentProfiles';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'অননুমোদিত' }, { status: 401 });
    }

    if (session.user.id === 'admin-master-id') {
      let adminImage = session.user.image || null;
      try {
        const dbAdmin = await prisma.user.findUnique({
          where: { email: session.user.email || 'robiulnil101@gmail.com' },
        });
        if (dbAdmin?.image) {
          adminImage = dbAdmin.image;
        }
      } catch (err) {
        console.error('Error fetching admin DB record:', err);
      }

      return NextResponse.json({
        user: {
          id: 'admin-master-id',
          name: session.user.name,
          email: session.user.email,
          role: 'ADMIN',
          phone: session.user.phone || '01712592519',
          classGrade: null,
          rollNumber: null,
          image: adminImage,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
    }

    const prof = getStudentProfile(user.classGrade || 7, user.rollNumber || 1, user.email);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        classGrade: user.classGrade,
        rollNumber: user.rollNumber,
        fatherName: prof.fatherName,
        motherName: prof.motherName,
        schoolName: prof.schoolName,
        dateOfBirth: prof.dateOfBirth,
        religion: prof.religion || 'ইসলাম',
        image: (user as any).image || null,
        createdAt: user.createdAt,
      },
    });
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
    const {
      name,
      phone,
      classGrade,
      rollNumber,
      currentPassword,
      newPassword,
      fatherName,
      motherName,
      schoolName,
      dateOfBirth,
      religion,
    } = body;

    if (session.user.id === 'admin-master-id') {
      try {
        await prisma.user.upsert({
          where: { email: session.user.email || 'robiulnil101@gmail.com' },
          update: {
            name: name || undefined,
            phone: phone || undefined,
            image: body.image || undefined,
          },
          create: {
            name: name || session.user.name || 'শিক্ষানোভা অ্যাডমিন',
            email: session.user.email || 'robiulnil101@gmail.com',
            password: 'master_admin_placeholder',
            role: 'ADMIN',
            phone: phone || '01712592519',
            image: body.image || null,
          },
        });
      } catch (adminSaveErr) {
        console.error('Error saving admin details in DB:', adminSaveErr);
      }
      return NextResponse.json({ message: 'মাস্টার অ্যাডমিন তথ্য সফলভাবে সংরক্ষিত হয়েছে' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (classGrade !== undefined) updateData.classGrade = classGrade ? parseInt(classGrade) : null;
    if (rollNumber !== undefined) updateData.rollNumber = rollNumber ? parseInt(rollNumber) : null;
    if (body.image) updateData.image = body.image;

    const clsNum = classGrade ? parseInt(classGrade) : (session.user as any)?.classGrade || 7;
    const rollNum = rollNumber ? parseInt(rollNumber) : (session.user as any)?.rollNumber || 1;
    if (fatherName !== undefined || motherName !== undefined || schoolName !== undefined || dateOfBirth !== undefined || religion !== undefined) {
      saveStudentProfile(clsNum, rollNum, { fatherName, motherName, schoolName, dateOfBirth, religion }, session.user.email);
    }

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

