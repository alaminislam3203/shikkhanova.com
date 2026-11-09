import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস' }, { status: 403 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      users,
      pdfs,
      purchases,
      results,
      todayAttendances,
      totalAttendanceCount,
    ] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          classGrade: true,
          rollNumber: true,
          image: true,
          createdAt: true,
        },
      }),
      prisma.pdfMaterial.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { purchases: true },
          },
        },
      }),
      prisma.pdfPurchase.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: {
              name: true,
              email: true,
              phone: true,
              classGrade: true,
              rollNumber: true,
            },
          },
          pdf: {
            select: {
              title: true,
              classGrade: true,
              subject: true,
              price: true,
            },
          },
        },
      }),
      prisma.examResult.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.attendance.findMany({
        where: {
          date: {
            gte: startOfToday,
          },
        },
      }),
      prisma.attendance.count(),
    ]);

    const students = users.filter((u) => u.role === 'STUDENT');
    const approvedPurchases = purchases.filter((p) => p.status === 'APPROVED');
    const pendingPurchases = purchases.filter((p) => p.status === 'PENDING');
    const rejectedPurchases = purchases.filter((p) => p.status === 'REJECTED');

    const totalRevenue = approvedPurchases.reduce((sum, p) => sum + p.amount, 0);
    const pendingRevenue = pendingPurchases.reduce((sum, p) => sum + p.amount, 0);
    const bkashRevenue = approvedPurchases
      .filter((p) => p.paymentMethod === 'BKASH')
      .reduce((sum, p) => sum + p.amount, 0);
    const nagadRevenue = approvedPurchases
      .filter((p) => p.paymentMethod === 'NAGAD')
      .reduce((sum, p) => sum + p.amount, 0);

    const freePdfs = pdfs.filter((p) => p.isFree || p.price <= 0).length;
    const paidPdfs = pdfs.length - freePdfs;

    const todayPresent = todayAttendances.filter((a) => a.status === 'PRESENT').length;
    const todayAbsent = todayAttendances.filter((a) => a.status === 'ABSENT').length;
    const todayLate = todayAttendances.filter((a) => a.status === 'LATE').length;

    // Class-wise breakdown for Classes 5 to 10
    const classes = [5, 6, 7, 8, 9, 10].map((cls) => ({
      classGrade: cls,
      students: students.filter((s) => s.classGrade === cls).length,
      pdfs: pdfs.filter((p) => p.classGrade === cls).length,
      results: results.filter((r) => r.classGrade === cls).length,
      todayPresent: todayAttendances.filter(
        (a) => a.classGrade === cls && a.status === 'PRESENT'
      ).length,
      todayTotal: todayAttendances.filter((a) => a.classGrade === cls).length,
    }));

    return NextResponse.json({
      kpis: {
        totalUsers: users.length,
        totalStudents: students.length,
        totalPdfs: pdfs.length,
        freePdfs,
        paidPdfs,
        totalPurchases: purchases.length,
        pendingPurchasesCount: pendingPurchases.length,
        approvedPurchasesCount: approvedPurchases.length,
        rejectedPurchasesCount: rejectedPurchases.length,
        totalRevenue,
        pendingRevenue,
        bkashRevenue,
        nagadRevenue,
        totalResults: results.length,
        totalAttendanceCount,
        todayAttendance: {
          present: todayPresent,
          absent: todayAbsent,
          late: todayLate,
          total: todayAttendances.length,
        },
      },
      classes,
      recentPurchases: purchases.slice(0, 6),
      recentPdfs: pdfs.slice(0, 5),
      recentResults: results.slice(0, 5),
      recentStudents: students.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: error.message || 'ড্যাশবোর্ড ডেটা লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
