import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RawQuestion, JUNIOR_SUBJECTS_5_8 } from '@/lib/defaultQuizData';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

import {
  QUESTIONS_DIR,
  SERVER_MCQ_JSON_PATH,
  ensureDirExists,
  getSubjectSlug,
  getFileName,
  migrateExistingQuestionsDir,
  readQuestionsFromFile,
  writeQuestionsToFile,
} from '@/lib/quizStorage';

// Auto-run migration whenever this module is loaded
try {
  migrateExistingQuestionsDir();
} catch {}

// Map raw JSON keys to standardized platform subject names
export function mapSubjectKeyToName(key: string, classGrade: number = 6): string {
  const normalized = key.toLowerCase().trim();
  if (normalized === 'bangla' || normalized === 'bengali') {
    return classGrade === 5 ? 'বাংলা' : 'বাংলা ১ম পত্র';
  }
  if (normalized === 'math' || normalized === 'mathematics') {
    return classGrade === 5 ? 'প্রাথমিক গণিত' : 'গণিত';
  }
  if (normalized === 'science') {
    return classGrade === 5 ? 'প্রাথমিক বিজ্ঞান' : 'বিজ্ঞান';
  }
  if (normalized === 'ict' || normalized === 'information_technology') {
    return classGrade >= 9 ? 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)' : 'ICT';
  }
  if (normalized === 'islam') {
    return 'ইসলাম ও নৈতিক শিক্ষা';
  }
  if (normalized === 'hindu') {
    return 'হিন্দুধর্ম ও নৈতিক শিক্ষা';
  }
  if (normalized === 'bgs' || normalized === 'bangladesh_and_global_studies') {
    return 'বাংলাদেশ ও বিশ্বপরিচয়';
  }
  return key;
}

// Convert mcq_questions.json structure into flat RawQuestion[]
export function parseMcqJsonSubject(subjectData: any): RawQuestion[] {
  const result: RawQuestion[] = [];
  if (!subjectData) return result;

  // Case 1: Structure with tests: [ { qs: [...] } ]
  if (Array.isArray(subjectData.tests)) {
    for (const test of subjectData.tests) {
      if (Array.isArray(test.qs)) {
        for (const item of test.qs) {
          if (!item?.q || !Array.isArray(item?.o)) continue;
          const options: [string, string, string, string] = [
            String(item.o[0] || ''),
            String(item.o[1] || ''),
            String(item.o[2] || ''),
            String(item.o[3] || ''),
          ];
          const ansIndex = typeof item.a === 'number' && item.a >= 0 && item.a <= 3 ? item.a : 0;
          result.push({
            q: String(item.q).trim(),
            options,
            ans: ansIndex,
            explanation: item.e ? String(item.e).trim() : undefined,
          });
        }
      }
    }
  }

  // Case 2: Direct array of questions
  if (Array.isArray(subjectData)) {
    for (const item of subjectData) {
      const q = item.q || item.question;
      const opts = item.options || item.o;
      if (!q || !Array.isArray(opts)) continue;
      const options: [string, string, string, string] = [
        String(opts[0] || ''),
        String(opts[1] || ''),
        String(opts[2] || ''),
        String(opts[3] || ''),
      ];
      const ansIndex = typeof (item.ans ?? item.a) === 'number' ? (item.ans ?? item.a) : 0;
      result.push({
        q: String(q).trim(),
        options,
        ans: ansIndex,
        explanation: (item.explanation || item.e) ? String(item.explanation || item.e).trim() : undefined,
      });
    }
  }

  return result;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = Number(searchParams.get('classGrade')) || 6;
    const category = searchParams.get('category') || 'subject';
    const subject = searchParams.get('subject') || '';
    const action = searchParams.get('action') || '';

    ensureDirExists();
    migrateExistingQuestionsDir();

    // Summary of question counts across subjects for a class
    if (action === 'summary') {
      const summary: Record<string, number> = {};
      const files = fs.readdirSync(QUESTIONS_DIR);

      files.forEach((file) => {
        if (file.startsWith(`class_${classGrade}_sub_`) && file.endsWith('.json')) {
          try {
            const raw = fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf-8');
            const data = JSON.parse(raw);
            const subName = data?.subject;
            const count = Array.isArray(data?.questions) ? data.questions.length : 0;
            if (subName) {
              summary[subName] = count;
            }
          } catch {}
        }
      });

      return NextResponse.json({ summary, classGrade });
    }

    // Single subject/category questions retrieval
    const fileName = getFileName(classGrade, category, subject);
    const filePath = path.join(QUESTIONS_DIR, fileName);
    let questions = readQuestionsFromFile(filePath, classGrade, category, subject);

    // If category is 'free' or 'paid' and file has fewer than 20 questions,
    // construct a balanced board model test from across all available subjects of that class!
    if ((category === 'free' || category === 'paid') && questions.length < 20) {
      try {
        const allSubjectFiles = fs.readdirSync(QUESTIONS_DIR).filter(
          (f) => f.startsWith(`class_${classGrade}_sub_`) && f.endsWith('.json')
        );
        if (allSubjectFiles.length > 0) {
          const aggregated: RawQuestion[] = [];
          const perSubject = Math.max(3, Math.floor(30 / allSubjectFiles.length));
          for (const f of allSubjectFiles) {
            try {
              const raw = fs.readFileSync(path.join(QUESTIONS_DIR, f), 'utf-8');
              const data = JSON.parse(raw);
              const subQs: RawQuestion[] = Array.isArray(data?.questions) ? data.questions : [];
              if (subQs.length > 0) {
                const shuffled = [...subQs].sort(() => 0.5 - Math.random());
                aggregated.push(...shuffled.slice(0, perSubject));
              }
            } catch {}
          }
          if (aggregated.length >= 10) {
            questions = aggregated.sort(() => 0.5 - Math.random()).slice(0, 30);
          }
        }
      } catch {}
    }

    return NextResponse.json(
      {
        classGrade,
        category,
        subject,
        questions,
        total: questions.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'প্রশ্ন লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = (process.env.ADMIN_EMAIL || 'robiulnil101@gmail.com').toLowerCase();
    const isAdmin =
      session?.user?.role === 'ADMIN' ||
      session?.user?.email?.toLowerCase() === adminEmail;

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন প্রশ্ন যুক্ত বা পরিবর্তন করতে পারেন।' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, classGrade = 6, category = 'subject', subject, questions, batch } = body;

    ensureDirExists();
    migrateExistingQuestionsDir();

    // ACTION 1: Import directly from server's data/mcq_questions.json
    if (action === 'import_server_file') {
      if (!fs.existsSync(SERVER_MCQ_JSON_PATH)) {
        return NextResponse.json(
          { error: 'সার্ভারে mcq_questions.json ফাইলটি পাওয়া যায়নি।' },
          { status: 404 }
        );
      }

      const rawJson = fs.readFileSync(SERVER_MCQ_JSON_PATH, 'utf-8');
      const parsedData = JSON.parse(rawJson);

      const targetClass = Number(classGrade) || 6;
      const breakdown: Record<string, number> = {};
      let totalImported = 0;

      for (const [key, val] of Object.entries(parsedData)) {
        const platformSubject = mapSubjectKeyToName(key, targetClass);
        const subQuestions = parseMcqJsonSubject(val);

        if (subQuestions.length > 0) {
          const fileName = getFileName(targetClass, 'subject', platformSubject);
          const filePath = path.join(QUESTIONS_DIR, fileName);

          writeQuestionsToFile(filePath, {
            classGrade: targetClass,
            category: 'subject',
            subject: platformSubject,
            sourceKey: key,
            updatedAt: new Date().toISOString(),
            questions: subQuestions,
          });

          breakdown[platformSubject] = subQuestions.length;
          totalImported += subQuestions.length;
        }
      }

      return NextResponse.json({
        success: true,
        message: `সার্ভার ফাইল থেকে সফলভাবে মোট ${totalImported.toLocaleString('bn-BD')}টি প্রশ্ন ইমপোর্ট করা হয়েছে!`,
        totalImported,
        classGrade: targetClass,
        breakdown,
      });
    }

    // ACTION 2: Batch import of multiple subjects (sent from client uploaded JSON)
    if (batch && typeof batch === 'object') {
      const targetClass = Number(classGrade) || 6;
      const breakdown: Record<string, number> = {};
      let totalImported = 0;

      for (const [keyOrSubject, val] of Object.entries(batch)) {
        let subQuestions: RawQuestion[] = [];
        let platformSubject = keyOrSubject;

        if (Array.isArray(val)) {
          // Already parsed questions array
          subQuestions = val as RawQuestion[];
        } else {
          // Parse raw subject object
          platformSubject = mapSubjectKeyToName(keyOrSubject, targetClass);
          subQuestions = parseMcqJsonSubject(val);
        }

        if (subQuestions.length > 0) {
          const fileName = getFileName(targetClass, 'subject', platformSubject);
          const filePath = path.join(QUESTIONS_DIR, fileName);

          writeQuestionsToFile(filePath, {
            classGrade: targetClass,
            category: 'subject',
            subject: platformSubject,
            updatedAt: new Date().toISOString(),
            questions: subQuestions,
          });

          breakdown[platformSubject] = subQuestions.length;
          totalImported += subQuestions.length;
        }
      }

      return NextResponse.json({
        success: true,
        message: `মোট ${totalImported.toLocaleString('bn-BD')}টি প্রশ্ন সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!`,
        totalImported,
        classGrade: targetClass,
        breakdown,
      });
    }

    // ACTION 3: Single subject or category update
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'প্রশ্নের তালিকা সঠিক নয়।' },
        { status: 400 }
      );
    }

    const targetClass = Number(classGrade) || 6;
    const fileName = getFileName(targetClass, category, subject);
    const filePath = path.join(QUESTIONS_DIR, fileName);

    writeQuestionsToFile(filePath, {
      classGrade: targetClass,
      category,
      subject: subject || null,
      updatedAt: new Date().toISOString(),
      questions,
    });

    return NextResponse.json({
      success: true,
      message: 'প্রশ্ন তালিকা সফলভাবে সংরক্ষণ করা হয়েছে!',
      total: questions.length,
      classGrade: targetClass,
      subject,
    });
  } catch (error: any) {
    console.error('API /api/quiz/questions error:', error);
    return NextResponse.json(
      { error: error.message || 'প্রশ্ন সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

