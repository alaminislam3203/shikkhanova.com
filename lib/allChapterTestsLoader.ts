import fs from 'fs';
import path from 'path';
import { getAllBanglaChapterTests } from './banglaChapterTests';
import { getAllBanglaGrammarChapterTests } from './banglaGrammarChapterTests';
import { getAllBdwpChapterTests } from './bdwpChapterTests';

export interface ChapterQuestion {
  id: string;
  q: string;
  stem?: string;
  stemLabel?: string;
  items?: string[];
  options: [string, string, string, string];
  ans: number;
  explanation?: string;
  page?: string;
  category?: string;
}

export interface ChapterTest {
  id: string;
  type: string;
  ch: string;
  chNum: number;
  name: string;
  durationMinutes: number;
  mark: number;
  negativeMark: number;
  questions: ChapterQuestion[];
}

// In-memory cache for subject tests
const subjectCache = new Map<string, ChapterTest[]>();

/**
 * Maps subject name and paper parameter to a canonical subject key
 */
export function resolveSubjectKey(subjectName: string = '', paperParam?: string | null): string {
  const s = (subjectName || '').trim().toLowerCase();
  const p = (paperParam || '').trim();

  // 1. Bangla 2nd / Grammar
  if (
    p === '2' ||
    s.includes('ব্যাকরণ') ||
    (s.includes('বাংলা') && (s.includes('২') || s.includes('2') || s.includes('দ্বিতীয়') || s.includes('দ্বিতীয়')))
  ) {
    return 'bangla_grammar';
  }

  // 2. Bangla 1st
  if (
    s.includes('বাংলা') &&
    (p === '1' || s.includes('১') || s.includes('1') || s.includes('প্রথম') || (!s.includes('২') && !s.includes('2')))
  ) {
    return 'bangla_1st';
  }

  // 3. Bangladesh & Global Studies (BDWP)
  if (
    s.includes('বাংলাদেশ ও বিশ্বপরিচয়') ||
    s.includes('বাংলাদেশ ও বিশ্ব পরিচয়') ||
    s.includes('বাবি') ||
    s.includes('bdwp')
  ) {
    return 'bdwp';
  }

  // 4. Chemistry
  if (s.includes('রসায়ন') || s.includes('রসায়ন') || s.includes('chemistry')) {
    return 'chemistry';
  }

  // 5. Physics
  if (s.includes('পদার্থ') || s.includes('physics')) {
    return 'physics';
  }

  // 6. Biology
  if (s.includes('জীব') || s.includes('biology')) {
    return 'biology';
  }

  // 7. Higher Math
  if (s.includes('উচ্চতর') || s.includes('higher math')) {
    return 'higher_math';
  }

  // 8. General Math
  if (s.includes('গণিত') || s.includes('math')) {
    return 'general_math';
  }

  // 9. Geography
  if (s.includes('ভূগোল') || s.includes('geography')) {
    return 'geography';
  }

  // 10. History
  if (s.includes('ইতিহাস') || s.includes('history')) {
    return 'history';
  }

  // 11. Economics
  if (s.includes('অর্থনীতি') || s.includes('economics')) {
    return 'economics';
  }

  // 12. ICT
  if (s.includes('তথ্য ও যোগাযোগ') || s.includes('আইসিটি') || s.includes('ict')) {
    return 'ict';
  }

  // 13. General Science
  if (s.includes('সাধারণ বিজ্ঞান') || (s.includes('বিজ্ঞান') && !s.includes('জীব') && !s.includes('গার্হস্থ্য'))) {
    return 'general_science';
  }

  // 14. Agriculture
  if (s.includes('কৃষি') || s.includes('agriculture')) {
    return 'agriculture';
  }

  // 15. Home Science
  if (s.includes('গার্হস্থ্য') || s.includes('home science')) {
    return 'home_science';
  }

  // 16. Islam & Moral Education
  if (s.includes('ইসলাম') || s.includes('islam')) {
    return 'islam';
  }

  // 17. Hindu Religion & Moral Education
  if (s.includes('হিন্দু') || s.includes('hindu')) {
    return 'hindu';
  }

  return '';
}

/**
 * Load all tests for a given canonical subject key
 */
export function getTestsBySubjectKey(key: string): ChapterTest[] {
  if (!key) return [];

  // Check cache first
  if (subjectCache.has(key)) {
    return subjectCache.get(key) || [];
  }

  let tests: ChapterTest[] = [];

  // Pre-existing subjects with specialized loaders
  if (key === 'bangla_1st') {
    tests = getAllBanglaChapterTests() as ChapterTest[];
    subjectCache.set(key, tests);
    return tests;
  }
  if (key === 'bangla_grammar') {
    tests = getAllBanglaGrammarChapterTests() as ChapterTest[];
    subjectCache.set(key, tests);
    return tests;
  }
  if (key === 'bdwp') {
    tests = getAllBdwpChapterTests() as ChapterTest[];
    subjectCache.set(key, tests);
    return tests;
  }

  // Dynamic load from data/chapter_tests/{key}.json
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'chapter_tests', `${key}.json`);
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        tests = parsed;
        subjectCache.set(key, tests);
        return tests;
      }
    }
  } catch (err) {
    console.error(`Error loading chapter tests for ${key}:`, err);
  }

  return [];
}

/**
 * Find a single test by ID across all available subjects
 */
export function findChapterTestById(testId: string): ChapterTest | null {
  if (!testId) return null;

  // Check already cached subjects first
  for (const [, tests] of subjectCache.entries()) {
    const found = tests.find((t) => t.id === testId);
    if (found) return found;
  }

  // Check standard subject keys
  const allKeys = [
    'bangla_1st',
    'bangla_grammar',
    'bdwp',
    'chemistry',
    'physics',
    'biology',
    'higher_math',
    'general_math',
    'geography',
    'history',
    'economics',
    'ict',
    'general_science',
    'agriculture',
    'home_science',
    'islam',
    'hindu',
  ];

  for (const k of allKeys) {
    const tests = getTestsBySubjectKey(k);
    const found = tests.find((t) => t.id === testId);
    if (found) return found;
  }

  return null;
}

/**
 * Returns whether a given subject name has chapter tests available
 */
export function hasChapterTests(subjectName: string, paperParam?: string | null): boolean {
  const key = resolveSubjectKey(subjectName, paperParam);
  return Boolean(key);
}
