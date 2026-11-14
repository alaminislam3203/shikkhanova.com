export type ClassGrade = 5 | 6 | 7 | 8 | 9 | 10;

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface StudentRollItem {
  rollNumber: number;
  studentName: string;
  classGrade?: number;
  phone?: string;
  status: AttendanceStatus;
}

export interface SubjectMark {
  code?: string;
  subject: string;
  fullMarks: number;
  obtained: number;
  cq?: number;
  mcq?: number;
  grade: string;
  gpa: number;
  isFourthSubject?: boolean;
}

export interface MarksheetData {
  studentName: string;
  fatherName?: string;
  motherName?: string;
  schoolName?: string;
  dateOfBirth?: string;
  religion?: string;
  fourthSubject?: string;
  classGrade: number;
  rollNumber: number;
  examTitle: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  gpa: number;
  subjects: SubjectMark[];
}

export interface PdfItem {
  id: string;
  title: string;
  description: string;
  classGrade: number;
  subject: string;
  price: number;
  fileUrl: string;
  isFree?: boolean;
  purchaseStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface VideoItem {
  id: string;
  title: string;
  classGrade: number;
  subject: string;
  youtubeId: string;
  duration?: string;
}

export interface PurchaseRecord {
  id: string;
  amount: number;
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'UPAY';
  senderPhone: string;
  trxId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  student: {
    name: string;
    email: string;
    phone?: string;
    classGrade?: number;
    rollNumber?: number;
  };
  pdf: {
    title: string;
    classGrade: number;
    subject: string;
    price: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation?: string;
  classGrade: number; // 5 to 10
  subject: string; // বাংলা, ইংরেজি, গণিত, বিজ্ঞান, বাংলাদেশ ও বিশ্বপরিচয়, ICT
  isPremium?: boolean;
}

export interface QuizResultRecord {
  id: string;
  name: string;
  phone?: string;
  classGrade: number;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  medal?: string;
}

