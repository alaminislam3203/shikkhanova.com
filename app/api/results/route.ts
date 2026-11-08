import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const rollNumber = searchParams.get('rollNumber');

    if (!classGrade || !rollNumber) {
      return NextResponse.json({ error: 'classGrade এবং rollNumber প্রয়োজন' }, { status: 400 });
    }

    const results = await prisma.examResult.findMany({
      where: {
        classGrade: parseInt(classGrade),
        rollNumber: parseInt(rollNumber),
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!results || results.length === 0) {
      return NextResponse.json({ results: [], message: 'কোনো ফলাফল পাওয়া যায়নি' });
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ফলাফল যুক্ত করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const { examTitle, classGrade, rollNumber, studentName, totalMarks, obtainedMarks, grade, gpa, subjectMarks } = body;

    const newResult = await prisma.examResult.create({
      data: {
        examTitle,
        classGrade: parseInt(classGrade),
        rollNumber: parseInt(rollNumber),
        studentName,
        totalMarks: parseFloat(totalMarks || '100'),
        obtainedMarks: parseFloat(obtainedMarks),
        grade,
        gpa: parseFloat(gpa || '5.00'),
        subjectMarks: typeof subjectMarks === 'object' ? JSON.stringify(subjectMarks) : subjectMarks,
      },
    });

    return NextResponse.json({ message: 'ফলাফল সফলভাবে যুক্ত হয়েছে', result: newResult });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

