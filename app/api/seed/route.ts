import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const log: string[] = [];

  try {
    // 1. Read students from data/students.json
    const studentsPath = path.join(process.cwd(), 'data', 'students.json');
    let localStudents: any[] = [];
    if (fs.existsSync(studentsPath)) {
      localStudents = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));
    }

    log.push(`Found ${localStudents.length} local students to seed.`);

    const hashedPassword = await bcrypt.hash('123456', 10);
    let seededStudents = 0;

    for (const s of localStudents) {
      try {
        await prisma.user.upsert({
          where: { email: s.email },
          update: {
            name: s.name,
            phone: s.phone,
            classGrade: s.classGrade,
            rollNumber: s.rollNumber,
          },
          create: {
            name: s.name,
            email: s.email,
            password: hashedPassword,
            phone: s.phone,
            role: 'STUDENT',
            classGrade: s.classGrade,
            rollNumber: s.rollNumber,
          },
        });
        seededStudents++;
      } catch (err: any) {
        log.push(`Failed student ${s.email}: ${err.message}`);
      }
    }

    log.push(`Successfully seeded ${seededStudents} students into PostgreSQL.`);

    // 2. Read results from data/results.json
    const resultsPath = path.join(process.cwd(), 'data', 'results.json');
    let localResults: any[] = [];
    if (fs.existsSync(resultsPath)) {
      localResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    }

    log.push(`Found ${localResults.length} local results to seed.`);

    let seededResults = 0;
    for (const r of localResults) {
      try {
        await prisma.examResult.upsert({
          where: { id: r.id },
          update: {
            examTitle: r.examTitle,
            classGrade: r.classGrade,
            rollNumber: r.rollNumber,
            studentName: r.studentName,
            totalMarks: r.totalMarks,
            obtainedMarks: r.obtainedMarks,
            grade: r.grade,
            gpa: r.gpa,
            subjectMarks: r.subjectMarks,
          },
          create: {
            id: r.id,
            examTitle: r.examTitle,
            classGrade: r.classGrade,
            rollNumber: r.rollNumber,
            studentName: r.studentName,
            totalMarks: r.totalMarks,
            obtainedMarks: r.obtainedMarks,
            grade: r.grade,
            gpa: r.gpa,
            subjectMarks: r.subjectMarks,
          },
        });
        seededResults++;
      } catch (err: any) {
        log.push(`Failed result ${r.id}: ${err.message}`);
      }
    }

    log.push(`Successfully seeded ${seededResults} exam results into PostgreSQL.`);

    // Count in PostgreSQL
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalExamResults = await prisma.examResult.count();

    return NextResponse.json({
      success: true,
      log,
      databaseCounts: {
        totalUsers,
        totalStudents,
        totalExamResults,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        log,
      },
      { status: 500 }
    );
  }
}

