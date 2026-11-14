import fs from 'fs';
import path from 'path';
import { RawQuestion } from './defaultQuizData';
import { getDbSetting, setDbSetting } from './dbSettings';

export const QUESTIONS_DIR = path.join(process.cwd(), 'data', 'quiz-questions');
export const SERVER_MCQ_JSON_PATH = path.join(process.cwd(), 'data', 'mcq_questions.json');

export function ensureDirExists() {
  if (!fs.existsSync(QUESTIONS_DIR)) {
    fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
  }
}

/**
 * Maps any Bengali or English subject name to a clean, human-readable slug for filenames.
 * E.g. "ICT" -> "ict", "গণিত" -> "math", "বাংলা ১ম পত্র" -> "bangla_1st"
 */
export function getSubjectSlug(subject: string): string {
  const s = (subject || '').trim().toLowerCase();

  const map: Record<string, string> = {
    // ICT
    'ict': 'ict',
    'তথ্য ও যোগাযোগ প্রযুক্তি': 'ict',
    'তথ্য ও যোগাযোগ প্রযুক্তি (ict)': 'ict',

    // Bangla
    'বাংলা': 'bangla',
    'বাংলা ১ম পত্র': 'bangla_1st',
    'বাংলা ২য় পত্র': 'bangla_2nd',
    'বাংলা ২য় পত্র': 'bangla_2nd',
    'bangla': 'bangla',
    'bengali': 'bangla',

    // English
    'ইংরেজি': 'english',
    'ইংরেজি ১ম পত্র': 'english_1st',
    'ইংরেজি ২য় পত্র': 'english_2nd',
    'ইংরেজি ২য় পত্র': 'english_2nd',
    'english': 'english',

    // Math
    'গণিত': 'math',
    'প্রাথমিক গণিত': 'math',
    'সাধারণ গণিত': 'math',
    'উচ্চতর গণিত': 'higher_math',
    'math': 'math',
    'mathematics': 'math',

    // Science
    'বিজ্ঞান': 'science',
    'প্রাথমিক বিজ্ঞান': 'science',
    'সাধারণ বিজ্ঞান': 'general_science',
    'পদার্থবিজ্ঞান': 'physics',
    'রসায়ন': 'chemistry',
    'রসায়ন': 'chemistry',
    'জীববিজ্ঞান': 'biology',
    'science': 'science',
    'physics': 'physics',
    'chemistry': 'chemistry',
    'biology': 'biology',

    // BGS / Social
    'বাংলাদেশ ও বিশ্বপরিচয়': 'bgs',
    'বাংলাদেশ ও বিশ্বপরিচয়': 'bgs',
    'bgs': 'bgs',
    'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা': 'history',
    'ভূগোল ও পরিবেশ': 'geography',
    'পৌরনীতি ও নাগরিকতা': 'civics',
    'অর্থনীতি': 'economics',

    // Religion
    'ইসলাম ও নৈতিক শিক্ষা': 'islam',
    'ইসলাম': 'islam',
    'islam': 'islam',
    'হিন্দুধর্ম ও নৈতিক শিক্ষা': 'hindu',
    'হিন্দুধর্ম': 'hindu',
    'hindu': 'hindu',

    // Commerce
    'হিসাববিজ্ঞান': 'accounting',
    'ব্যবসায় উদ্যোগ': 'business_ent',
    'ব্যবসায় উদ্যোগ': 'business_ent',
    'ফিন্যান্স ও ব্যাংকিং': 'finance',
  };

  if (map[s]) return map[s];

  // Fallback: clean ASCII / sanitized unicode characters
  const cleaned = s
    .replace(/[\\/:\*\?"<>\|]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50);

  return cleaned || 'default';
}

/**
 * Returns human-readable filename, e.g.:
 * class_6_sub_ict.json, class_6_sub_math.json, class_6_free.json
 */
export function getFileName(classGrade: number, category: string, subject?: string): string {
  if (category === 'free') {
    return `class_${classGrade}_free.json`;
  }
  if (category === 'paid') {
    return `class_${classGrade}_paid.json`;
  }
  const safeSub = subject ? getSubjectSlug(subject) : 'default';
  return `class_${classGrade}_sub_${safeSub}.json`;
}

/**
 * Automatically scans the data/quiz-questions directory and renames any
 * old hex-encoded files (e.g. class_6_sub_494354.json) into human-readable
 * subject files (e.g. class_6_sub_ict.json).
 */
export function migrateExistingQuestionsDir() {
  try {
    ensureDirExists();
    const files = fs.readdirSync(QUESTIONS_DIR);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      if (!file.startsWith('class_') || !file.includes('_sub_')) continue;

      const oldPath = path.join(QUESTIONS_DIR, file);
      try {
        const raw = fs.readFileSync(oldPath, 'utf-8');
        const data = JSON.parse(raw);
        const classGrade = Number(data?.classGrade) || 6;
        const subjName = data?.subject || data?.sourceKey;

        if (subjName) {
          const newSlug = getSubjectSlug(subjName);
          const newFileName = `class_${classGrade}_sub_${newSlug}.json`;
          const newPath = path.join(QUESTIONS_DIR, newFileName);

          if (file !== newFileName) {
            fs.writeFileSync(newPath, JSON.stringify(data, null, 2), 'utf-8');
            try {
              fs.unlinkSync(oldPath);
            } catch {}
            console.log(`[QUIZ FILE RENAME] Successfully migrated "${file}" -> "${newFileName}"`);
          }
        }
      } catch (err) {
        console.error(`[QUIZ FILE RENAME] Error processing "${file}":`, err);
      }
    }
  } catch (err) {
    console.error('[QUIZ FILE RENAME] Directory scan failed:', err);
  }
}

// Auto-run migration whenever this module is loaded
try {
  migrateExistingQuestionsDir();
} catch {}

export function readQuestionsFromFile(
  filePath: string,
  classGrade?: number,
  category?: string,
  subject?: string
): RawQuestion[] {
  try {
    // 1. Direct file check
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
    }

    // 2. Fallback check for old hex or alternate filenames
    if (classGrade && subject && category === 'subject') {
      const oldHex = Buffer.from(subject.trim()).toString('hex');
      const oldHexPath = path.join(QUESTIONS_DIR, `class_${classGrade}_sub_${oldHex}.json`);
      if (fs.existsSync(oldHexPath)) {
        const raw = fs.readFileSync(oldHexPath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Save to new clean path and remove old hex
        try {
          fs.writeFileSync(filePath, raw, 'utf-8');
          fs.unlinkSync(oldHexPath);
        } catch {}
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
      }
    }
  } catch (err) {
    console.error('Failed to read questions from file:', filePath, err);
  }
  return [];
}

export function writeQuestionsToFile(filePath: string, data: any): void {
  ensureDirExists();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Returns unique database key for a question bank
 */
export function getQuizQuestionsDbKey(classGrade: number, category: string, subject?: string): string {
  const safeSub = subject ? getSubjectSlug(subject) : 'default';
  return `quiz_qs_${classGrade}_${category}_${safeSub}`;
}

/**
 * Retrieves questions with Database-first strategy, falling back to local seed file.
 */
export async function getQuestionsFromDb(
  classGrade: number,
  category: string,
  subject?: string
): Promise<RawQuestion[]> {
  const dbKey = getQuizQuestionsDbKey(classGrade, category, subject);
  try {
    const dbData = await getDbSetting<any>(dbKey, null);
    if (dbData) {
      if (Array.isArray(dbData) && dbData.length > 0) return dbData;
      if (Array.isArray(dbData.questions) && dbData.questions.length > 0) {
        return dbData.questions;
      }
    }
  } catch (err) {
    console.error(`Failed to read questions from DB for ${dbKey}:`, err);
  }

  // Fallback to reading from local file
  const fileName = getFileName(classGrade, category, subject);
  const filePath = path.join(QUESTIONS_DIR, fileName);
  const fileQuestions = readQuestionsFromFile(filePath, classGrade, category, subject);

  // If local questions found and not yet in DB, asynchronously seed them to DB
  if (fileQuestions.length > 0) {
    setDbSetting(dbKey, {
      classGrade,
      category,
      subject: subject || null,
      updatedAt: new Date().toISOString(),
      questions: fileQuestions,
    }).catch(() => {});
  }

  return fileQuestions;
}

/**
 * Persists questions to PostgreSQL Database (and secondary file backup).
 */
export async function saveQuestionsToDb(
  classGrade: number,
  category: string,
  subject: string | undefined,
  payload: { questions: RawQuestion[]; [key: string]: any }
): Promise<void> {
  const dbKey = getQuizQuestionsDbKey(classGrade, category, subject);

  // 1. Primary Save to PostgreSQL Database
  await setDbSetting(dbKey, payload);

  // 2. Secondary local file fallback
  try {
    const fileName = getFileName(classGrade, category, subject);
    const filePath = path.join(QUESTIONS_DIR, fileName);
    writeQuestionsToFile(filePath, payload);
  } catch {}
}

