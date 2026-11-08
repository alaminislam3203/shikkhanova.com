import fs from 'fs';
import path from 'path';
import { PrismaClient, Role, PaymentMethod, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Native .env parser without requiring external 'dotenv' package
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...rest] = trimmed.split('=');
        if (key && rest.length > 0 && !process.env[key.trim()]) {
          let val = rest.join('=').trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          process.env[key.trim()] = val;
        }
      }
    });
  }
} catch {
  // Ignore fallback
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ShikkhaNova database...');

  // 1. Seed Master Admin
  const adminPassword = await bcrypt.hash('RABIUL@20', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'robiulnil101@gmail.com' },
    update: {},
    create: {
      name: 'শিক্ষানোভা পরিচালক (Admin)',
      email: 'robiulnil101@gmail.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '01712592519',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Seed Sample Students for Class 7
  const studentPassword = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'rakibul@gmail.com' },
    update: {},
    create: {
      name: 'রাকিবুল হাসান',
      email: 'rakibul@gmail.com',
      password: studentPassword,
      role: Role.STUDENT,
      classGrade: 7,
      rollNumber: 1,
      phone: '01711223344',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'sadia@gmail.com' },
    update: {},
    create: {
      name: 'সাদিয়া সুলতানা',
      email: 'sadia@gmail.com',
      password: studentPassword,
      role: Role.STUDENT,
      classGrade: 9,
      rollNumber: 2,
      phone: '01899887766',
    },
  });

  // 3. Seed Sample PDF Materials
  const pdf1 = await prisma.pdfMaterial.upsert({
    where: { id: 'seed-pdf-1' },
    update: {},
    create: {
      id: 'seed-pdf-1',
      title: '৭ম শ্রেণি গণিত ১ম সাময়িক স্পেশাল হ্যান্ডনোট ও সূত্রাবলি',
      description: 'বীজগণিতীয় রাশি, জ্যামিতির বেসিক ও অধ্যায়ভিত্তিক সৃজনশীল সমাধান।',
      classGrade: 7,
      subject: 'গণিত (Mathematics)',
      price: 50,
      fileUrl: '/assets/pdfs/class-7-math-special.pdf',
    },
  });

  const pdf2 = await prisma.pdfMaterial.upsert({
    where: { id: 'seed-pdf-2' },
    update: {},
    create: {
      id: 'seed-pdf-2',
      title: '৮ম শ্রেণি সাধারণ বিজ্ঞান ফাইনাল মডেল টেস্ট ও সাজেশন',
      description: 'পদার্থের প্রকৃতি, জীব ও পরিবেশ অধ্যায়ের পূর্ণাঙ্গ ব্যাখ্যাসহ সৃজনশীল প্রশ্নব্যাংক।',
      classGrade: 8,
      subject: 'বিজ্ঞান (Science)',
      price: 60,
      fileUrl: '/assets/pdfs/class-8-science-special.pdf',
    },
  });

  const pdf3 = await prisma.pdfMaterial.upsert({
    where: { id: 'seed-pdf-3' },
    update: {},
    create: {
      id: 'seed-pdf-3',
      title: '৯ম শ্রেণি পদার্থবিজ্ঞান গাণিতিক সমস্যা ও সূত্রাবলি',
      description: 'গতি, বল ও কাজ-ক্ষমতা-শক্তি অধ্যায়ের শতভাগ কমন উপযোগী হ্যান্ডনোট।',
      classGrade: 9,
      subject: 'পদার্থবিজ্ঞান',
      price: 80,
      fileUrl: '/assets/pdfs/class-9-physics-special.pdf',
    },
  });

  // 4. Seed Sample Exam Results
  await prisma.examResult.upsert({
    where: { id: 'res-seed-1' },
    update: {},
    create: {
      id: 'res-seed-1',
      studentId: student1.id,
      examTitle: '১ম সাময়িক মূল্যায়ন পরীক্ষা ২০২৬',
      classGrade: 7,
      rollNumber: 1,
      studentName: 'রাকিবুল হাসান',
      totalMarks: 400,
      obtainedMarks: 368,
      grade: 'A+',
      gpa: 5.0,
      subjectMarks: JSON.stringify([
        { subject: 'বাংলা', fullMarks: 100, obtained: 88, grade: 'A+', gpa: 5.0 },
        { subject: 'ইংরেজি', fullMarks: 100, obtained: 86, grade: 'A+', gpa: 5.0 },
        { subject: 'সাধারণ গণিত', fullMarks: 100, obtained: 98, grade: 'A+', gpa: 5.0 },
        { subject: 'সাধারণ বিজ্ঞান', fullMarks: 100, obtained: 96, grade: 'A+', gpa: 5.0 },
      ]),
    },
  });

  // 5. Seed Sample Attendance Record
  await prisma.attendance.create({
    data: {
      studentId: student1.id,
      classGrade: 7,
      rollNumber: 1,
      studentName: 'রাকিবুল হাসান',
      status: 'PRESENT',
      date: new Date(),
    },
  });

  console.log('Database seeded successfully! Ready for production.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
