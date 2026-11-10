import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_GALLERY_PHOTOS, CATEGORY_MAP, GalleryPhoto } from '@/lib/defaultGallery';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_FILE_PATH = path.join(process.cwd(), 'data', 'gallery.json');

function readLocalGallery(): GalleryPhoto[] {
  try {
    if (fs.existsSync(LOCAL_FILE_PATH)) {
      const raw = fs.readFileSync(LOCAL_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_GALLERY_PHOTOS;
}

function writeLocalGallery(items: GalleryPhoto[]) {
  try {
    const dir = path.dirname(LOCAL_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local gallery:', err);
  }
}

async function ensureGalleryTableAndSeed(): Promise<GalleryPhoto[]> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Gallery" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "subtitle" TEXT NOT NULL,
        "category" TEXT NOT NULL DEFAULT 'classroom',
        "categoryLabel" TEXT NOT NULL DEFAULT 'ক্লাসরুম ও পাঠদান',
        "date" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Gallery" ORDER BY "createdAt" DESC`
    );

    if (!existing || existing.length === 0) {
      for (const item of DEFAULT_GALLERY_PHOTOS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "Gallery" ("id", "title", "subtitle", "category", "categoryLabel", "date", "imageUrl", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT ("id") DO NOTHING`,
          item.id,
          item.title,
          item.subtitle,
          item.category,
          item.categoryLabel,
          item.date,
          item.imageUrl,
          item.createdAt ? new Date(item.createdAt) : new Date()
        );
      }
      return DEFAULT_GALLERY_PHOTOS;
    }

    return existing.map((r: any) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      category: r.category as GalleryPhoto['category'],
      categoryLabel: r.categoryLabel || CATEGORY_MAP[r.category as GalleryPhoto['category']] || 'ফটো',
      date: r.date,
      imageUrl: r.imageUrl,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch {
    // If DB raw execution fails (e.g. SQLite or permission), use JSON file
    return readLocalGallery();
  }
}

// GET: Fetch all gallery photos
export async function GET() {
  try {
    const photos = await ensureGalleryTableAndSeed();
    return NextResponse.json({ photos }, { status: 200 });
  } catch (error) {
    const fallback = readLocalGallery();
    return NextResponse.json({ photos: fallback }, { status: 200 });
  }
}

// POST: Add new gallery photo (ADMIN only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ছবি যুক্ত করতে পারবেন।' }, { status: 403 });
    }

    const body = await req.json();
    const { title, subtitle, category, date, imageUrl } = body;

    if (!title?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: 'ছবির শিরোনাম এবং ছবির লিঙ্ক (বা আপলোড) আবশ্যক।' }, { status: 400 });
    }

    const catKey = (category || 'classroom') as GalleryPhoto['category'];
    const catLabel = CATEGORY_MAP[catKey] || 'ক্লাসরুম ও পাঠদান';
    const newId = `g-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newPhoto: GalleryPhoto = {
      id: newId,
      title: title.trim(),
      subtitle: (subtitle || '').trim(),
      category: catKey,
      categoryLabel: catLabel,
      date: (date || 'আজকের দিন').trim(),
      imageUrl: imageUrl.trim(),
      createdAt: nowIso,
    };

    // 1. Save to local JSON
    const local = readLocalGallery();
    const updatedLocal = [newPhoto, ...local];
    writeLocalGallery(updatedLocal);

    // 2. Try DB
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Gallery" ("id", "title", "subtitle", "category", "categoryLabel", "date", "imageUrl", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        newPhoto.id,
        newPhoto.title,
        newPhoto.subtitle,
        newPhoto.category,
        newPhoto.categoryLabel,
        newPhoto.date,
        newPhoto.imageUrl,
        new Date(nowIso)
      );
    } catch {}

    return NextResponse.json(
      { success: true, message: 'ছবি সফলভাবে গ্যালারিতে যুক্ত হয়েছে!', photo: newPhoto },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ছবি সংরক্ষণ করা যায়নি।' }, { status: 500 });
  }
}

// PUT / PATCH: Update existing photo (ADMIN only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ছবি পরিবর্তন করতে পারবেন।' }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, subtitle, category, date, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'ছবির আইডি প্রয়োজন।' }, { status: 400 });
    }

    const catKey = (category || 'classroom') as GalleryPhoto['category'];
    const catLabel = CATEGORY_MAP[catKey] || 'ক্লাসরুম ও পাঠদান';

    // 1. Update local JSON
    const local = readLocalGallery();
    const idx = local.findIndex((p) => p.id === id);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        title: title ? title.trim() : local[idx].title,
        subtitle: subtitle !== undefined ? subtitle.trim() : local[idx].subtitle,
        category: catKey,
        categoryLabel: catLabel,
        date: date ? date.trim() : local[idx].date,
        imageUrl: imageUrl ? imageUrl.trim() : local[idx].imageUrl,
      };
      writeLocalGallery(local);
    }

    // 2. Try DB update
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "Gallery"
         SET "title" = $1, "subtitle" = $2, "category" = $3, "categoryLabel" = $4, "date" = $5, "imageUrl" = $6
         WHERE "id" = $7`,
        title?.trim(),
        subtitle?.trim(),
        catKey,
        catLabel,
        date?.trim(),
        imageUrl?.trim(),
        id
      );
    } catch {}

    return NextResponse.json({ success: true, message: 'ছবি সফলভাবে আপডেট করা হয়েছে!' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'আপডেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}

// DELETE: Delete photo by ID (ADMIN only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ছবি মুছতে পারবেন।' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ছবির আইডি প্রয়োজন।' }, { status: 400 });
    }

    // 1. Remove from local JSON
    const local = readLocalGallery();
    const filtered = local.filter((p) => p.id !== id);
    writeLocalGallery(filtered);

    // 2. Remove from DB
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "Gallery" WHERE "id" = $1`, id);
    } catch {}

    return NextResponse.json({ success: true, message: 'ছবি সফলভাবে মুছে ফেলা হয়েছে!' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ছবি মোছা সম্ভব হয়নি।' }, { status: 500 });
  }
}

