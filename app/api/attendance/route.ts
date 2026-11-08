import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AttendanceStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const dateStr = searchParams.get('date');

    if (!classGrade) {
      return NextResponse.json({ error: 'classGrade প্যারামিটার প্রয়োজন' }, { status: 400 });
    }

    const targetClass = parseInt(classGrade);
    const filterDate = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));

    const records = await prisma.attendance.findMany({
      where: {
        classGrade: targetClass,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { rollNumber: 'asc' },
    });

    return NextResponse.json({ records });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Allow admin or teacher to save attendance
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন বা শিক্ষক হাজিরা নিতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const { classGrade, date, records } = body;

    if (!classGrade || !Array.isArray(records)) {
      return NextResponse.json({ error: 'সঠিক ডেটা প্রদান করুন' }, { status: 400 });
    }

    const attendanceDate = date ? new Date(date) : new Date();

    // Upsert or create attendance for each student roll
    const created = await Promise.all(
      records.map(async (r: { rollNumber: number; studentName?: string; status: AttendanceStatus }) => {
        return prisma.attendance.create({
          data: {
            classGrade: parseInt(classGrade.toString()),
            rollNumber: r.rollNumber,
            studentName: r.studentName || `শিক্ষার্থী রোল ${r.rollNumber}`,
            date: attendanceDate,
            status: r.status,
          },
        });
      })
    );

    return NextResponse.json({ message: 'উপস্থিতি সফলভাবে সংরক্ষিত হয়েছে!', count: created.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
