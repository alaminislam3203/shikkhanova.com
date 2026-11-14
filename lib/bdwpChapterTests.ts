import fs from 'fs';
import path from 'path';

export interface BdwpChapterQuestion {
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

export interface BdwpChapterTest {
  id: string;
  type: string; // 'ইতিহাস ও রাষ্ট্র' | 'ভূগোল ও সম্পদ' | 'অর্থনীতি' | 'সমাজবিজ্ঞান'
  ch: string; // অধ্যায় শিরোনাম
  chNum: number;
  name: string; // 'মডেল টেস্ট-01'
  durationMinutes: number;
  mark: number;
  negativeMark: number;
  questions: BdwpChapterQuestion[];
}

let cachedBdwpTests: BdwpChapterTest[] | null = null;

function getBdwpCategory(chNum: number): string {
  if (chNum === 1 || chNum === 2 || (chNum >= 6 && chNum <= 9)) {
    return 'ইতিহাস ও রাষ্ট্র';
  }
  if (chNum === 4 || chNum === 5) {
    return 'ভূগোল ও পরিবেশ';
  }
  if (chNum >= 10 && chNum <= 12) {
    return 'অর্থনীতি';
  }
  return 'সমাজবিজ্ঞান';
}

export function getAllBdwpChapterTests(): BdwpChapterTest[] {
  if (cachedBdwpTests && cachedBdwpTests.length > 0) {
    return cachedBdwpTests;
  }

  const cachePath = path.join(process.cwd(), 'data', 'bdwp_chapter_tests.json');

  // 1. Try reading from pre-generated cache
  try {
    if (fs.existsSync(cachePath)) {
      const content = fs.readFileSync(cachePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedBdwpTests = parsed;
        return cachedBdwpTests;
      }
    }
  } catch (err) {
    console.error('Error loading bdwp_chapter_tests.json:', err);
  }

  // 2. If cache not present, extract from bdwp_model_test_app (2) বাবি.html
  const htmlPath = path.join(process.cwd(), 'bdwp_model_test_app (2) বাবি.html');
  try {
    if (fs.existsSync(htmlPath)) {
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      const startTag = '<script id="data" type="application/json">';
      const endTag = '</script>';
      const startIdx = htmlContent.indexOf(startTag);
      if (startIdx !== -1) {
        const jsonStart = startIdx + startTag.length;
        const jsonEnd = htmlContent.indexOf(endTag, jsonStart);
        if (jsonEnd !== -1) {
          const rawJson = htmlContent.slice(jsonStart, jsonEnd);
          const data = JSON.parse(rawJson);
          const rawTests: any[] = data.tests || [];

          const formattedTests: BdwpChapterTest[] = [];

          for (const t of rawTests) {
            const chNum = Number(t.ch) || 1;
            const category = getBdwpCategory(chNum);
            const rawQs: any[] = Array.isArray(t.qs) ? t.qs : [];

            const formattedQs: BdwpChapterQuestion[] = rawQs.map((q, idx) => {
              const items = Array.isArray(q.s) && q.s.length > 0 ? q.s : undefined;
              return {
                id: String(q.oid ? `${t.id}_q${q.oid}` : `${t.id}_q${idx + 1}`),
                q: q.q || '',
                stem: items ? items.join('\n') : undefined,
                items: items,
                options: [
                  q.o?.[0] || '',
                  q.o?.[1] || '',
                  q.o?.[2] || '',
                  q.o?.[3] || '',
                ],
                ans: typeof q.c === 'number' ? q.c : 0,
                explanation: q.e || '',
                page: q.p ? String(q.p) : undefined,
                category: category,
              };
            });

            formattedTests.push({
              id: String(t.id),
              type: category,
              ch: t.chapter || `অধ্যায় ${chNum}`,
              chNum: chNum,
              name: t.title || 'মডেল টেস্ট',
              durationMinutes: Number(t.time) || 30,
              mark: 1,
              negativeMark: typeof t.neg === 'number' ? t.neg : 0.25,
              questions: formattedQs,
            });
          }

          if (formattedTests.length > 0) {
            cachedBdwpTests = formattedTests;
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(cachePath, JSON.stringify(formattedTests, null, 2), 'utf-8');

            // Cleanup legacy HTML file now that it is extracted
            try {
              fs.unlinkSync(htmlPath);
            } catch (unlinkErr) {
              console.warn('Could not remove legacy bdwp_model_test_app file:', unlinkErr);
            }

            return cachedBdwpTests;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error extracting from bdwp_model_test_app file:', err);
  }

  return [];
}

