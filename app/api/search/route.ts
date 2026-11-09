import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'PAGE' | 'PDF' | 'RESULT' | 'VIDEO' | 'ATTENDANCE';
  categoryLabel: string;
  href: string;
  badge?: string;
}

// In-memory server cache for 30s to eliminate repeated DB roundtrips during typing
let cachedDbItems: GlobalSearchResult[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = (searchParams.get('q') || '').trim().toLowerCase();

    const now = Date.now();
    if (!cachedDbItems || now - lastCacheTime > CACHE_TTL_MS) {
      const [pdfs, examResults, videos] = await Promise.all([
        prisma.pdfMaterial
          .findMany({
            take: 30,
            orderBy: { createdAt: 'desc' },
          })
          .catch(() => []),

        prisma.examResult
          .findMany({
            take: 25,
            orderBy: { createdAt: 'desc' },
          })
          .catch(() => []),

        prisma.videoLesson
          .findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
          })
          .catch(() => []),
      ]);

      cachedDbItems = [
        ...pdfs.map((p) => ({
          id: `pdf-${p.id}`,
          title: p.title,
          subtitle: `Class ${p.classGrade} • ${p.subject} ${p.description || ''}`,
          category: 'PDF' as const,
          categoryLabel: 'পিডিএফ শিট',
          href: '/pdfs',
          badge: p.isFree || p.price <= 0 ? 'ফ্রি' : `৳${p.price}`,
        })),
        ...examResults.map((r) => ({
          id: `res-${r.id}`,
          title: `${r.studentName} (রোল: ${r.rollNumber})`,
          subtitle: `Class ${r.classGrade} • ${r.examTitle}`,
          category: 'RESULT' as const,
          categoryLabel: 'রেজাল্ট',
          href: `/results`,
          badge: `${r.grade} (${r.gpa})`,
        })),
        ...videos.map((v) => ({
          id: `vid-${v.id}`,
          title: v.title,
          subtitle: `Class ${v.classGrade} • ${v.subject}`,
          category: 'VIDEO' as const,
          categoryLabel: 'ভিডিও ক্লাস',
          href: '/videos',
        })),
      ];
      lastCacheTime = now;
    }

    if (!rawQuery) {
      return NextResponse.json({ results: cachedDbItems.slice(0, 8) });
    }

    const filtered = cachedDbItems.filter(
      (item) =>
        item.title.toLowerCase().includes(rawQuery) ||
        item.subtitle.toLowerCase().includes(rawQuery) ||
        item.categoryLabel.toLowerCase().includes(rawQuery)
    );

    return NextResponse.json({ results: filtered.slice(0, 10) });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
