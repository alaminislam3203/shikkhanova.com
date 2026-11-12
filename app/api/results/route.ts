import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { getStudentProfile } from '@/lib/studentProfiles';
import { sendBulkSms, SMS_TEMPLATES } from '@/lib/smsService';

export const dynamic = 'force-dynamic';

const LOCAL_RESULTS_PATH = path.join(process.cwd(), 'data', 'results.json');

// Ensure nctb-mark-grading.png exists in public folder
try {
  const targetPath = path.join(process.cwd(), 'public', 'nctb-mark-grading.png');
  const sourcePath = 'C:\\Users\\AL AMIN\\.gemini\\antigravity\\brain\\ac40c9e4-9e84-4560-92b8-3fe0bb211df5\\.user_uploaded\\media_1794339585242_c5d7cc14.png';
  if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
  }
} catch {}

function enrichResultWithProfile(res: any) {
  if (!res) return res;
  const prof = getStudentProfile(res.classGrade, res.rollNumber);
  return {
    ...res,
    fatherName: res.fatherName || prof.fatherName,
    motherName: res.motherName || prof.motherName,
    schoolName: res.schoolName || prof.schoolName,
    dateOfBirth: res.dateOfBirth || prof.dateOfBirth,
    religion: res.religion || prof.religion || 'ইসলাম',
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

// Auto-seed results into PostgreSQL if DB table is empty or has fewer than seed records or needs update
async function ensureSeedResults() {
  try {
    const local = readLocalResults();
    if (local.length > 0) {
      const sample = await prisma.examResult.findFirst();
      const needsSync = !sample || !sample.subjectMarks?.includes('হিন্দুধর্ম ও নৈতিক শিক্ষা');
      if (needsSync) {
        for (const r of local) {
          try {
            await prisma.examResult.upsert({
              where: { id: r.id },
              update: {
                examTitle: r.examTitle,
                classGrade: r.classGrade,
                rollNumber: r.rollNumber,
                studentName: r.studentName,
                totalMarks: r.totalMarks,
                obtainedMarks: r.obtainedMarks,
                grade: r.grade,
                gpa: r.gpa,
                subjectMarks: typeof r.subjectMarks === 'object' ? JSON.stringify(r.subjectMarks) : r.subjectMarks,
              },
              create: {
                id: r.id,
                examTitle: r.examTitle,
                classGrade: r.classGrade,
                rollNumber: r.rollNumber,
                studentName: r.studentName,
                totalMarks: r.totalMarks,
                obtainedMarks: r.obtainedMarks,
                grade: r.grade,
                gpa: r.gpa,
                subjectMarks: typeof r.subjectMarks === 'object' ? JSON.stringify(r.subjectMarks) : r.subjectMarks,
              },
            });
          } catch {}
        }
      }
    }
  } catch (err) {
    console.warn('ensureSeedResults DB sync check:', err);
  }
}

// GET: Search student result OR list all class results for Admin directly from PostgreSQL
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');
    const rollNumber = searchParams.get('rollNumber');
    const examTitle = searchParams.get('examTitle');
    const all = searchParams.get('all');

    // Make sure PostgreSQL has the latest seed data
    await ensureSeedResults();

    // 1. Admin Request: Fetch all results for a class or all classes
    if (all === 'true' || (classGrade && !rollNumber)) {
      try {
        const whereClause: any = {};
        if (classGrade && classGrade !== 'all') {
          whereClause.classGrade = parseInt(classGrade);
        }
        if (examTitle && examTitle !== 'all') {
          whereClause.examTitle = examTitle;
        }

        const results = await prisma.examResult.findMany({
          where: whereClause,
          orderBy: [{ classGrade: 'asc' }, { rollNumber: 'asc' }, { createdAt: 'desc' }],
        });

        if (results && results.length > 0) {
          return NextResponse.json({ results: results.map(enrichResultWithProfile) });
        }
      } catch (dbErr) {
        console.warn('PostgreSQL GET fallback:', dbErr);
      }

      // Local fallback in case DB connection is transiently unreachable
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
      const whereCondition: any = {
        classGrade: parseInt(classGrade),
        rollNumber: parseInt(rollNumber),
      };
      if (examTitle && examTitle !== 'all') {
        whereCondition.examTitle = examTitle;
      }

      const results = await prisma.examResult.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
      });

      if (results && results.length > 0) {
        return NextResponse.json({ results: results.map(enrichResultWithProfile) });
      }
    } catch (dbErr) {
      console.warn('PostgreSQL student result search fallback:', dbErr);
    }

    // Local fallback in case DB connection is transiently unreachable
    const local = readLocalResults();
    const matched = local.filter((r) => {
      const matchCls = String(r.classGrade) === String(classGrade);
      const matchRoll = String(r.rollNumber) === String(rollNumber);
      const matchExam = !examTitle || examTitle === 'all' || r.examTitle.trim() === examTitle.trim();
      return matchCls && matchRoll && matchExam;
    });

    return NextResponse.json({ results: matched.map(enrichResultWithProfile) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save or Update Subject-by-Subject Result directly to PostgreSQL (ADMIN only)
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

    // 1. Direct PostgreSQL Upsert
    let savedInDb = false;
    try {
      await prisma.examResult.upsert({
        where: { id: resultId },
        update: {
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
        create: {
          id: resultId,
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
      savedInDb = true;
    } catch (dbErr) {
      console.error('PostgreSQL save error:', dbErr);
    }

    // 2. Keep local file in sync
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

    // 3. Optional Exam Result SMS Notification
    if (body.sendResultSms) {
      try {
        const studentUser = await prisma.user.findFirst({
          where: { classGrade: cGrade, rollNumber: rNum },
          select: { phone: true, name: true },
        });
        const targetPhone = studentUser?.phone || body.phone;
        if (targetPhone) {
          const smsText = SMS_TEMPLATES.examResult({
            studentName: resultRecord.studentName || studentUser?.name || `রোল ${rNum}`,
            examTitle: resultRecord.examTitle,
            obtainedMarks: oMarks,
            totalMarks: tMarks,
            gpa: fGpa,
            grade: resultRecord.grade,
          });
          await sendBulkSms({
            numbers: [targetPhone],
            message: smsText,
            type: 'result',
          });
        }
      } catch {}
    }

    return NextResponse.json({
      message: savedInDb
        ? 'ফলাফল PostgreSQL ডেটাবেজে সফলভাবে সংরক্ষিত হয়েছে!'
        : 'ফলাফল সফলভাবে সংরক্ষিত হয়েছে!',
      result: enrichResultWithProfile(resultRecord),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove result by ID from PostgreSQL (ADMIN only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'আইডি প্রয়োজন' }, { status: 400 });
    }

    // 1. Delete from PostgreSQL
    try {
      await prisma.examResult.delete({ where: { id } });
    } catch (dbErr) {
      console.warn('PostgreSQL delete result warning:', dbErr);
    }

    // 2. Delete from local backup
    const local = readLocalResults();
    const updated = local.filter((r) => r.id !== id);
    writeLocalResults(updated);

    return NextResponse.json({ message: 'ফলাফল সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
