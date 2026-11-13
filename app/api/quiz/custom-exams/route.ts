import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomExams,
  saveCustomExams,
  getExamQuestions,
  CustomExam,
} from '@/lib/quizExamStorage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const classGrade = searchParams.get('classGrade');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    let exams = getCustomExams();

    if (id) {
      const exam = exams.find((e) => e.id === id);
      if (!exam) {
        return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
      }
      const questions = getExamQuestions(exam);
      return NextResponse.json({ exam, questions });
    }

    if (classGrade) {
      const grade = parseInt(classGrade, 10);
      exams = exams.filter((e) => e.classGrade === grade);
    }

    if (activeOnly) {
      exams = exams.filter((e) => e.isActive);
    }

    return NextResponse.json({ exams });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      subtitle,
      classGrade,
      subject,
      examCode,
      durationMinutes,
      questionCount,
      sourceType,
      questions,
      isActive,
    } = body;

    if (!title || !classGrade || !subject) {
      return NextResponse.json(
        { error: 'পরীক্ষার নাম, শ্রেণি এবং বিষয় আবশ্যক।' },
        { status: 400 }
      );
    }

    let exams = getCustomExams();
    const examId = id || `exam_${Date.now()}`;

    const newExam: CustomExam = {
      id: examId,
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      classGrade: Number(classGrade),
      subject: subject.trim(),
      examCode: examCode ? examCode.trim().toUpperCase() : '',
      durationMinutes: Number(durationMinutes) || 20,
      questionCount: Number(questionCount) || 20,
      sourceType: sourceType === 'custom' ? 'custom' : 'auto_bank',
      questions: Array.isArray(questions) ? questions : undefined,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = exams.findIndex((e) => e.id === examId);
    if (existingIndex >= 0) {
      exams[existingIndex] = { ...exams[existingIndex], ...newExam };
    } else {
      exams.unshift(newExam);
    }

    saveCustomExams(exams);

    return NextResponse.json({
      success: true,
      message: 'কাস্টম পরীক্ষা সফলভাবে সংরক্ষণ করা হয়েছে!',
      exam: newExam,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'পরীক্ষা সংরক্ষণ ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    let exams = getCustomExams();
    exams = exams.filter((e) => e.id !== id);
    saveCustomExams(exams);

    return NextResponse.json({
      success: true,
      message: 'পরীক্ষাটি সফলভাবে মুছে ফেলা হয়েছে।',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete exam' },
      { status: 500 }
    );
  }
}

