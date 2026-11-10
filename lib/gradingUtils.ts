export interface SubjectMarkEntry {
  code?: string;
  subject: string;
  fullMarks: number;
  obtained: number;
  grade: string;
  gpa: number;
  isOptional?: boolean;
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

