export type ClassGrade = 5 | 6 | 7 | 8 | 9 | 10;

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface StudentRollItem {
  rollNumber: number;
  studentName: string;
  classGrade: ClassGrade;
  phone?: string;
  status: AttendanceStatus;
}

export interface SubjectMark {
  subject: string;
  fullMarks: number;
  obtained: number;
  grade: string;
  gpa: number;
}

export interface MarksheetData {
  studentName: string;
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
  paymentMethod: 'BKASH' | 'NAGAD';
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

