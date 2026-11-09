import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'PAGE' | 'PDF' | 'RESULT' | 'VIDEO' | 'ATTENDANCE';
  categoryLabel: string;
  href: string;
  badge?: string;
}

const STATIC_SITE_PAGES: GlobalSearchResult[] = [
  {
    id: 'page-home',
    title: 'হোম পেইজ (শিক্ষানোভা একাডেমি)',
    subtitle: '৫ম থেকে ১০ম শ্রেণির ডিজিটাল শিক্ষা ব্যবস্থাপনা • জুম্মাপাড়া, নীলফামারী সদর',
    category: 'PAGE',
    categoryLabel: 'পেইজ',
    href: '/',
  },
  {
    id: 'page-attendance',
    title: 'দৈনিক রোল উপস্থিতি ও হাজিরা শিট',
    subtitle: '৫ম থেকে ১০ম শ্রেণির প্রতিদিনের ক্লাসের উপস্থিতি ও অনুপস্থিতির তালিকা',
    category: 'PAGE',
    categoryLabel: 'হাজিরা',
    href: '/attendance',
  },
  {
    id: 'page-results',
    title: 'কোচিং পরীক্ষার রেজাল্ট ও মার্কশিট',
    subtitle: 'শ্রেণি ও রোল নম্বর দিয়ে অফিশিয়াল গ্রেডশিট ও জিপিএ অনুসন্ধান',
    category: 'PAGE',
    categoryLabel: 'রেজাল্ট',
    href: '/results',
  },
  {
    id: 'page-pdfs',
    title: 'প্রিমিয়াম পিডিএফ শিট ও হ্যান্ডনোট শপ',
    subtitle: 'অধ্যায়ভিত্তিক রঙিন হ্যান্ডনোট, সাজেশন ও ফ্রি শিট ডাউনলোড',
    category: 'PAGE',
    categoryLabel: 'হ্যান্ডনোট',
    href: '/pdfs',
  },
  {
    id: 'page-videos',
    title: 'ইউটিউব ভিডিও ক্লাস (@ShikkhaNova)',
    subtitle: 'গণিত, বিজ্ঞান, ইংরেজি ও আইসিটি বিষয়ের অধ্যায়ভিত্তিক ভিডিও লেকচার',
    category: 'PAGE',
    categoryLabel: 'ভিডিও ক্লাস',
    href: '/videos',
  },
  {
    id: 'page-account',
    title: 'আমার একাউন্ট ও প্রোফাইল সেটিংস',
    subtitle: 'প্রোফাইল ছবি, নাম, মোবাইল নম্বর ও পাসওয়ার্ড পরিবর্তন',
    category: 'PAGE',
    categoryLabel: 'একাউন্ট',
    href: '/account',
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = (searchParams.get('q') || '').trim();

    if (!rawQuery) {
      return NextResponse.json({ results: STATIC_SITE_PAGES.slice(0, 5) });
    }

    const qLower = rawQuery.toLowerCase();

    // Parse class number if user typed e.g. "7", "class 7", "৭ম", "৭"
    const bnToEnMap: Record<string, string> = {
      '০': '0',
      '১': '1',
      '২': '2',
      '৩': '3',
      '৪': '4',
      '৫': '5',
      '৬': '6',
      '৭': '7',
      '৮': '8',
      '৯': '9',
    };
    const normalizedDigits = rawQuery.replace(/[০-৯]/g, (d) => bnToEnMap[d] || d);
    const matchedClassMatch = normalizedDigits.match(/\b(5|6|7|8|9|10)\b/);
    const classNum = matchedClassMatch ? parseInt(matchedClassMatch[1]) : null;

    // 1. Match Static Pages
    const matchedPages = STATIC_SITE_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(qLower) ||
        p.subtitle.toLowerCase().includes(qLower) ||
        p.categoryLabel.toLowerCase().includes(qLower)
    );

    // 2. Query Database in Parallel (PDFs, Results, Videos, Attendance)
    const [pdfs, examResults, videos, attendances] = await Promise.all([
      prisma.pdfMaterial
        .findMany({
          where: {
            OR: [
              { title: { contains: rawQuery, mode: 'insensitive' } },
              { subject: { contains: rawQuery, mode: 'insensitive' } },
              { description: { contains: rawQuery, mode: 'insensitive' } },
              ...(classNum ? [{ classGrade: classNum }] : []),
            ],
          },
          take: 6,
          orderBy: { createdAt: 'desc' },
        })
        .catch(() => []),

      prisma.examResult
        .findMany({
          where: {
            OR: [
              { studentName: { contains: rawQuery, mode: 'insensitive' } },
              { examTitle: { contains: rawQuery, mode: 'insensitive' } },
              ...(classNum ? [{ classGrade: classNum }] : []),
            ],
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
        .catch(() => []),

      prisma.videoLesson
        .findMany({
          where: {
            OR: [
              { title: { contains: rawQuery, mode: 'insensitive' } },
              { subject: { contains: rawQuery, mode: 'insensitive' } },
              { description: { contains: rawQuery, mode: 'insensitive' } },
              ...(classNum ? [{ classGrade: classNum }] : []),
            ],
          },
          take: 4,
          orderBy: { createdAt: 'desc' },
        })
        .catch(() => []),

      prisma.attendance
        .findMany({
          where: {
            OR: [
              { studentName: { contains: rawQuery, mode: 'insensitive' } },
              ...(classNum ? [{ classGrade: classNum }] : []),
            ],
          },
          take: 4,
          orderBy: { date: 'desc' },
        })
        .catch(() => []),
    ]);

    const results: GlobalSearchResult[] = [
      ...matchedPages,
      ...pdfs.map((p) => ({
        id: `pdf-${p.id}`,
        title: p.title,
        subtitle: `Class ${p.classGrade} • ${p.subject}`,
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
      ...attendances.map((a) => ({
        id: `att-${a.id}`,
        title: `${a.studentName || `রোল ${a.rollNumber}`} (Class ${a.classGrade})`,
        subtitle: `রোল নম্বর: ${a.rollNumber} • উপস্থিতি স্ট্যাটাস: ${a.status}`,
        category: 'ATTENDANCE' as const,
        categoryLabel: 'হাজিরা',
        href: `/attendance?class=${a.classGrade}`,
        badge: a.status === 'PRESENT' ? 'উপস্থিত' : 'অনুপস্থিত',
      })),
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ results: STATIC_SITE_PAGES.slice(0, 5) });
  }
}
