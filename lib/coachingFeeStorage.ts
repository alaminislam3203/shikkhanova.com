import fs from 'fs';
import path from 'path';

export type FeePaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type FeePaymentMethod = 'BKASH' | 'NAGAD' | 'ROCKET';

export interface CoachingFeeRecord {
  id: string;
  studentName: string;
  classGrade: number; // 5 to 10
  rollNumber?: string | number;
  month: string; // e.g. "মার্চ ২০২৬"
  amount: number; // default 1200
  paymentMethod: FeePaymentMethod;
  senderPhone: string;
  studentPhone?: string;
  trxId: string;
  status: FeePaymentStatus;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FEES_FILE = path.join(DATA_DIR, 'coaching_fees.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getCoachingFees(filters?: {
  status?: string;
  classGrade?: number;
  month?: string;
  search?: string;
}): CoachingFeeRecord[] {
  ensureDataDir();
  let list: CoachingFeeRecord[] = [];

  try {
    if (fs.existsSync(FEES_FILE)) {
      const raw = fs.readFileSync(FEES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch (err) {
    console.error('Error reading coaching_fees.json:', err);
  }

  // Sort newest first
  list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (filters) {
    if (filters.status && filters.status !== 'ALL') {
      list = list.filter((item) => item.status === filters.status);
    }
    if (filters.classGrade) {
      list = list.filter((item) => item.classGrade === filters.classGrade);
    }
    if (filters.month && filters.month !== 'ALL') {
      list = list.filter((item) => item.month === filters.month);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.trxId.toLowerCase().includes(q) ||
          item.studentName.toLowerCase().includes(q) ||
          String(item.rollNumber || '').toLowerCase().includes(q) ||
          item.senderPhone.toLowerCase().includes(q) ||
          (item.studentPhone || '').toLowerCase().includes(q)
      );
    }
  }

  return list;
}

export function saveCoachingFee(data: Omit<CoachingFeeRecord, 'id' | 'createdAt' | 'status'> & { id?: string; status?: FeePaymentStatus }): CoachingFeeRecord {
  ensureDataDir();
  let list: CoachingFeeRecord[] = [];

  try {
    if (fs.existsSync(FEES_FILE)) {
      const raw = fs.readFileSync(FEES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {}

  const newRecord: CoachingFeeRecord = {
    id: data.id || `fee_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
    studentName: data.studentName.trim(),
    classGrade: Number(data.classGrade),
    rollNumber: data.rollNumber !== undefined && data.rollNumber !== '' ? String(data.rollNumber).trim() : undefined,
    month: data.month.trim(),
    amount: Number(data.amount) || 1200,
    paymentMethod: data.paymentMethod || 'BKASH',
    senderPhone: data.senderPhone.trim(),
    studentPhone: data.studentPhone ? data.studentPhone.trim() : undefined,
    trxId: data.trxId.trim().toUpperCase(),
    status: data.status || 'PENDING',
    note: data.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  // Check if TrxID already exists
  const existingIdx = list.findIndex(
    (item) => item.trxId.toUpperCase() === newRecord.trxId
  );

  if (existingIdx >= 0) {
    throw new Error(`এই ট্রানজেকশন আইডি (${newRecord.trxId}) দিয়ে ইতিমধ্যে একটি ফি রেকর্ড জমা দেওয়া হয়েছে!`);
  }

  list.unshift(newRecord);

  try {
    fs.writeFileSync(FEES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing coaching_fees.json:', err);
  }

  return newRecord;
}

export function updateCoachingFeeStatus(
  id: string,
  newStatus: FeePaymentStatus,
  note?: string
): CoachingFeeRecord | null {
  ensureDataDir();
  let list: CoachingFeeRecord[] = [];

  try {
    if (fs.existsSync(FEES_FILE)) {
      const raw = fs.readFileSync(FEES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {}

  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  list[index] = {
    ...list[index],
    status: newStatus,
    note: note !== undefined ? note : list[index].note,
    updatedAt: now,
    approvedAt: newStatus === 'APPROVED' ? now : list[index].approvedAt,
  };

  try {
    fs.writeFileSync(FEES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error updating coaching_fees.json:', err);
  }

  return list[index];
}

export function deleteCoachingFee(id: string): boolean {
  ensureDataDir();
  try {
    if (fs.existsSync(FEES_FILE)) {
      const raw = fs.readFileSync(FEES_FILE, 'utf-8');
      let list: CoachingFeeRecord[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        list = list.filter((item) => item.id !== id);
        fs.writeFileSync(FEES_FILE, JSON.stringify(list, null, 2), 'utf-8');
        return true;
      }
    }
  } catch (err) {
    console.error('Error deleting coaching fee record:', err);
  }
  return false;
}
