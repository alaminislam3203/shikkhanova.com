import fs from 'fs';
import path from 'path';
import { RawQuestion } from './defaultQuizData';
import { readSubjectQuestions } from './quizStorage';
import { getDbSetting, setDbSetting } from './dbSettings';

export interface CustomExam {
  id: string;
  title: string;
  subtitle?: string;
  classGrade: number; // 5 to 10
  subject: string;
  examCode?: string; // e.g. "TEST10" or empty
  durationMinutes: number; // e.g. 20
  questionCount: number; // e.g. 25
  sourceType: 'auto_bank' | 'custom';
  questions?: RawQuestion[];
  isActive: boolean;
  createdAt: string;
  isPaid?: boolean;
  price?: number;
  badge?: string;
  coverImage?: string;
}

export interface QuizSubmission {
  id: string;
  examId: string;
  examTitle: string;
  classGrade: number;
  subject: string;
  studentName: string;
  rollNumber?: string | number;
  score: number;
  total: number;
  percentage: number;
  timeTakenSeconds?: number;
  submittedAt: string;
  medal?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CUSTOM_EXAMS_FILE = path.join(DATA_DIR, 'custom_exams.json');
const QUIZ_SUBMISSIONS_FILE = path.join(DATA_DIR, 'quiz_submissions.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ─── CUSTOM EXAMS ───

export function getCustomExams(): CustomExam[] {
  ensureDataDir();
  try {
    if (fs.existsSync(CUSTOM_EXAMS_FILE)) {
      const raw = fs.readFileSync(CUSTOM_EXAMS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading custom_exams.json:', err);
  }

  // Default seed exams if file doesn't exist yet
  const defaults: CustomExam[] = [
    {
      id: 'exam_class6_math_weekly',
      title: '৬ষ্ঠ শ্রেণি গণিত সাপ্তাহিক মূল্যায়ন টেস্ট',
      subtitle: 'প্রথম অধ্যায়ের মৌলিক ধারণা ও বহুনির্বাচনী প্রশ্ন',
      classGrade: 6,
      subject: 'গণিত',
      examCode: '',
      durationMinutes: 20,
      questionCount: 20,
      sourceType: 'auto_bank',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exam_class6_ict_special',
      title: '৬ষ্ঠ শ্রেণি ICT স্পেশাল কুইজ ২০২৬',
      subtitle: 'তথ্য ও যোগাযোগ প্রযুক্তি অধ্যায়ভিত্তিক প্রস্তুতি',
      classGrade: 6,
      subject: 'ICT',
      examCode: '',
      durationMinutes: 15,
      questionCount: 15,
      sourceType: 'auto_bank',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  saveCustomExams(defaults);
  return defaults;
}

export async function getCustomExamsFromDb(): Promise<CustomExam[]> {
  try {
    const dbData = await getDbSetting<CustomExam[] | null>('custom_exams', null);
    if (Array.isArray(dbData) && dbData.length > 0) {
      return dbData;
    }
  } catch {}

  // Fallback to initial seed
  const fallback = getCustomExams();
  try {
    await setDbSetting('custom_exams', fallback);
  } catch {}
  return fallback;
}

export async function saveCustomExamsToDb(exams: CustomExam[]): Promise<void> {
  await setDbSetting('custom_exams', exams);
}

export function saveCustomExams(exams: CustomExam[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(CUSTOM_EXAMS_FILE, JSON.stringify(exams, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing custom_exams.json:', err);
  }
}

export function getExamQuestions(exam: CustomExam): RawQuestion[] {
  if (exam.sourceType === 'custom' && Array.isArray(exam.questions) && exam.questions.length > 0) {
    return exam.questions;
  }

  // Pick from question bank
  const bank = readSubjectQuestions(exam.classGrade, exam.subject);
  if (bank.length === 0) return [];

  // Shuffle and slice
  const count = exam.questionCount || 20;
  if (bank.length <= count) return bank;

  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ─── QUIZ SUBMISSIONS ───

export function getQuizSubmissions(filters?: {
  classGrade?: number;
  subject?: string;
  examId?: string;
  search?: string;
  sortBy?: 'rank' | 'recent';
}): QuizSubmission[] {
  ensureDataDir();
  try {
    if (fs.existsSync(QUIZ_SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(QUIZ_SUBMISSIONS_FILE, 'utf-8');
      let list: QuizSubmission[] = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];

      if (filters) {
        if (filters.classGrade) {
          list = list.filter((s) => s.classGrade === filters.classGrade);
        }
        if (filters.subject && filters.subject !== 'all') {
          const subLower = filters.subject.toLowerCase();
          list = list.filter((s) => (s.subject || '').toLowerCase().includes(subLower));
        }
        if (filters.examId && filters.examId !== 'all') {
          list = list.filter((s) => s.examId === filters.examId);
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            (s) =>
              (s.studentName || '').toLowerCase().includes(q) ||
              String(s.rollNumber || '').toLowerCase().includes(q) ||
              (s.examTitle || '').toLowerCase().includes(q)
          );
        }
      }

      // Sort: if 'recent', sort by newest; otherwise default to 'rank' (highest score/percentage, least time)
      if (filters?.sortBy === 'recent') {
        list.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      } else {
        list.sort((a, b) => {
          const pctA = typeof a.percentage === 'number' ? a.percentage : 0;
          const pctB = typeof b.percentage === 'number' ? b.percentage : 0;
          if (pctB !== pctA) return pctB - pctA;

          const scA = typeof a.score === 'number' ? a.score : 0;
          const scB = typeof b.score === 'number' ? b.score : 0;
          if (scB !== scA) return scB - scA;

          const timeA = typeof a.timeTakenSeconds === 'number' && a.timeTakenSeconds > 0 ? a.timeTakenSeconds : 999999;
          const timeB = typeof b.timeTakenSeconds === 'number' && b.timeTakenSeconds > 0 ? b.timeTakenSeconds : 999999;
          if (timeA !== timeB) return timeA - timeB;

          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        });
      }

      return list;
    }
  } catch (err) {
    console.error('Error reading quiz_submissions.json:', err);
  }
  return [];
}

export function saveQuizSubmission(sub: QuizSubmission): QuizSubmission {
  ensureDataDir();
  let list: QuizSubmission[] = [];
  try {
    if (fs.existsSync(QUIZ_SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(QUIZ_SUBMISSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {}

  // Prepend new submission
  list.unshift(sub);

  // Keep last 1000 submissions
  if (list.length > 1000) {
    list = list.slice(0, 1000);
  }

  try {
    fs.writeFileSync(QUIZ_SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving quiz submission:', err);
  }

  return sub;
}

export function deleteQuizSubmission(id: string): boolean {
  ensureDataDir();
  try {
    if (fs.existsSync(QUIZ_SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(QUIZ_SUBMISSIONS_FILE, 'utf-8');
      let list: QuizSubmission[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        list = list.filter((s) => s.id !== id);
        fs.writeFileSync(QUIZ_SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
        return true;
      }
    }
  } catch (err) {
    console.error('Error deleting quiz submission:', err);
  }
  return false;
}

export function clearQuizSubmissions(examId?: string): boolean {
  ensureDataDir();
  try {
    if (examId) {
      if (fs.existsSync(QUIZ_SUBMISSIONS_FILE)) {
        const raw = fs.readFileSync(QUIZ_SUBMISSIONS_FILE, 'utf-8');
        let list: QuizSubmission[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          list = list.filter((s) => s.examId !== examId);
          fs.writeFileSync(QUIZ_SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
          return true;
        }
      }
    } else {
      fs.writeFileSync(QUIZ_SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return true;
    }
  } catch (err) {
    console.error('Error clearing quiz submissions:', err);
  }
  return false;
}

