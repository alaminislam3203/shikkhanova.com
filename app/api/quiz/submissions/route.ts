import { NextRequest, NextResponse } from 'next/server';
import {
  getQuizSubmissions,
  saveQuizSubmission,
  deleteQuizSubmission,
  clearQuizSubmissions,
  QuizSubmission,
} from '@/lib/quizExamStorage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classGradeParam = searchParams.get('classGrade');
    const subject = searchParams.get('subject') || undefined;
    const examId = searchParams.get('examId') || undefined;
    const search = searchParams.get('search') || undefined;

    const classGrade = classGradeParam ? parseInt(classGradeParam, 10) : undefined;

    const submissions = getQuizSubmissions({
      classGrade,
      subject,
      examId,
      search,
    });

    // Summary statistics
    const totalCount = submissions.length;
    let avgScore = 0;
    let avgPercentage = 0;
    let passCount = 0; // >= 40%

    if (totalCount > 0) {
      const sumPercentage = submissions.reduce((acc, s) => acc + (s.percentage || 0), 0);
      avgPercentage = Math.round(sumPercentage / totalCount);
      passCount = submissions.filter((s) => (s.percentage || 0) >= 40).length;
    }

    return NextResponse.json({
      submissions,
      stats: {
        totalSubmissions: totalCount,
        avgPercentage,
        passCount,
        failCount: totalCount - passCount,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      examId,
      examTitle,
      classGrade,
      subject,
      studentName,
      rollNumber,
      score,
      total,
      timeTakenSeconds,
    } = body;

    if (!studentName || score === undefined || !total) {
      return NextResponse.json(
        { error: 'শিক্ষার্থীর নাম এবং স্কোর প্রদান করা আবশ্যক।' },
        { status: 400 }
      );
    }

    const totalQuestions = Number(total);
    const scored = Number(score);
    const percentage = totalQuestions > 0 ? Math.round((scored / totalQuestions) * 100) : 0;

    let medal = '⭐ Top 10';
    if (percentage === 100) medal = '🥇 Gold';
    else if (percentage >= 80) medal = '🥈 Silver';
    else if (percentage >= 60) medal = '🥉 Bronze';

    const submission: QuizSubmission = {
      id: `sub_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      examId: examId || 'general_test',
      examTitle: examTitle || 'মডেল টেস্ট',
      classGrade: Number(classGrade) || 6,
      subject: subject || 'সাধারণ',
      studentName: studentName.trim(),
      rollNumber: rollNumber !== undefined && rollNumber !== '' ? String(rollNumber).trim() : undefined,
      score: scored,
      total: totalQuestions,
      percentage,
      timeTakenSeconds: timeTakenSeconds ? Number(timeTakenSeconds) : undefined,
      submittedAt: new Date().toISOString(),
      medal,
    };

    saveQuizSubmission(submission);

    return NextResponse.json({
      success: true,
      message: 'ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে!',
      submission,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ফলাফল সংরক্ষণ ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const examId = searchParams.get('examId');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (id) {
      deleteQuizSubmission(id);
      return NextResponse.json({ success: true, message: 'রেজাল্ট রেকর্ড মুছে ফেলা হয়েছে।' });
    }

    if (clearAll) {
      clearQuizSubmissions(examId || undefined);
      return NextResponse.json({
        success: true,
        message: examId ? 'এই পরীক্ষার সকল ফলাফল পরিষ্কার করা হয়েছে।' : 'সকল ফলাফল পরিষ্কার করা হয়েছে।',
      });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}

