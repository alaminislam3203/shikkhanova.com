import fs from 'fs';
import path from 'path';

export interface ChapterQuestion {
  id: string;
  q: string;
  stem?: string;
  stemLabel?: string;
  items?: string[];
  tail?: string;
  options: [string, string, string, string];
  ans: number;
  explanation?: string;
  page?: string;
  category?: string;
}

export interface ChapterTest {
  id: string;
  type: string; // 'কবিতা' | 'গদ্য'
  ch: string; // অধ্যায়
  author?: string;
  name: string; // 'মডেল টেস্ট-01'
  durationMinutes: number;
  mark: number;
  negativeMark: number;
  questions: ChapterQuestion[];
}

let cachedTests: ChapterTest[] | null = null;

export function getAllBanglaChapterTests(): ChapterTest[] {
  if (cachedTests && cachedTests.length > 0) {
    return cachedTests;
  }

  const cachePath = path.join(process.cwd(), 'data', 'bangla_chapter_tests.json');
  try {
    if (fs.existsSync(cachePath)) {
      const content = fs.readFileSync(cachePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedTests = parsed;
        return cachedTests;
      }
    }
  } catch (err) {
    console.error('Error loading bangla_chapter_tests.json:', err);
  }

  return [];
}
