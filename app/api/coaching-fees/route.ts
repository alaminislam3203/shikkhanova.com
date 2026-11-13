import { NextRequest, NextResponse } from 'next/server';
import {
  getCoachingFees,
  saveCoachingFee,
  updateCoachingFeeStatus,
  deleteCoachingFee,
  FeePaymentStatus,
  FeePaymentMethod,
} from '@/lib/coachingFeeStorage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const classGradeParam = searchParams.get('classGrade');
    const month = searchParams.get('month') || undefined;
    const search = searchParams.get('search') || undefined;

    const classGrade = classGradeParam ? parseInt(classGradeParam, 10) : undefined;

    const fees = getCoachingFees({
      status,
      classGrade,
      month,
      search,
    });

    // Summary calculations
    const allFees = getCoachingFees(); // total unfiltered stats
    const pendingCount = allFees.filter((f) => f.status === 'PENDING').length;
    const approvedCount = allFees.filter((f) => f.status === 'APPROVED').length;
    const rejectedCount = allFees.filter((f) => f.status === 'REJECTED').length;
    const approvedAmount = allFees
      .filter((f) => f.status === 'APPROVED')
      .reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalAmount = allFees.reduce((sum, f) => sum + (f.amount || 0), 0);

    return NextResponse.json({
      fees,
      stats: {
        totalRecords: allFees.length,
        pendingCount,
        approvedCount,
        rejectedCount,
        approvedAmount,
        totalAmount,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch coaching fees' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName,
      classGrade,
      rollNumber,
      month,
      amount,
      paymentMethod,
      senderPhone,
      studentPhone,
      trxId,
    } = body;

    if (!studentName || !classGrade || !month || !senderPhone || !trxId) {
      return NextResponse.json(
        { error: 'শিক্ষার্থীর নাম, শ্রেণি, মাস, প্রেরকের নম্বর এবং Transaction ID আবশ্যক।' },
        { status: 400 }
      );
    }

    if (trxId.trim().length < 6) {
      return NextResponse.json(
        { error: 'অনুগ্রহ করে সঠিক Transaction ID (কমপক্ষে ৬ অক্ষর) প্রদান করুন।' },
        { status: 400 }
      );
    }

    const saved = saveCoachingFee({
      studentName: studentName.trim(),
      classGrade: Number(classGrade),
      rollNumber: rollNumber !== undefined && rollNumber !== '' ? String(rollNumber).trim() : undefined,
      month: month.trim(),
      amount: Number(amount) || 1200,
      paymentMethod: (paymentMethod || 'BKASH') as FeePaymentMethod,
      senderPhone: senderPhone.trim(),
      studentPhone: studentPhone ? studentPhone.trim() : undefined,
      trxId: trxId.trim().toUpperCase(),
    });

    return NextResponse.json({
      success: true,
      message: 'কোচিং ফি সফলভাবে সাবমিট হয়েছে! অ্যাডমিন ভেরিফাই করে অনুমোদন করবেন।',
      record: saved,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'ফি সাবমিট ব্যর্থ হয়েছে।' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, note } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID এবং Status প্রদান করা আবশ্যক।' },
        { status: 400 }
      );
    }

    const updated = updateCoachingFeeStatus(id, status as FeePaymentStatus, note);
    if (!updated) {
      return NextResponse.json({ error: 'রেকর্ড পাওয়া যায়নি।' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message:
        status === 'APPROVED'
          ? `পেমেন্টটি (TrxID: ${updated.trxId}) সফলভাবে অনুমোদন করা হয়েছে!`
          : `পেমেন্টটি বাতিল হিসেবে চিহ্নিত করা হয়েছে।`,
      record: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID আবশ্যক।' }, { status: 400 });
    }

    deleteCoachingFee(id);
    return NextResponse.json({
      success: true,
      message: 'ফি রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে।',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'মুছে ফেলা ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}
