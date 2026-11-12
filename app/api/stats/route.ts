import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { DEFAULT_LANDING_CONTENT } from '@/lib/defaultLandingContent';
import { DEFAULT_QUIZ_PACKAGES, DEFAULT_CUSTOM_QUIZ_CARDS } from '@/lib/defaultQuizData';

export const dynamic = 'force-dynamic';

function getStoredLandingContentFromFile() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'landing-content.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_LANDING_CONTENT;
}

export async function GET() {
  try {
    const landingContent = getStoredLandingContentFromFile();
    const landingStats = Array.isArray(landingContent?.stats)
      ? landingContent.stats
      : DEFAULT_LANDING_CONTENT.stats;

    // Helper to parse existing numbers from string e.g. "১,৫০০+" -> 1500
    const parseNumber = (val: string, fallback: number): { num: number; suffix: string } => {
      if (!val) return { num: fallback, suffix: '+' };
      const bnToEn: Record<string, string> = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
      };
      const enStr = val.replace(/[০-৯]/g, (d) => bnToEn[d] || d);
      const matched = enStr.match(/\d+/g);
      const num = matched ? parseInt(matched.join(''), 10) : fallback;
      const suffix = val.includes('%') ? '%' : '+';
      return { num: isNaN(num) ? fallback : num, suffix };
    };

    // 1. Live Students Count
    let dbStudentsCount = 0;
    try {
      dbStudentsCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    } catch {}

    const configuredStudents = parseNumber(landingStats[0]?.value || '১,৫০০+', 1500);
    // Combine configured base with live registered students in DB
    const finalStudentCount = Math.max(configuredStudents.num, 1500 + dbStudentsCount);

    // 2. Live Pass / GPA-5 Rate
    let livePassRate = 98;
    try {
      const allResults = await prisma.examResult.findMany({
        select: { gpa: true, grade: true },
      });
      if (allResults.length > 0) {
        const passedCount = allResults.filter(
          (r) => (r.gpa && r.gpa >= 1.0) || r.grade !== 'F'
        ).length;
        livePassRate = Math.min(100, Math.round((passedCount / allResults.length) * 100));
      }
    } catch {}
    const configuredGpa = parseNumber(landingStats[1]?.value || '৯৮%', livePassRate);
    const finalGpaRate = configuredGpa.num || livePassRate;

    // 3. Live PDF Notes & Sheets Count
    let dbPdfCount = 0;
    try {
      dbPdfCount = await prisma.pdfMaterial.count();
    } catch {}
    const configuredSheets = parseNumber(landingStats[2]?.value || '৫০+', 50);
    const finalSheetsCount = Math.max(configuredSheets.num, 50 + dbPdfCount);

    // 4. Live Model Tests & Quizzes Count
    let customCardsCount = 0;
    try {
      const customCardsPath = path.join(process.cwd(), 'data', 'custom_quiz_cards.json');
      if (fs.existsSync(customCardsPath)) {
        const parsed = JSON.parse(fs.readFileSync(customCardsPath, 'utf-8'));
        if (Array.isArray(parsed)) customCardsCount = parsed.length;
      }
    } catch {}
    if (customCardsCount === 0) {
      customCardsCount = DEFAULT_CUSTOM_QUIZ_CARDS.length;
    }

    // 6 free class tests + packages + custom cards + subject question sets
    const baseQuizzes = 6 + DEFAULT_QUIZ_PACKAGES.length + customCardsCount * 10;
    const configuredQuizzes = parseNumber(landingStats[3]?.value || '১০০+', 100);
    const finalQuizzesCount = Math.max(configuredQuizzes.num, baseQuizzes);

    return NextResponse.json({
      success: true,
      stats: [
        {
          id: 'stat-students',
          targetNumber: finalStudentCount,
          suffix: '+',
          label: landingStats[0]?.label || 'সফল শিক্ষার্থী',
          badgeText: 'সক্রিয় ব্যাচ',
          description: 'দেশসেরা প্রতিষ্ঠানে ভর্তির সুযোগ',
          icon: 'users',
        },
        {
          id: 'stat-gpa',
          targetNumber: finalGpaRate,
          suffix: '%',
          label: landingStats[1]?.label || 'জিপিএ-৫ ও পাশের হার',
          badgeText: 'ধারাবাহিক সাফল্য',
          description: 'বিগত ৫ বছরের ঈর্ষণীয় ফলাফল',
          icon: 'award',
        },
        {
          id: 'stat-sheets',
          targetNumber: finalSheetsCount,
          suffix: '+',
          label: landingStats[2]?.label || 'এক্সক্লুসিভ শিট ও নোট',
          badgeText: 'আপডেটেড রিসোর্স',
          description: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ রঙিন শিট',
          icon: 'book',
        },
        {
          id: 'stat-quizzes',
          targetNumber: finalQuizzesCount,
          suffix: '+',
          label: landingStats[3]?.label || 'মডেল টেস্ট ও কুইজ',
          badgeText: 'রিয়েল-টাইম টেস্ট',
          description: 'মেধা যাচাই ও লাইভ র‍্যাঙ্কিং',
          icon: 'clock',
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে',
      },
      { status: 500 }
    );
  }
}
