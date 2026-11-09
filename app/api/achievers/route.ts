import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_ACHIEVERS, AchieverItem } from '@/lib/defaultAchievers';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'achievers.json');

function readLocalAchievers(): AchieverItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...DEFAULT_ACHIEVERS];
}

function writeLocalAchievers(achievers: AchieverItem[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(achievers, null, 2), 'utf8');
  } catch {}
}

async function ensureAchieversTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SuccessStory" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "classGrade" INTEGER NOT NULL,
        "classLabel" TEXT NOT NULL,
        "achievement" TEXT NOT NULL,
        "institution" TEXT NOT NULL,
        "photoUrl" TEXT NOT NULL,
        "badge" TEXT NOT NULL DEFAULT '',
        "year" TEXT NOT NULL DEFAULT '২০২৬',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRows: Array<{ count: bigint | number }> =
      await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "SuccessStory"`);
    const count = Number(countRows?.[0]?.count || 0);

    if (count === 0) {
      for (const a of DEFAULT_ACHIEVERS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "SuccessStory" ("id", "name", "classGrade", "classLabel", "achievement", "institution", "photoUrl", "badge", "year")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT ("id") DO UPDATE SET
             "name" = EXCLUDED."name",
             "classGrade" = EXCLUDED."classGrade",
             "classLabel" = EXCLUDED."classLabel",
             "achievement" = EXCLUDED."achievement",
             "institution" = EXCLUDED."institution",
             "photoUrl" = EXCLUDED."photoUrl",
             "badge" = EXCLUDED."badge"`,
          a.id,
          a.name,
          a.classGrade,
          a.classLabel,
          a.achievement,
          a.institution,
          a.photoUrl,
          a.badge || '',
          a.year || '২০২৬'
        );
      }
    }
    return true;
  } catch (err) {
    console.warn('Database SuccessStory init skipped, using fallback:', err);
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classGradeParam = searchParams.get('classGrade');
  const targetClass =
    classGradeParam && classGradeParam !== 'all' ? Number(classGradeParam) : null;

  const dbReady = await ensureAchieversTable();
  if (dbReady) {
    try {
      let query = `SELECT * FROM "SuccessStory"`;
      let params: any[] = [];
      if (targetClass) {
        query += ` WHERE "classGrade" = $1`;
        params.push(targetClass);
      }
      query += ` ORDER BY "classGrade" DESC, "createdAt" ASC`;

      const rows: any[] = await prisma.$queryRawUnsafe(query, ...params);
      const achievers: AchieverItem[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        classGrade: Number(r.classGrade),
        classLabel: r.classLabel,
        achievement: r.achievement,
        institution: r.institution,
        photoUrl: r.photoUrl,
        badge: r.badge || '',
        year: r.year || '২০২৬',
      }));

      return NextResponse.json({ achievers });
    } catch (err) {
      console.warn('GET /api/achievers DB fallback:', err);
    }
  }

  let local = readLocalAchievers();
  if (targetClass) {
    local = local.filter((a) => a.classGrade === targetClass);
  }
  return NextResponse.json({ achievers: local });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || '').trim();
    const classGrade = Number(body.classGrade) || 10;
    const classLabel =
      (body.classLabel || `${classGrade}ম শ্রেণি`).trim();
    const achievement = (body.achievement || 'গোল্ডেন A+').trim();
    const institution =
      (body.institution || 'নীলফামারী সরকারি উচ্চ বিদ্যালয়').trim();
    const photoUrl = (body.photoUrl || '').trim();
    const badge = (body.badge || '').trim();
    const year = (body.year || '২০২৬').trim();

    if (!name || !photoUrl) {
      return NextResponse.json(
        { error: 'শিক্ষার্থীর নাম এবং ক্লাউডিনারি ছবি আবশ্যক' },
        { status: 400 }
      );
    }

    const newAchiever: AchieverItem = {
      id: `ach-${Date.now()}`,
      name,
      classGrade,
      classLabel,
      achievement,
      institution,
      photoUrl,
      badge,
      year,
    };

    const dbReady = await ensureAchieversTable();
    if (dbReady) {
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "SuccessStory" ("id", "name", "classGrade", "classLabel", "achievement", "institution", "photoUrl", "badge", "year")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          newAchiever.id,
          newAchiever.name,
          newAchiever.classGrade,
          newAchiever.classLabel,
          newAchiever.achievement,
          newAchiever.institution,
          newAchiever.photoUrl,
          newAchiever.badge || '',
          newAchiever.year || '২০২৬'
        );
        return NextResponse.json({
          achiever: newAchiever,
          message: 'সাফল্য গাঁথা সফলভাবে যোগ করা হয়েছে!',
        });
      } catch (err) {
        console.warn('POST /api/achievers fallback:', err);
      }
    }

    const local = readLocalAchievers();
    local.push(newAchiever);
    writeLocalAchievers(local);

    return NextResponse.json({
      achiever: newAchiever,
      message: 'সাফল্য গাঁথা সফলভাবে যোগ করা হয়েছে!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'যুক্ত করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'আইডি আবশ্যক' }, { status: 400 });
    }

    const dbReady = await ensureAchieversTable();
    if (dbReady) {
      try {
        await prisma.$executeRawUnsafe(
          `DELETE FROM "SuccessStory" WHERE "id" = $1`,
          id
        );
        return NextResponse.json({ message: 'সাফল্য রেকর্ড মুছে ফেলা হয়েছে' });
      } catch (err) {
        console.warn('DELETE /api/achievers fallback:', err);
      }
    }

    const local = readLocalAchievers();
    writeLocalAchievers(local.filter((a) => a.id !== id));
    return NextResponse.json({ message: 'সাফল্য রেকর্ড মুছে ফেলা হয়েছে' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
