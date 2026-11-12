import prisma from '@/lib/prisma';

export interface SmsSendParams {
  numbers: string | string[];
  message: string;
  senderId?: string;
  type?: 'attendance' | 'result' | 'payment' | 'fee' | 'broadcast' | 'custom';
  metadata?: Record<string, any>;
}

export interface SmsLogEntry {
  id: string;
  timestamp: string;
  type: string;
  recipientCount: number;
  numbers: string[];
  message: string;
  status: 'SENT' | 'FAILED' | 'MOCK_SENT';
  response: any;
  error?: string;
}

export interface SmsBalanceResponse {
  success: boolean;
  balance: number | string;
  status: 'active' | 'inactive' | 'mock';
  message?: string;
}

// Helper to format Bangladeshi phone numbers to 8801XXXXXXXXX
export function formatBdPhone(phone: string): string | null {
  if (!phone) return null;
  // Remove spaces, hyphens, plus signs
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
  
  // If starts with 8801[3-9], verify 13 digits
  if (/^8801[3-9]\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  // If starts with 01[3-9], verify 11 digits and prepend 88
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return `88${cleaned}`;
  }
  // If starts with 1[3-9], verify 10 digits and prepend 880
  if (/^1[3-9]\d{8}$/.test(cleaned)) {
    return `880${cleaned}`;
  }
  return null;
}

let isSmsTableReady = false;
async function ensureSmsLogTable(): Promise<void> {
  if (isSmsTableReady) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SmsLog" (
        "id" TEXT PRIMARY KEY,
        "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "type" TEXT NOT NULL,
        "recipientCount" INTEGER NOT NULL,
        "numbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "response" JSONB,
        "error" TEXT
      );
    `);
    isSmsTableReady = true;
  } catch (err) {
    console.error('ensureSmsLogTable error:', err);
  }
}

// Read SMS delivery logs from Database (PostgreSQL)
export async function getSmsLogs(): Promise<SmsLogEntry[]> {
  try {
    await ensureSmsLogTable();
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT "id", "timestamp", "type", "recipientCount", "numbers", "message", "status", "response", "error"
       FROM "SmsLog"
       ORDER BY "timestamp" DESC
       LIMIT 500`
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        timestamp: r.timestamp
          ? new Date(r.timestamp).toISOString()
          : new Date().toISOString(),
        type: r.type,
        recipientCount: Number(r.recipientCount || 0),
        numbers: Array.isArray(r.numbers) ? r.numbers : [],
        message: r.message || '',
        status: r.status,
        response: r.response,
        error: r.error || undefined,
      }));
    }
  } catch (err) {
    console.error('Failed to read SMS logs from Database:', err);
  }
  return [];
}

// Append an SMS log entry directly into Database
export async function appendSmsLog(entry: SmsLogEntry): Promise<void> {
  try {
    await ensureSmsLogTable();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "SmsLog" ("id", "timestamp", "type", "recipientCount", "numbers", "message", "status", "response", "error")
       VALUES ($1, $2::timestamptz, $3, $4, $5, $6, $7, $8::jsonb, $9)
       ON CONFLICT ("id") DO NOTHING`,
      entry.id,
      entry.timestamp,
      entry.type,
      entry.recipientCount,
      entry.numbers,
      entry.message,
      entry.status,
      JSON.stringify(entry.response || {}),
      entry.error || null
    );
  } catch (err) {
    console.error('Failed to write SMS log to Database:', err);
  }
}

// Clear all SMS logs in Database
export async function clearSmsLogs(): Promise<void> {
  try {
    await ensureSmsLogTable();
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "SmsLog"`);
  } catch (err) {
    console.error('Failed to clear SMS logs in Database:', err);
  }
}

/**
 * Check BulkSMSBD account balance
 */
export async function checkSmsBalance(): Promise<SmsBalanceResponse> {
  const apiKey = process.env.BULKSMSBD_API_KEY || '';
  
  if (!apiKey || apiKey === 'YOUR_BULKSMSBD_API_KEY') {
    return {
      success: true,
      balance: 'কনফিগার করা হয়নি (Mock)',
      status: 'mock',
      message: 'আপনার .env ফাইলে BULKSMSBD_API_KEY বসান',
    };
  }

  try {
    const url = `http://bulksmsbd.net/api/getBalanceApi?api_key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    const data = await res.json();

    if (data && (data.balance !== undefined || data.response_code === 202)) {
      return {
        success: true,
        balance: data.balance ?? 'সক্রিয়',
        status: 'active',
      };
    }

    return {
      success: false,
      balance: 0,
      status: 'inactive',
      message: data.error_message || 'ব্যালেন্স দেখতে পাওয়া যায়নি',
    };
  } catch (err: any) {
    return {
      success: false,
      balance: 0,
      status: 'inactive',
      message: err.message || 'নেটওয়ার্ক এরর',
    };
  }
}

/**
 * Send SMS using BulkSMSBD API
 */
export async function sendBulkSms(params: SmsSendParams): Promise<{
  success: boolean;
  message: string;
  sentCount: number;
  logId?: string;
  response?: any;
}> {
  const { numbers, message, senderId, type = 'custom' } = params;

  // Normalize numbers array
  const rawList = Array.isArray(numbers)
    ? numbers
    : String(numbers)
        .split(/[,\n]/)
        .map((n) => n.trim())
        .filter(Boolean);

  // Validate and format Bangladeshi phone numbers
  const validNumbers: string[] = [];
  for (const raw of rawList) {
    const formatted = formatBdPhone(raw);
    if (formatted && !validNumbers.includes(formatted)) {
      validNumbers.push(formatted);
    }
  }

  if (validNumbers.length === 0) {
    return {
      success: false,
      message: 'কোনো বৈধ বাংলাদেশি মোবাইল নম্বর পাওয়া যায়নি (যেমন: 017XXXXXXXX)',
      sentCount: 0,
    };
  }

  if (!message || !message.trim()) {
    return {
      success: false,
      message: 'এসএমএস এর টেক্সট বার্তা খালি হতে পারবে না',
      sentCount: 0,
    };
  }

  const apiKey = process.env.BULKSMSBD_API_KEY || '';
  const resolvedSenderId =
    senderId || process.env.BULKSMSBD_SENDER_ID || '8809617618999';
  const apiUrl = process.env.BULKSMSBD_API_URL || 'http://bulksmsbd.net/api/smsapi';

  const logId = `sms-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const commaSeparatedNumbers = validNumbers.join(',');

  // If API key is not configured, simulate sending (Development/Demo Mode)
  if (!apiKey || apiKey === 'YOUR_BULKSMSBD_API_KEY') {
    const mockEntry: SmsLogEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      type,
      recipientCount: validNumbers.length,
      numbers: validNumbers,
      message,
      status: 'MOCK_SENT',
      response: {
        response_code: 202,
        success_message: 'Mock: SMS logged successfully (Please add real BULKSMSBD_API_KEY in .env)',
      },
    };
    appendSmsLog(mockEntry);

    return {
      success: true,
      message: `(সিমুলেশন মোড) ${validNumbers.length}টি নম্বরে বার্তা পাঠানো হয়েছে। বাস্তব এসএমএস পেতে .env-এ আপনার আসল API Key দিন।`,
      sentCount: validNumbers.length,
      logId,
      response: mockEntry.response,
    };
  }

  // Real BulkSMSBD API Dispatch
  try {
    const formData = new URLSearchParams();
    formData.append('api_key', apiKey);
    formData.append('type', 'text');
    formData.append('number', commaSeparatedNumbers);
    formData.append('senderid', resolvedSenderId);
    formData.append('message', message);

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      cache: 'no-store',
    });

    const resData = await res.json().catch(async () => {
      const text = await res.text();
      return { raw: text };
    });

    // BulkSMSBD success response has response_code: 202 and no error_message
    const isSuccess =
      resData?.response_code === 202 &&
      !resData?.error_message &&
      Boolean(resData?.success_message || resData?.message_id);

    let friendlyError = resData?.error_message || 'BulkSMSBD থেকে এসএমএস পাঠাতে ব্যর্থ হয়েছে';
    if (resData?.response_code === 1032 || String(resData?.error_message || '').toLowerCase().includes('not whitelisted')) {
      friendlyError = `আপনার আইপি হোয়াইটলিস্ট করা নেই: ${resData?.error_message || ''}। BulkSMSBD ড্যাশবোর্ডে গিয়ে আপনার বর্তমান আইপি (Whitelist IP) যুক্ত করুন বা IP Checking Disable করুন।`;
    } else if (
      resData?.response_code === 1005 ||
      resData?.response_code === 1002 ||
      String(resData?.error_message || '').includes('is_masking') ||
      String(resData?.error_message || '').includes('sender id is disabled')
    ) {
      friendlyError = `ভুল Sender ID: আপনার অ্যাকাউন্টে এই Sender ID ('${resolvedSenderId}') বরাদ্দকৃত বা সক্রিয় নয়। BulkSMSBD ড্যাশবোর্ডের বাম পাশের "Sender ID" মেনু থেকে আপনার অনুমোদিত আসল Sender ID কপি করে .env ফাইলে BULKSMSBD_SENDER_ID তে বসান।`;
    }

    const logEntry: SmsLogEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      type,
      recipientCount: validNumbers.length,
      numbers: validNumbers,
      message,
      status: isSuccess ? 'SENT' : 'FAILED',
      response: resData,
      error: isSuccess ? undefined : friendlyError,
    };
    await appendSmsLog(logEntry);

    return {
      success: isSuccess,
      message: isSuccess
        ? `${validNumbers.length}টি নম্বরে এসএমএস সফলভাবে পাঠানো হয়েছে!`
        : friendlyError,
      sentCount: isSuccess ? validNumbers.length : 0,
      logId,
      response: resData,
    };
  } catch (err: any) {
    const logEntry: SmsLogEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      type,
      recipientCount: validNumbers.length,
      numbers: validNumbers,
      message,
      status: 'FAILED',
      response: null,
      error: err.message || 'Network dispatch failure',
    };
    await appendSmsLog(logEntry);

    return {
      success: false,
      message: `এসএমএস গেটওয়ে এরর: ${err.message}`,
      sentCount: 0,
      logId,
    };
  }
}

// ----------------------------------------------------
// Pre-defined Educational SMS Templates
// ----------------------------------------------------

export const SMS_TEMPLATES = {
  attendance: (opts: {
    studentName: string;
    classGrade: number;
    rollNumber: number;
    date: string;
  }) =>
    `অভিভাবক মহোদয়, আপনার সন্তান ${opts.studentName} (শ্রেণি: ${opts.classGrade}ম, রোল: ${opts.rollNumber}) আজ ${opts.date} কোচিং ক্লাসে অনুপস্থিত ছিল। — শিক্ষানোভা একাডেমি`,

  examResult: (opts: {
    studentName: string;
    examTitle: string;
    obtainedMarks: number | string;
    totalMarks: number | string;
    gpa: number | string;
    grade: string;
  }) =>
    `অভিনন্দন ${opts.studentName}! ${opts.examTitle}-এ তোমার প্রাপ্ত নম্বর ${opts.obtainedMarks}/${opts.totalMarks}, GPA: ${opts.gpa} (${opts.grade})। রেজাল্ট দেখুন: shikkhanova.com/results`,

  paymentConfirmation: (opts: {
    studentName: string;
    itemTitle: string;
    amount: number | string;
    trxId: string;
  }) =>
    `প্রিয় ${opts.studentName}, আপনার ৳${opts.amount} পেমেন্ট (TrxID: ${opts.trxId}) অনুমোদিত হয়েছে। "${opts.itemTitle}" আনলক করা হয়েছে। ধন্যবাদ — শিক্ষানোভা একাডেমি`,

  feeReminder: (opts: {
    studentName: string;
    month: string;
    dueDate: string;
    amount?: number | string;
  }) =>
    `সম্মানিত অভিভাবক, ${opts.studentName}-এর ${opts.month} মাসের মাসিক টিউশন ফি ${opts.amount ? '৳' + opts.amount + ' ' : ''}বকেয়া রয়েছে। অনুগ্রহ করে ${opts.dueDate}-এর মধ্যে পরিশোধ করুন। হেল্পলাইন: 01712592519 — শিক্ষানোভা একাডেমি`,

  announcement: (opts: { title: string; details: string }) =>
    `জরুরি বিজ্ঞপ্তি: ${opts.title}। ${opts.details} — পরিচালক, শিক্ষানোভা একাডেমি`,
};

