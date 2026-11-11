export interface SubjectMarkEntry {
  code?: string;
  subject: string;
  fullMarks: number;
  obtained: number;
  cq?: number;
  mcq?: number;
  grade: string;
  gpa: number;
  isOptional?: boolean;
}

/**
 * Get NCTB standard CQ and MCQ marks for a subject
 */
export function getSubjectCqMcq(
  sub: {
    subject: string;
    fullMarks: number;
    obtained: number;
    cq?: number;
    mcq?: number;
  },
  classGrade?: number
): { cq: string | number; mcq: string | number } {
  // Class 5 has NO separate CQ / MCQ in primary school NCTB standard
  if (classGrade === 5) {
    return { cq: '—', mcq: '—' };
  }

  // 1. If explicit CQ or MCQ is provided
  if (sub.cq !== undefined && sub.cq !== null && sub.mcq !== undefined && sub.mcq !== null) {
    return { cq: sub.cq, mcq: sub.mcq };
  }
  if (sub.cq !== undefined && sub.cq !== null) {
    return { cq: sub.cq, mcq: sub.mcq ?? '—' };
  }
  if (sub.mcq !== undefined && sub.mcq !== null) {
    return { cq: sub.cq ?? '—', mcq: sub.mcq };
  }

  // 2. English / ইংরেজি has no separate CQ/MCQ in NCTB board format
  const name = sub.subject.toLowerCase();
  if (name.includes('english') || name.includes('ইংরেজি')) {
    return { cq: '—', mcq: '—' };
  }

  // 3. Fallback for older records where only total obtained was entered
  const obtained = sub.obtained || 0;
  if (obtained === 0) {
    return { cq: 0, mcq: 0 };
  }

  // 100 mark subjects (NCTB: CQ 70, MCQ 30)
  if (sub.fullMarks === 100) {
    const mcq = Math.min(30, Math.max(0, Math.round(obtained * 0.3)));
    const cq = Math.min(70, Math.max(0, obtained - mcq));
    return { cq, mcq };
  }

  // 50 mark subjects (NCTB: বাংলা ২য় পত্র: CQ 30, MCQ 20; ICT: Practical/CQ 25, MCQ 25)
  if (sub.fullMarks === 50) {
    if (name.includes('বাংলা')) {
      const mcq = Math.min(20, Math.max(0, Math.round(obtained * 0.4)));
      const cq = Math.min(30, Math.max(0, obtained - mcq));
      return { cq, mcq };
    }
    const mcq = Math.min(25, Math.max(0, Math.round(obtained * 0.5)));
    const cq = Math.min(25, Math.max(0, obtained - mcq));
    return { cq, mcq };
  }

  // Any other full marks (70% CQ, 30% MCQ)
  const maxMcq = Math.round(sub.fullMarks * 0.3);
  const maxCq = sub.fullMarks - maxMcq;
  const mcq = Math.min(maxMcq, Math.max(0, Math.round(obtained * 0.3)));
  const cq = Math.min(maxCq, Math.max(0, obtained - mcq));
  return { cq, mcq };
}

export interface CalculatedResultSummary {
  totalFullMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  hasFailedSubject: boolean;
  failedCount: number;
}

/**
 * Calculate Letter Grade and Grade Point (GPA) for a single subject based on percentage
 */
export function calculateSubjectGradeAndGpa(obtained: number, fullMarks: number = 100): { grade: string; gpa: number } {
  if (fullMarks <= 0) return { grade: 'F', gpa: 0.00 };
  
  // Calculate percentage
  const percent = (Math.max(0, obtained) / fullMarks) * 100;

  if (percent >= 80) return { grade: 'A+', gpa: 5.00 };
  if (percent >= 70) return { grade: 'A', gpa: 4.00 };
  if (percent >= 60) return { grade: 'A-', gpa: 3.50 };
  if (percent >= 50) return { grade: 'B', gpa: 3.00 };
  if (percent >= 40) return { grade: 'C', gpa: 2.00 };
  if (percent >= 33) return { grade: 'D', gpa: 1.00 };
  return { grade: 'F', gpa: 0.00 };
}

/**
 * Calculate overall Exam Result Summary according to Bangladesh Education Board Standards
 */
export function calculateOverallResult(subjects: SubjectMarkEntry[]): CalculatedResultSummary {
  if (!subjects || subjects.length === 0) {
    return {
      totalFullMarks: 0,
      totalObtainedMarks: 0,
      percentage: 0,
      grade: 'F',
      gpa: 0.00,
      hasFailedSubject: false,
      failedCount: 0,
    };
  }

  let totalFullMarks = 0;
  let totalObtainedMarks = 0;
  let sumGpa = 0;
  let failedCount = 0;
  let compulsorySubjectsCount = 0;
  let optionalBonusGpa = 0;

  subjects.forEach((sub) => {
    totalFullMarks += sub.fullMarks;
    totalObtainedMarks += sub.obtained;

    if (sub.isOptional) {
      // 4th subject bonus (Points above 2.00)
      if (sub.gpa > 2.00) {
        optionalBonusGpa += (sub.gpa - 2.00);
      }
    } else {
      compulsorySubjectsCount += 1;
      sumGpa += sub.gpa;
      if (sub.gpa === 0 || sub.grade === 'F') {
        failedCount += 1;
      }
    }
  });

  const percentage = totalFullMarks > 0 ? (totalObtainedMarks / totalFullMarks) * 100 : 0;

  // Board Rule: If student fails in any compulsory subject, overall grade is F and GPA is 0.00
  if (failedCount > 0) {
    return {
      totalFullMarks,
      totalObtainedMarks,
      percentage: Math.round(percentage * 10) / 10,
      grade: 'F',
      gpa: 0.00,
      hasFailedSubject: true,
      failedCount,
    };
  }

  const effectiveCount = compulsorySubjectsCount > 0 ? compulsorySubjectsCount : subjects.length;
  let finalGpa = effectiveCount > 0 ? (sumGpa + optionalBonusGpa) / effectiveCount : 0;
  // Maximum GPA is 5.00
  finalGpa = Math.min(5.00, Math.round(finalGpa * 100) / 100);

  let finalGrade = 'F';
  if (finalGpa >= 5.00) finalGrade = 'A+';
  else if (finalGpa >= 4.00) finalGrade = 'A';
  else if (finalGpa >= 3.50) finalGrade = 'A-';
  else if (finalGpa >= 3.00) finalGrade = 'B';
  else if (finalGpa >= 2.00) finalGrade = 'C';
  else if (finalGpa >= 1.00) finalGrade = 'D';
  else finalGrade = 'F';

  return {
    totalFullMarks,
    totalObtainedMarks,
    percentage: Math.round(percentage * 10) / 10,
    grade: finalGrade,
    gpa: finalGpa,
    hasFailedSubject: false,
    failedCount: 0,
  };
}

