import fs from 'fs';
import path from 'path';

export interface StudentProfileExtra {
  fatherName?: string;
  motherName?: string;
  schoolName?: string;
  dateOfBirth?: string;
}

const PROFILES_PATH = path.join(process.cwd(), 'data', 'student_profiles.json');

const BENGALI_FATHERS = [
  'মো: রফিকুল ইসলাম',
  'মো: শাহ আলম',
  'মো: আব্দুল মালেক',
  'মো: আনোয়ার হোসেন',
  'মো: নজরুল ইসলাম',
  'মো: গোলাম মোস্তফা',
  'মো: সিরাজুল ইসলাম',
  'মো: আবুল কাশেম',
  'মো: মোস্তাফিজুর রহমান',
  'মো: আমিনুর রশীদ',
];

const BENGALI_MOTHERS = [
  'মোসা: রোকেয়া বেগম',
  'মোসা: শাহানাজ বেগম',
  'মোসা: পারভীন আক্তার',
  'মোসা: নাছিমা খাতুন',
  'মোসা: ফরিদা ইয়াসমিন',
  'মোসা: রেহানা সুলতানা',
  'মোসা: মমতাজ বেগম',
  'মোসা: সালমা আক্তার',
  'মোসা: জাহানারা বেগম',
  'মোসা: রাশেদা পারভীন',
];

const DEFAULT_SCHOOLS = [
  'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
  'নীলফামারী সরকারি বালিকা উচ্চ বিদ্যালয়',
  'নীলফামারী মডেল হাই স্কুল',
  'কালেক্টরেট পাবলিক স্কুল ও কলেজ, নীলফামারী',
  'ছমির উদ্দিন মেমোরিয়াল কলেজ ও স্কুল',
];

function readProfilesFile(): Record<string, StudentProfileExtra> {
  try {
    if (fs.existsSync(PROFILES_PATH)) {
      const raw = fs.readFileSync(PROFILES_PATH, 'utf-8');
      return JSON.parse(raw) || {};
    }
  } catch {}
  return {};
}

function writeProfilesFile(data: Record<string, StudentProfileExtra>) {
  try {
    const dir = path.dirname(PROFILES_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PROFILES_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write student profiles file:', err);
  }
}

export function getStudentProfile(
  classGrade: number,
  rollNumber: number,
  email?: string
): Required<StudentProfileExtra> {
  const all = readProfilesFile();
  const key = `${classGrade}_${rollNumber}`;
  const emailKey = email ? email.toLowerCase().trim() : '';

  const matched = (emailKey && all[emailKey]) || all[key] || {};

  // Deterministic realistic birth year based on class:
  // Class 5 ~ 11 yrs (2015), Class 6 ~ 12 yrs (2014), ..., Class 10 ~ 16 yrs (2010)
  const birthYear = 2026 - (classGrade + 6);
  const birthDay = ((rollNumber * 7) % 28) + 1;
  const birthMonth = ((rollNumber * 3) % 12) + 1;
  const defaultDob = `${String(birthDay).padStart(2, '0')}/${String(birthMonth).padStart(2, '0')}/${birthYear}`;

  const defaultFather = BENGALI_FATHERS[(rollNumber - 1) % BENGALI_FATHERS.length];
  const defaultMother = BENGALI_MOTHERS[(rollNumber - 1) % BENGALI_MOTHERS.length];
  const defaultSchool = DEFAULT_SCHOOLS[(rollNumber + classGrade) % DEFAULT_SCHOOLS.length];

  return {
    fatherName: matched.fatherName?.trim() || defaultFather,
    motherName: matched.motherName?.trim() || defaultMother,
    schoolName: matched.schoolName?.trim() || defaultSchool,
    dateOfBirth: matched.dateOfBirth?.trim() || defaultDob,
  };
}

export function saveStudentProfile(
  classGrade: number,
  rollNumber: number,
  extra: StudentProfileExtra,
  email?: string
) {
  const all = readProfilesFile();
  const key = `${classGrade}_${rollNumber}`;
  const existing = all[key] || {};

  const updated: StudentProfileExtra = {
    ...existing,
    fatherName: extra.fatherName !== undefined ? extra.fatherName : existing.fatherName,
    motherName: extra.motherName !== undefined ? extra.motherName : existing.motherName,
    schoolName: extra.schoolName !== undefined ? extra.schoolName : existing.schoolName,
    dateOfBirth: extra.dateOfBirth !== undefined ? extra.dateOfBirth : existing.dateOfBirth,
  };

  all[key] = updated;
  if (email) {
    all[email.toLowerCase().trim()] = updated;
  }

  writeProfilesFile(all);
  return updated;
}
