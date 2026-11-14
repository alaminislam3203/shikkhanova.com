import { NextResponse } from 'next/server';
import {
  resolveSubjectKey,
  getTestsBySubjectKey,
  findChapterTestById,
  ChapterTest,
} from '@/lib/allChapterTestsLoader';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Cleanup legacy HTML files and MCQ-MODEL-TEST DATA folder if cached data exists
try {
  const legacyHtml1 = path.join(process.cwd(), 'Bangla_Unified_Model_Test_App.html');
  if (fs.existsSync(legacyHtml1)) fs.unlinkSync(legacyHtml1);
} catch {}
try {
  const legacyHtml2 = path.join(process.cwd(), 'bangla-grammar-unified-app.html');
  const cachePath2 = path.join(process.cwd(), 'data', 'bangla_grammar_chapter_tests.json');
  if (fs.existsSync(legacyHtml2) && fs.existsSync(cachePath2)) {
    fs.unlinkSync(legacyHtml2);
  }
} catch {}
try {
  const legacyHtml3 = path.join(process.cwd(), 'bdwp_model_test_app (2) বাবি.html');
  const cachePath3 = path.join(process.cwd(), 'data', 'bdwp_chapter_tests.json');
  if (fs.existsSync(legacyHtml3) && fs.existsSync(cachePath3)) {
    fs.unlinkSync(legacyHtml3);
  }
} catch {}

// Cleanup MCQ-MODEL-TEST DATA directory if all JSON files exist
try {
  const mcqDir = path.join(process.cwd(), 'MCQ-MODEL-TEST DATA');
  const destDir = path.join(process.cwd(), 'data', 'chapter_tests');
  if (fs.existsSync(mcqDir) && fs.existsSync(destDir)) {
    const requiredFiles = [
      'chemistry.json',
      'physics.json',
      'geography.json',
      'higher_math.json',
      'hindu.json',
      'history.json',
      'economics.json',
      'biology.json',
      'islam.json',
      'agriculture.json',
      'ict.json',
      'general_science.json',
      'general_math.json',
      'home_science.json',
    ];
    const allReady = requiredFiles.every((f) => fs.existsSync(path.join(destDir, f)));
    if (allReady) {
      const files = fs.readdirSync(mcqDir);
      for (const file of files) {
        try {
          fs.unlinkSync(path.join(mcqDir, file));
        } catch {}
      }
      try {
        fs.rmdirSync(mcqDir);
      } catch {}
    }
  }
} catch {}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'summary';
    const typeFilter = searchParams.get('type');
    const chapterFilter = searchParams.get('chapter');
    const testId = searchParams.get('id');
    const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();
    const subjectParam = searchParams.get('subject') || '';
    const paperParam = searchParams.get('paper');

    // 1. Single Test by ID (with full questions)
    if (action === 'test' && testId) {
      const found = findChapterTestById(testId);
      if (!found) {
        return NextResponse.json({ success: false, message: 'টেস্ট পাওয়া যায়নি' }, { status: 404 });
      }
      return NextResponse.json({ success: true, test: found });
    }

    // Resolve subject key
    const subjectKey = resolveSubjectKey(subjectParam, paperParam);
    const allTests: ChapterTest[] = getTestsBySubjectKey(subjectKey);

    // 2. Chapters List with Summary
    if (action === 'chapters') {
      const chapterMap = new Map<
        string,
        {
          name: string;
          type: string;
          author?: string;
          chNum?: number;
          testCount: number;
          totalQuestions: number;
          tests: { id: string; name: string; min: number; questionCount: number }[];
        }
      >();

      for (const t of allTests) {
        const key = `${t.type}|${t.ch}`;
        const existing = chapterMap.get(key) || {
          name: t.ch,
          type: t.type,
          author: (t as any).author,
          chNum: (t as any).chNum,
          testCount: 0,
          totalQuestions: 0,
          tests: [],
        };
        existing.testCount += 1;
        existing.totalQuestions += (t.questions || []).length;
        existing.tests.push({
          id: t.id,
          name: t.name,
          min: t.durationMinutes,
          questionCount: (t.questions || []).length,
        });
        chapterMap.set(key, existing);
      }

      let chapters = Array.from(chapterMap.values());

      // Filter by type if provided
      if (typeFilter && typeFilter !== 'all') {
        chapters = chapters.filter((c) => c.type === typeFilter);
      }

      // Filter by search query
      if (searchQuery) {
        chapters = chapters.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery) ||
            (c.author && c.author.toLowerCase().includes(searchQuery))
        );
      }

      // Sort chapters numerically if chNum is present
      chapters.sort((a, b) => {
        if (typeof a.chNum === 'number' && typeof b.chNum === 'number') {
          return a.chNum - b.chNum;
        }
        return a.name.localeCompare(b.name, 'bn');
      });

      return NextResponse.json({
        success: true,
        subjectKey,
        totalChapters: chapters.length,
        totalTests: allTests.length,
        chapters,
      });
    }

    // 3. Tests List (optionally filtered by chapter, type, or search)
    let filtered = allTests;

    if (chapterFilter) {
      filtered = filtered.filter((t) => t.ch === chapterFilter);
    }
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery) ||
          t.ch.toLowerCase().includes(searchQuery)
      );
    }

    // 4. Default: Summary stats
    return NextResponse.json({
      success: true,
      subjectKey,
      totalTests: allTests.length,
      filteredCount: filtered.length,
      tests: filtered.map((t) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        ch: t.ch,
        chNum: t.chNum,
        min: t.durationMinutes,
        mark: t.mark,
        negativeMark: t.negativeMark,
        questionCount: (t.questions || []).length,
      })),
    });
  } catch (error: any) {
    console.error('Chapter tests API error:', error);
    return NextResponse.json(
      { success: false, message: 'সার্ভার ত্রুটি ঘটেছে', error: error?.message },
      { status: 500 }
    );
  }
}
