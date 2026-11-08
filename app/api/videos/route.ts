import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get('classGrade');

    const where: any = {};
    if (classGrade && classGrade !== 'all') {
      where.classGrade = parseInt(classGrade);
    }

    const videos = await prisma.videoLesson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ videos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'শুধুমাত্র অ্যাডমিন ভিডিও যুক্ত করতে পারবেন' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, classGrade, subject, youtubeUrl, youtubeId } = body;

    if (!title || !classGrade || !subject || !youtubeUrl) {
      return NextResponse.json({ error: 'সকল প্রয়োজনীয় তথ্য প্রদান করুন' }, { status: 400 });
    }

    // Extract youtubeId if not provided
    let videoId = youtubeId;
    if (!videoId) {
      const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      videoId = match ? match[1] : 'dQw4w9WgXcQ';
    }

    const newVideo = await prisma.videoLesson.create({
      data: {
        title,
        description: description || null,
        classGrade: parseInt(classGrade.toString()),
        subject,
        youtubeUrl,
        youtubeId: videoId,
        channel: '@ShikkhaNova',
      },
    });

    return NextResponse.json({ message: 'ভিডিও ক্লাস সফলভাবে যুক্ত হয়েছে', video: newVideo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

