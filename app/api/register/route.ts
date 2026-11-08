import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, classGrade, rollNumber } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || null,
        role: Role.STUDENT,
        classGrade: classGrade ? parseInt(classGrade.toString()) : null,
        rollNumber: rollNumber ? parseInt(rollNumber.toString()) : null,
      },
    });

    return NextResponse.json(
      {
        message: 'রেজিস্ট্রেশন সফল হয়েছে!',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'রেজিস্ট্রেশন সম্পন্ন হতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
