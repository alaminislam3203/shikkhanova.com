import 'dotenv/config';
import { PrismaClient, Role, PaymentMethod, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  // 3. Seed PDF Materials
  const pdf1 = await prisma.pdfMaterial.create({
    data: {
      title: '৭ম শ্রেণি গণিত ১ম সাময়িক স্পেশাল হ্যান্ডনোট ও সূত্রাবলি',
      description: 'বীজগণিতীয় রাশি, জ্যামিতির বেসিক ও অধ্যায়ভিত্তিক সৃজনশীল সমাধান।',
      classGrade: 7,
      subject: 'গণিত (Mathematics)',
      price: 50,
      fileUrl: '/assets/pdfs/class-7-math-special.pdf',
    },
  });

  const pdf2 = await prisma.pdfMaterial.create({
    data: {
      title: '৮ম শ্রেণি সাধারণ বিজ্ঞান ফাইনাল মডেল টেস্ট ও সাজেশন',
      description: 'পদার্থের প্রকৃতি, জীব ও পরিবেশ অধ্যায়ের ১০০% কমন উপযোগী প্রশ্নাবলি।',
      classGrade: 8,
      subject: 'বিজ্ঞান (Science)',
      price: 60,
      fileUrl: '/assets/pdfs/class-8-science.pdf',
    },
  });

  const pdf3 = await prisma.pdfMaterial.create({
    data: {
      title: '৯ম-১০ম শ্রেণি পদার্থবিজ্ঞান গাণিতিক সমস্যার সহজ সমাধান',
      description: 'গতি ও বল অধ্যায়ের সকল গাণিতিক সূত্র ও শর্টকাট টেকনিক।',
      classGrade: 9,
      subject: 'পদার্থবিজ্ঞান (Physics)',
      price: 80,
      fileUrl: '/assets/pdfs/class-9-physics.pdf',
    },
  });

  // 4. Seed Exam Results
  await prisma.examResult.create({
    data: {
      examTitle: 'মাসিক মূল্যায়ন ও মডেল টেস্ট',
      classGrade: 7,
      rollNumber: 1,
      studentName: 'রাকিবুল হাসান',
      totalMarks: 400,
      obtainedMarks: 368,
      grade: 'A+',
      gpa: 5.00,
      subjectMarks: JSON.stringify([
        { subject: 'বাংলা (Bangla)', fullMarks: 100, obtained: 92, grade: 'A+', gpa: 5.00 },
        { subject: 'ইংরেজি (English)', fullMarks: 100, obtained: 88, grade: 'A+', gpa: 5.00 },
        { subject: 'গণিত (Mathematics)', fullMarks: 100, obtained: 96, grade: 'A+', gpa: 5.00 },
        { subject: 'সাধারণ বিজ্ঞান (Science)', fullMarks: 100, obtained: 92, grade: 'A+', gpa: 5.00 },
      ]),
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

