import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_BANNERS, BannerItem } from '@/lib/defaultBanners';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'banners.json');

function readLocalBanners(): BannerItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...DEFAULT_BANNERS];
}

function writeLocalBanners(banners: BannerItem[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(banners, null, 2), 'utf8');
  } catch {}
}

async function ensureBannerTableAndSeed() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "HeroBanner" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "linkUrl" TEXT NOT NULL DEFAULT '',
        "displayOrder" INTEGER NOT NULL DEFAULT 1,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRows: Array<{ count: bigint | number }> =
      await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "HeroBanner"`);
    const count = Number(countRows?.[0]?.count || 0);

    if (count === 0) {
      for (const b of DEFAULT_BANNERS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "HeroBanner" ("id", "title", "imageUrl", "linkUrl", "displayOrder", "isActive")
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT ("id") DO NOTHING`,
          b.id,
          b.title,
          b.imageUrl,
          b.linkUrl || '',
          b.displayOrder,
          b.isActive
        );
      }
    }
    return true;
  } catch (err) {
    console.warn('Database HeroBanner init skipped, using fallback:', err);
    return false;
  }
}

export async function GET() {
  const dbReady = await ensureBannerTableAndSeed();
  if (dbReady) {
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM "HeroBanner" ORDER BY "displayOrder" ASC, "createdAt" DESC`
      );
      const banners: BannerItem[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl,
        linkUrl: r.linkUrl || '',
        displayOrder: Number(r.displayOrder) || 1,
        isActive: Boolean(r.isActive),
        createdAt: r.createdAt
          ? new Date(r.createdAt).toISOString()
          : new Date().toISOString(),
      }));
      return NextResponse.json({ banners });
    } catch (err) {
      console.warn('GET /api/banners fallback:', err);
    }
  }

  const local = readLocalBanners();
  local.sort((a, b) => a.displayOrder - b.displayOrder);
  return NextResponse.json({ banners: local });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = (body.title || 'শিক্ষানোভা একাডেমি ব্যানার').trim();
    const imageUrl = (body.imageUrl || '').trim();
    const linkUrl = (body.linkUrl || '').trim();
    const displayOrder = Number(body.displayOrder) || 1;
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'ব্যানার ছবি আপলোড করুন অথবা ছবির লিংক দিন' },
        { status: 400 }
      );
    }

    const newBanner: BannerItem = {
      id: `banner-${Date.now()}`,
      title,
      imageUrl,
      linkUrl,
      displayOrder,
      isActive,
      createdAt: new Date().toISOString(),
    };

    const dbReady = await ensureBannerTableAndSeed();
    if (dbReady) {
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "HeroBanner" ("id", "title", "imageUrl", "linkUrl", "displayOrder", "isActive")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          newBanner.id,
          newBanner.title,
          newBanner.imageUrl,
          newBanner.linkUrl || '',
          newBanner.displayOrder,
          newBanner.isActive
        );
        return NextResponse.json({
          banner: newBanner,
          message: 'নতুন হিরো ব্যানার সফলভাবে যোগ করা হয়েছে!',
        });
      } catch (err) {
        console.warn('POST /api/banners DB insert fallback:', err);
      }
    }

    const local = readLocalBanners();
    local.push(newBanner);
    writeLocalBanners(local);

    return NextResponse.json({
      banner: newBanner,
      message: 'নতুন হিরো ব্যানার সফলভাবে যোগ করা হয়েছে!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ব্যানার যোগ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = (body.id || '').trim();
    const title = (body.title || 'শিক্ষানোভা একাডেমি ব্যানার').trim();
    const imageUrl = (body.imageUrl || '').trim();
    const linkUrl = (body.linkUrl || '').trim();
    const displayOrder = Number(body.displayOrder) || 1;
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

    if (!id || !imageUrl) {
      return NextResponse.json(
        { error: 'ব্যানার আইডি এবং ছবির লিংক আবশ্যক' },
        { status: 400 }
      );
    }

    const updatedBanner: BannerItem = {
      id,
      title,
      imageUrl,
      linkUrl,
      displayOrder,
      isActive,
    };

    const dbReady = await ensureBannerTableAndSeed();
    if (dbReady) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "HeroBanner"
           SET "title" = $1, "imageUrl" = $2, "linkUrl" = $3, "displayOrder" = $4, "isActive" = $5
           WHERE "id" = $6`,
          updatedBanner.title,
          updatedBanner.imageUrl,
          updatedBanner.linkUrl || '',
          updatedBanner.displayOrder,
          updatedBanner.isActive,
          updatedBanner.id
        );
        return NextResponse.json({
          banner: updatedBanner,
          message: 'ব্যানার সফলভাবে আপডেট করা হয়েছে!',
        });
      } catch (err) {
        console.warn('PATCH /api/banners fallback:', err);
      }
    }

    const local = readLocalBanners();
    const idx = local.findIndex((b) => b.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedBanner };
      writeLocalBanners(local);
    }

    return NextResponse.json({
      banner: updatedBanner,
      message: 'ব্যানার সফলভাবে আপডেট করা হয়েছে!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ব্যানার আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ব্যানার আইডি আবশ্যক' }, { status: 400 });
    }

    const dbReady = await ensureBannerTableAndSeed();
    if (dbReady) {
      try {
        await prisma.$executeRawUnsafe(
          `DELETE FROM "HeroBanner" WHERE "id" = $1`,
          id
        );
        return NextResponse.json({ message: 'ব্যানার মুছে ফেলা হয়েছে' });
      } catch (err) {
        console.warn('DELETE /api/banners fallback:', err);
      }
    }

    const local = readLocalBanners();
    writeLocalBanners(local.filter((b) => b.id !== id));

    return NextResponse.json({ message: 'ব্যানার মুছে ফেলা হয়েছে' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

