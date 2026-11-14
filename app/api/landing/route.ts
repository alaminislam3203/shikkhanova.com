import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_LANDING_CONTENT, LandingContent } from '@/lib/defaultLandingContent';
import { getDbSetting, setDbSetting } from '@/lib/dbSettings';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'landing-content.json');

function readLocalLandingContent(): LandingContent {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          stats: Array.isArray(parsed.stats) ? parsed.stats : DEFAULT_LANDING_CONTENT.stats,
          director: { ...DEFAULT_LANDING_CONTENT.director, ...(parsed.director || {}) },
          whyUs: Array.isArray(parsed.whyUs) ? parsed.whyUs : DEFAULT_LANDING_CONTENT.whyUs,
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_LANDING_CONTENT.faqs,
          contact: { ...DEFAULT_LANDING_CONTENT.contact, ...(parsed.contact || {}) },
        };
      }
    }
  } catch (err) {
    console.error('Failed to read landing content file:', err);
  }
  return DEFAULT_LANDING_CONTENT;
}

export async function getLandingContent(): Promise<LandingContent> {
  // 1. Read from PostgreSQL Database first
  try {
    const dbData = await getDbSetting<LandingContent | null>('landing_content', null);
    if (dbData && typeof dbData === 'object' && (dbData.stats || dbData.director || dbData.whyUs)) {
      return {
        stats: Array.isArray(dbData.stats) ? dbData.stats : DEFAULT_LANDING_CONTENT.stats,
        director: { ...DEFAULT_LANDING_CONTENT.director, ...(dbData.director || {}) },
        whyUs: Array.isArray(dbData.whyUs) ? dbData.whyUs : DEFAULT_LANDING_CONTENT.whyUs,
        faqs: Array.isArray(dbData.faqs) ? dbData.faqs : DEFAULT_LANDING_CONTENT.faqs,
        contact: { ...DEFAULT_LANDING_CONTENT.contact, ...(dbData.contact || {}) },
      };
    }
  } catch (err) {
    console.error('Failed to read landing content from DB:', err);
  }

  // 2. Fallback to local file seed and save into PostgreSQL Database
  const localSeed = readLocalLandingContent();
  try {
    await setDbSetting('landing_content', localSeed);
  } catch {}
  return localSeed;
}

export async function GET() {
  try {
    const content = await getLandingContent();
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'ল্যান্ডিং পেজ কন্টেন্ট লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন ল্যান্ডিং পেজের তথ্য পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const current = await getLandingContent();

    const updated: LandingContent = {
      stats: Array.isArray(body.stats) ? body.stats : current.stats,
      director: body.director ? { ...current.director, ...body.director } : current.director,
      whyUs: Array.isArray(body.whyUs) ? body.whyUs : current.whyUs,
      faqs: Array.isArray(body.faqs) ? body.faqs : current.faqs,
      contact: body.contact ? { ...current.contact, ...body.contact } : current.contact,
    };

    // 1. Primary Save: Direct to PostgreSQL Database
    await setDbSetting('landing_content', updated);

    // 2. Secondary local file fallback (optional)
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    } catch {}

    return NextResponse.json({
      message: 'ল্যান্ডিং পেজের সকল তথ্য সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!',
      content: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'ল্যান্ডিং পেজ কন্টেন্ট সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

