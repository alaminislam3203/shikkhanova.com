import fs from 'fs';
import path from 'path';

export interface GrammarChapterQuestion {
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

export interface GrammarChapterTest {
  id: string;
  type: string; // 'ব্যাকরণ' | 'নির্মিতি'
  ch: string; // অধ্যায় নাম e.g. "ভাষা ও বাংলা ভাষা"
  chNum: number;
  name: string; // 'মডেল টেস্ট-01'
  durationMinutes: number;
  mark: number;
  negativeMark: number;
  questions: GrammarChapterQuestion[];
}

let cachedGrammarTests: GrammarChapterTest[] | null = null;

export function getAllBanglaGrammarChapterTests(): GrammarChapterTest[] {
  if (cachedGrammarTests && cachedGrammarTests.length > 0) {
    return cachedGrammarTests;
  }

  const cachePath = path.join(process.cwd(), 'data', 'bangla_grammar_chapter_tests.json');

  // 1. Try reading from pre-generated cache
  try {
    if (fs.existsSync(cachePath)) {
      const content = fs.readFileSync(cachePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedGrammarTests = parsed;
        return cachedGrammarTests;
      }
    }
  } catch (err) {
    console.error('Error loading bangla_grammar_chapter_tests.json:', err);
  }

  // 2. If cache not present, extract from bangla-grammar-unified-app.html
  const htmlPath = path.join(process.cwd(), 'bangla-grammar-unified-app.html');
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

          const chapters: { n: number; name: string }[] = data.chapters || [];
          const chapterMap = new Map<number, string>();
          chapters.forEach((c) => chapterMap.set(c.n, c.name));

          const rawTests: any[] = data.tests || [];
          const rawQuestions: any[] = data.questions || [];

          // Group questions by test ID (tid)
          const qMap = new Map<string, GrammarChapterQuestion[]>();
          for (const q of rawQuestions) {
            const tid = q.tid;
            if (!qMap.has(tid)) {
              qMap.set(tid, []);
            }
            const items = Array.isArray(q.st) && q.st.length > 0 ? q.st : undefined;
            qMap.get(tid)!.push({
              id: String(q.id || `${tid}_${q.no}`),
              q: q.q || '',
              stem: items ? items.join('\n') : undefined,
              items: items,
              options: [
                q.o?.[0] || '',
                q.o?.[1] || '',
                q.o?.[2] || '',
                q.o?.[3] || '',
              ],
              ans: typeof q.a === 'number' ? q.a : 0,
              explanation: q.e || '',
              page: q.p ? String(q.p) : undefined,
              category: (q.ch && q.ch >= 39) ? 'নির্মিতি' : 'ব্যাকরণ',
            });
          }

          const formattedTests: GrammarChapterTest[] = [];
          for (const t of rawTests) {
            const chName = chapterMap.get(t.ch) || `অধ্যায় ${t.ch}`;
            const testQuestions = qMap.get(t.id) || [];
            formattedTests.push({
              id: String(t.id),
              type: t.ch >= 39 ? 'নির্মিতি' : 'ব্যাকরণ',
              ch: chName,
              chNum: t.ch,
              name: t.name || 'মডেল টেস্ট',
              durationMinutes: Number(t.min) || 30,
              mark: 1,
              negativeMark: typeof t.neg === 'number' ? t.neg : 0.25,
              questions: testQuestions,
            });
          }

          if (formattedTests.length > 0) {
            cachedGrammarTests = formattedTests;
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(cachePath, JSON.stringify(formattedTests, null, 2), 'utf-8');

            // Cleanup legacy HTML file now that it is extracted
            try {
              fs.unlinkSync(htmlPath);
            } catch (unlinkErr) {
              console.warn('Could not remove legacy bangla-grammar-unified-app.html:', unlinkErr);
            }

            return cachedGrammarTests;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error extracting from bangla-grammar-unified-app.html:', err);
  }

  return [];
}

