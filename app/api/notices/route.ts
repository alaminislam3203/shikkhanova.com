import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_NOTICES, CATEGORY_LABELS, NoticeItem } from '@/lib/defaultNotices';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_FILE_PATH = path.join(process.cwd(), 'data', 'notices.json');

function readLocalNotices(): NoticeItem[] {
  try {
    if (fs.existsSync(LOCAL_FILE_PATH)) {
      const raw = fs.readFileSync(LOCAL_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_NOTICES;
}

function writeLocalNotices(notices: NoticeItem[]) {
  try {
    const dir = path.dirname(LOCAL_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_FILE_PATH, JSON.stringify(notices, null, 2), 'utf-8');
  } catch {}
}

async function ensureNoticeTableAndSeed(): Promise<NoticeItem[]> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Notice" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "category" TEXT NOT NULL DEFAULT 'general',
        "categoryLabel" TEXT NOT NULL DEFAULT 'হ্যান্ডনোট ও সাধারণ',
        "targetClass" TEXT NOT NULL DEFAULT 'সকল শ্রেণি',
        "isPinned" BOOLEAN NOT NULL DEFAULT false,
        "summary" TEXT NOT NULL,
        "details" TEXT NOT NULL,
        "attachmentUrl" TEXT DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Notice" ORDER BY "isPinned" DESC, "createdAt" DESC`
    );

    if (!existing || existing.length === 0) {
      for (const item of DEFAULT_NOTICES) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "Notice" ("id", "title", "date", "category", "categoryLabel", "targetClass", "isPinned", "summary", "details", "attachmentUrl", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT ("id") DO NOTHING`,
          item.id,
          item.title,
          item.date,
          item.category,
          item.categoryLabel,
          item.targetClass,
          Boolean(item.isPinned),
          item.summary,
          item.details,
          item.attachmentUrl || '',
          new Date(item.createdAt || Date.now())
        );
      }

      const seeded: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "Notice" ORDER BY "isPinned" DESC, "createdAt" DESC`
      );
      writeLocalNotices(seeded);
      return seeded;
    }

    writeLocalNotices(existing);
    return existing;
  } catch {
    return readLocalNotices();
  }
}

export async function GET() {
  const notices = await ensureNoticeTableAndSeed();
  return NextResponse.json({ notices });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন নোটিশ যুক্ত করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      date,
      category = 'general',
      targetClass = 'সকল শ্রেণি',
      isPinned = false,
      summary,
      details,
      attachmentUrl = '',
    } = body;

    if (!title || !summary) {
      return NextResponse.json({ error: 'নোটিশের শিরোনাম ও সংক্ষিপ্ত বিবরণ আবশ্যক' }, { status: 400 });
    }

    const id = `notice-${Date.now()}`;
    const categoryLabel =
      CATEGORY_LABELS[category as NoticeItem['category']] || 'হ্যান্ডনোট ও সাধারণ';
    const formattedDate =
      date?.trim() ||
      new Date().toLocaleDateString('bn-BD', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    const fullDetails = details?.trim() || summary.trim();

    const newNotice: NoticeItem = {
      id,
      title: title.trim(),
      date: formattedDate,
      category,
      categoryLabel,
      targetClass: targetClass.trim() || 'সকল শ্রেণি',
      isPinned: Boolean(isPinned),
      summary: summary.trim(),
      details: fullDetails,
      attachmentUrl: attachmentUrl?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    try {
      await ensureNoticeTableAndSeed();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Notice" ("id", "title", "date", "category", "categoryLabel", "targetClass", "isPinned", "summary", "details", "attachmentUrl", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        newNotice.id,
        newNotice.title,
        newNotice.date,
        newNotice.category,
        newNotice.categoryLabel,
        newNotice.targetClass,
        newNotice.isPinned,
        newNotice.summary,
        newNotice.details,
        newNotice.attachmentUrl || '',
        new Date()
      );
    } catch {}

    const current = readLocalNotices();
    writeLocalNotices([newNotice, ...current]);

    return NextResponse.json({ message: 'নোটিশ সফলভাবে প্রকাশিত হয়েছে!', notice: newNotice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'নোটিশ প্রকাশ ব্যর্থ হয়েছে' }, { status: 500 });
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
      title,
      date,
      category,
      targetClass,
      isPinned,
      summary,
      details,
      attachmentUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'নোটিশ আইডি প্রয়োজন' }, { status: 400 });
    }

    const categoryLabel = category
      ? CATEGORY_LABELS[category as NoticeItem['category']] || 'হ্যান্ডনোট ও সাধারণ'
      : undefined;

    try {
      await ensureNoticeTableAndSeed();
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "Notice" WHERE "id" = $1 LIMIT 1`,
        id
      );

      if (rows && rows.length > 0) {
        const existing = rows[0];
        const nextTitle = title !== undefined ? title.trim() : existing.title;
        const nextDate = date !== undefined ? date.trim() : existing.date;
        const nextCategory = category !== undefined ? category : existing.category;
        const nextCategoryLabel = categoryLabel || existing.categoryLabel;
        const nextTargetClass =
          targetClass !== undefined ? targetClass.trim() : existing.targetClass;
        const nextIsPinned =
          isPinned !== undefined ? Boolean(isPinned) : Boolean(existing.isPinned);
        const nextSummary = summary !== undefined ? summary.trim() : existing.summary;
        const nextDetails = details !== undefined ? details.trim() : existing.details;
        const nextAttachmentUrl =
          attachmentUrl !== undefined ? attachmentUrl.trim() : existing.attachmentUrl;

        await prisma.$executeRawUnsafe(
          `UPDATE "Notice"
           SET "title" = $1, "date" = $2, "category" = $3, "categoryLabel" = $4,
               "targetClass" = $5, "isPinned" = $6, "summary" = $7, "details" = $8, "attachmentUrl" = $9
           WHERE "id" = $10`,
          nextTitle,
          nextDate,
          nextCategory,
          nextCategoryLabel,
          nextTargetClass,
          nextIsPinned,
          nextSummary,
          nextDetails,
          nextAttachmentUrl,
          id
        );
      }
    } catch {}

    const current = readLocalNotices().map((item) =>
      item.id === id
        ? {
            ...item,
            ...(title !== undefined ? { title: title.trim() } : {}),
            ...(date !== undefined ? { date: date.trim() } : {}),
            ...(category !== undefined ? { category, categoryLabel: categoryLabel || item.categoryLabel } : {}),
            ...(targetClass !== undefined ? { targetClass: targetClass.trim() } : {}),
            ...(isPinned !== undefined ? { isPinned: Boolean(isPinned) } : {}),
            ...(summary !== undefined ? { summary: summary.trim() } : {}),
            ...(details !== undefined ? { details: details.trim() } : {}),
            ...(attachmentUrl !== undefined ? { attachmentUrl: attachmentUrl.trim() } : {}),
          }
        : item
    );
    writeLocalNotices(current);

    return NextResponse.json({ message: 'নোটিশ আপডেট হয়েছে!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'নোটিশ আপডেট ব্যর্থ হয়েছে' }, { status: 500 });
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
      return NextResponse.json({ error: 'নোটিশ আইডি প্রয়োজন' }, { status: 400 });
    }

    try {
      await ensureNoticeTableAndSeed();
      await prisma.$executeRawUnsafe(`DELETE FROM "Notice" WHERE "id" = $1`, id);
    } catch {}

    const current = readLocalNotices().filter((item) => item.id !== id);
    writeLocalNotices(current);

    return NextResponse.json({ message: 'নোটিশ ডিলিট করা হয়েছে!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ডিলিট ব্যর্থ হয়েছে' }, { status: 500 });
  }
}

