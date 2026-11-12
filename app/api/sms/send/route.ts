import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendBulkSms, formatBdPhone } from '@/lib/smsService';
import { getStudentProfile } from '@/lib/studentProfiles';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন এসএমএস পাঠাতে পারবেন' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      type = 'custom', // 'custom' | 'class-bulk' | 'all-students' | 'fee-reminder'
      numbers,
      message,
      classGrade,
      senderId,
    } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'এসএমএস বার্তা খালি হতে পারবে না' },
        { status: 400 }
      );
    }

    let recipientNumbers: string[] = [];

    // Case 1: Class-wise bulk or all students
    if (type === 'class-bulk' || type === 'all-students' || type === 'fee-reminder') {
      const where: any = { role: 'STUDENT' };
      if (type === 'class-bulk' && classGrade && classGrade !== 'all') {
        where.classGrade = parseInt(String(classGrade), 10);
      }

      // 1. Fetch registered student phone numbers from DB
      const users = await prisma.user.findMany({
        where,
        select: { phone: true, name: true, rollNumber: true, classGrade: true },
      });

      for (const u of users) {
        if (u.phone) {
          const formatted = formatBdPhone(u.phone);
          if (formatted && !recipientNumbers.includes(formatted)) {
            recipientNumbers.push(formatted);
          }
        }
      }

      // 2. Also check if custom phone numbers are passed in body
      if (numbers) {
        const extraList = Array.isArray(numbers) ? numbers : String(numbers).split(/[,\n]/);
        for (const raw of extraList) {
          const formatted = formatBdPhone(raw);
          if (formatted && !recipientNumbers.includes(formatted)) {
            recipientNumbers.push(formatted);
          }
        }
      }

      // If no registered phone numbers found, check if direct numbers were supplied
      if (recipientNumbers.length === 0 && numbers) {
        const list = Array.isArray(numbers) ? numbers : String(numbers).split(/[,\n]/);
        recipientNumbers = list.map(formatBdPhone).filter(Boolean) as string[];
      }
    } else {
      // Case 2: Custom / Direct numbers
      const list = Array.isArray(numbers) ? numbers : String(numbers).split(/[,\n]/);
      recipientNumbers = list.map(formatBdPhone).filter(Boolean) as string[];
    }

    if (recipientNumbers.length === 0) {
      return NextResponse.json(
        {
          error:
            'কোনো বৈধ মোবাইল নম্বর পাওয়া যায়নি। শিক্ষার্থী প্রোফাইলে ফোন নম্বর যুক্ত করুন অথবা সরাসরি নম্বর টাইপ করুন।',
        },
        { status: 400 }
      );
    }

    const result = await sendBulkSms({
      numbers: recipientNumbers,
      message,
      senderId,
      type,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'এসএমএস পাঠাতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

