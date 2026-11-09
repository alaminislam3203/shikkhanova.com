import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_NCTB_SUBJECTS, NctbSubjectItem } from '@/lib/nctbSubjects';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_SUBJECTS_FILE = path.join(process.cwd(), 'data', 'subjects.json');

function readLocalSubjects(): NctbSubjectItem[] {
  try {
    if (fs.existsSync(LOCAL_SUBJECTS_FILE)) {
      const raw = fs.readFileSync(LOCAL_SUBJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_NCTB_SUBJECTS;
}

function writeLocalSubjects(list: NctbSubjectItem[]) {
  try {
    const dir = path.dirname(LOCAL_SUBJECTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_SUBJECTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {}
}

async function ensureSubjectTableAndSeed(): Promise<NctbSubjectItem[]> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassSubject" (
        "id" TEXT PRIMARY KEY,
        "classGrade" INTEGER NOT NULL,
        "subjectName" TEXT NOT NULL,
        "bookTitle" TEXT NOT NULL,
        "subjectCode" TEXT NOT NULL DEFAULT '১০১',
        "group" TEXT NOT NULL DEFAULT 'সকল বিভাগ',
        "fullMarks" INTEGER NOT NULL DEFAULT 100,
        "isCompulsory" BOOLEAN NOT NULL DEFAULT true,
        "nctbBookUrl" TEXT DEFAULT 'https://nctb.gov.bd',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "ClassSubject" ORDER BY "classGrade" ASC, "subjectCode" ASC, "createdAt" ASC`
    );

    if (!existing || existing.length === 0) {
      for (const item of DEFAULT_NCTB_SUBJECTS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "ClassSubject" ("id", "classGrade", "subjectName", "bookTitle", "subjectCode", "group", "fullMarks", "isCompulsory", "nctbBookUrl")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT ("id") DO NOTHING`,
          item.id,
          item.classGrade,
          item.subjectName,
          item.bookTitle,
          item.subjectCode,
          item.group,
          item.fullMarks,
          Boolean(item.isCompulsory),
          item.nctbBookUrl || 'https://nctb.gov.bd'
        );
      }

      const seeded: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "ClassSubject" ORDER BY "classGrade" ASC, "subjectCode" ASC, "createdAt" ASC`
      );
      writeLocalSubjects(seeded);
      return seeded;
    }

    writeLocalSubjects(existing);
    return existing;
  } catch {
    return readLocalSubjects();
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classGradeParam = searchParams.get('classGrade');
  const all = await ensureSubjectTableAndSeed();

  const filtered = classGradeParam
    ? all.filter((s) => Number(s.classGrade) === Number(classGradeParam))
    : all;

  return NextResponse.json({ subjects: filtered });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন বিষয় যুক্ত করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const {
      classGrade = 7,
      subjectName,
      bookTitle,
      subjectCode = '১০১',
      group = 'সকল বিভাগ',
      fullMarks = 100,
      isCompulsory = true,
      nctbBookUrl = 'https://nctb.gov.bd',
    } = body;

    if (!subjectName?.trim()) {
      return NextResponse.json({ error: 'বিষয়ের নাম আবশ্যক' }, { status: 400 });
    }

    const newItem: NctbSubjectItem = {
      id: `sub-c${classGrade}-${Date.now()}`,
      classGrade: Number(classGrade),
      subjectName: subjectName.trim(),
      bookTitle: bookTitle?.trim() || `${subjectName.trim()} (${classGrade}ম শ্রেণি - NCTB)`,
      subjectCode: subjectCode?.trim() || '১০১',
      group: group || 'সকল বিভাগ',
      fullMarks: Number(fullMarks) || 100,
      isCompulsory: Boolean(isCompulsory),
      nctbBookUrl: nctbBookUrl?.trim() || 'https://nctb.gov.bd',
    };

    try {
      await ensureSubjectTableAndSeed();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "ClassSubject" ("id", "classGrade", "subjectName", "bookTitle", "subjectCode", "group", "fullMarks", "isCompulsory", "nctbBookUrl")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        newItem.id,
        newItem.classGrade,
        newItem.subjectName,
        newItem.bookTitle,
        newItem.subjectCode,
        newItem.group,
        newItem.fullMarks,
        newItem.isCompulsory,
        newItem.nctbBookUrl
      );
    } catch {}

    const current = readLocalSubjects();
    writeLocalSubjects([...current, newItem]);

    return NextResponse.json({ message: 'নতুন বিষয় ও NCTB বই সফলভাবে যুক্ত হয়েছে!', subject: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'বিষয় যুক্ত করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      classGrade,
      subjectName,
      bookTitle,
      subjectCode,
      group,
      fullMarks,
      isCompulsory,
      nctbBookUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'বিষয় আইডি প্রয়োজন' }, { status: 400 });
    }

    try {
      await ensureSubjectTableAndSeed();
      await prisma.$executeRawUnsafe(
        `UPDATE "ClassSubject"
         SET "classGrade" = $1, "subjectName" = $2, "bookTitle" = $3, "subjectCode" = $4,
             "group" = $5, "fullMarks" = $6, "isCompulsory" = $7, "nctbBookUrl" = $8
         WHERE "id" = $9`,
        Number(classGrade),
        subjectName.trim(),
        bookTitle.trim(),
        subjectCode.trim(),
        group,
        Number(fullMarks) || 100,
        Boolean(isCompulsory),
        nctbBookUrl?.trim() || 'https://nctb.gov.bd',
        id
      );
    } catch {}

    const current = readLocalSubjects().map((s) =>
      s.id === id
        ? {
            ...s,
            classGrade: Number(classGrade),
            subjectName: subjectName.trim(),
            bookTitle: bookTitle.trim(),
            subjectCode: subjectCode.trim(),
            group,
            fullMarks: Number(fullMarks) || 100,
            isCompulsory: Boolean(isCompulsory),
            nctbBookUrl: nctbBookUrl?.trim() || 'https://nctb.gov.bd',
          }
        : s
    );
    writeLocalSubjects(current);

    return NextResponse.json({ message: 'বিষয় ও NCTB বই আপডেট হয়েছে!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'আপডেট ব্যর্থ হয়েছে' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'বিষয় আইডি প্রয়োজন' }, { status: 400 });
    }

    try {
      await ensureSubjectTableAndSeed();
      await prisma.$executeRawUnsafe(`DELETE FROM "ClassSubject" WHERE "id" = $1`, id);
    } catch {}

    const current = readLocalSubjects().filter((s) => s.id !== id);
    writeLocalSubjects(current);

    return NextResponse.json({ message: 'বিষয়টি মুছে ফেলা হয়েছে!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ডিলিট ব্যর্থ হয়েছে' }, { status: 500 });
  }
}

