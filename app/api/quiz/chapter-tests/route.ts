import { NextResponse } from 'next/server';
import { getAllBanglaChapterTests } from '@/lib/banglaChapterTests';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Cleanup legacy 3.5MB HTML file from disk if it exists
try {
  const legacyHtml = path.join(process.cwd(), 'Bangla_Unified_Model_Test_App.html');
  if (fs.existsSync(legacyHtml)) {
    fs.unlinkSync(legacyHtml);
  }
} catch {}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'summary';
    const typeFilter = searchParams.get('type'); // 'কবিতা' | 'গদ্য'
    const chapterFilter = searchParams.get('chapter'); // e.g. 'সুভা'
    const testId = searchParams.get('id');
    const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

    const allTests = getAllBanglaChapterTests();

    // 1. Single Test by ID (with full questions)
    if (action === 'test' && testId) {
      const found = allTests.find((t) => t.id === testId);
      if (!found) {
        return NextResponse.json({ success: false, message: 'টেস্ট পাওয়া যায়নি' }, { status: 404 });
      }
      return NextResponse.json({ success: true, test: found });
    }

    // 2. Chapters List with Summary
    if (action === 'chapters') {
      const chapterMap = new Map<string, {
        name: string;
        type: string;
        author?: string;
        testCount: number;
        totalQuestions: number;
        tests: { id: string; name: string; min: number; questionCount: number }[];
      }>();

      for (const t of allTests) {
        const key = `${t.type}|${t.ch}`;
        const existing = chapterMap.get(key) || {
          name: t.ch,
          type: t.type,
          author: t.author,
          testCount: 0,
          totalQuestions: 0,
          tests: [],
        };
        existing.testCount += 1;
        existing.totalQuestions += Array.isArray(t.questions) ? t.questions.length : 0;
        existing.tests.push({
          id: t.id,
          name: t.name,
          min: t.durationMinutes,
          questionCount: Array.isArray(t.questions) ? t.questions.length : 0,
        });
        chapterMap.set(key, existing);
      }

      let chapters = Array.from(chapterMap.values());
      if (typeFilter) {
        chapters = chapters.filter((c) => c.type === typeFilter);
      }
      if (searchQuery) {
        chapters = chapters.filter((c) =>
          c.name.toLowerCase().includes(searchQuery) || (c.author && c.author.toLowerCase().includes(searchQuery))
        );
      }

      return NextResponse.json({
        success: true,
        totalChapters: chapters.length,
        totalTests: allTests.length,
        totalQuestions: allTests.reduce((acc, t) => acc + (t.questions ? t.questions.length : 0), 0),
        chapters,
      });
    }

    // 3. Tests List (Summary)
    let filtered = allTests;
    if (typeFilter) {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }
    if (chapterFilter) {
      filtered = filtered.filter((t) => t.ch === chapterFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery) ||
          t.ch.toLowerCase().includes(searchQuery) ||
          (t.author && t.author.toLowerCase().includes(searchQuery))
      );
    }

    const testSummaries = filtered.map((t) => ({
      id: t.id,
      type: t.type,
      ch: t.ch,
      author: t.author || '',
      name: t.name,
      min: t.durationMinutes,
      mark: t.mark || 1,
      neg: t.negativeMark || 0.25,
      questionCount: Array.isArray(t.questions) ? t.questions.length : 0,
    }));

    return NextResponse.json({
      success: true,
      count: testSummaries.length,
      tests: testSummaries,
    });
  } catch (err: any) {
    console.error('Error in /api/quiz/chapter-tests:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
