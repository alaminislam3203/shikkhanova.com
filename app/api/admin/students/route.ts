import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { getStudentProfile, saveStudentProfile } from '@/lib/studentProfiles';

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  classGrade: number;
  rollNumber: number;
  fatherName?: string;
  motherName?: string;
  schoolName?: string;
  dateOfBirth?: string;
  image?: string | null;
  createdAt?: string;
}

const DEFAULT_STUDENTS_SEED: Array<{
  classGrade: number;
  rollNumber: number;
  name: string;
  phone: string;
}> = [
  // Class 5
  { classGrade: 5, rollNumber: 1, name: 'আরিফুল ইসলাম', phone: '01711000501' },
  { classGrade: 5, rollNumber: 2, name: 'সাদিয়া সুলতানা', phone: '01711000502' },
  { classGrade: 5, rollNumber: 3, name: 'তানভীর আহমেদ', phone: '01711000503' },
  { classGrade: 5, rollNumber: 4, name: 'নুসরাত জাহান', phone: '01711000504' },
  { classGrade: 5, rollNumber: 5, name: 'মাহমুদুল হাসান', phone: '01711000505' },
  // Class 6
  { classGrade: 6, rollNumber: 1, name: 'রাকিবুল হাসান', phone: '01711000601' },
  { classGrade: 6, rollNumber: 2, name: 'তানজিলা আক্তার', phone: '01711000602' },
  { classGrade: 6, rollNumber: 3, name: 'নাজমুল হুদা', phone: '01711000603' },
  { classGrade: 6, rollNumber: 4, name: 'সুমাইয়া জাহান', phone: '01711000604' },
  { classGrade: 6, rollNumber: 5, name: 'জাহিদ হাসান', phone: '01711000605' },
  // Class 7
  { classGrade: 7, rollNumber: 1, name: 'হাসিবুর রহমান', phone: '01711000701' },
  { classGrade: 7, rollNumber: 2, name: 'ফাতেমা তুজ জোহরা', phone: '01711000702' },
  { classGrade: 7, rollNumber: 3, name: 'ইমরান হোসেন', phone: '01711000703' },
  { classGrade: 7, rollNumber: 4, name: 'জান্নাতুল ফেরদৌস', phone: '01711000704' },
  { classGrade: 7, rollNumber: 5, name: 'মেহেদী হাসান', phone: '01711000705' },
  // Class 8
  { classGrade: 8, rollNumber: 1, name: 'শাকিল আহমেদ', phone: '01711000801' },
  { classGrade: 8, rollNumber: 2, name: 'তাসনিম আক্তার', phone: '01711000802' },
  { classGrade: 8, rollNumber: 3, name: 'রায়হান কবীর', phone: '01711000803' },
  { classGrade: 8, rollNumber: 4, name: 'আয়েশা সিদ্দিকা', phone: '01711000804' },
  { classGrade: 8, rollNumber: 5, name: 'সোহানুর রহমান', phone: '01711000805' },
  // Class 9
  { classGrade: 9, rollNumber: 1, name: 'আব্দুল্লাহ আল মামুন', phone: '01711000901' },
  { classGrade: 9, rollNumber: 2, name: 'মালিহা তাবাসসুম', phone: '01711000902' },
  { classGrade: 9, rollNumber: 3, name: 'সাব্বির হোসেন', phone: '01711000903' },
  { classGrade: 9, rollNumber: 4, name: 'হুমায়রা আনজুম', phone: '01711000904' },
  { classGrade: 9, rollNumber: 5, name: 'নাফিস ইকবাল', phone: '01711000905' },
  // Class 10
  { classGrade: 10, rollNumber: 1, name: 'তাওহীদুল ইসলাম', phone: '01711001001' },
  { classGrade: 10, rollNumber: 2, name: 'সামিয়া রহমান', phone: '01711001002' },
  { classGrade: 10, rollNumber: 3, name: 'আশরাফুল আলম', phone: '01711001003' },
  { classGrade: 10, rollNumber: 4, name: 'নাদিয়া সুলতানা', phone: '01711001004' },
  { classGrade: 10, rollNumber: 5, name: 'রেদওয়ান আহমেদ', phone: '01711001005' },
];

const DATA_FILE = path.join(process.cwd(), 'data', 'students.json');

function readLocalStudents(): StudentRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_STUDENTS_SEED.map((s) => ({
    id: `std-c${s.classGrade}-r${s.rollNumber}`,
    name: s.name,
    email: `c${s.classGrade}.roll${s.rollNumber}@shikkhanova.com`,
    phone: s.phone,
    classGrade: s.classGrade,
    rollNumber: s.rollNumber,
  }));
}

function writeLocalStudents(students: StudentRecord[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf8');
  } catch {}
}

async function ensureSeedStudents() {
  try {
    const count = await prisma.user.count({
      where: { role: 'STUDENT' },
    });

    if (count === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      for (const s of DEFAULT_STUDENTS_SEED) {
        const email = `c${s.classGrade}.roll${s.rollNumber}@shikkhanova.com`;
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            name: s.name,
            email,
            password: hashedPassword,
            phone: s.phone,
            role: 'STUDENT',
            classGrade: s.classGrade,
            rollNumber: s.rollNumber,
          },
        });
      }
    }
    return true;
  } catch (err) {
    console.warn('Database student seed skipped, falling back to local:', err);
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classGradeParam = searchParams.get('classGrade');
  const filterClass =
    classGradeParam && classGradeParam !== 'all' ? Number(classGradeParam) : null;

  const dbOk = await ensureSeedStudents();
  if (dbOk) {
    try {
      const whereClause: any = { role: 'STUDENT' };
      if (filterClass) {
        whereClause.classGrade = filterClass;
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: [{ classGrade: 'asc' }, { rollNumber: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          classGrade: true,
          rollNumber: true,
          image: true,
          createdAt: true,
        },
      });

      const students: StudentRecord[] = users.map((u) => {
        const prof = getStudentProfile(u.classGrade || 7, u.rollNumber || 1, u.email);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          classGrade: u.classGrade || 7,
          rollNumber: u.rollNumber || 1,
          fatherName: prof.fatherName,
          motherName: prof.motherName,
          schoolName: prof.schoolName,
          dateOfBirth: prof.dateOfBirth,
          image: u.image,
          createdAt: u.createdAt.toISOString(),
        };
      });

      return NextResponse.json({ students });
    } catch (err) {
      console.warn('GET /api/admin/students fallback:', err);
    }
  }

  let local = readLocalStudents();
  if (filterClass) {
    local = local.filter((s) => Number(s.classGrade) === filterClass);
  }
  local = local.map((s) => {
    const prof = getStudentProfile(s.classGrade, s.rollNumber, s.email);
    return {
      ...s,
      fatherName: s.fatherName || prof.fatherName,
      motherName: s.motherName || prof.motherName,
      schoolName: s.schoolName || prof.schoolName,
      dateOfBirth: s.dateOfBirth || prof.dateOfBirth,
    };
  });
  local.sort((a, b) => a.classGrade - b.classGrade || a.rollNumber - b.rollNumber);
  return NextResponse.json({ students: local });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || '').trim();
    const classGrade = Number(body.classGrade) || 7;
    const rollNumber = Number(body.rollNumber) || 1;
    const phone = (body.phone || '').trim();
    const rawEmail = (body.email || '').trim().toLowerCase();
    const rawPassword = (body.password || '123456').trim() || '123456';

    if (!name) {
      return NextResponse.json(
        { error: 'শিক্ষার্থীর নাম প্রদান করা আবশ্যক' },
        { status: 400 }
      );
    }

    const email =
      rawEmail ||
      `c${classGrade}.roll${rollNumber}.${Date.now().toString().slice(-4)}@shikkhanova.com`;

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    try {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      const finalEmail = existingEmail
        ? `c${classGrade}.roll${rollNumber}.${Date.now().toString().slice(-5)}@shikkhanova.com`
        : email;

      const created = await prisma.user.create({
        data: {
          name,
          email: finalEmail,
          password: hashedPassword,
          phone: phone || null,
          role: 'STUDENT',
          classGrade,
          rollNumber,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          classGrade: true,
          rollNumber: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        student: {
          id: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone || '',
          classGrade: created.classGrade || classGrade,
          rollNumber: created.rollNumber || rollNumber,
        },
        message: 'নতুন শিক্ষার্থী সফলভাবে যোগ করা হয়েছে',
      });
    } catch (dbErr) {
      console.warn('POST /api/admin/students fallback to local:', dbErr);
    }

    const local = readLocalStudents();
    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      name,
      email,
      phone,
      classGrade,
      rollNumber,
    };
    local.push(newStudent);
    writeLocalStudents(local);

    return NextResponse.json({
      student: newStudent,
      message: 'নতুন শিক্ষার্থী সফলভাবে যোগ করা হয়েছে',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'শিক্ষার্থী যোগ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = (body.id || '').trim();
    const name = (body.name || '').trim();
    const classGrade = Number(body.classGrade) || 7;
    const rollNumber = Number(body.rollNumber) || 1;
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const newPassword = (body.password || '').trim();

    if (!id || !name) {
      return NextResponse.json(
        { error: 'শিক্ষার্থীর আইডি এবং নাম আবশ্যক' },
        { status: 400 }
      );
    }

    try {
      const updateData: any = {
        name,
        classGrade,
        rollNumber,
        phone: phone || null,
      };
      if (email) {
        updateData.email = email;
      }
      if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          classGrade: true,
          rollNumber: true,
        },
      });

      return NextResponse.json({
        student: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone || '',
          classGrade: updated.classGrade || classGrade,
          rollNumber: updated.rollNumber || rollNumber,
        },
        message: 'শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে',
      });
    } catch (dbErr) {
      console.warn('PATCH /api/admin/students fallback:', dbErr);
    }

    const local = readLocalStudents();
    const idx = local.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'শিক্ষার্থী খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }
    local[idx] = {
      ...local[idx],
      name,
      classGrade,
      rollNumber,
      phone,
      email: email || local[idx].email,
    };
    writeLocalStudents(local);

    return NextResponse.json({
      student: local[idx],
      message: 'শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'শিক্ষার্থীর আইডি আবশ্যক' }, { status: 400 });
    }

    try {
      await prisma.user.delete({ where: { id } });
      return NextResponse.json({ message: 'শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে' });
    } catch (dbErr) {
      console.warn('DELETE /api/admin/students fallback:', dbErr);
    }

    const local = readLocalStudents();
    const filtered = local.filter((s) => s.id !== id);
    writeLocalStudents(filtered);

    return NextResponse.json({ message: 'শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

