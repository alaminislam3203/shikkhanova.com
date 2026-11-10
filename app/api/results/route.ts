import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { getStudentProfile } from '@/lib/studentProfiles';

export const dynamic = 'force-dynamic';

const LOCAL_RESULTS_PATH = path.join(process.cwd(), 'data', 'results.json');

function enrichResultWithProfile(res: any) {
  if (!res) return res;
  const prof = getStudentProfile(res.classGrade, res.rollNumber);
  return {
    ...res,
    fatherName: res.fatherName || prof.fatherName,
    motherName: res.motherName || prof.motherName,
    schoolName: res.schoolName || prof.schoolName,
    dateOfBirth: res.dateOfBirth || prof.dateOfBirth,
  };
}

function readLocalResults(): any[] {
  try {
    if (fs.existsSync(LOCAL_RESULTS_PATH)) {
      const raw = fs.readFileSync(LOCAL_RESULTS_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function writeLocalResults(results: any[]) {
  try {
    const dir = path.dirname(LOCAL_RESULTS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_RESULTS_PATH, JSON.stringify(results, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local results:', err);
  }
}

// GET: Search student result OR list all class results for Admin
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const rollNumber = searchParams.get('rollNumber');
    const all = searchParams.get('all');

    // 1. Admin Request: Fetch all results for a class or all classes
    if (all === 'true' || (classGrade && !rollNumber)) {
      try {
        const whereClause = classGrade && classGrade !== 'all' ? { classGrade: parseInt(classGrade) } : {};
        const results = await prisma.examResult.findMany({
          where: whereClause,
          orderBy: [{ classGrade: 'asc' }, { rollNumber: 'asc' }, { createdAt: 'desc' }],
        });
        if (results && results.length > 0) {
          return NextResponse.json({ results: results.map(enrichResultWithProfile) });
        }
      } catch {}

      // Fallback to local file
      const local = readLocalResults();
      const filtered = classGrade && classGrade !== 'all'
        ? local.filter((r) => String(r.classGrade) === String(classGrade))
        : local;
      return NextResponse.json({ results: filtered.map(enrichResultWithProfile) });
    }

    // 2. Student / Parent Search by Class and Roll
    if (!classGrade || !rollNumber) {
      return NextResponse.json({ error: 'classGrade এবং rollNumber প্রয়োজন' }, { status: 400 });
    }

    try {
      const results = await prisma.examResult.findMany({
        where: {
          classGrade: parseInt(classGrade),
          rollNumber: parseInt(rollNumber),
        },
        orderBy: { createdAt: 'desc' },
      });

      if (results && results.length > 0) {
        return NextResponse.json({ results: results.map(enrichResultWithProfile) });
      }
    } catch {}

    // Fallback to local file
    const local = readLocalResults();
    const matched = local.filter(
      (r) => String(r.classGrade) === String(classGrade) && String(r.rollNumber) === String(rollNumber)
    );

    return NextResponse.json({ results: matched.map(enrichResultWithProfile) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save or Update Subject-by-Subject Result (ADMIN only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ফলাফল যুক্ত করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      examTitle,
      classGrade,
      rollNumber,
      studentName,
      totalMarks,
      obtainedMarks,
      grade,
      gpa,
      subjectMarks,
    } = body;

    if (!examTitle || !classGrade || !rollNumber || !studentName) {
      return NextResponse.json({ error: 'পরীক্ষার নাম, শ্রেণি, রোল এবং শিক্ষার্থীর নাম আবশ্যক' }, { status: 400 });
    }

    const cGrade = parseInt(classGrade);
    const rNum = parseInt(rollNumber);
    const tMarks = parseFloat(totalMarks || '600');
    const oMarks = parseFloat(obtainedMarks || '0');
    const fGpa = parseFloat(gpa !== undefined ? String(gpa) : '0');
    const subJson = typeof subjectMarks === 'object' ? JSON.stringify(subjectMarks) : subjectMarks || '[]';
    const resultId = id || `res-${Date.now()}-${rNum}`;
    const nowIso = new Date().toISOString();

    const resultRecord = {
      id: resultId,
      examTitle: examTitle.trim(),
      classGrade: cGrade,
      rollNumber: rNum,
      studentName: studentName.trim(),
      totalMarks: tMarks,
      obtainedMarks: oMarks,
      grade: grade || 'F',
      gpa: fGpa,
      subjectMarks: subJson,
      createdAt: nowIso,
    };

    // 1. Save to local JSON backup
    const local = readLocalResults();
    const existingIdx = local.findIndex(
      (r) => (id && r.id === id) || (r.classGrade === cGrade && r.rollNumber === rNum && r.examTitle === examTitle)
    );
    if (existingIdx !== -1) {
      local[existingIdx] = { ...local[existingIdx], ...resultRecord };
    } else {
      local.unshift(resultRecord);
    }
    writeLocalResults(local);

    // 2. Try DB Upsert / Create
    try {
      if (id) {
        await prisma.examResult.update({
          where: { id },
          data: {
            examTitle: resultRecord.examTitle,
            classGrade: cGrade,
            rollNumber: rNum,
            studentName: resultRecord.studentName,
            totalMarks: tMarks,
            obtainedMarks: oMarks,
            grade: resultRecord.grade,
            gpa: fGpa,
            subjectMarks: subJson,
          },
        });
      } else {
        await prisma.examResult.create({
          data: {
            examTitle: resultRecord.examTitle,
            classGrade: cGrade,
            rollNumber: rNum,
            studentName: resultRecord.studentName,
            totalMarks: tMarks,
            obtainedMarks: oMarks,
            grade: resultRecord.grade,
            gpa: fGpa,
            subjectMarks: subJson,
          },
        });
      }
    } catch {}

    return NextResponse.json({
      message: 'ফলাফল সফলভাবে সংরক্ষিত হয়েছে!',
      result: resultRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove result by ID (ADMIN only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ফলাফল মুছতে পারবেন' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ফলাফল আইডি আবশ্যক' }, { status: 400 });
    }

    // 1. Remove from local JSON
    const local = readLocalResults();
    const filtered = local.filter((r) => r.id !== id);
    writeLocalResults(filtered);

    // 2. Remove from DB
    try {
      await prisma.examResult.delete({ where: { id } });
    } catch {}

    return NextResponse.json({ message: 'ফলাফল সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
